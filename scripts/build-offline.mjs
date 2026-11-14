// Inline Vite's production bundle; keep the source HTML and dev workflow unchanged.
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
const root = resolve('dist')
let html = await readFile(resolve(root, 'index.html'), 'utf8')
const local = url => {
  const path = resolve(root, url.replace(/^\//, ''))
  if (!path.startsWith(root + sep)) throw new Error('Asset outside dist: ' + url)
  return path
}
const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)]
if (scripts.length !== 1) throw new Error('Expected one bundled application script')
for (const [tag, url] of scripts) {
  const js = await readFile(local(url), 'utf8')
  html = html.replace(tag, () => '<script type="module">' + js.replace(/<\/script/gi, '<\\/script') + '</script>')
}
for (const [tag, url] of [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]) {
  const css = await readFile(local(url), 'utf8')
  html = html.replace(tag, () => '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>')
}
for (const [tag, url] of [...html.matchAll(/<link\b[^>]*rel="icon"[^>]*href="([^"]+)"[^>]*>/g)]) {
  const icon = await readFile(local(url))
  html = html.replace(tag, () => '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,' + icon.toString('base64') + '" />')
}
if (/<script[^>]*src=|<link[^>]*href="(?!data:)/i.test(html)) throw new Error('External resource remains')
await writeFile(resolve(root, 'index.html'), html)
await writeFile('Offline-TaskManager.html', html)
console.log('Standalone HTML written: dist/index.html and Offline-TaskManager.html')
