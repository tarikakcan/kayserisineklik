import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const ROOT = path.resolve('kaynak/public')
const LIVE = path.resolve('1-CANLI-SITE/assets')

/** Önce canlı klasördeki daha yeni optimize dosyaları kaynağa kopyala */
function syncOptimizedSources() {
  const pairs = [
    ['hero-home.jpg', 'hero-home.jpg'],
    ['hero-home.png', 'hero-home.png'],
    ['products/kapi-sinekligi.jpg', 'products/kapi-sinekligi.jpg'],
    ['products/kapi-sinekligi.png', 'products/kapi-sinekligi.png'],
    ['products/kedi-sinekligi.jpg', 'products/kedi-sinekligi.jpg'],
    ['products/kedi-sinekligi.png', 'products/kedi-sinekligi.png'],
    ['products/kedi-sinekligi-balkon.jpg', 'products/kedi-sinekligi-balkon.jpg'],
    ['products/kedi-sinekligi-balkon.png', 'products/kedi-sinekligi-balkon.png'],
    ['products/surgulu-sineklik.jpg', 'products/surgulu-sineklik.jpg'],
    ['products/surgulu-sineklik.png', 'products/surgulu-sineklik.png'],
    ['products/sineklik-tamir-bandi.jpg', 'products/sineklik-tamir-bandi.jpg'],
    ['products/sineklik-tamir-bandi.png', 'products/sineklik-tamir-bandi.png'],
    ['products/sineklik-tamir-bandi-steps.jpg', 'products/sineklik-tamir-bandi-steps.jpg'],
    ['products/sineklik-tamir-bandi-steps.png', 'products/sineklik-tamir-bandi-steps.png'],
    ['products/sineklik-tamir-bandi-rolls.jpg', 'products/sineklik-tamir-bandi-rolls.jpg'],
    ['products/sineklik-tamir-bandi-rolls.png', 'products/sineklik-tamir-bandi-rolls.png'],
  ]
  for (const [rel] of pairs) {
    const src = path.join(LIVE, rel)
    const dest = path.join(ROOT, rel)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    if (!fs.existsSync(dest) || fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs) {
      fs.copyFileSync(src, dest)
      console.log('sync', rel)
    }
  }
}

async function convertDir(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await convertDir(full)
      continue
    }
    if (!/\.(png|jpe?g)$/i.test(entry.name)) continue
  const webpPath = full.replace(/\.(png|jpe?g)$/i, '.webp')
    if (fs.existsSync(webpPath) && fs.statSync(webpPath).mtimeMs >= fs.statSync(full).mtimeMs) {
      continue
    }
    await sharp(full)
      .webp({ quality: 82, effort: 4 })
      .toFile(webpPath)
    const before = fs.statSync(full).size
    const after = fs.statSync(webpPath).size
    console.log(`webp ${path.relative(ROOT, webpPath)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`)
  }
}

syncOptimizedSources()
await convertDir(ROOT)
console.log('Tamam')
