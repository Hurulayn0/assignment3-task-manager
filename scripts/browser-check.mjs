import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const evidence = []
const browser = await chromium.launch({ channel: 'msedge', headless: false })
const page = await browser.newPage({ viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', error => errors.push(error.message))
try {
  await page.goto('http://127.0.0.1:5173')
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
    await page.mouse.move(0, 0)
    const png = await page.screenshot({ path: `screenshots/${filename}.png`, fullPage: true })
    evidence.push({ filter: label, file: `${filename}.png`, titles: expectedTitles, statuses: expectedStatuses, counts: [3, 1, 1, 1], sha256: createHash('sha256').update(png).digest('hex') })
  }
  await page.getByRole('button', { name: 'Clear done', exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 0)
  await page.getByRole('button', { name: /Undo/ }).click()
  assert.equal(await page.locator('.task-row').count(), 1)
  await page.getByRole('button', { name: `Delete ${titles[2]}`, exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 0)
  await page.getByRole('button', { name: /Undo/ }).click()
  await page.getByRole('button', { name: /^All / }).click()
  assert.equal(await page.locator('.task-row').count(), 3)
  await page.getByRole('textbox', { name: 'New task' }).fill('   ')
  await page.getByRole('button', { name: '+ Add task', exact: true }).click()
  assert.equal(await page.locator('.task-row').count(), 3)
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
  assert.deepEqual(errors, [])
  await writeFile('screenshots/verification.json', JSON.stringify({ browser: await browser.version(), url: page.url(), capturedAt: new Date().toISOString(), screenshots: evidence, checksPassed: true }, null, 2) + '\n')
  console.log('Browser checks passed: add, status cycle, four filters, counts, clear, delete, Undo, blank input, mobile overflow; four screenshots captured.')
} finally { await browser.close() }
