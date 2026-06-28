/**
 * Saf HTML site üretici — _next yok, sürükle-bırak deploy.
 * Çalıştır: npm run build  (proje kökünden)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { renderProductContentLeft, renderPriceSection } from './product-content-render.mjs'
import { renderBlogBlocks } from './blog-content-render.mjs'
import { renderLegalPage } from './legal-render.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PROJECT = path.join(ROOT, '..')
const OUT = path.join(PROJECT, '1-CANLI-SITE')
const ADMIN_OUT = path.join(PROJECT, '2-ADMIN')

const { site } = await import(pathToFileURL(path.join(ROOT, 'lib/site-config.js')).href)
const { products } = await import(pathToFileURL(path.join(ROOT, 'lib/products-config.js')).href)
const { blogPosts } = await import(pathToFileURL(path.join(ROOT, 'lib/blog-posts.js')).href)
const { getProductContent } = await import(pathToFileURL(path.join(ROOT, 'lib/product-content.js')).href)
const { legalNav, legalMeta } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/legal-config.js')).href)
const { gizlilikPolitikasi } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/gizlilik-politikasi.js')).href)
const { kvkkAydinlatmaMetni } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/kvkk-aydinlatma-metni.js')).href)
const { kullanimKosullari } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/kullanim-kosullari.js')).href)

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const formatPrice = (n) => Number(n).toLocaleString('tr-TR')
/** Canonical/sitemap ile uyumlu uzantısız URL (/urunler/dikey-plise-sineklik) */
const url = (route) => {
  if (!route || route === 'index.html' || route === '/') return '/'
  return '/' + String(route).replace(/\.html$/, '').replace(/^\/+/, '')
}
const wa = (msg = 'Merhaba, sineklik için bilgi almak istiyorum.') =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`

const FRAME_COLORS = [
  { name: 'Beyaz', file: 'beyaz.png' },
  { name: 'Vizon', file: 'vizon.png' },
  { name: 'Meşe', file: 'mese.png' },
  { name: 'Altın Meşe', file: 'altin-mese.png' },
  { name: 'Antrasit', file: 'antrasit.png' },
]

function calcColorSwatches(depth = 0) {
  const p = depth ? '../'.repeat(depth) : ''
  const swatches = FRAME_COLORS.map((c, i) =>
    `<button type="button" class="calc-color-swatch h-10 w-10 rounded-full border-2 transition-all ${i === 0 ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/50'}" data-color="${esc(c.name)}" title="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="${i === 0 ? 'true' : 'false'}" style="background:url('${p}assets/colors/${c.file}') center/cover no-repeat"></button>`
  ).join('')
  return `<div><label class="text-xs font-medium">Renk</label>
<div id="calc-colors" class="flex flex-wrap gap-2.5 mt-2" role="radiogroup" aria-label="Renk seçin">${swatches}</div>
<input type="hidden" id="calc-color" value="${esc(FRAME_COLORS[0].name)}"/></div>`
}

function calcQtyRow() {
  return `<div class="flex items-stretch gap-2 calc-qty-row">
<div class="calc-qty-group flex items-center border border-border rounded-md shrink-0 bg-background" title="Adet">
<button type="button" class="calc-qty-btn calc-qty-minus px-2.5 py-2 text-lg leading-none hover:bg-muted transition-colors" aria-label="Adet azalt">−</button>
<span class="calc-qty-value px-2.5 py-2 min-w-[2rem] text-center text-sm font-semibold tabular-nums border-x border-border">1</span>
<button type="button" class="calc-qty-btn calc-qty-plus px-2.5 py-2 text-lg leading-none hover:bg-muted transition-colors" aria-label="Adet artır">+</button>
</div>
<button type="button" id="calc-btn" class="flex-1 min-w-0 py-2 px-3 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Fiyat Hesapla</button>
</div>`
}

function formConsentBlock() {
  const gizlilik = url('gizlilik-politikasi.html')
  const kvkk = url('kvkk-aydinlatma-metni.html')
  return `<label class="form-consent">
<input type="checkbox" name="privacy_consent" value="1" required class="form-consent-input"/>
<span class="form-consent-text"><a href="${gizlilik}" target="_blank" rel="noopener noreferrer">Gizlilik Politikası</a> ve <a href="${kvkk}" target="_blank" rel="noopener noreferrer">KVKK Aydınlatma Metni</a>&rsquo;ni okudum, anladım.</span>
</label>`
}

function calcQuoteActions(waIcon) {
  const icon = waIcon.replace('h-7 w-7', 'h-4 w-4 shrink-0')
  return `<div class="flex items-stretch gap-2 pt-1">
<a id="calc-wa" href="${wa()}" target="_blank" rel="noreferrer" aria-label="WhatsApp'tan teklif al" class="calc-action-btn flex-1 inline-flex items-center justify-center gap-1.5 min-h-[2.75rem] py-2 px-2 rounded-md bg-[#25D366] text-white text-sm font-semibold no-underline hover:bg-[#20bd5a] transition-colors">${icon}<span class="text-center leading-tight">WhatsApp Teklif</span></a>
<button type="button" id="quote-open" aria-label="Form ile teklif iste" class="calc-action-btn flex-1 inline-flex items-center justify-center min-h-[2.75rem] py-2 px-2 rounded-md border border-primary text-primary text-sm font-semibold bg-background hover:bg-primary/5 transition-colors"><span class="text-center leading-tight">Form ile Teklif</span></button>
</div>`
}

function schemaLocalBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: `${site.name} - ${site.company}`,
    image: `${site.url}/logo.svg`,
    url: `${site.url}/`,
    telephone: site.phoneIntl,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: ['Kayseri', 'Türkiye'],
    priceRange: '₺₺',
    sameAs: [],
  }
}

function schemaProduct(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.tagline,
    image: p.image.startsWith('http') ? p.image : `${site.url}${p.image}`,
    brand: { '@type': 'Brand', name: 'Edeka Kapı' },
    offers: {
      '@type': 'Offer',
      url: `${site.url}/urunler/${p.slug}`,
      priceCurrency: 'TRY',
      price: String(p.minPrice),
      priceValidUntil: `${new Date().getFullYear()}-12-31`,
      availability: 'https://schema.org/InStock',
      areaServed: 'TR',
    },
  }
}

function schemaBreadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.href.startsWith('http') ? it.href : `${site.url}${it.href}`,
    })),
  }
}

function staticPricesTable() {
  const rows = products.map(p => `<tr class="border-b">
<td class="p-3 font-medium">${esc(p.name)}</td>
<td class="p-3 text-right font-semibold text-primary price-cell" data-slug="${p.slug}">₺${formatPrice(p.pricePerM2)}</td>
<td class="p-3 text-right hidden sm:table-cell text-muted-foreground min-cell" data-slug="${p.slug}">₺${formatPrice(p.minPrice)}</td>
<td class="p-3 text-right"><a href="${url(`urunler/${p.slug}.html`)}" class="text-primary font-semibold">Hesapla →</a></td></tr>`).join('')
  return `<table class="w-full text-sm"><thead><tr class="border-b bg-muted/50">
<th class="p-3 text-left">Ürün</th><th class="p-3 text-right">m² (KDV hariç)</th>
<th class="p-3 text-right hidden sm:table-cell">Min.</th><th></th></tr></thead><tbody>${rows}</tbody></table>`
}

const waIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`

function whatsappFab() {
  return `<a href="${wa()}" target="_blank" rel="noreferrer" title="WhatsApp: ${esc(site.phone)}" class="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20bd5a] hover:scale-105 transition-transform" aria-label="WhatsApp ile yazın: ${esc(site.phone)}">${waIconSvg}</a>`
}

function jsonLd(data) {
  const items = Array.isArray(data) ? data : [data]
  return items.map(d => `<script type="application/ld+json">${JSON.stringify(d)}</script>`).join('\n')
}

function head({ title, description, canonical, depth = 0, jsonLdData }) {
  const p = depth ? '../'.repeat(depth) : ''
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="${site.url}${canonical}"/>
<link rel="icon" href="${p}logo.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="${p}assets/css/site.css"/>
<link rel="stylesheet" href="${p}assets/css/site-fallback.css"/>
<style>:root{--font-sans:'Inter',system-ui,sans-serif;--font-display:'Playfair Display',Georgia,serif}body{font-family:var(--font-sans)}h1,h2,h3,.font-display{font-family:var(--font-display)}</style>
${jsonLdData ? jsonLd(jsonLdData) : ''}
</head>
<body class="antialiased">`
}

function announcement(depth = 0) {
  return `<div class="relative overflow-hidden bg-gradient-to-r from-primary via-[#b8330e] to-primary text-primary-foreground">
<div class="container relative flex items-center justify-center gap-3 py-2 text-xs sm:text-sm">
<span class="font-semibold">Türkiye'nin her yerine kargo!</span>
<span class="hidden sm:inline opacity-90">81 il'e güvenli teslimat</span>
<a href="${wa('Merhaba, Kayseri dışından kargo ile sineklik almak istiyorum.')}" target="_blank" rel="noreferrer" class="underline font-semibold">WhatsApp'tan sipariş ver →</a>
</div></div>`
}

function header(depth = 0) {
  const p = depth ? '../'.repeat(depth) : ''
  const productLinks = products.map(pr =>
    `<a href="${url(`urunler/${pr.slug}.html`)}" class="block px-3 py-2 rounded-lg hover:bg-muted text-sm">${esc(pr.name)}</a>`
  ).join('')
  return `<header class="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur">
<div class="container flex h-16 items-center justify-between gap-4">
<a href="${url('index.html')}" class="flex items-center gap-2">
<img src="${p}logo.svg" alt="${esc(site.name)}" class="h-9 w-auto max-w-[140px] object-contain" width="140" height="36"/>
<div class="hidden sm:flex flex-col leading-tight"><span class="font-bold">${esc(site.name)}</span><span class="text-[10px] text-muted-foreground">${esc(site.company)}</span></div>
</a>
<nav class="hidden lg:flex items-center gap-1">
<a href="${url('index.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Anasayfa</a>
<div class="relative group">
<a href="${url('urunler.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Ürünler</a>
<div class="absolute left-0 top-full pt-2 w-72 hidden group-hover:block"><div class="rounded-xl border bg-card shadow-lg p-2">${productLinks}</div></div>
</div>
<a href="${url('sineklik-fiyatlari.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Fiyatlar</a>
<a href="${url('sineklik-montaji.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Montaj</a>
<a href="${url('blog.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Blog</a>
<a href="${url('hakkimizda.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Hakkımızda</a>
<a href="${url('iletisim.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">İletişim</a>
</nav>
<a href="${wa()}" target="_blank" rel="noreferrer" class="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#25D366] whitespace-nowrap shrink-0">${waIconSvg.replace('h-7 w-7', 'h-4 w-4')}<span>${esc(site.phone)}</span></a>
<button type="button" id="menu-btn" class="lg:hidden p-2 rounded-md hover:bg-muted" aria-label="Menü">☰</button>
</div>
<div id="mobile-menu" class="lg:hidden hidden border-t bg-background"><div class="container py-3 flex flex-col gap-1">
<a href="${url('index.html')}" class="px-3 py-2 rounded-md hover:bg-muted text-sm">Anasayfa</a>
<a href="${url('urunler.html')}" class="px-3 py-2 rounded-md hover:bg-muted text-sm">Ürünler</a>
<a href="${url('sineklik-fiyatlari.html')}" class="px-3 py-2 rounded-md hover:bg-muted text-sm">Fiyatlar</a>
<a href="${url('iletisim.html')}" class="px-3 py-2 rounded-md hover:bg-muted text-sm">İletişim</a>
</div></div>
</header>`
}

function footer(depth = 0) {
  const p = depth ? '../'.repeat(depth) : ''
  return `<footer class="mt-20 border-t border-border bg-muted/30">
<div class="container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
<div><img src="${p}logo.svg" alt="${esc(site.name)}" class="h-10 w-auto max-w-[160px] object-contain"/><p class="mt-4 text-sm text-muted-foreground">${esc(site.slogans[0])}</p></div>
<div><h4 class="font-semibold mb-3">Ürünler</h4><ul class="space-y-2 text-sm">${products.map(pr => `<li><a href="${url(`urunler/${pr.slug}.html`)}" class="text-muted-foreground hover:text-primary">${esc(pr.name)}</a></li>`).join('')}</ul></div>
<div><h4 class="font-semibold mb-3">Kurumsal</h4><ul class="space-y-2 text-sm">
<li><a href="${url('hakkimizda.html')}" class="text-muted-foreground hover:text-primary">Hakkımızda</a></li>
<li><a href="${url('sineklik-fiyatlari.html')}" class="text-muted-foreground hover:text-primary">Fiyatlar</a></li>
<li><a href="${url('iletisim.html')}" class="text-muted-foreground hover:text-primary">İletişim</a></li>
</ul></div>
<div><h4 class="font-semibold mb-3">Yasal</h4><ul class="space-y-2 text-sm">
${legalNav.map(l => `<li><a href="${url(`${l.slug}.html`)}" class="text-muted-foreground hover:text-primary">${esc(l.label)}</a></li>`).join('')}
</ul></div>
<div><h4 class="font-semibold mb-3">İletişim</h4>
<p class="text-sm text-muted-foreground">${esc(site.address.full)}</p>
<p class="text-sm mt-2"><a href="tel:${site.phoneIntl}">${esc(site.phone)}</a></p>
<p class="text-sm"><a href="${wa()}" target="_blank" rel="noreferrer" class="text-[#25D366] font-medium hover:underline">WhatsApp ile yazın</a></p>
<p class="text-sm"><a href="mailto:${site.email}">${esc(site.email)}</a></p>
</div></div>
<div class="border-t"><div class="container py-4 text-xs text-muted-foreground">© ${new Date().getFullYear()} ${esc(site.name)}</div></div>
</footer>
${whatsappFab()}
<script>window.SITE_CONFIG=${JSON.stringify({ whatsappNumber: site.whatsappNumber, pricingApi: site.pricingApi || 'https://admin.kayserisineklik.com.tr/api/pricing.php', formContact: '/api/contact.php', formQuote: '/api/quote.php', products: products.map(p=>({slug:p.slug,name:p.name,pricePerM2:p.pricePerM2,minPrice:p.minPrice,options:p.options,selectionType:p.selectionType})) })};</script>
<script src="${p}assets/js/site.js"></script>
</body></html>`
}

function layout({ title, description, canonical, body, jsonLdData, depth = 0 }) {
  return `${head({ title, description, canonical, depth, jsonLdData })}
${announcement(depth)}
${header(depth)}
<main class="min-h-[60vh]">${body}</main>
${footer(depth)}`
}

function write(rel, html) {
  const file = path.join(OUT, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html, 'utf8')
  console.log('  ', rel)
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name)
    const d = path.join(dest, e.name)
    if (e.name === '.env' || e.name === 'data') continue
    if (e.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

function copyAssets() {
  fs.mkdirSync(path.join(OUT, 'assets/css'), { recursive: true })
  fs.copyFileSync(path.join(ROOT, 'assets/css/site.css'), path.join(OUT, 'assets/css/site.css'))
  fs.copyFileSync(path.join(ROOT, 'public/site-fallback.css'), path.join(OUT, 'assets/css/site-fallback.css'))
  fs.copyFileSync(path.join(ROOT, 'public/logo.svg'), path.join(OUT, 'logo.svg'))
  fs.mkdirSync(path.join(OUT, 'assets/js'), { recursive: true })
  fs.copyFileSync(path.join(__dirname, 'assets/site.js'), path.join(OUT, 'assets/js/site.js'))
  copyDir(path.join(ROOT, 'public/colors'), path.join(OUT, 'assets/colors'))
  if (fs.existsSync(path.join(ROOT, 'public/blog'))) {
    copyDir(path.join(ROOT, 'public/blog'), path.join(OUT, 'assets/blog'))
  }
  if (fs.existsSync(path.join(ROOT, 'public/products'))) {
    copyDir(path.join(ROOT, 'public/products'), path.join(OUT, 'assets/products'))
  }
  copyDir(path.join(ROOT, 'public/api'), path.join(OUT, 'api'))
  const apiDataHt = path.join(ROOT, 'public/api/data/.htaccess')
  if (fs.existsSync(apiDataHt)) {
    fs.mkdirSync(path.join(OUT, 'api/data'), { recursive: true })
    fs.copyFileSync(apiDataHt, path.join(OUT, 'api/data/.htaccess'))
  }
  fs.copyFileSync(path.join(ROOT, 'public/.htaccess'), path.join(OUT, '.htaccess'))
  writeSeoFiles()
}

function writeSeoFiles() {
  const now = new Date().toISOString()
  const urls = [
    { loc: `${site.url}/`, priority: '1.0' },
    { loc: `${site.url}/urunler`, priority: '0.9' },
    { loc: `${site.url}/sineklik-fiyatlari`, priority: '0.9' },
    { loc: `${site.url}/sineklik-montaji`, priority: '0.8' },
    { loc: `${site.url}/blog`, priority: '0.8' },
    { loc: `${site.url}/hakkimizda`, priority: '0.7' },
    { loc: `${site.url}/iletisim`, priority: '0.8' },
    { loc: `${site.url}/gizlilik-politikasi`, priority: '0.4' },
    { loc: `${site.url}/kvkk-aydinlatma-metni`, priority: '0.4' },
    { loc: `${site.url}/kullanim-kosullari`, priority: '0.4' },
    ...products.map(p => ({ loc: `${site.url}/urunler/${p.slug}`, priority: '0.9' })),
    ...blogPosts.map(b => ({ loc: `${site.url}/blog/${b.slug}`, priority: '0.7' })),
  ]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${now}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap, 'utf8')
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`, 'utf8')
}

function copyAdmin() {
  if (fs.existsSync(ADMIN_OUT)) fs.rmSync(ADMIN_OUT, { recursive: true, force: true })
  copyDir(path.join(ROOT, 'admin'), ADMIN_OUT)
}

/** Hostinger: admin.kayserisineklik.com.tr → public_html/admin */
function syncAdminIntoLive() {
  const dest = path.join(OUT, 'admin')
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true })
  copyDir(ADMIN_OUT, dest)
  const dataHt = path.join(ROOT, 'admin', 'data', '.htaccess')
  if (fs.existsSync(dataHt)) {
    fs.mkdirSync(path.join(dest, 'data'), { recursive: true })
    fs.copyFileSync(dataHt, path.join(dest, 'data', '.htaccess'))
  }
}

function pageHome() {
  const cards = products.map(p => `<a href="${url(`urunler/${p.slug}.html`)}" class="group rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/40 block">
<div class="aspect-[4/5] relative overflow-hidden"><img src="${esc(p.image)}" alt="${esc(p.name)} — Kayseri sineklik" class="h-full w-full object-cover"/>
<span class="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full price-badge" data-slug="${p.slug}">₺${p.pricePerM2}/m² + KDV</span></div>
<div class="p-5"><h3 class="font-display font-bold text-xl">${esc(p.name)}</h3><p class="text-sm text-muted-foreground mt-2">${esc(p.tagline)}</p></div></a>`).join('')
  const blogs = blogPosts.slice(0, 3).map(b => `<a href="${url(`blog/${b.slug}.html`)}" class="group rounded-3xl overflow-hidden bg-card border block">
<div class="aspect-[16/10] overflow-hidden"><img src="${esc(blogCoverSrc(b.cover))}" alt="${esc(b.title)}" class="h-full w-full object-cover"/></div>
<div class="p-5"><h3 class="font-display font-bold text-lg">${esc(b.title)}</h3><p class="text-sm text-muted-foreground mt-2">${esc(b.description)}</p></div></a>`).join('')
  write('index.html', layout({
    title: `${site.name} | Plise, Menteşeli ve Sürgülü Sineklik`,
    description: site.description,
    canonical: '/',
    jsonLdData: schemaLocalBusiness(),
    body: `<section class="warm-hero"><div class="container py-14 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
<div><h1 class="text-4xl md:text-6xl font-bold leading-tight">Sinek girmesin, <span class="text-primary ink-underline">içeri ferahlık</span> girsin.</h1>
<p class="mt-6 text-lg text-foreground/75">${esc(site.description)}</p>
<div class="mt-8 flex flex-wrap gap-3">
<a href="${wa()}" class="inline-flex items-center px-7 py-3 rounded-full bg-[#25D366] text-white font-semibold">WhatsApp'tan Teklif Al</a>
<a href="tel:${site.phoneIntl}" class="inline-flex items-center px-6 py-3 rounded-full border font-semibold">${esc(site.phone)}</a>
</div></div>
<div class="rounded-3xl overflow-hidden frame-card"><img src="${esc(products[1].image)}" alt="Duble plise sineklik Kayseri montaj örneği" class="w-full aspect-[4/3] object-cover"/></div>
</div></section>
<section class="container py-16"><h2 class="text-3xl font-bold mb-8">Koleksiyon</h2><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">${cards}</div></section>
<section class="container py-10"><div class="grid md:grid-cols-3 gap-5">${blogs}</div></section>`
  }))
}

function pageProducts() {
  const grid = products.map(p => `<a href="${url(`urunler/${p.slug}.html`)}" class="rounded-2xl overflow-hidden bg-card border block">
<img src="${esc(p.image)}" alt="${esc(p.name)} — Kayseri sineklik modeli" class="aspect-[4/3] object-cover w-full"/>
<div class="p-4"><h2 class="font-semibold">${esc(p.name)}</h2><p class="text-sm text-muted-foreground">${esc(p.tagline)}</p>
<span class="text-sm font-semibold text-primary price-badge" data-slug="${p.slug}">₺${p.pricePerM2}/m² + KDV</span></div></a>`).join('')
  write('urunler/index.html', layout({
    title: 'Sineklik Modelleri',
    description: '8 sineklik modeli',
    canonical: '/urunler',
    depth: 1,
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Ürünler', href: '/urunler' },
    ]),
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">Sineklik Modelleri</h1></div></section><section class="container py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">${grid}</section>`,
  }))
}

function pageProduct(p) {
  const opts = p.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')
  const openingBlock = p.selectionType === 'direction'
    ? `<div><label class="text-xs font-medium">Açılım</label><select id="calc-opt" class="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background">${opts}</select></div>`
    : ''
  const colorBlock = p.selectionType === 'color' ? calcColorSwatches(1) : ''
  const rich = getProductContent(p.slug)
  const richLeft = rich
    ? renderProductContentLeft(rich, { esc, frameColors: FRAME_COLORS, assetPrefix: '../' })
    : ''
  const richPrice = rich
    ? renderPriceSection(rich, p, { esc, formatPrice })
    : ''
  const others = products.filter(x => x.slug !== p.slug).slice(0, 4).map(o =>
    `<a href="${url(`urunler/${o.slug}.html`)}" class="rounded-xl border bg-card block overflow-hidden"><img src="${esc(o.image)}" alt="${esc(o.name)}" class="aspect-[4/3] object-cover w-full"/><div class="p-3 text-sm font-semibold">${esc(o.name)}</div></a>`
  ).join('')
  write(`urunler/${p.slug}.html`, layout({
    title: `${p.name} Fiyatları`,
    description: p.tagline,
    canonical: `/urunler/${p.slug}`,
    depth: 1,
    jsonLdData: [schemaProduct(p), schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Ürünler', href: '/urunler' },
      { name: p.name, href: `/urunler/${p.slug}` },
    ])],
    body: `<div class="container pt-4 text-xs text-muted-foreground"><a href="${url('index.html')}">Anasayfa</a> › <a href="${url('urunler.html')}">Ürünler</a> › ${esc(p.name)}</div>
<section class="container py-8">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
<div class="min-w-0"><img src="${esc(p.image)}" alt="${esc(p.name)} — Kayseri sineklik" class="rounded-2xl border aspect-square object-cover w-full max-w-full"/>
<h1 class="mt-5 text-3xl font-extrabold">${esc(p.name)} Fiyatları</h1>
<p class="text-muted-foreground mt-2">${esc(p.tagline)}</p>
<p class="text-sm text-muted-foreground mt-3"><strong>${esc(p.name)} m² fiyatı:</strong> ${formatPrice(p.pricePerM2)} TL/m² + KDV (minimum sipariş tutarı ${formatPrice(p.minPrice)} TL + KDV). Kayseri içi montaj dahildir; Türkiye geneline kargo ile gönderim yapılır.</p>
<ul class="mt-4 space-y-2">${p.features.map(f => `<li class="text-sm">✓ ${esc(f)}</li>`).join('')}</ul>
${richLeft}</div>
<aside class="min-w-0 w-full lg:sticky lg:top-24 space-y-4">
<div class="rounded-2xl border bg-card p-6 shadow-sm" id="calculator" data-slug="${p.slug}" data-name="${esc(p.name)}">
<h2 class="font-semibold text-primary text-lg">Anlık Fiyat Hesaplayıcı</h2>
<div class="mt-4 space-y-4">
<div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-medium">Genişlik (cm)</label><input type="number" id="calc-w" value="100" min="20" max="400" class="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"/></div>
<div><label class="text-xs font-medium">Yükseklik (cm)</label><input type="number" id="calc-h" value="120" min="20" max="400" class="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"/></div></div>
${openingBlock}
${colorBlock}
${calcQtyRow()}
<div class="p-4 rounded-lg bg-primary/10 border border-primary/15"><div class="text-xs text-muted-foreground">Yaklaşık Fiyat (KDV dahil)</div><div class="text-3xl font-extrabold text-primary mt-1" id="calc-price">—</div><div class="text-xs text-muted-foreground mt-1" id="calc-detail"></div></div>
${calcQuoteActions(waIconSvg)}
</div></div>
${richPrice}</aside>
</div></section>
<section class="container pb-12"><h2 class="text-xl font-bold mb-4">Diğer Modeller</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-3">${others}</div></section>
<div id="quote-modal" class="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div class="bg-card rounded-xl p-6 max-w-md w-full">
<h3 class="font-bold text-lg">Teklif İste</h3>
<form id="quote-form" class="mt-4 space-y-3"><input type="text" name="website" class="hidden" tabindex="-1"/>
<input name="name" required placeholder="Ad Soyad *" class="w-full px-3 py-2 border rounded-md"/>
<input name="phone" required placeholder="Telefon *" class="w-full px-3 py-2 border rounded-md"/>
<input name="email" type="email" placeholder="E-posta" class="w-full px-3 py-2 border rounded-md"/>
<textarea name="note" rows="3" placeholder="Not" class="w-full px-3 py-2 border rounded-md"></textarea>
${formConsentBlock()}
<button type="submit" class="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold">Gönder</button>
<button type="button" id="quote-close" class="w-full py-2 text-sm text-muted-foreground">Kapat</button></form></div></div>`
  }))
}

function pagePrices() {
  write('sineklik-fiyatlari.html', layout({
    title: 'Sineklik Fiyatları 2026',
    description: 'm² birim fiyat listesi',
    canonical: '/sineklik-fiyatlari',
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Sineklik Fiyatları', href: '/sineklik-fiyatlari' },
    ]),
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">Sineklik Fiyatları 2026</h1>
<p class="mt-2 text-muted-foreground">Tablo KDV hariç birim fiyatları gösterir; ürün sayfasındaki hesaplayıcı KDV dahil toplam verir.</p></div></section>
<section class="container py-8"><div id="prices-table" class="rounded-2xl border overflow-hidden">${staticPricesTable()}</div>
<p class="mt-4 text-xs text-muted-foreground">Fiyatlar ${new Date().getFullYear()} yılı için geçerlidir. Ölçüye göre net fiyat için ürün sayfasındaki hesaplayıcıyı kullanın veya WhatsApp'tan yazın.</p></section>`,
  }))
}

function pageContact() {
  write('iletisim.html', layout({
    title: 'İletişim',
    description: 'Bize ulaşın',
    canonical: '/iletisim',
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'İletişim', href: '/iletisim' },
    ]),
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">İletişim</h1></div></section>
<section class="container py-10 grid lg:grid-cols-2 gap-8">
<div class="space-y-4"><div class="rounded-xl border bg-card p-5"><strong>Adres</strong><p class="text-sm text-muted-foreground mt-1">${esc(site.address.full)}</p></div>
<a href="tel:${site.phoneIntl}" class="block rounded-xl border bg-card p-5"><strong>Telefon</strong><p>${esc(site.phone)}</p></a>
<a href="mailto:${site.email}" class="block rounded-xl border bg-card p-5"><strong>E-posta</strong><p>${esc(site.email)}</p></a>
<iframe src="https://www.google.com/maps?q=Fevzi+%C3%87akmak,+Fuzuli+Cd.+No:63,+38020+Kocasinan/Kayseri&output=embed" class="w-full h-64 rounded-xl border" loading="lazy" title="Konum"></iframe></div>
<div><h2 class="text-xl font-bold mb-3">Bize Yazın</h2>
<form id="contact-form" class="space-y-3 rounded-xl border bg-card p-5"><input type="text" name="website" class="hidden" tabindex="-1"/>
<input name="name" required placeholder="Ad Soyad *" class="w-full px-3 py-2 border rounded-md"/>
<input name="phone" required placeholder="Telefon *" class="w-full px-3 py-2 border rounded-md"/>
<input name="email" type="email" placeholder="E-posta" class="w-full px-3 py-2 border rounded-md"/>
<input name="subject" placeholder="Konu" class="w-full px-3 py-2 border rounded-md"/>
<textarea name="message" rows="4" placeholder="Mesaj" class="w-full px-3 py-2 border rounded-md"></textarea>
${formConsentBlock()}
<button type="submit" class="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold">Gönder</button>
<p id="contact-msg" class="text-sm hidden"></p></form></div></section>`
  }))
}

function pageStatic(name, title, h1, content) {
  write(`${name}.html`, layout({
    title,
    description: h1,
    canonical: `/${name}`,
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: h1, href: `/${name}` },
    ]),
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">${h1}</h1></div></section><section class="container py-10 prose max-w-none">${content}</section>`,
  }))
}

function pageBlogList() {
  const cards = blogPosts.map(b => `<a href="${url(`blog/${b.slug}.html`)}" class="rounded-2xl border bg-card overflow-hidden block">
<img src="${esc(blogCoverSrc(b.cover))}" alt="${esc(b.title)}" class="aspect-[16/10] object-cover w-full"/><div class="p-5"><h2 class="font-bold">${esc(b.title)}</h2><p class="text-sm text-muted-foreground mt-2">${esc(b.description)}</p></div></a>`).join('')
  write('blog/index.html', layout({
    title: 'Blog',
    description: 'Sineklik rehberi',
    canonical: '/blog',
    depth: 1,
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Blog', href: '/blog' },
    ]),
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">Sineklik Rehberi</h1></div></section><section class="container py-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">${cards}</section>`,
  }))
}

function blogCoverSrc(cover, depth = 0) {
  if (!cover) return ''
  if (cover.startsWith('http') || cover.startsWith('/')) return cover
  const p = depth ? '../'.repeat(depth) : ''
  return p + cover
}

function pageBlogPost(b) {
  const depth = 1
  const assetPrefix = '../'
  const cover = blogCoverSrc(b.cover, depth)
  const blocks = b.blocks?.map((block) => {
    if (block.type === 'cta' && block.href === '__WA_OLCU__') {
      return { ...block, href: wa('Merhaba, sineklik ölçüsü konusunda destek almak istiyorum.') }
    }
    return block
  })
  const bodyContent = blocks
    ? renderBlogBlocks(blocks, { esc, assetPrefix })
    : b.content.map(c => `<h2 class="text-xl font-bold mt-8">${esc(c.h)}</h2><p class="text-muted-foreground mt-2">${esc(c.p)}</p>`).join('')
  write(`blog/${b.slug}.html`, layout({
    title: b.title,
    description: b.description,
    canonical: `/blog/${b.slug}`,
    depth,
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: b.title, href: `/blog/${b.slug}` },
    ]),
    body: `<article class="container py-10 max-w-3xl prose-blog"><div class="text-xs text-muted-foreground mb-4"><a href="${url('blog.html')}">Blog</a></div>
<h1 class="text-3xl font-extrabold">${esc(b.title)}</h1><p class="mt-3 text-lg text-muted-foreground">${esc(b.description)}</p>
${blocks ? '' : `<img src="${esc(cover)}" alt="${esc(b.title)}" class="mt-6 rounded-2xl w-full border object-cover"/>`}${bodyContent}</article>`
  }))
}

function pageLegal(doc) {
  const body = renderLegalPage(doc, { esc, site, url, legalNav, legalMeta })
  write(`${doc.slug}.html`, layout({
    title: doc.title,
    description: doc.subtitle,
    canonical: `/${doc.slug}`,
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: doc.title, href: `/${doc.slug}` },
    ]),
    body,
  }))
}

function page404() {
  write('404.html', layout({ title: 'Sayfa bulunamadı', description: '404', canonical: '/404', body: `<section class="container py-24 text-center"><h1 class="text-4xl font-bold">404</h1><p class="mt-4 text-muted-foreground">Aradığınız sayfa bulunamadı.</p><a href="${url('index.html')}" class="inline-block mt-6 text-primary font-semibold">Anasayfa</a></section>` }))
}

console.log('Saf HTML build →', OUT)
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true })
copyAssets()
copyAdmin()
pageHome()
pageProducts()
products.forEach(pageProduct)
pagePrices()
pageContact()
pageStatic('hakkimizda', 'Hakkımızda', 'Hakkımızda', `<p>${esc(site.company)} – Kayseri ve çevresinde sineklik üretim, satış ve montaj hizmeti.</p><p class="mt-4 text-muted-foreground">10+ yıl deneyim, 5.000+ montaj, %98 müşteri memnuniyeti.</p>`)
pageStatic('sineklik-montaji', 'Sineklik Montajı', 'Sineklik Montajı', `<p>Kayseri ve çevresinde profesyonel montaj. Ücretsiz keşif, 2 yıl garanti.</p><ol class="mt-6 space-y-4 list-decimal pl-5"><li>İletişim & randevu</li><li>Ücretsiz keşif & ölçü</li><li>Ölçüye özel üretim (1-3 gün)</li><li>Profesyonel montaj</li><li>2 yıl garanti</li></ol><a href="${wa('Sineklik montajı için randevu almak istiyorum.')}" class="inline-block mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">WhatsApp Randevu</a>`)
pageBlogList()
blogPosts.forEach(pageBlogPost)
pageLegal(gizlilikPolitikasi)
pageLegal(kvkkAydinlatmaMetni)
pageLegal(kullanimKosullari)
page404()
syncAdminIntoLive()
console.log('Tamam! npm run deploy:github → GitHub main (canlı)')
