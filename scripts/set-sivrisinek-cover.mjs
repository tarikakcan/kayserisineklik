import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const src = path.resolve(
  'C:/Users/mosta/.cursor/projects/c-Users-mosta-Desktop-kayserisineklik/assets/c__Users_mosta_AppData_Roaming_Cursor_User_workspaceStorage_1600d7864e3a9c3564eb24452ed194aa_images_blog-gorsel-16-5eced934-d288-4d8a-9764-05d4f85aa9b4.png'
)
const destDir = path.resolve('kaynak/public/blog')
const webp = path.join(destDir, 'sivrisinekle-bas-etme-7-yol.webp')

if (!fs.existsSync(src)) {
  console.error('Kaynak görsel bulunamadı:', src)
  process.exit(1)
}

fs.mkdirSync(destDir, { recursive: true })
await sharp(src).webp({ quality: 85, effort: 4 }).toFile(webp)
console.log('Kapak görseli:', webp, `(${Math.round(fs.statSync(webp).size / 1024)} KB)`)
