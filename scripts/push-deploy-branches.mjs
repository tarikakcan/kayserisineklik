/**
 * Hostinger Git deploy için orphan branch'ler:
 *   live  → 1-CANLI-SITE içeriği (public_html kökü)
 *   admin → 2-ADMIN içeriği (admin subdomain)
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

function pushDeployBranch(branch, srcDir) {
  const tmp = path.join(ROOT, `.deploy-${branch}`)
  if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true })

  copyDir(srcDir, tmp, new Set(['.env', '.git']))
  const remote = execSync('git remote get-url origin', { cwd: ROOT, encoding: 'utf8' }).trim()

  run('git init', tmp)
  run('git checkout -b ' + branch, tmp)
  run('git add .', tmp)
  run(`git commit -m "Deploy ${branch}: ${new Date().toISOString().slice(0, 10)}"`, tmp)
  run(`git remote add origin "${remote}"`, tmp)
  run(`git push -u origin ${branch} --force`, tmp)

  fs.rmSync(tmp, { recursive: true, force: true })
  console.log(`\n✓ ${branch} branch pushed (kök = ${path.basename(srcDir)} içeriği)\n`)
}

console.log('Build…')
run('npm run build')

const live = path.join(ROOT, '1-CANLI-SITE')
const admin = path.join(ROOT, '2-ADMIN')
if (!fs.existsSync(live)) throw new Error('1-CANLI-SITE yok — önce npm run build')
if (!fs.existsSync(admin)) throw new Error('2-ADMIN yok — önce npm run build')

pushDeployBranch('live', live)
pushDeployBranch('admin', admin)

console.log('Hostinger Git:')
console.log('  Ana site  → branch: live')
console.log('  Admin     → branch: admin')
