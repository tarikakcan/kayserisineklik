/**
 * Hostinger Git deploy — live branch = public_html tamamı
 *   /           → ana site
 *   /api/       → api.kayserisineklik.com.tr
 *   /admin/     → admin.kayserisineklik.com.tr
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function run(cmd, cwd = ROOT) {
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
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

function pushLiveBranch() {
  const liveSrc = path.join(ROOT, '1-CANLI-SITE')
  const tmp = path.join(ROOT, '.deploy-live')
  if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true })

  copyDir(liveSrc, tmp, new Set(['.env', '.git']))
  const remote = execSync('git remote get-url origin', { cwd: ROOT, encoding: 'utf8' }).trim()

  run('git init', tmp)
  run('git checkout -b live', tmp)
  run('git add .', tmp)
  run(`git commit -m "Deploy live: ${new Date().toISOString().slice(0, 10)}"`, tmp)
  run(`git remote add origin "${remote}"`, tmp)
  run('git push -u origin live --force', tmp)

  fs.rmSync(tmp, { recursive: true, force: true })
  console.log('\n✓ live branch → GitHub (Hostinger otomatik çeker)\n')
}

console.log('Build…')
run('npm run build')

const live = path.join(ROOT, '1-CANLI-SITE')
if (!fs.existsSync(live)) throw new Error('1-CANLI-SITE yok')
if (!fs.existsSync(path.join(live, 'admin'))) throw new Error('admin/ eksik — build syncAdminIntoLive kontrol et')

pushLiveBranch()

console.log('Hostinger alt alan adları (public_html alt klasörleri):')
console.log('  kayserisineklik.com.tr           → public_html/')
console.log('  api.kayserisineklik.com.tr       → public_html/api/')
console.log('  admin.kayserisineklik.com.tr     → public_html/admin/')
