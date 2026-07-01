/**
 * Admin .env oluşturur (kaynak/admin + 1-CANLI-SITE/admin).
 * Hostinger'da aynı içeriği public_html/admin/.env olarak yapıştırın.
 *
 * npm run admin:setup -- --password "Sifreniz"
 * npm run admin:setup -- --generate
 * npm run admin:setup -- --user admin --password "Sifreniz"
 */
import { execSync } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const ADMIN_DIRS = [
  path.join(ROOT, 'kaynak', 'admin'),
  path.join(ROOT, '1-CANLI-SITE', 'admin'),
]

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = { user: 'admin', password: '', generate: false }
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--user' && args[i + 1]) {
      opts.user = args[++i]
      continue
    }
    if (args[i] === '--password' && args[i + 1]) {
      opts.password = args[++i]
      continue
    }
    if (args[i] === '--generate') {
      opts.generate = true
    }
  }
  return opts
}

function generatePassword() {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#%'
  const bytes = crypto.randomBytes(18)
  let out = ''
  for (let i = 0; i < 18; i++) out += chars[bytes[i] % chars.length]
  return out
}

function hashPassword(password) {
  return execSync('php -r "echo password_hash(getenv(\'ADMIN_SETUP_PASSWORD\'), PASSWORD_BCRYPT);"', {
    encoding: 'utf8',
    env: { ...process.env, ADMIN_SETUP_PASSWORD: password },
  }).trim()
}

function writeEnv(user, hash) {
  const lines = [
    '# Admin panel — bu dosya Git\'e gitmez',
    `ADMIN_USER=${user}`,
    `ADMIN_PASS_HASH=${hash}`,
    '',
  ]
  const content = lines.join('\n')
  for (const dir of ADMIN_DIRS) {
    if (!fs.existsSync(dir)) {
      console.warn(`Atlandı (klasör yok): ${dir}`)
      continue
    }
    fs.writeFileSync(path.join(dir, '.env'), content, 'utf8')
  }
  return content
}

const opts = parseArgs()
let password = opts.password

if (!password) {
  if (opts.generate) {
    password = generatePassword()
  } else {
    console.error(`
Admin şifre kurulumu

  npm run admin:setup -- --password "Sifreniz"
  npm run admin:setup -- --generate
  npm run admin:setup -- --user admin --password "Sifreniz"
`)
    process.exit(1)
  }
}

if (password.length < 8) {
  console.error('Şifre en az 8 karakter olmalı.')
  process.exit(1)
}

const hash = hashPassword(password)
writeEnv(opts.user, hash)

console.log('\n✓ Admin .env oluşturuldu:')
for (const dir of ADMIN_DIRS) {
  if (fs.existsSync(dir)) console.log(`  ${path.join(dir, '.env')}`)
}

console.log(`
Giriş bilgileri
  Kullanıcı: ${opts.user}
  Şifre:     ${password}

Hostinger (canlı admin paneli)
  Dosya: public_html/admin/.env
  İçerik aynı — deploy bu dosyayı göndermez, panelden elle ekleyin.
  Panel: https://admin.kayserisineklik.com.tr/admin/

Yerel test
  cd kaynak/admin
  php -S localhost:4000 router.php
  → http://localhost:4000/admin/
`)
