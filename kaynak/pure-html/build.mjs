/**
 * Saf HTML site üretici — _next yok, sürükle-bırak deploy.
 * Çalıştır: npm run build  (proje kökünden)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { renderProductContentLeft, renderPriceSection, renderRepairTapeContent } from './product-content-render.mjs'
import { renderBlogBlocks } from './blog-content-render.mjs'
import { renderLegalPage } from './legal-render.mjs'
import { renderRegionPage, renderRegionsIndex } from './region-render.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PROJECT = path.join(ROOT, '..')
const OUT = path.join(PROJECT, '1-CANLI-SITE')
const ADMIN_OUT = path.join(PROJECT, '2-ADMIN')

const { site } = await import(pathToFileURL(path.join(ROOT, 'lib/site-config.js')).href)
const { products, repairTapeFallback } = await import(pathToFileURL(path.join(ROOT, 'lib/products-config.js')).href)
const { blogPosts } = await import(pathToFileURL(path.join(ROOT, 'lib/blog-posts.js')).href)
const { getProductContent } = await import(pathToFileURL(path.join(ROOT, 'lib/product-content.js')).href)
const { legalNav, legalMeta } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/legal-config.js')).href)
const { gizlilikPolitikasi } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/gizlilik-politikasi.js')).href)
const { kvkkAydinlatmaMetni } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/kvkk-aydinlatma-metni.js')).href)
const { kullanimKosullari } = await import(pathToFileURL(path.join(ROOT, 'lib/legal/kullanim-kosullari.js')).href)
const { districts, publishedDistricts, districtGroups, getDistrictById } = await import(pathToFileURL(path.join(ROOT, 'lib/regions/districts-config.js')).href)
const { getDistrictContent } = await import(pathToFileURL(path.join(ROOT, 'lib/regions/district-content.js')).href)
const { getDistrictImages } = await import(pathToFileURL(path.join(ROOT, 'lib/regions/region-images.js')).href)

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const formatPrice = (n) => Number(n).toLocaleString('tr-TR')
const META_DESC_MAX = 160
const BRAND_SUFFIX = ` | ${site.name}`

function metaDescription(text, max = META_DESC_MAX) {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (!clean) return site.description
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

function pageTitle(title, { withBrand = true } = {}) {
  const t = String(title ?? '').trim()
  if (!withBrand || t.includes(site.name)) return t
  return `${t}${BRAND_SUFFIX}`
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return `${site.url}${site.heroImage}`
  if (String(pathOrUrl).startsWith('http')) return String(pathOrUrl)
  const path = String(pathOrUrl).startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${site.url}${path}`
}

function ogImageUrl(image, depth = 0) {
  if (!image) return absoluteUrl(site.heroImage)
  if (image.startsWith('http')) return image
  if (image.startsWith('/')) return absoluteUrl(image)
  const normalized = image.replace(/^(\.\.\/)+/, '')
  return absoluteUrl(normalized.startsWith('/') ? normalized : `/${normalized}`)
}

/** Canonical/sitemap ile uyumlu uzantısız URL (/urunler/dikey-plise-sineklik) */
const url = (route) => {
  if (!route || route === 'index.html' || route === '/') return '/'
  let r = String(route).replace(/\.html$/, '').replace(/^\/+/, '')
  if (r === 'urunler/index' || r === 'blog/index' || r === 'bolgeler/index') {
    return `/${r.split('/')[0]}`
  }
  return `/${r}`
}
const wa = (msg = 'Merhaba, sineklik için bilgi almak istiyorum.') =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`

const FRAME_COLORS = [
  { name: 'Beyaz', file: 'beyaz.webp' },
  { name: 'Vizon', file: 'vizon.webp' },
  { name: 'Meşe', file: 'mese.webp' },
  { name: 'Altın Meşe', file: 'altin-mese.webp' },
  { name: 'Antrasit', file: 'antrasit.webp' },
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
  return `<div class="calc-action-row flex flex-col sm:flex-row items-stretch gap-2 pt-1">
<a id="calc-wa" href="${wa()}" target="_blank" rel="noreferrer" aria-label="WhatsApp'tan teklif al" class="calc-action-btn flex-1 inline-flex items-center justify-center gap-1.5 min-h-[2.75rem] py-2 px-2 rounded-md bg-[#25D366] text-white text-sm font-semibold no-underline hover:bg-[#20bd5a] transition-colors">${icon}<span class="text-center leading-tight">WhatsApp Teklif</span></a>
<button type="button" id="quote-open" aria-label="Form ile teklif iste" class="calc-action-btn flex-1 inline-flex items-center justify-center min-h-[2.75rem] py-2 px-2 rounded-md border border-primary text-primary text-sm font-semibold bg-background hover:bg-primary/5 transition-colors"><span class="text-center leading-tight">Form ile Teklif</span></button>
</div>`
}

function schemaLocalBusiness(areaServed = ['Kayseri', 'Türkiye'], pageUrl = `${site.url}/`) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: `${site.name} - ${site.company}`,
    image: `${site.url}/logo.svg`,
    url: pageUrl,
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed,
    priceRange: '₺₺',
    sameAs: [],
  }
}

function schemaWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'tr-TR',
    publisher: {
      '@type': 'Organization',
      name: site.company,
      logo: { '@type': 'ImageObject', url: `${site.url}/logo.svg` },
    },
  }
}

function schemaArticle(post, canonicalPath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: ogImageUrl(blogCoverSrc(post.cover, 1)),
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: site.company },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: `${site.url}/logo.svg` },
    },
    mainEntityOfPage: absoluteUrl(canonicalPath),
    inLanguage: 'tr-TR',
  }
}

function schemaDistrictLocalBusiness(district) {
  return schemaLocalBusiness(
    { '@type': 'City', name: `${district.name}, Kayseri` },
    `${site.url}/bolgeler/${district.slug}`,
  )
}

function schemaProduct(p) {
  if (p.saleType === 'package') return schemaPackageProduct(p)
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

function schemaPackageProduct(p) {
  const lowest = Math.min(
    ...repairTapeFallback.variants.map(v => Number(v.fiyat) || 0).filter(n => n > 0),
    p.minPrice || 0,
  )
  const basePrice = Number.isFinite(lowest) && lowest > 0 ? lowest : p.minPrice
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
      ...(basePrice > 0 ? { price: String(basePrice) } : {}),
      priceValidUntil: `${new Date().getFullYear()}-12-31`,
      availability: 'https://schema.org/InStock',
      areaServed: 'TR',
    },
  }
}

function schemaItemList(items, listName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${site.url}/urunler/${item.slug}`,
      name: item.name,
    })),
  }
}

function schemaFaq(faq) {
  if (!faq?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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
  const rows = products.filter(p => p.saleType !== 'package').map(p => `<tr class="border-b">
<td class="p-3 font-medium">${esc(p.name)}</td>
<td class="p-3 text-right font-semibold text-primary price-cell" data-slug="${p.slug}">₺${formatPrice(p.pricePerM2)}</td>
<td class="p-3 text-right hidden sm:table-cell text-muted-foreground min-cell" data-slug="${p.slug}">₺${formatPrice(p.minPrice)}</td>
<td class="p-3 text-right"><a href="${url(`urunler/${p.slug}.html`)}" class="text-primary font-semibold">Hesapla →</a></td></tr>`).join('')
  return `<table class="w-full text-sm"><thead><tr class="border-b bg-muted/50">
<th class="p-3 text-left">Ürün</th><th class="p-3 text-right">m² (KDV hariç)</th>
<th class="p-3 text-right hidden sm:table-cell">Min.</th><th></th></tr></thead><tbody>${rows}</tbody></table>`
}

const waIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="wa-icon h-7 w-7" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`

function whatsappFab() {
  return `<a href="${wa()}" target="_blank" rel="noreferrer" title="WhatsApp: ${esc(site.phone)}" class="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20bd5a] hover:scale-105 transition-transform" aria-label="WhatsApp ile yazın: ${esc(site.phone)}">${waIconSvg}</a>`
}

function jsonLd(data) {
  const items = Array.isArray(data) ? data : [data]
  return items.map(d => `<script type="application/ld+json">${JSON.stringify(d)}</script>`).join('\n')
}

function head({ title, description, canonical, depth = 0, jsonLdData, ogImage, ogType = 'website', robots = 'index,follow', datePublished, lcpPreload }) {
  const p = depth ? '../'.repeat(depth) : ''
  const fullTitle = pageTitle(title)
  const desc = metaDescription(description)
  const pageUrl = absoluteUrl(canonical)
  const image = ogImageUrl(ogImage, depth)
  const lcpHref = lcpPreload
    ? (lcpPreload.startsWith('http') ? lcpPreload : `${p}${lcpPreload.replace(/^\//, '')}`)
    : ''
  const lcpLink = lcpHref
    ? `<link rel="preload" as="image" href="${esc(lcpHref)}" fetchpriority="high"/>`
    : ''
  const articleMeta = ogType === 'article' && datePublished
    ? `<meta property="article:published_time" content="${esc(datePublished)}"/>`
    : ''
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="robots" content="${esc(robots)}"/>
<meta name="googlebot" content="${esc(robots)}"/>
<link rel="canonical" href="${pageUrl}"/>
<link rel="alternate" hreflang="tr" href="${pageUrl}"/>
<link rel="alternate" hreflang="x-default" href="${pageUrl}"/>
<meta property="og:locale" content="tr_TR"/>
<meta property="og:site_name" content="${esc(site.name)}"/>
<meta property="og:type" content="${esc(ogType)}"/>
<meta property="og:title" content="${esc(fullTitle)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:url" content="${pageUrl}"/>
<meta property="og:image" content="${esc(image)}"/>
${articleMeta}
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(fullTitle)}"/>
<meta name="twitter:description" content="${esc(desc)}"/>
<meta name="twitter:image" content="${esc(image)}"/>
<link rel="icon" href="${p}logo.svg" type="image/svg+xml"/>
<link rel="apple-touch-icon" href="${p}logo.svg"/>
<meta name="theme-color" content="#c45a1f"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="${p}assets/css/site.css"/>
<link rel="stylesheet" href="${p}assets/css/site-fallback.css" media="print" onload="this.media='all'"/>
<noscript><link rel="stylesheet" href="${p}assets/css/site-fallback.css"/></noscript>
${lcpLink}
<style>:root{--font-sans:'Inter',system-ui,sans-serif;--font-display:'Playfair Display',Georgia,serif}body{font-family:var(--font-sans)}h1,h2,h3,.font-display{font-family:var(--font-display)}.site-header{background-color:#fff!important;background-color:rgba(255,255,255,.92)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}#mobile-menu,#mobile-menu-backdrop{display:none!important;visibility:hidden!important;pointer-events:none!important}#mobile-menu.is-open{display:flex!important;visibility:visible!important;pointer-events:auto!important}#mobile-menu-backdrop.is-open{display:block!important;visibility:visible!important;pointer-events:auto!important}</style>
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

function regionNavLinks(group) {
  return publishedDistricts
    .filter(d => d.group === group)
    .map(d => `<a href="${url(`bolgeler/${d.slug}.html`)}" class="block px-3 py-1.5 rounded-lg hover:bg-muted text-sm">${esc(d.name)}</a>`)
    .join('')
}

function mobileNavIcon(name) {
  const s = 'width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none"'
  const icons = {
    home: `<svg ${s}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"/></svg>`,
    products: `<svg ${s}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    price: `<svg ${s}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    install: `<svg ${s}><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    regions: `<svg ${s}><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    blog: `<svg ${s}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>`,
    about: `<svg ${s}><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>`,
    contact: `<svg ${s}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>`,
  }
  return `<span class="mobile-nav-icon" aria-hidden="true">${icons[name] || ''}</span>`
}

function mobileNavLink(href, label, icon) {
  return `<a href="${href}" class="mobile-nav-item">${mobileNavIcon(icon)}<span class="mobile-nav-label">${esc(label)}</span></a>`
}

function mobileMenu() {
  const productItems = products.map(pr =>
    `<a href="${url(`urunler/${pr.slug}.html`)}" class="mobile-nav-sublink">${esc(pr.name)}</a>`
  ).join('')
  const regionMerkez = publishedDistricts.filter(d => d.group === 'merkez').map(d =>
    `<a href="${url(`bolgeler/${d.slug}.html`)}" class="mobile-nav-sublink">${esc(d.name)}</a>`
  ).join('')
  const regionCevre = publishedDistricts.filter(d => d.group === 'cevre').map(d =>
    `<a href="${url(`bolgeler/${d.slug}.html`)}" class="mobile-nav-sublink">${esc(d.name)}</a>`
  ).join('')
  return `<div id="mobile-menu-backdrop" class="mobile-menu-backdrop" tabindex="-1" aria-hidden="true" style="display:none"></div>
<div id="mobile-menu" class="mobile-menu-panel" aria-labelledby="mobile-menu-title" aria-hidden="true" style="display:none">
<div class="mobile-menu-top">
<div>
<p id="mobile-menu-title" class="mobile-menu-title">${esc(site.name)}</p>
<p class="mobile-menu-subtitle">${esc(site.company)}</p>
</div>
</div>
<div class="mobile-menu-scroll">
<nav class="mobile-nav" aria-label="Mobil site menüsü">
${mobileNavLink(url('index.html'), 'Anasayfa', 'home')}
<div class="mobile-nav-section">
<p class="mobile-nav-section-title">${mobileNavIcon('products')}<span>Ürünler</span></p>
<div class="mobile-nav-section-links">${productItems}</div>
</div>
${mobileNavLink(url('sineklik-fiyatlari.html'), 'Fiyatlar', 'price')}
${mobileNavLink(url('sineklik-montaji.html'), 'Montaj', 'install')}
<div class="mobile-nav-section">
<p class="mobile-nav-section-title">${mobileNavIcon('regions')}<span>Hizmet Bölgeleri</span></p>
<p class="mobile-nav-subhead">Merkez İlçeler</p>
<div class="mobile-nav-region-grid">${regionMerkez}</div>
<p class="mobile-nav-subhead">Çevre İlçeler</p>
<div class="mobile-nav-region-grid">${regionCevre}</div>
<a href="${url('bolgeler/index.html')}" class="mobile-nav-sublink mobile-nav-sublink--all">Tüm bölgeler →</a>
</div>
${mobileNavLink(url('blog.html'), 'Blog', 'blog')}
${mobileNavLink(url('hakkimizda.html'), 'Hakkımızda', 'about')}
${mobileNavLink(url('iletisim.html'), 'İletişim', 'contact')}
</nav>
</div>
<div class="mobile-menu-footer">
<a href="${wa()}" target="_blank" rel="noreferrer" class="mobile-menu-wa-btn">${waIconSvg.replace('h-7 w-7', 'h-5 w-5')}<span>WhatsApp — ${esc(site.phone)}</span></a>
<a href="tel:${site.phoneIntl}" class="mobile-menu-call-btn">${mobileNavIcon('contact')}<span>Hemen Ara — ${esc(site.phone)}</span></a>
</div>
</div>`
}

function header(depth = 0) {
  const p = depth ? '../'.repeat(depth) : ''
  const productLinks = products.map(pr =>
    `<a href="${url(`urunler/${pr.slug}.html`)}" class="block px-3 py-2 rounded-lg hover:bg-muted text-sm">${esc(pr.name)}</a>`
  ).join('')
  const regionLinks = `<div class="px-3 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Merkez İlçeler</div>${regionNavLinks('merkez')}<div class="px-3 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border-t border-border/60 mt-1">Çevre İlçeler</div>${regionNavLinks('cevre')}`
  return `<header class="site-header sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur">
<div class="container flex h-16 items-center justify-between gap-4">
<a href="${url('index.html')}" class="flex items-center gap-2 shrink-0 min-w-0">
<img src="${p}logo.svg" alt="${esc(site.name)}" class="h-9 w-auto max-w-[140px] object-contain" width="140" height="36"/>
<div class="hidden sm:flex flex-col leading-tight"><span class="font-bold">${esc(site.name)}</span><span class="text-[10px] text-muted-foreground">${esc(site.company)}</span></div>
</a>
<nav class="site-header-nav hidden lg:flex items-center gap-1">
<a href="${url('index.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Anasayfa</a>
<div class="relative group">
<a href="${url('urunler.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Ürünler</a>
<div class="absolute left-0 top-full pt-2 w-72 hidden group-hover:block"><div class="rounded-xl border bg-card shadow-lg p-2">${productLinks}</div></div>
</div>
<a href="${url('sineklik-fiyatlari.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Fiyatlar</a>
<a href="${url('sineklik-montaji.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Montaj</a>
<div class="relative group">
<a href="${url('bolgeler/index.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Bölgeler</a>
<div class="absolute left-0 top-full pt-2 w-60 hidden group-hover:block"><div class="rounded-xl border bg-card shadow-lg p-2 max-h-[min(70vh,28rem)] overflow-y-auto">${regionLinks}<a href="${url('bolgeler/index.html')}" class="block px-3 py-2 rounded-lg hover:bg-muted text-sm font-semibold text-primary border-t mt-1 pt-2 sticky bottom-0 bg-card">Tüm bölgeler →</a></div></div>
</div>
<a href="${url('blog.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Blog</a>
<a href="${url('hakkimizda.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">Hakkımızda</a>
<a href="${url('iletisim.html')}" class="px-3 py-2 text-sm font-medium hover:text-primary">İletişim</a>
</nav>
<a href="${wa()}" target="_blank" rel="noreferrer" class="site-header-wa hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#25D366] whitespace-nowrap shrink-0">${waIconSvg.replace('h-7 w-7', 'h-4 w-4')}<span>${esc(site.phone)}</span></a>
<button type="button" id="menu-btn" class="mobile-menu-toggle" aria-label="Menüyü aç" aria-expanded="false" aria-controls="mobile-menu">
<svg class="mobile-menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>
</div>
</header>`
}

const footerProductSlugs = [
  'dikey-plise-sineklik', 'duble-plise-sineklik', 'yatay-plise-sineklik',
  'menteseli-sineklik', 'surgulu-sineklik', 'kapi-sinekligi', 'pencere-sinekligi',
  'kedi-sinekligi', 'sineklik-tamir-bandi',
]
const footerProducts = footerProductSlugs
  .map(slug => products.find(pr => pr.slug === slug))
  .filter(Boolean)

function footerLink(href, label) {
  return `<li><a href="${href}" class="text-muted-foreground hover:text-primary transition-colors">${esc(label)}</a></li>`
}

function footerRegionList(group) {
  return publishedDistricts
    .filter(d => d.group === group)
    .map(d => `<li><a href="${url(`bolgeler/${d.slug}.html`)}" class="text-muted-foreground hover:text-primary transition-colors">${esc(d.name)}</a></li>`)
    .join('')
}

function footer(depth = 0) {
  const p = depth ? '../'.repeat(depth) : ''
  const productLinks = footerProducts.map(pr =>
    `<li><a href="${url(`urunler/${pr.slug}.html`)}" class="text-muted-foreground hover:text-primary transition-colors">${esc(pr.name)}</a></li>`
  ).join('')
  return `<footer class="site-footer mt-20 border-t border-border bg-muted/30">
<div class="container py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-6 site-footer-grid">
<div class="site-footer-col site-footer-brand">
<img src="${p}logo.svg" alt="${esc(site.name)}" class="h-10 w-auto max-w-[160px] object-contain" width="160" height="40"/>
<p class="mt-4 text-sm text-muted-foreground leading-relaxed">${esc(site.slogans[0])}</p>
<p class="mt-2 text-xs text-muted-foreground/80">${esc(site.company)}</p>
<p class="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary/90 bg-primary/5 border border-primary/10 rounded-full px-3 py-1.5">${esc(site.shipping.short)}</p>
<a href="${wa()}" target="_blank" rel="noreferrer" class="site-footer-wa-btn mt-5 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1fb855] transition-colors">${waIconSvg.replace('h-7 w-7', 'h-4 w-4')} WhatsApp</a>
</div>
<div class="site-footer-col">
<h4 class="site-footer-heading font-bold">Bilgi &amp; Hizmet</h4>
<ul class="site-footer-links">${[
    footerLink(url('hakkimizda.html'), 'Hakkımızda'),
    footerLink(url('sineklik-montaji.html'), 'Sineklik Montajı'),
    footerLink(url('sineklik-fiyatlari.html'), 'Fiyatlar'),
    footerLink(url('blog.html'), 'Blog'),
    footerLink(url('urunler.html'), 'Tüm Ürünler'),
    footerLink(url('iletisim.html'), 'İletişim'),
  ].join('')}</ul>
</div>
<div class="site-footer-col">
<h4 class="site-footer-heading font-bold">Ürünler</h4>
<ul class="site-footer-links site-footer-links--compact">${productLinks}</ul>
</div>
<div class="site-footer-col">
<h4 class="site-footer-heading font-bold">Yasal</h4>
<ul class="site-footer-links">${legalNav.map(l => footerLink(url(`${l.slug}.html`), l.label)).join('')}</ul>
</div>
<div class="site-footer-col">
<h4 class="site-footer-heading font-bold">İletişim</h4>
<ul class="site-footer-contact">
<li><span class="site-footer-contact-label">Adres</span><span class="text-sm text-muted-foreground leading-relaxed">${esc(site.address.full)}</span></li>
<li><span class="site-footer-contact-label">Telefon</span><a href="tel:${site.phoneIntl}" class="text-sm font-medium hover:text-primary">${esc(site.phone)}</a></li>
<li><span class="site-footer-contact-label">E-posta</span><a href="mailto:${site.email}" class="text-sm hover:text-primary break-all">${esc(site.email)}</a></li>
<li><span class="site-footer-contact-label">Çalışma</span><span class="text-sm text-muted-foreground">${esc(site.workingHours)}</span></li>
</ul>
</div>
<div class="site-footer-col site-footer-col--regions">
<h4 class="site-footer-heading font-bold"><a href="${url('bolgeler/index.html')}" class="hover:text-primary font-bold">Hizmet Bölgeleri</a></h4>
<p class="site-footer-region-label">Merkez İlçeler</p>
<ul class="site-footer-links site-footer-links--compact">${footerRegionList('merkez')}</ul>
<p class="site-footer-region-label mt-4">Çevre İlçeler</p>
<ul class="site-footer-links site-footer-links--compact">${footerRegionList('cevre')}</ul>
</div>
</div>
<div class="border-t border-border/60">
<div class="container py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
<p>© ${new Date().getFullYear()} ${esc(site.name)} — ${esc(site.company)}</p>
<p>${esc(site.workingHours)} · ${esc(site.address.city)}</p>
</div>
</div>
</footer>
${mobileMenu()}
${whatsappFab()}
<script>window.SITE_CONFIG=${JSON.stringify({ whatsappNumber: site.whatsappNumber, pricingApi: site.pricingApi || 'https://admin.kayserisineklik.com.tr/api/pricing.php', repairTapeApi: site.repairTapeApi || 'https://admin.kayserisineklik.com.tr/api/repair-tape.php', repairTapeFallback, formContact: '/api/contact.php', formQuote: '/api/quote.php', products: products.map(p=>({slug:p.slug,name:p.name,pricePerM2:p.pricePerM2,minPrice:p.minPrice,options:p.options,selectionType:p.selectionType,saleType:p.saleType||null})) })};</script>
<script src="${p}assets/js/site.js"></script>
</body></html>`
}

function layout({ title, description, canonical, body, jsonLdData, depth = 0, ogImage, ogType, robots, datePublished, lcpPreload }) {
  return `${head({ title, description, canonical, depth, jsonLdData, ogImage, ogType, robots, datePublished, lcpPreload })}
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

function sanitizeSiteCss(css) {
  return css.replace(/@font-face\{[^}]*_next\/static\/media[^}]*\}/g, '')
}

function pruneLegacyImages(dir) {
  if (!fs.existsSync(dir)) return
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) pruneLegacyImages(full)
    else if (/\.(png|jpe?g)$/i.test(e.name)) {
      const webp = full.replace(/\.(png|jpe?g)$/i, '.webp')
      if (fs.existsSync(webp)) fs.unlinkSync(full)
    }
  }
}

function copyAssets() {
  fs.mkdirSync(path.join(OUT, 'assets/css'), { recursive: true })
  const rawCss = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8')
  fs.writeFileSync(path.join(OUT, 'assets/css/site.css'), sanitizeSiteCss(rawCss), 'utf8')
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
  if (fs.existsSync(path.join(ROOT, 'public/regions'))) {
    copyDir(path.join(ROOT, 'public/regions'), path.join(OUT, 'assets/regions'))
  }
  const heroHome = path.join(ROOT, 'public/hero-home.webp')
  if (fs.existsSync(heroHome)) {
    fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true })
    fs.copyFileSync(heroHome, path.join(OUT, 'assets/hero-home.webp'))
  }
  copyDir(path.join(ROOT, 'public/api'), path.join(OUT, 'api'))
  const apiDataHt = path.join(ROOT, 'public/api/data/.htaccess')
  if (fs.existsSync(apiDataHt)) {
    fs.mkdirSync(path.join(OUT, 'api/data'), { recursive: true })
    fs.copyFileSync(apiDataHt, path.join(OUT, 'api/data/.htaccess'))
  }
  fs.copyFileSync(path.join(ROOT, 'public/.htaccess'), path.join(OUT, '.htaccess'))
  for (const sub of ['colors', 'blog', 'products', 'regions']) {
    pruneLegacyImages(path.join(OUT, 'assets', sub))
  }
  pruneLegacyImages(path.join(OUT, 'assets'))
  writeSeoFiles()
}

function writeSeoFiles() {
  const now = new Date().toISOString().slice(0, 10)
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
    { loc: `${site.url}/bolgeler`, priority: '0.8' },
    ...publishedDistricts.map(d => ({ loc: `${site.url}/bolgeler/${d.slug}`, priority: '0.85' })),
  ]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${now}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap, 'utf8')
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: Yandex
Allow: /
Disallow: /api/
Disallow: /admin/
Host: ${site.domain}

Sitemap: ${site.url}/sitemap.xml
`, 'utf8')
  writeLlmsTxt()
}

function writeLlmsTxt() {
  const merkez = publishedDistricts.filter(d => d.group === 'merkez').map(d => d.name)
  const cevre = publishedDistricts.filter(d => d.group === 'cevre').map(d => d.name)
  const body = `# ${site.name}
> ${site.company} — Kayseri ve Türkiye genelinde ölçüye özel sineklik üretimi, montaj ve kargo.

## İletişim
- Telefon: ${site.phone}
- [WhatsApp](https://wa.me/${site.whatsappNumber})
- E-posta: [${site.email}](mailto:${site.email})
- Adres: ${site.address.full}
- [Web sitesi](${site.url}/)

## Hizmetler
- Plise, menteşeli, sürgülü, kapı ve pencere sinekliği
- Merkez ilçelerde ücretsiz keşif ve yerinde montaj
- Çevre ilçelerde bireysel siparişler: kargo ile gönderim (ölçü rehberi + WhatsApp yeterli)
- Toplu işler (bina, okul, otel, tesis vb.): yerinde ölçü, keşif ve montaj — tüm ilçelerde

## Hizmet Bölgeleri — Merkez İlçeler
${merkez.map(n => `- ${n}`).join('\n')}

## Hizmet Bölgeleri — Çevre İlçeler
${cevre.map(n => `- ${n}`).join('\n')}

## Önemli Sayfalar
- [Anasayfa](${site.url}/)
- [Ürünler](${site.url}/urunler)
- [Hizmet Bölgeleri](${site.url}/bolgeler)
- [Sineklik Fiyatları](${site.url}/sineklik-fiyatlari)
- [Sineklik Montajı](${site.url}/sineklik-montaji)
- [İletişim](${site.url}/iletisim)
- [Blog](${site.url}/blog)
`
  fs.writeFileSync(path.join(OUT, 'llms.txt'), body, 'utf8')
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

function productPriceBadge(p) {
  if (p.saleType === 'package') {
    const min = p.minPrice || 0
    return min > 0 ? `₺${formatPrice(min)}'den + KDV` : 'Paket satış'
  }
  return `₺${formatPrice(p.pricePerM2)}/m² + KDV`
}

function isContainedProductImage(p) {
  return p.imageClass === 'product-image-contained'
}

function productImageFitClass(p) {
  return isContainedProductImage(p) ? 'object-contain' : 'object-cover'
}

function productCardImageHome(p) {
  const alt = `${esc(p.name)} — Kayseri sineklik`
  const badge = `<span class="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full price-badge" data-slug="${p.slug}">${productPriceBadge(p)}</span>`
  if (isContainedProductImage(p)) {
    return `<div class="product-card-media-contained">${badge}<img src="${esc(p.image)}" alt="${alt}" width="400" height="300" loading="lazy" decoding="async"/></div>`
  }
  return `<div class="aspect-[4/5] relative overflow-hidden"><img src="${esc(p.image)}" alt="${alt}" class="h-full w-full object-cover" width="400" height="500" loading="lazy" decoding="async"/>${badge}</div>`
}

function productCardImageGrid(p) {
  const alt = `${esc(p.name)} — Kayseri sineklik modeli`
  if (isContainedProductImage(p)) {
    return `<div class="product-card-media-contained"><img src="${esc(p.image)}" alt="${alt}"/></div>`
  }
  return `<img src="${esc(p.image)}" alt="${alt}" class="aspect-[4/3] object-cover w-full"/>`
}

function pageHome() {
  const homeProducts = products.filter(p => p.slug !== 'sineklik-tamir-bandi')
  const cards = homeProducts.map(p => `<a href="${url(`urunler/${p.slug}.html`)}" class="group rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/40 block">
${productCardImageHome(p)}
<div class="p-5"><h3 class="font-display font-bold text-xl">${esc(p.name)}</h3><p class="text-sm text-muted-foreground mt-2">${esc(p.tagline)}</p></div></a>`).join('')
  const blogs = blogPosts.slice(0, 3).map(b => `<a href="${url(`blog/${b.slug}.html`)}" class="group rounded-3xl overflow-hidden bg-card border block">
<div class="aspect-[16/10] overflow-hidden"><img src="${esc(blogCoverSrc(b.cover))}" alt="${esc(b.title)}" class="h-full w-full object-cover"/></div>
<div class="p-5"><h3 class="font-display font-bold text-lg">${esc(b.title)}</h3><p class="text-sm text-muted-foreground mt-2">${esc(b.description)}</p></div></a>`).join('')
  write('index.html', layout({
    title: `${site.name} | Plise, Menteşeli ve Sürgülü Sineklik`,
    description: site.description,
    canonical: '/',
    ogImage: site.heroImage,
    lcpPreload: site.heroImage,
    jsonLdData: [schemaLocalBusiness(), schemaWebSite()],
    body: `<section class="warm-hero"><div class="container py-14 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
<div><h1 class="text-4xl md:text-6xl font-bold leading-tight">İçeri sinek girmesin, <span class="text-primary ink-underline">ferahlık gelsin</span>.</h1>
<p class="mt-6 text-lg text-foreground/75">${esc(site.description)}</p>
<div class="mt-8 flex flex-wrap gap-3">
<a href="${wa()}" class="inline-flex items-center px-7 py-3 rounded-full bg-[#25D366] text-white font-semibold wa-cta">WhatsApp'tan Teklif Al</a>
<a href="tel:${site.phoneIntl}" class="inline-flex items-center px-6 py-3 rounded-full border font-semibold">${esc(site.phone)}</a>
</div></div>
<div class="rounded-3xl overflow-hidden frame-card aspect-[4/3] w-full"><img src="${esc(site.heroImage)}" alt="Kayseri plise sineklik — Erciyes manzaralı pencere" width="800" height="600" fetchpriority="high" decoding="async" class="w-full h-full object-cover"/></div>
</div></section>
<section class="container py-16"><h2 class="text-3xl font-bold mb-8">Koleksiyon</h2><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">${cards}</div></section>
<section class="container py-10"><div class="grid md:grid-cols-3 gap-5">${blogs}</div></section>`
  }))
}

function pageProducts() {
  const grid = products.map(p => `<a href="${url(`urunler/${p.slug}.html`)}" class="rounded-2xl overflow-hidden bg-card border block">
${productCardImageGrid(p)}
<div class="p-4"><h2 class="font-semibold">${esc(p.name)}</h2><p class="text-sm text-muted-foreground">${esc(p.tagline)}</p>
<span class="text-sm font-semibold text-primary price-badge" data-slug="${p.slug}">${productPriceBadge(p)}</span></div></a>`).join('')
  write('urunler/index.html', layout({
    title: 'Sineklik Modelleri',
    description: `Kayseri ve 81 il kargo: plise, menteşeli, sürgülü, kapı ve pencere sinekliği ile tamir bandı. ${products.length} model, ölçüye özel üretim.`,
    canonical: '/urunler',
    depth: 1,
    ogImage: site.heroImage,
    jsonLdData: [
      schemaBreadcrumb([
        { name: 'Anasayfa', href: '/' },
        { name: 'Ürünler', href: '/urunler' },
      ]),
      schemaItemList(products, 'Sineklik Modelleri'),
    ],
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">Sineklik Modelleri</h1></div></section><section class="container py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">${grid}</section>`,
  }))
}

function pageProduct(p) {
  const opts = p.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')
  const productImgClass = p.imageClass || 'aspect-square'
  const productImgFit = productImageFitClass(p)
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
    description: `${p.tagline} Kayseri içi montaj, Türkiye geneline kargo. Anlık fiyat hesaplayıcı ile ölçünüze göre teklif alın.`,
    canonical: `/urunler/${p.slug}`,
    depth: 1,
    ogImage: p.image,
    jsonLdData: [schemaProduct(p), schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Ürünler', href: '/urunler' },
      { name: p.name, href: `/urunler/${p.slug}` },
    ])],
    body: `<div class="container pt-4 text-xs text-muted-foreground"><a href="${url('index.html')}">Anasayfa</a> › <a href="${url('urunler.html')}">Ürünler</a> › ${esc(p.name)}</div>
<section class="container py-8">
<div class="product-page-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
<div class="product-page-media min-w-0"><img src="${esc(p.image)}" alt="${esc(p.name)} — Kayseri sineklik" class="rounded-2xl border ${productImgClass} ${productImgFit} w-full max-w-full"/></div>
<aside class="product-page-aside min-w-0 w-full space-y-4">
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
<div class="product-page-details min-w-0">
<h1 class="text-3xl font-extrabold">${esc(p.name)} Fiyatları</h1>
<p class="text-muted-foreground mt-2">${esc(p.tagline)}</p>
<p class="text-sm text-muted-foreground mt-3"><strong>${esc(p.name)} m² fiyatı:</strong> ${formatPrice(p.pricePerM2)} TL/m² + KDV (minimum sipariş tutarı ${formatPrice(p.minPrice)} TL + KDV). Kayseri içi montaj dahildir; Türkiye geneline kargo ile gönderim yapılır.</p>
<ul class="mt-4 space-y-2">${p.features.map(f => `<li class="text-sm">✓ ${esc(f)}</li>`).join('')}</ul>
${richLeft}</div>
</div></section>
<section class="container pb-12"><h2 class="text-xl font-bold mb-4">Diğer Modeller</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-3">${others}</div></section>
<div id="quote-modal" class="quote-modal hidden fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title"><div class="quote-modal-panel bg-card rounded-t-2xl sm:rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
<h3 id="quote-modal-title" class="font-bold text-lg">Teklif İste</h3>
<form id="quote-form" class="mt-4 space-y-3"><input type="text" name="website" class="hidden" tabindex="-1" autocomplete="off"/>
<input name="name" required placeholder="Ad Soyad *" autocomplete="name" class="w-full px-3 py-2.5 border rounded-md text-base"/>
<input name="phone" type="tel" required placeholder="Telefon *" autocomplete="tel" class="w-full px-3 py-2.5 border rounded-md text-base"/>
<input name="email" type="email" placeholder="E-posta" autocomplete="email" class="w-full px-3 py-2.5 border rounded-md text-base"/>
<textarea name="note" rows="3" placeholder="Not" class="w-full px-3 py-2.5 border rounded-md text-base"></textarea>
${formConsentBlock()}
<button type="submit" class="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold">Gönder</button>
<button type="button" id="quote-close" class="w-full py-2 text-sm text-muted-foreground">Kapat</button></form></div></div>`
  }))
}

function pagePackageProduct(p) {
  const rich = getProductContent(p.slug)
  const imgClass = p.imageClass || 'aspect-square'
  const imgFit = productImageFitClass(p)
  let richLeft = rich
    ? renderRepairTapeContent(rich, { esc, assetPrefix: '../' })
      .replace('__REPAIR_WA__', wa())
      .replace('__REPAIR_BLOG__', url('blog/sineklik-yirtik-delik-tamiri.html'))
    : ''
  const gallery = (p.gallery || [p.image]).map((img, i) => {
    const src = esc(img)
    return `<button type="button" class="repair-gallery-thumb rounded-lg border overflow-hidden ${i === 0 ? 'ring-2 ring-primary' : ''}" data-src="${src}" aria-label="Görsel ${i + 1}">
<img src="${src}" alt="${esc(p.name)} görsel ${i + 1}" class="${imgClass} ${imgFit} w-full h-full"/></button>`
  }).join('')
  const others = products.filter(x => x.slug !== p.slug && x.saleType !== 'package').slice(0, 4).map(o =>
    `<a href="${url(`urunler/${o.slug}.html`)}" class="rounded-xl border bg-card block overflow-hidden"><img src="${esc(o.image)}" alt="${esc(o.name)}" class="aspect-[4/3] object-cover w-full"/><div class="p-3 text-sm font-semibold">${esc(o.name)}</div></a>`
  ).join('')
  write(`urunler/${p.slug}.html`, layout({
    title: p.name,
    description: 'Yırtık ve delik sineklikleri dakikalar içinde onarın. Gri ve siyah renk, tek parça veya 12\'li/24\'lü/36\'lı paket seçenekleriyle. 81 il kargo.',
    canonical: `/urunler/${p.slug}`,
    depth: 1,
    ogImage: p.image,
    jsonLdData: [schemaPackageProduct(p), schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Ürünler', href: '/urunler' },
      { name: p.name, href: `/urunler/${p.slug}` },
    ])],
    body: `<div class="container pt-4 text-xs text-muted-foreground"><a href="${url('index.html')}">Anasayfa</a> › <a href="${url('urunler.html')}">Ürünler</a> › ${esc(p.name)}</div>
<section class="container py-8">
<div class="product-page-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
<div class="product-page-media min-w-0">
<div class="rounded-2xl border overflow-hidden product-page-media-contained"><img id="repair-tape-main" src="${esc(p.image)}" alt="${esc(p.name)} — Kayseri sineklik tamir bandı" class="${imgClass} ${imgFit} w-full max-w-full"/></div>
<div class="grid grid-cols-3 gap-2 mt-3">${gallery}</div>
</div>
<aside class="product-page-aside min-w-0 w-full">
<div class="rounded-2xl border bg-card p-6 shadow-sm" id="repair-tape-selector" data-name="${esc(p.name)}">
<h2 class="font-semibold text-primary text-lg">Sipariş Seçimi</h2>
<p class="text-xs text-muted-foreground mt-1">Ürün seçin; fiyat admin panelinden güncellenir.</p>
<div class="mt-4 space-y-4">
<div><label class="text-xs font-medium" for="repair-variant-select">Ürün / Paket</label>
<select id="repair-variant-select" class="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-sm">
<option value="">Yükleniyor…</option>
</select></div>
<div class="p-4 rounded-lg bg-primary/10 border border-primary/15">
<div class="text-xs text-muted-foreground">Yaklaşık Fiyat (KDV dahil)</div>
<div class="text-3xl font-extrabold text-primary mt-1" id="repair-tape-price">—</div>
<div class="text-xs text-muted-foreground mt-1" id="repair-tape-detail"></div>
</div>
<a id="repair-tape-wa" href="${wa(`Merhaba, ${p.name} için sipariş vermek istiyorum.`)}" target="_blank" rel="noreferrer" class="flex w-full items-center justify-center gap-2 min-h-[2.75rem] py-3 px-4 rounded-md bg-[#25D366] text-white text-sm font-semibold no-underline hover:bg-[#20bd5a] transition-colors">${waIconSvg.replace('h-7 w-7', 'h-5 w-5')}<span>WhatsApp'tan Sipariş Ver</span></a>
</div></div></aside>
<div class="product-page-details min-w-0">
<h1 class="text-3xl font-extrabold">${esc(p.name)}</h1>
<p class="text-muted-foreground mt-2 leading-relaxed">${esc(p.description)}</p>
<ul class="mt-4 space-y-2">${p.features.map(f => `<li class="text-sm">✓ ${esc(f)}</li>`).join('')}</ul>
${richLeft}</div>
</div></section>
<section class="container pb-12"><h2 class="text-xl font-bold mb-4">Diğer Modeller</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-3">${others}</div></section>`
  }))
}

function pagePrices() {
  write('sineklik-fiyatlari.html', layout({
    title: 'Sineklik Fiyatları 2026',
    description: 'Güncel sineklik m² birim fiyatları ve minimum sipariş tutarları. Plise, menteşeli ve sürgülü modeller için KDV dahil hesaplama.',
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
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`
  write('iletisim.html', layout({
    title: 'İletişim',
    description: `${site.company} — ${site.address.full}. Telefon ${site.phone}, WhatsApp ve form ile sineklik teklifi alın. ${site.workingHours}.`,
    canonical: '/iletisim',
    jsonLdData: [
      schemaLocalBusiness(['Kayseri', 'Türkiye'], `${site.url}/iletisim`),
      schemaBreadcrumb([
        { name: 'Anasayfa', href: '/' },
        { name: 'İletişim', href: '/iletisim' },
      ]),
    ],
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">İletişim</h1></div></section>
<section class="container py-10 contact-page">
<div class="contact-page-grid">
<div class="contact-page-info min-w-0">
<div class="contact-info-cards">
<div class="contact-info-card"><strong>Adres</strong><p class="text-sm text-muted-foreground mt-1">${esc(site.address.full)}</p></div>
<a href="tel:${site.phoneIntl}" class="contact-info-card contact-info-card--link"><strong>Telefon</strong><p class="mt-1">${esc(site.phone)}</p></a>
<a href="mailto:${esc(site.email)}" class="contact-info-card contact-info-card--link contact-info-card--email"><strong>E-posta</strong><p class="contact-info-email mt-1">${esc(site.email)}</p></a>
</div>
<div class="contact-map-wrap rounded-xl overflow-hidden border border-border">
<iframe src="${mapsSrc}" class="contact-map-iframe" loading="lazy" title="Konum — ${esc(site.company)}" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
</div>
<div class="contact-page-form min-w-0"><h2 class="text-xl font-bold mb-3">Bize Yazın</h2>
<form id="contact-form" class="space-y-3 rounded-xl border bg-card p-5"><input type="text" name="website" class="hidden" tabindex="-1"/>
<input name="name" required placeholder="Ad Soyad *" class="w-full px-3 py-2 border rounded-md"/>
<input name="phone" type="tel" required placeholder="Telefon *" autocomplete="tel" class="w-full px-3 py-2.5 border rounded-md text-base"/>
<input name="email" type="email" placeholder="E-posta" class="w-full px-3 py-2 border rounded-md"/>
<input name="subject" placeholder="Konu" class="w-full px-3 py-2 border rounded-md"/>
<textarea name="message" rows="4" placeholder="Mesaj" class="w-full px-3 py-2 border rounded-md"></textarea>
${formConsentBlock()}
<button type="submit" class="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold">Gönder</button>
<p id="contact-msg" class="text-sm hidden"></p></form></div>
</div></section>`
  }))
}

function pageAbout() {
  const cards = [
    { title: 'Ölçüye özel üretim', text: 'Her pencere ve kapı farklıdır. Sinekliklerinizi contadan contaya ölçü alarak, atölyemizde ölçünüze göre üretiyoruz.' },
    { title: 'Kayseri montaj + 81 il kargo', text: 'Kayseri merkez ilçelerde ücretsiz keşif ve profesyonel montaj; Türkiye geneline güvenli kargo ile gönderim yapıyoruz.' },
    { title: 'Üreticiden doğrudan fiyat', text: 'Aracı olmadan Edeka atölyesinden çıkan ürünleri doğrudan size ulaştırıyoruz; fiyatları sitedeki hesaplayıcıdan anında görebilirsiniz.' },
    { title: 'Garanti ve destek', text: 'Montajlı siparişlerde işçilik garantisi sunuyoruz. Sorularınız için telefon, WhatsApp ve iletişim formu her zaman açık.' },
  ].map(c => `<article class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
<h2 class="text-lg font-bold font-display">${esc(c.title)}</h2>
<p class="text-sm text-muted-foreground mt-2 leading-relaxed">${esc(c.text)}</p>
</article>`).join('')

  write('hakkimizda.html', layout({
    title: 'Hakkımızda',
    description: `${site.company} — Kayseri\'de otomatik kapı ve sineklik sistemleri. Ölçüye özel üretim, yerinde montaj ve Türkiye geneline kargo.`,
    canonical: '/hakkimizda',
    jsonLdData: [
      schemaLocalBusiness(['Kayseri', 'Türkiye'], `${site.url}/hakkimizda`),
      schemaBreadcrumb([
        { name: 'Anasayfa', href: '/' },
        { name: 'Hakkımızda', href: '/hakkimizda' },
      ]),
    ],
    body: `<section class="hero-gradient"><div class="container py-12"><h1 class="text-4xl font-extrabold">Hakkımızda</h1></div></section>
<section class="container py-10 space-y-8 max-w-4xl">
<div class="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
<p class="text-muted-foreground leading-relaxed"><strong>${esc(site.company)}</strong> olarak Kayseri'de otomatik kapı ve sineklik sistemleri alanında hizmet veriyoruz. <strong>Kayseri Sineklik</strong> markasıyla plise, menteşeli, sürgülü ve özel ölçü sineklik üretimini kendi atölyemizde gerçekleştiriyoruz.</p>
<p class="text-muted-foreground leading-relaxed">Otomatik kapı alanındaki yılların tecrübesini sineklik üretimine taşıyoruz: doğru ölçü, sağlam malzeme ve düzgün montaj bizim için standart. Kayseri içi müşterilerimize keşif ve montaj; Türkiye'nin geri kalanına ise ölçüye özel üretilmiş sineklikleri kargo ile ulaştırıyoruz.</p>
</div>
<div class="grid sm:grid-cols-2 gap-4">${cards}</div>
<div class="flex flex-wrap gap-3 pt-2">
<a href="${wa('Merhaba, sineklik hakkında bilgi almak istiyorum.')}" class="inline-flex items-center px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold">WhatsApp'tan Yazın</a>
<a href="${url('iletisim.html')}" class="inline-flex items-center px-6 py-3 rounded-full border border-primary text-primary font-semibold">İletişim</a>
</div>
</section>`,
  }))
}

function pageStatic(name, title, h1, content, description) {
  write(`${name}.html`, layout({
    title,
    description: description || metaDescription(`${h1} — ${site.company}. Kayseri sineklik üretim, montaj ve kargo.`),
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
    title: 'Sineklik Rehberi ve Blog',
    description: 'Sineklik çeşitleri, ölçü alma, bakım, tamir ve montaj hakkında uzman rehber yazıları. Kayseri Sineklik blog.',
    canonical: '/blog',
    depth: 1,
    ogImage: site.heroImage,
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
    if (block.type === 'closing' && block.cta?.href === '__WA_SUPPORT__') {
      return { ...block, cta: { ...block.cta, href: wa('Merhaba, sineklik yırtık/delik tamiri konusunda destek almak istiyorum.') } }
    }
    return block
  })
  const bodyContent = blocks
    ? renderBlogBlocks(blocks, { esc, assetPrefix })
    : b.content.map(c => `<h2 class="text-xl font-bold mt-8">${esc(c.h)}</h2><p class="text-muted-foreground mt-2">${esc(c.p)}</p>`).join('')
  const heroImg = blocks && cover
    ? `<img src="${esc(cover)}" alt="${esc(b.title)}" class="mt-6 rounded-2xl w-full border object-cover" loading="lazy"/>`
    : (!blocks ? `<img src="${esc(cover)}" alt="${esc(b.title)}" class="mt-6 rounded-2xl w-full border object-cover"/>` : '')
  const faqSchema = schemaFaq(b.faq)
  const breadcrumbs = schemaBreadcrumb([
    { name: 'Anasayfa', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: b.title, href: `/blog/${b.slug}` },
  ])
  const jsonLdData = faqSchema
    ? [breadcrumbs, schemaArticle(b, `/blog/${b.slug}`), faqSchema]
    : [breadcrumbs, schemaArticle(b, `/blog/${b.slug}`)]
  const articleWidth = blocks?.some(bl => bl.type === 'cardGrid') ? 'max-w-5xl' : 'max-w-3xl'
  write(`blog/${b.slug}.html`, layout({
    title: b.pageTitle || b.title,
    description: b.description,
    canonical: `/blog/${b.slug}`,
    depth,
    ogImage: cover,
    ogType: 'article',
    datePublished: b.date,
    jsonLdData,
    body: `<article class="container py-10 ${articleWidth} prose-blog"><div class="text-xs text-muted-foreground mb-4"><a href="${url('blog.html')}">Blog</a></div>
<h1 class="text-3xl font-extrabold">${esc(b.title)}</h1>${heroImg}${bodyContent}</article>`
  }))
}

function pageLegal(doc) {
  const body = renderLegalPage(doc, { esc, site, url, legalNav, legalMeta, wa, formConsentBlock })
  write(`${doc.slug}.html`, layout({
    title: doc.title,
    description: metaDescription(`${doc.subtitle}. ${site.company} resmi web sitesi — ${site.name}.`),
    canonical: `/${doc.slug}`,
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: doc.title, href: `/${doc.slug}` },
    ]),
    body,
  }))
}

function page404() {
  write('404.html', layout({
    title: 'Sayfa bulunamadı',
    description: 'Aradığınız sayfa bulunamadı. Kayseri Sineklik anasayfasına dönebilir veya WhatsApp ile bize ulaşabilirsiniz.',
    canonical: '/404',
    robots: 'noindex,follow',
    body: `<section class="container py-24 text-center"><h1 class="text-4xl font-bold">404</h1><p class="mt-4 text-muted-foreground">Aradığınız sayfa bulunamadı.</p><a href="${url('index.html')}" class="inline-block mt-6 text-primary font-semibold">Anasayfa</a></section>`,
  }))
}

function pageRegionsIndex() {
  const body = renderRegionsIndex({
    esc, url, districtGroups, publishedDistricts, getDistrictById, getDistrictImages, assetPrefix: '../',
  })
  write('bolgeler/index.html', layout({
    title: 'Kayseri Hizmet Bölgeleri',
    description: `Kayseri'nin 16 ilçesinde sineklik: merkez ilçelerde ücretsiz keşif ve montaj, çevre ilçelerde kargo. Melikgazi, Talas, Develi, Yahyalı ve tüm bölgeler.`,
    canonical: '/bolgeler',
    depth: 1,
    ogImage: '/assets/regions/yazin-sineklik-banner.webp',
    jsonLdData: schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Hizmet Bölgeleri', href: '/bolgeler' },
    ]),
    body,
  }))
}

function pageRegionDistrict(district) {
  const content = getDistrictContent(district.slug)
  if (!content) {
    console.warn('  ! içerik yok, atlanıyor:', district.slug)
    return
  }
  const body = renderRegionPage(district, content, {
    esc, site, url, products, getDistrictById, wa,
    images: getDistrictImages(district),
    assetPrefix: '../',
  })
  const faqSchema = schemaFaq(content.faq)
  const jsonLdData = [
    schemaDistrictLocalBusiness(district),
    schemaBreadcrumb([
      { name: 'Anasayfa', href: '/' },
      { name: 'Hizmet Bölgeleri', href: '/bolgeler' },
      { name: `${district.name} Sineklik`, href: `/bolgeler/${district.slug}` },
    ]),
    ...(faqSchema ? [faqSchema] : []),
  ]
  write(`bolgeler/${district.slug}.html`, layout({
    title: `${district.name} Sineklik Fiyatları ve Montajı`,
    description: metaDescription(content.aiSnippet || content.heroLead || `${district.nameIn} ölçüye özel sineklik, montaj ve kargo hizmeti.`),
    canonical: `/bolgeler/${district.slug}`,
    depth: 1,
    ogImage: getDistrictImages(district).hero,
    jsonLdData,
    body,
  }))
}

console.log('Saf HTML build →', OUT)
if (fs.existsSync(OUT)) {
  try {
    fs.rmSync(OUT, { recursive: true, force: true })
  } catch (err) {
    if (err?.code !== 'EBUSY') throw err
    console.warn('Çıktı klasörü kilitli — mevcut dosyaların üzerine yazılıyor.')
  }
}
copyAssets()
copyAdmin()
pageHome()
pageProducts()
products.forEach(p => p.saleType === 'package' ? pagePackageProduct(p) : pageProduct(p))
pagePrices()
pageContact()
pageAbout()
pageStatic('sineklik-montaji', 'Sineklik Montajı', 'Sineklik Montajı', `<p>Kayseri ve çevresinde profesyonel montaj. Ücretsiz keşif, 2 yıl garanti.</p><ol class="mt-6 space-y-4 list-decimal pl-5"><li>İletişim & randevu</li><li>Ücretsiz keşif & ölçü</li><li>Ölçüye özel üretim (1-3 gün)</li><li>Profesyonel montaj</li><li>2 yıl garanti</li></ol><a href="${wa('Sineklik montajı için randevu almak istiyorum.')}" class="inline-block mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">WhatsApp Randevu</a>`, 'Kayseri merkez ilçelerde ücretsiz keşif ve profesyonel sineklik montajı. Ölçü, üretim ve montaj süreci adım adım.')
pageBlogList()
blogPosts.forEach(pageBlogPost)
pageLegal(gizlilikPolitikasi)
pageLegal(kvkkAydinlatmaMetni)
pageLegal(kullanimKosullari)
pageRegionsIndex()
publishedDistricts.forEach(pageRegionDistrict)
page404()
syncAdminIntoLive()
console.log('Tamam! npm run deploy:github → GitHub main (canlı)')
