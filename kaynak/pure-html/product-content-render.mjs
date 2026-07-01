/** Ürün sayfası zengin içerik blokları — build.mjs tarafından kullanılır */

export const SECTION_ICONS = {
  howItWorks: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
  useCases: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  materials: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="m12.83 2.18 8 4.5a1 1 0 0 1 0 1.73l-8 4.5a2 2 0 0 1-2 0l-8-4.5a1 1 0 0 1 0-1.73l8-4.5a2 2 0 0 1 2 0Z"/><path d="M2.5 10.5 12 15l9.5-4.5"/><path d="M12 22V15"/></svg>`,
  colors: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  maintenance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S13 6 12 6s-2 1.9-4 3.5S5 13 5 15a7 7 0 0 0 7 7z"/><path d="M12 22v-4"/></svg>`,
  pricing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,
  application: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="m3 17 2 2 4-4"/><path d="m13 17 2 2 4-4"/><path d="M3 7h2"/><path d="M13 7h8"/><path d="M3 12h2"/><path d="M13 12h8"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  bandage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M10 20.5a4.5 4.5 0 0 0 4.5-4.5h-4.5v4.5Z"/><path d="M10 8.5V4a4.5 4.5 0 0 1 4.5 4.5h-4.5Z"/><path d="M14 14h4.5a4.5 4.5 0 0 0-4.5-4.5V14Z"/><path d="M4 10h4.5a4.5 4.5 0 0 1 4.5 4.5V10Z"/></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
}

export function boldTerms(text, terms = []) {
  let parts = [{ type: 'text', value: text }]
  for (const term of [...terms].sort((a, b) => b.length - a.length)) {
    if (!term) continue
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const next = []
    for (const part of parts) {
      if (part.type !== 'text') {
        next.push(part)
        continue
      }
      let last = 0
      let m
      while ((m = re.exec(part.value)) !== null) {
        if (m.index > last) next.push({ type: 'text', value: part.value.slice(last, m.index) })
        next.push({ type: 'strong', value: m[0] })
        last = m.index + m[0].length
      }
      if (last < part.value.length) next.push({ type: 'text', value: part.value.slice(last) })
    }
    parts = next.length ? next : parts
  }
  return parts.map(p => (p.type === 'strong' ? `<strong>${p.value}</strong>` : p.value)).join('')
}

function sectionHead(title, iconKey) {
  return `<div class="flex items-center gap-2.5 mb-3">
<span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">${SECTION_ICONS[iconKey]}</span>
<h2 class="text-xl font-bold font-display">${title}</h2>
</div>`
}

function sectionCard(inner) {
  return `<article class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">${inner}</article>`
}

export function renderProductContentLeft(content, { esc, frameColors, assetPrefix = '' }) {
  if (!content) return ''

  const howHtml = (content.howItWorks || [])
    .map(p => `<p class="text-muted-foreground leading-relaxed">${esc(p)}</p>`)
    .join('')

  const useCards = (content.useCases || [])
    .map(c => `<div class="rounded-xl border border-border bg-background p-4">
<h3 class="font-semibold text-sm">${esc(c.title)}</h3>
<p class="text-sm text-muted-foreground mt-1.5 leading-relaxed">${esc(c.text)}</p>
</div>`).join('')

  const materialsHtml = `<p class="text-muted-foreground leading-relaxed">${content.materials?.html || esc(content.materials?.text || '')}</p>`

  const colorSwatches = (frameColors || []).map(c =>
    `<span class="inline-flex flex-col items-center gap-1.5 text-center">
<span class="h-9 w-9 rounded-full border-2 border-border shadow-sm" style="background:url('${assetPrefix}assets/colors/${c.file}') center/cover no-repeat" title="${esc(c.name)}"></span>
<span class="text-[10px] text-muted-foreground leading-tight">${esc(c.name)}</span>
</span>`
  ).join('')

  const colorsHtml = `<p class="text-muted-foreground leading-relaxed">${esc(content.colors?.text || '')}</p>
<div class="flex flex-wrap gap-3 mt-4">${colorSwatches}</div>`

  const maintHtml = `<ul class="space-y-2 text-muted-foreground">${(content.maintenance || [])
    .map(item => `<li class="flex gap-2 text-sm leading-relaxed"><span class="text-primary shrink-0">•</span><span>${esc(item)}</span></li>`)
    .join('')}</ul>`

  const inlineImg = content.inlineImage
    ? `<figure class="my-6"><img src="${assetPrefix}${content.inlineImage.src}" alt="${esc(content.inlineImage.alt)}" class="rounded-2xl w-full border object-cover" loading="lazy"/>${content.inlineImage.caption ? `<figcaption class="text-xs text-muted-foreground mt-2 text-center leading-relaxed">${esc(content.inlineImage.caption)}</figcaption>` : ''}</figure>`
    : ''

  const howSection = sectionCard(`${sectionHead('Nasıl Çalışır?', 'howItWorks')}<div class="space-y-3">${howHtml}</div>${inlineImg}`)

  return `<div class="product-rich-content mt-8 space-y-6">
${howSection}
${sectionCard(`${sectionHead('Nerelerde Kullanılır?', 'useCases')}<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${useCards}</div>`)}
${sectionCard(`${sectionHead('Malzeme ve Yapı', 'materials')}${materialsHtml}`)}
${sectionCard(`${sectionHead('Renk ve Seçenekler', 'colors')}${colorsHtml}`)}
${sectionCard(`${sectionHead('Bakım Önerileri', 'maintenance')}${maintHtml}`)}
</div>`
}

const REPAIR_SECTION_ICONS = {
  howItWorks: 'bandage',
  useCases: 'home',
  materials: 'materials',
  colors: 'colors',
  application: 'application',
  packages: 'package',
}

export function renderRepairTapeContent(content, { esc, assetPrefix = '' }) {
  if (!content?.sections?.length) return ''

  const cards = content.sections.map((section) => {
    const iconKey = REPAIR_SECTION_ICONS[section.key] || 'howItWorks'
    let body = ''
    if (section.paragraphs?.length) {
      body += section.paragraphs.map(p =>
        `<p class="text-muted-foreground leading-relaxed text-sm">${esc(p)}</p>`
      ).join('')
    }
    if (section.listItems?.length) {
      const tag = section.ordered ? 'ol' : 'ul'
      const cls = section.ordered
        ? 'list-decimal pl-5 mt-2 space-y-2 text-sm text-muted-foreground leading-relaxed'
        : 'list-disc pl-5 mt-2 space-y-2 text-sm text-muted-foreground leading-relaxed'
      body += `<${tag} class="${cls}">${section.listItems.map(i => `<li>${esc(i)}</li>`).join('')}</${tag}>`
    }
    return sectionCard(`${sectionHead(section.title, iconKey)}${body}`)
  }).join('')

  const closing = content.closing
    ? `<section class="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
<p class="text-muted-foreground leading-relaxed">${esc(content.closing.text)}</p>
<div class="mt-4 flex flex-wrap gap-3">
<a href="__REPAIR_WA__" id="repair-tape-wa-bottom" class="inline-flex items-center px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold no-underline hover:bg-[#20bd5a] transition-colors">WhatsApp'tan Sipariş Ver</a>
<a href="__REPAIR_BLOG__" class="inline-flex items-center px-6 py-3 rounded-full border border-primary text-primary font-semibold no-underline hover:bg-primary/5 transition-colors">${esc(content.closing.blogLink.label)} rehberi</a>
</div></section>`
    : ''

  return `<div class="product-rich-content mt-8 space-y-6">${cards}</div>${closing}`
}

export function renderPriceSection(content, product, { esc, formatPrice }) {
  if (!content?.pricing) return ''
  const extra = content.pricing.extraPriceLine
    ? `<p class="text-sm text-muted-foreground mt-2">${esc(content.pricing.extraPriceLine)}</p>`
    : ''
  return `${sectionCard(`${sectionHead('Fiyat Hakkında', 'pricing')}
<p class="text-sm text-muted-foreground leading-relaxed">${esc(content.pricing.text || '')}</p>
<p class="text-sm mt-3"><strong>${esc(product.name)} m² fiyatı:</strong> ${formatPrice(product.pricePerM2)} TL/m² + KDV, minimum sipariş bedeli ${formatPrice(product.minPrice)} TL + KDV.</p>
${extra}
<p class="text-xs text-muted-foreground mt-3">Yukarıdaki hesaplayıcıya ölçünüzü girerek KDV dahil yaklaşık toplam fiyatı anında görebilirsiniz.</p>`)}`
}
