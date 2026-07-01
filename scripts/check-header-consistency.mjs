import fs from 'fs'
import path from 'path'

const ROOT = path.join(process.cwd(), '1-CANLI-SITE')

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (e.name.endsWith('.html')) acc.push(p)
  }
  return acc
}

function normalizeHeader(html) {
  const m = html.match(/<header class="site-header[\s\S]*?<\/header>/)
  if (!m) return null
  return m[0]
    .replace(/href="[^"]*"/g, 'href="H"')
    .replace(/src="[^"]*"/g, 'src="S"')
    .replace(/\s+/g, ' ')
    .trim()
}

const files = walk(ROOT)
const groups = new Map()
const issues = []

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8')
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  const header = normalizeHeader(html)
  if (!header) {
    issues.push(`${rel}: header missing`)
    continue
  }
  const hasMobileCss = html.includes('#mobile-menu,#mobile-menu-backdrop')
  const menuAfterFooter = html.indexOf('id="mobile-menu"') > html.indexOf('</footer>')
  const hasMenuBtn = header.includes('id="menu-btn"')
  const hasSiteHeaderNav = header.includes('site-header-nav')
  const cssPaths = [...html.matchAll(/href="([^"]*site-fallback\.css)"/g)].map(m => m[1])
  const jsPaths = [...html.matchAll(/src="([^"]*site\.js)"/g)].map(m => m[1])

  const meta = { hasMobileCss, menuAfterFooter, hasMenuBtn, hasSiteHeaderNav, cssPaths, jsPaths }
  const key = header
  if (!groups.has(key)) groups.set(key, { meta, files: [] })
  groups.get(key).files.push(rel)

  if (!hasMobileCss) issues.push(`${rel}: missing mobile menu critical CSS`)
  if (!menuAfterFooter) issues.push(`${rel}: mobile menu not after footer`)
  if (!hasMenuBtn) issues.push(`${rel}: missing menu button`)
}

console.log(`HTML files: ${files.length}`)
console.log(`Header variants: ${groups.size}\n`)

for (const [key, { meta, files: list }] of groups) {
  console.log(`Variant (${list.length} pages):`)
  console.log(`  menu CSS: ${meta.hasMobileCss}, menu after footer: ${meta.menuAfterFooter}`)
  console.log(`  css: ${meta.cssPaths.join(', ') || '?'}`)
  console.log(`  js: ${meta.jsPaths.join(', ') || '?'}`)
  console.log(`  samples: ${list.slice(0, 4).join(', ')}${list.length > 4 ? '...' : ''}\n`)
}

if (issues.length) {
  console.log('Issues:')
  for (const i of issues) console.log(' -', i)
} else {
  console.log('No structural header issues found.')
}
