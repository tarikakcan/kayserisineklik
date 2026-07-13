/**
 * Ürün ve hero WebP dosyalarından responsive varyantlar üretir.
 * Çıktı: kaynak/public → build ile 1-CANLI-SITE/assets
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'kaynak', 'public')

const PRODUCT_WIDTHS = [400, 800, 1200]
const HERO_WIDTHS = [600, 1200, 1800]

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

async function resizeWebp(src, dest, width) {
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(dest)
  const kb = Math.round(fs.statSync(dest).size / 1024)
  console.log(`  ${path.basename(dest)} (${kb} KB)`)
}

async function processProduct(slug) {
  const src = path.join(PUBLIC, 'products', `${slug}.webp`)
  if (!fs.existsSync(src)) {
    console.warn(`Eksik: products/${slug}.webp`)
    return
  }
  console.log(slug)
  for (const w of PRODUCT_WIDTHS) {
    const dest = path.join(PUBLIC, 'products', `${slug}-${w}w.webp`)
    await resizeWebp(src, dest, w)
  }
}

async function processHero() {
  const src = path.join(PUBLIC, 'hero-home.webp')
  if (!fs.existsSync(src)) {
    console.warn('Eksik: hero-home.webp')
    return
  }
  console.log('hero-home')
  for (const w of HERO_WIDTHS) {
    const dest = path.join(PUBLIC, `hero-home-${w}w.webp`)
    await resizeWebp(src, dest, w)
  }
}

for (const slug of PRODUCTS) await processProduct(slug)
await processHero()
console.log('Tamam')
