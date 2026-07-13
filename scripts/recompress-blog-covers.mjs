/**
 * Blog kapak + ağır ürün 400w WebP sıkıştırma (PageSpeed).
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'kaynak', 'public')
const BLOG = path.join(PUBLIC, 'blog')
const PRODUCTS = path.join(PUBLIC, 'products')

async function toWebp(src, dest, width, quality) {
  const input = Buffer.isBuffer(src) ? src : fs.readFileSync(src)
  const buf = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toBuffer()
  const out = dest + '.tmp'
  fs.writeFileSync(out, buf)
  fs.renameSync(out, dest)
  return buf.length
}

console.log('— blog kapakları —')
for (const name of fs.readdirSync(BLOG).filter((f) => f.endsWith('.webp') && !/-\d+w\.webp$/i.test(f))) {
  const srcPath = path.join(BLOG, name)
  const input = fs.readFileSync(srcPath)
  const before = input.length
  const base = name.replace(/\.webp$/i, '')
  const masterN = await toWebp(input, srcPath, 800, 68)
  const n400 = await toWebp(input, path.join(BLOG, `${base}-400w.webp`), 400, 62)
  const n800 = await toWebp(input, path.join(BLOG, `${base}-800w.webp`), 800, 68)
  console.log(`${name} ${Math.round(before / 1024)}→${Math.round(masterN / 1024)}KB | 400w ${Math.round(n400 / 1024)}KB | 800w ${Math.round(n800 / 1024)}KB`)
}

console.log('— ürün 400w (agresif) —')
const heavy400 = ['kedi-sinekligi', 'kapi-sinekligi', 'surgulu-sineklik', 'pencere-sinekligi', 'sineklik-tamir-bandi']
for (const slug of heavy400) {
  const master = path.join(PRODUCTS, `${slug}.webp`)
  const dest = path.join(PRODUCTS, `${slug}-400w.webp`)
  if (!fs.existsSync(master)) continue
  const before = fs.existsSync(dest) ? fs.statSync(dest).size : 0
  const n = await toWebp(master, dest, 400, 55)
  console.log(`${slug}-400w ${Math.round(before / 1024)}→${Math.round(n / 1024)}KB`)
}

console.log('Tamam')
