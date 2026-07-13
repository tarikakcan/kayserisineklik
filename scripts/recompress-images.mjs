/**
 * Ürün/hero WebP varyantlarını yeniden sıkıştırır (PageSpeed image size).
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'kaynak', 'public')

const PRODUCTS = [
  'dikey-plise-sineklik',
  'duble-plise-sineklik',
  'yatay-plise-sineklik',
  'menteseli-sineklik',
  'kapi-sinekligi',
  'pencere-sinekligi',
  'kedi-sinekligi',
  'surgulu-sineklik',
  'sineklik-tamir-bandi',
]

async function writeWebp(src, dest, width, quality) {
  const buf = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toBuffer()
  fs.writeFileSync(dest, buf)
  return buf.length
}

for (const slug of PRODUCTS) {
  const master = path.join(PUBLIC, 'products', `${slug}.webp`)
  if (!fs.existsSync(master)) {
    console.warn('skip', slug)
    continue
  }
  const beforePath = path.join(PUBLIC, 'products', `${slug}-800w.webp`)
  const before = fs.existsSync(beforePath) ? fs.statSync(beforePath).size : 0
  for (const [w, q] of [[400, 70], [800, 68], [1200, 68]]) {
    const dest = path.join(PUBLIC, 'products', `${slug}-${w}w.webp`)
    const n = await writeWebp(master, dest, w, q)
    if (w === 800) {
      console.log(`${slug} 800w ${Math.round(before / 1024)}→${Math.round(n / 1024)}KB`)
    }
  }
}

const heroSrc = path.join(PUBLIC, 'hero-home.webp')
const heroBuf = fs.readFileSync(heroSrc)
for (const [name, w, q] of [['hero-home-600w.webp', 600, 68], ['hero-home-800w.webp', 800, 68]]) {
  const n = await writeWebp(heroBuf, path.join(PUBLIC, name), w, q)
  console.log(`${name} ${Math.round(n / 1024)}KB`)
}
fs.copyFileSync(path.join(PUBLIC, 'hero-home-800w.webp'), path.join(PUBLIC, 'hero-home-1200w.webp'))
fs.copyFileSync(path.join(PUBLIC, 'hero-home-800w.webp'), path.join(PUBLIC, 'hero-home-1800w.webp'))
console.log('Tamam')
