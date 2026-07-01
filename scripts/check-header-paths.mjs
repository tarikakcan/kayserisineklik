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

function depthOf(rel) {
  const parts = rel.split('/')
  return parts.length - 1
}

const expected = {
  0: { css: 'assets/css/site-fallback.css', js: 'assets/js/site.js', logo: 'logo.svg' },
  1: { css: '../assets/css/site-fallback.css', js: '../assets/js/site.js', logo: '../logo.svg' },
}

const issues = []
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  const d = depthOf(rel)
  const html = fs.readFileSync(file, 'utf8')
  const exp = expected[d]
  if (!exp) {
    issues.push(`${rel}: unexpected depth ${d}`)
    continue
  }
  for (const [key, val] of Object.entries(exp)) {
    if (!html.includes(val)) issues.push(`${rel}: missing ${key} path "${val}"`)
  }
  const header = html.match(/<header class="site-header[\s\S]*?<\/header>/)?.[0] || ''
  if (!header.includes('site-header-nav')) issues.push(`${rel}: missing site-header-nav`)
  if (!header.includes('mobile-menu-toggle')) issues.push(`${rel}: missing hamburger`)
  if (!html.includes('#mobile-menu,#mobile-menu-backdrop')) issues.push(`${rel}: missing head mobile CSS`)
}

console.log(`Checked ${walk(ROOT).length} pages at depth 0 and 1`)
if (issues.length) {
  console.log(`Issues (${issues.length}):`)
  issues.forEach(i => console.log(' -', i))
} else {
  console.log('All asset paths and header parts are consistent by depth.')
}
