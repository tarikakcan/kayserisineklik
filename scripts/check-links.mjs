import fs from 'fs'
import path from 'path'

const OUT = path.join(import.meta.dirname, '..', '1-CANLI-SITE')
const htmlFiles = []
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (f.endsWith('.html')) htmlFiles.push(p)
  }
}
walk(OUT)

const hrefRe = /href="([^"#]+)"/g
const links = new Set()
const broken = []

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  let m
  while ((m = hrefRe.exec(html))) {
    const h = m[1]
    if (h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('tel:')) continue
    if (h.startsWith('/')) links.add(h)
  }
}

function resolve(link) {
  let target = link.replace(/^\//, '').replace(/\/$/, '')
  if (!target) return 'index.html'
  if (target === 'urunler' || target === 'blog' || target === 'bolgeler') return `${target}/index.html`
  if (target.endsWith('/index')) return `${target}.html`
  if (!target.endsWith('.html')) return `${target}.html`
  return target
}

for (const link of [...links].sort()) {
  const target = resolve(link)
  const fp = path.join(OUT, target.replace(/\//g, path.sep))
  if (!fs.existsSync(fp)) broken.push({ link, target })
}

console.log(`HTML files: ${htmlFiles.length}`)
console.log(`Internal links: ${links.size}`)
console.log(`Broken: ${broken.length}`)
broken.forEach(b => console.log(`  ${b.link} -> ${b.target}`))
