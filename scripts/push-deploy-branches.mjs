/**
 * GitHub main  = SADECE canlı site (Hostinger public_html)
 * GitHub dev   = kaynak kod (geliştirme, deploy edilmez)
 *
 * Çalıştır: npm run deploy:github
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROD_BRANCH = 'main'
const DEV_BRANCH = 'dev'

function run(cmd, cwd = ROOT, quiet = false) {
  execSync(cmd, { cwd, stdio: quiet ? 'pipe' : 'inherit', shell: true })
}

function tryRun(cmd) {
  try {
    run(cmd, ROOT, true)
  } catch {
    /* branch yoksa sorun değil */
  }
}

function copyDir(src, dest, skip = new Set()) {
  fs.mkdirSync(dest, { recursive: true })
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(e.name)) continue
    const s = path.join(src, e.name)
    const d = path.join(dest, e.name)
    if (e.isDirectory()) copyDir(s, d, skip)
    else fs.copyFileSync(s, d)
  }
}

function pushProductionMain() {
  const src = path.join(ROOT, '1-CANLI-SITE')
  const tmp = path.join(ROOT, '.deploy-main')
  if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true })

  copyDir(src, tmp, new Set(['.env', '.git']))
  const remote = execSync('git remote get-url origin', { cwd: ROOT, encoding: 'utf8' }).trim()
  const date = new Date().toISOString().slice(0, 10)

  run('git init', tmp)
  run(`git checkout -b ${PROD_BRANCH}`, tmp)
  run('git add .', tmp)
  run(`git commit -m "Canlı site: ${date}"`, tmp)
  run(`git remote add origin "${remote}"`, tmp)
  run(`git push -u origin ${PROD_BRANCH} --force`, tmp)

  fs.rmSync(tmp, { recursive: true, force: true })
  console.log(`\n✓ GitHub ${PROD_BRANCH} → sadece canlı dosyalar (Hostinger çeker)\n`)
}

function ensureDevBranch() {
  const branch = execSync('git branch --show-current', { cwd: ROOT, encoding: 'utf8' }).trim()
  if (branch !== DEV_BRANCH) {
    tryRun(`git branch -M ${DEV_BRANCH}`)
    console.log(`Yerel branch → ${DEV_BRANCH}`)
  }
  run(`git push -u origin ${DEV_BRANCH}`)
  console.log(`✓ GitHub ${DEV_BRANCH} → kaynak kod\n`)
}

console.log('Build…')
run('npm run build')

const site = path.join(ROOT, '1-CANLI-SITE')
if (!fs.existsSync(site)) throw new Error('1-CANLI-SITE yok')
if (!fs.existsSync(path.join(site, 'admin'))) throw new Error('admin/ eksik')
if (!fs.existsSync(path.join(site, 'api'))) throw new Error('api/ eksik')
if (!fs.existsSync(path.join(site, 'index.html'))) throw new Error('index.html eksik')

pushProductionMain()
ensureDevBranch()

tryRun('git push origin --delete live')
tryRun('git push origin --delete admin')

console.log('Hostinger Git ayarı: branch = main')
console.log('  kayserisineklik.com.tr       → public_html/')
console.log('  api.kayserisineklik.com.tr   → public_html/api/')
console.log('  admin.kayserisineklik.com.tr → public_html/admin/')
