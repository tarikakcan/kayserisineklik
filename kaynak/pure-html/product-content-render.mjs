/** Ürün sayfası zengin içerik blokları — build.mjs tarafından kullanılır */

export const SECTION_ICONS = {
  howItWorks: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
  useCases: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  materials: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="m12.83 2.18 8 4.5a1 1 0 0 1 0 1.73l-8 4.5a2 2 0 0 1-2 0l-8-4.5a1 1 0 0 1 0-1.73l8-4.5a2 2 0 0 1 2 0Z"/><path d="M2.5 10.5 12 15l9.5-4.5"/><path d="M12 22V15"/></svg>`,
  colors: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  maintenance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S13 6 12 6s-2 1.9-4 3.5S5 13 5 15a7 7 0 0 0 7 7z"/><path d="M12 22v-4"/></svg>`,
  pricing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,
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

  return `<div class="product-rich-content mt-8 space-y-6">
${sectionCard(`${sectionHead('Nasıl Çalışır?', 'howItWorks')}<div class="space-y-3">${howHtml}</div>`)}
${sectionCard(`${sectionHead('Nerelerde Kullanılır?', 'useCases')}<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${useCards}</div>`)}
${sectionCard(`${sectionHead('Malzeme ve Yapı', 'materials')}${materialsHtml}`)}
${sectionCard(`${sectionHead('Renk ve Seçenekler', 'colors')}${colorsHtml}`)}
${sectionCard(`${sectionHead('Bakım Önerileri', 'maintenance')}${maintHtml}`)}
</div>`
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
