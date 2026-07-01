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

const issues = []
for (const file of htmlFiles) {
  const rel = path.relative(OUT, file).replace(/\\/g, '/')
  const html = fs.readFileSync(file, 'utf8')
  const checks = [
    ['title', /<title>([^<]+)<\/title>/],
    ['description', /<meta name="description" content="([^"]+)"/],
    ['canonical', /<link rel="canonical" href="([^"]+)"/],
    ['robots', /<meta name="robots" content="([^"]+)"/],
    ['og:title', /<meta property="og:title" content="([^"]+)"/],
    ['og:description', /<meta property="og:description" content="([^"]+)"/],
    ['og:image', /<meta property="og:image" content="([^"]+)"/],
    ['og:url', /<meta property="og:url" content="([^"]+)"/],
    ['twitter:card', /<meta name="twitter:card" content="([^"]+)"/],
  ]
  for (const [name, re] of checks) {
    const m = html.match(re)
    if (!m) issues.push({ file: rel, issue: `Eksik: ${name}` })
    else if (name === 'description' && m[1].length < 50) issues.push({ file: rel, issue: `Kısa description (${m[1].length}): ${m[1].slice(0, 40)}…` })
    else if (name === 'description' && m[1].length > 165) issues.push({ file: rel, issue: `Uzun description (${m[1].length})` })
  }
  if (!html.includes('application/ld+json') && rel !== '404.html') {
    issues.push({ file: rel, issue: 'Schema (JSON-LD) yok' })
  }
}

const sitemap = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
if (sitemapUrls.some(u => u.includes('/404'))) issues.push({ file: 'sitemap.xml', issue: '404 sitemap içinde olmamalı' })

console.log(`Sayfa: ${htmlFiles.length}`)
console.log(`Sitemap URL: ${sitemapUrls.length}`)
console.log(`SEO sorun: ${issues.length}`)
issues.forEach(i => console.log(`  ${i.file}: ${i.issue}`))
process.exit(issues.length ? 1 : 0)
