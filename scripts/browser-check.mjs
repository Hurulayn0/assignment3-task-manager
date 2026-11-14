import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
const target = 'http://localhost:5173/'
const browser = await chromium.launch({ channel: 'msedge', headless: false })
const page = await browser.newPage({ viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', error => errors.push(error.message))
try {
  await page.goto(target)
  assert.equal(await page.getByRole('button', { name: /Undo$/ }).isDisabled(), true)
  const titles = ['Review reducer lecture notes', 'Build Task Manager interface', 'Write Vitest reducer tests']
  for (const title of titles) {
    await page.getByRole('textbox', { name: 'New task' }).fill(title)
    await page.getByRole('button', { name: '+ Add task', exact: true }).click()
  }
  await page.getByRole('button', { name: `Next status for ${titles[1]}`, exact: true }).click()
  await page.getByRole('button', { name: `Next status for ${titles[2]}`, exact: true }).click({ clickCount: 1 })
  await page.getByRole('button', { name: `Next status for ${titles[2]}`, exact: true }).click()
  for (const [label, filename, count] of [['All', 'all', 3], ['To do', 'todo', 1], ['In progress', 'in-progress', 1], ['Done', 'done', 1]]) {
    const button = page.getByRole('button', { name: new RegExp(`^${label} `) })
    await button.click()
    assert.equal(await button.getAttribute('aria-pressed'), 'true')
    assert.equal(await page.locator('.task-row').count(), count)
    const expectedTitles = filename === 'all' ? titles : [titles[['todo', 'in-progress', 'done'].indexOf(filename)]]
    const expectedStatuses = filename === 'all' ? ['To do', 'In progress', 'Done'] : [label]
    assert.deepEqual(await page.locator('.task-title').allTextContents(), expectedTitles)
    assert.deepEqual(await page.locator('.status-pill').allTextContents(), expectedStatuses)
    assert.deepEqual(await page.locator('.count').allTextContents(), ['3', '1', '1', '1'])
    assert.equal(await page.locator('[aria-pressed="true"]').count(), 1)
  }
  // Complete done -> todo -> in-progress -> done through actual UI controls.
  await page.getByRole('button', { name: /^All / }).click()
  for (const status of ['To do', 'In progress', 'Done']) {
    await page.getByRole('button', { name: `Next status for ${titles[2]}`, exact: true }).click()
    assert.equal(await page.locator('.task-row').filter({ hasText: titles[2] }).locator('.status-pill').innerText(), status)
  }
  await page.getByRole('button', { name: /^Done / }).click()
  await page.getByRole('button', { name: 'Clear done', exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 0)
  await page.getByRole('button', { name: /Undo$/ }).click()
  assert.equal(await page.locator('.task-row').count(), 1)
  await page.getByRole('button', { name: `Delete ${titles[2]}`, exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 0)
  await page.getByRole('button', { name: /Undo$/ }).click()
  await page.getByRole('button', { name: /^All / }).click()
  assert.equal(await page.locator('.task-row').count(), 3)
  await page.getByRole('textbox', { name: 'New task' }).fill('   ')
  await page.getByRole('button', { name: '+ Add task', exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 3)
  await page.getByRole('button', { name: /^In progress / }).click()
  await page.getByRole('textbox', { name: 'New task' }).fill('Verify filtered mutations')
  await page.getByRole('button', { name: '+ Add task', exact: true }).click()
  assert.deepEqual(await page.locator('.count').allTextContents(), ['4', '2', '1', '1'])
  assert.equal(await page.locator('.task-row').count(), 1)
  await page.getByRole('button', { name: `Next status for ${titles[1]}`, exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 0)
  assert.match(await page.locator('.empty').innerText(), /No tasks here/)
  await page.getByRole('button', { name: /^Done / }).click()
  await page.getByRole('button', { name: `Delete ${titles[1]}`, exact: true }).click()
  assert.deepEqual(await page.locator('.task-title').allTextContents(), [titles[2]])
  assert.deepEqual(await page.locator('.count').allTextContents(), ['3', '2', '0', '1'])
  await page.getByRole('button', { name: /Undo$/ }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
  // Undo add, advance, remove and clearDone in one fresh session.
  await page.reload()
  const input = page.getByRole('textbox', { name: 'New task' })
  await input.fill('Undo workflow')
  await page.getByRole('button', { name: '+ Add task', exact: true }).click()
  const next = page.getByRole('button', { name: 'Next status for Undo workflow', exact: true })
  await next.click()
  await page.getByRole('button', { name: /Undo$/ }).click()
  assert.deepEqual(await page.locator('.status-pill').allTextContents(), ['To do'])
  await next.click()
  await next.click()
  await page.getByRole('button', { name: 'Clear done', exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 0)
  await page.getByRole('button', { name: /Undo$/ }).click()
  assert.deepEqual(await page.locator('.status-pill').allTextContents(), ['Done'])
  await page.getByRole('button', { name: 'Delete Undo workflow', exact: true }).click()
  await page.getByRole('button', { name: /Undo$/ }).click()
  assert.deepEqual(await page.locator('.task-title').allTextContents(), ['Undo workflow'])
  for (let step = 0; step < 3; step++) await page.getByRole('button', { name: /Undo$/ }).click()
  assert.equal(await page.locator('.task-row').count(), 0)
  assert.equal(await page.getByRole('button', { name: /Undo$/ }).isDisabled(), true)
  assert.deepEqual(errors, [])
  console.log('Browser checks passed: Add, full Next cycle, Delete, four filters, counts, Clear done, Undo, blank input and mobile overflow. Original screenshots preserved.')
} finally { await browser.close() }
