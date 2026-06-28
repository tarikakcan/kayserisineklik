/**
 * urun_aciklama_metinleri.md → kaynak/lib/product-content/{slug}.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { products } from '../kaynak/lib/products-config.js'
import { boldTerms } from '../kaynak/pure-html/product-content-render.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const MD_PATH = path.join(ROOT, 'urun_aciklama_metinleri.md')
const OUT_DIR = path.join(ROOT, 'kaynak/lib/product-content')

/** Paragraf indeksleri — md dosyasındaki sıraya göre (--- satırları hariç) */
const SECTION_MAP = {
  'dikey-plise-sineklik': {
    howItWorks: [0, 1],
    useCases: [2],
    materials: [3],
    colors: [4],
    pricing: [5, 8],
    maintenance: [6, 7],
  },
  'duble-plise-sineklik': {
    howItWorks: [0, 1],
    useCases: [2, 6],
    materials: [3],
    colors: [4],
    maintenance: [5],
    pricing: [7, 8, 9],
  },
  'yatay-plise-sineklik': {
    howItWorks: [0, 1, 2],
    useCases: [3, 6],
    materials: [4],
    maintenance: [5],
    colors: [7],
    pricing: [8, 9],
  },
  'menteseli-sineklik': {
    howItWorks: [0, 1],
    useCases: [2, 3, 6],
    materials: [4],
    colors: [5],
    maintenance: [7],
    pricing: [8, 9],
  },
  'kapi-sinekligi': {
    howItWorks: [0, 1],
    useCases: [2, 6],
    colors: [3],
    materials: [4],
    maintenance: [5, 7],
    pricing: [8, 9],
  },
  'pencere-sinekligi': {
    howItWorks: [0, 1],
    useCases: [2, 7],
    materials: [5],
    colors: [6],
    maintenance: [3, 4, 8],
    pricing: [9, 10],
  },
  'kedi-sinekligi': {
    howItWorks: [0, 1, 2],
    useCases: [3, 6],
    materials: [4],
    colors: [5],
    maintenance: [7],
    pricing: [8, 9],
  },
  'surgulu-sineklik': {
    howItWorks: [0, 1, 2],
    useCases: [3, 7],
    materials: [4],
    colors: [5, 6],
    maintenance: [8],
    pricing: [9, 10],
  },
}

/** selectionType: 'color' ürünlerinde md metni yerine kullanılır */
const COLOR_PRODUCTS_TEXT =
  'Renk seçeneklerimiz arasında beyaz, vizon, meşe, altın meşe ve antrasit bulunuyor; böylece pencerenizin doğrama rengiyle uyumlu bir görünüm elde edebiliyorsunuz. Beyaz ve vizon özellikle PVC pencerelerle, meşe ve altın meşe ise ahşap görünümlü doğramalarla, antrasit ise modern koyu renkli PVC doğramalarla çok iyi uyum sağlıyor.'

const MATERIAL_TERMS = [
  'alüminyum kasa', 'alüminyum profil', 'alüminyum profilden', 'alüminyum çerçeve',
  'alüminyum', 'fiberglas kumaş', 'fiberglas tül', 'fiberglas tel', 'fiberglas',
  'polyester tel', 'polyester örgü', 'güçlendirilmiş polyester', 'dayanıklı tül',
  'plise kumaş', 'tül kumaş', 'tül kısmı', 'tül',
  'paslanmaz menteşe', 'menteşe', 'menteşeler', 'ray sistemi', 'ray', 'raylar',
  'mıknatıs', 'mıknatıslı', 'kilit mekanizması', 'kasa profili', 'kasa yapısı',
  'çerçeve yapısı', 'çerçeve',
]

function paras(text) {
  return text.split(/\n+/).map(s => s.trim()).filter(s => s && !/^---+$/.test(s))
}

function pick(paragraphs, indices) {
  return indices.map(i => paragraphs[i]).filter(Boolean)
}

function titleForSentence(s) {
  if (/mutfakta yemek|yemek pişerken/i.test(s)) return 'Mutfak Pencereleri'
  if (/yazlık/i.test(s)) return 'Yazlık Evler'
  if (/tek kanatlı|sabit bir taraf|günlük olarak sık/i.test(s)) return 'Günlük Kullanılan Odalar'
  if (/mutfak/i.test(s)) return 'Mutfak ve Yaşam Alanları'
  if (/balkon kap/i.test(s)) return 'Balkon Kapıları'
  if (/teras/i.test(s)) return 'Teras Kapıları'
  if (/restoran|kafe|işyer|vitrin/i.test(s)) return 'İşyeri ve Vitrinler'
  if (/çocuk/i.test(s)) return 'Çocuklu Aileler'
  if (/kedi|evcil hayvan|köpek/i.test(s)) return 'Evcil Hayvanlı Evler'
  if (/sürme|sürgülü|sürme cam/i.test(s)) return 'Sürme Pencereler'
  if (/giriş kap|bahçe kap/i.test(s)) return 'Giriş Kapıları'
  if (/apartman|toplu konut|site/i.test(s)) return 'Apartman Daireleri'
  if (/modern mimar|cam cephe|salon/i.test(s)) return 'Modern Cam Cepheler'
  if (/kiracı/i.test(s)) return 'Kiracılar ve Taşınabilir Montaj'
  if (/mıknatıslı/i.test(s)) return 'Sık Geçiş Noktaları'
  const words = s.replace(/[.!?]+$/, '').split(/\s+/).slice(0, 4).join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function useCaseCards(rawParts) {
  const raw = rawParts.join(' ')
  const sentences = raw.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 20)
  const cards = []
  const usedTitles = new Set()
  for (const s of sentences) {
    const title = titleForSentence(s)
    if (usedTitles.has(title)) continue
    usedTitles.add(title)
    cards.push({ title, text: s })
    if (cards.length >= 4) break
  }
  return cards
}

function maintenanceItems(rawParts) {
  const items = []
  for (const part of rawParts) {
    const sentences = part.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 15)
    items.push(...sentences)
  }
  return items.slice(0, 7)
}

function parseMd(md) {
  const blocks = {}
  const re = /^##\s+\d+\.\s+(.+)$/gm
  const matches = [...md.matchAll(re)]
  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][1].trim()
    const start = matches[i].index + matches[i][0].length
    const end = i + 1 < matches.length ? matches[i + 1].index : md.length
    blocks[title] = md.slice(start, end).trim()
  }
  return blocks
}

function toContent(slug, block) {
  const map = SECTION_MAP[slug]
  if (!map) throw new Error(`SECTION_MAP eksik: ${slug}`)
  const p = paras(block)
  const used = new Set(Object.values(map).flat())
  if (used.size !== p.length) {
    const missing = p.map((_, i) => i).filter(i => !used.has(i))
    const extra = [...used].filter(i => i >= p.length)
    if (missing.length || extra.length) {
      console.warn(`  ⚠ ${slug}: ${p.length} paragraf, harita ${used.size} indeks — eksik: [${missing}]`)
    }
  }

  const materialsText = pick(p, map.materials).join('\n\n')
  const colorsText = pick(p, map.colors).join('\n\n')
  const product = products.find((x) => x.slug === slug)
  const content = {
    howItWorks: pick(p, map.howItWorks),
    useCases: useCaseCards(pick(p, map.useCases)),
    materials: materialsText
      ? { text: materialsText, html: boldTerms(materialsText, MATERIAL_TERMS) }
      : { text: '', html: '' },
    colors: { text: colorsText },
    maintenance: maintenanceItems(pick(p, map.maintenance)),
    pricing: { text: pick(p, map.pricing).join('\n\n') },
  }
  if (product?.selectionType === 'color') {
    content.colors = { text: COLOR_PRODUCTS_TEXT }
  }
  return content
}

function jsExport(obj) {
  return `/** Otomatik üretildi — urun_aciklama_metinleri.md */\nexport default ${JSON.stringify(obj, null, 2)}\n`
}

const onlySlug = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1]

if (!fs.existsSync(MD_PATH)) {
  console.error('Dosya bulunamadı:', MD_PATH)
  process.exit(1)
}

const md = fs.readFileSync(MD_PATH, 'utf8')
const blocks = parseMd(md)
fs.mkdirSync(OUT_DIR, { recursive: true })

const imported = []
for (const p of products) {
  if (onlySlug && p.slug !== onlySlug) continue
  if (!SECTION_MAP[p.slug]) {
    console.warn('SECTION_MAP yok:', p.slug)
    continue
  }
  const block = blocks[p.name]
  if (!block) {
    console.warn('Atlandı (md\'de yok):', p.name)
    continue
  }
  const content = toContent(p.slug, block)
  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}.js`), jsExport(content), 'utf8')
  console.log('✓', p.slug)
  imported.push(p)
}

const varName = (slug) => slug.replace(/-/g, '_')
const indexLines = imported.map(p => `import ${varName(p.slug)} from './product-content/${p.slug}.js'`).join('\n')
const mapEntries = imported.map(p => `  '${p.slug}': ${varName(p.slug)},`).join('\n')

const index = `/** Otomatik üretildi — import:product-content */\n${indexLines}\n\nexport const productContentBySlug = {\n${mapEntries}\n}\n\nexport function getProductContent(slug) {\n  const c = productContentBySlug[slug]\n  if (!c || !c.howItWorks?.length) return null\n  return c\n}\n`

fs.writeFileSync(path.join(ROOT, 'kaynak/lib/product-content.js'), index, 'utf8')
console.log(`\n${imported.length} ürün içeriği içe aktarıldı.`)
