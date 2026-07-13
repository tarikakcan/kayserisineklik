/**
 * İlçe (bölge) sayfası HTML üretici
 */

function regionCard(icon, title, inner) {
  return `<article class="region-card rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
<div class="flex items-center gap-2.5 mb-3">
<span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-lg" aria-hidden="true">${icon}</span>
<h2 class="text-xl font-bold font-display">${title}</h2>
</div>
${inner}
</article>`
}

export function renderRegionPage(district, content, { esc, site, url, products, getDistrictById, wa, images, assetPrefix = '' }) {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(district.mapsQuery)}&output=embed`
  const waMsg = `Merhaba, ${district.name} için sineklik montajı / fiyat bilgisi almak istiyorum.`
  const heroSrc = assetPrefix + images.hero.replace(/^\//, '')
  const secondarySrc = assetPrefix + images.secondary.replace(/^\//, '')
  const accentSrc = assetPrefix + images.accent.replace(/^\//, '')

  const serviceGrid = content.serviceDetails.map(item =>
    `<div class="region-detail-cell rounded-xl border border-border bg-background p-4">
<div class="region-detail-label">${esc(item.label)}</div>
<p class="text-sm text-muted-foreground mt-1.5 leading-relaxed">${esc(item.value)}</p>
</div>`
  ).join('')

  const faqItems = content.faq.map((item, i) =>
    `<details class="region-faq-item rounded-xl border border-border bg-background group" ${i === 0 ? 'open' : ''}>
<summary class="region-faq-summary cursor-pointer px-4 py-3.5 text-sm font-semibold list-none flex items-center justify-between gap-3">
<span>${esc(item.question)}</span>
<span class="region-faq-chevron text-muted-foreground text-xs shrink-0" aria-hidden="true">▼</span>
</summary>
<div class="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">${esc(item.answer)}</div>
</details>`
  ).join('')

  const nearbyLinks = district.nearby
    .map(id => getDistrictById(id))
    .filter(Boolean)
    .filter(d => d.published)
    .map(d => `<a href="${url(`bolgeler/${d.slug}.html`)}" class="region-chip">${esc(d.name)}</a>`)
    .join('')

  const productLinks = district.featuredProducts
    .map(slug => products.find(p => p.slug === slug))
    .filter(Boolean)
    .map(p => `<a href="${url(`urunler/${p.slug}.html`)}" class="region-chip region-chip--product">${esc(p.name)}</a>`)
    .join('')

  const htmlNotes = (content.htmlNotes || [])
    .map(note => `<!-- TODO: ${esc(note)} -->`)
    .join('\n')

  const pageH1 = content.h1 || `${district.name} Sineklik`
  const heroLead = content.heroLead || `${district.nameIn} ölçüye özel sineklik üretimi, montaj ve kargo hizmeti sunuyoruz.`

  return `${htmlNotes}
<div class="region-hero hero-gradient">
<div class="container py-10 md:py-14">
<div class="text-xs text-muted-foreground mb-4"><a href="${url('index.html')}">Anasayfa</a> › <a href="${url('bolgeler/index.html')}">Hizmet Bölgeleri</a> › ${esc(district.name)}</div>
<div class="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
<div>
<h1 class="text-3xl md:text-4xl font-extrabold font-display">${esc(pageH1)}</h1>
<p class="mt-3 text-lg text-muted-foreground">${esc(heroLead)}</p>
</div>
<div class="region-hero-visual rounded-2xl overflow-hidden border border-border shadow-sm bg-card">
<img src="${esc(heroSrc)}" alt="${esc(district.name)} sineklik — Kayseri plise sineklik montaj" class="w-full h-auto object-cover" width="1200" height="630" loading="lazy" decoding="async"/>
</div>
</div>
</div></div>

<section class="container py-8 max-w-5xl">
<div class="region-ai-snippet rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 sm:p-6" role="note" aria-label="Hızlı özet">
<p class="text-xs font-bold uppercase tracking-wide text-primary mb-2">Bu bölgede hizmet veriyoruz</p>
<p class="text-base sm:text-lg font-medium leading-relaxed text-foreground">${esc(content.aiSnippet)}</p>
</div>
</section>

<section class="container pb-8 max-w-5xl space-y-6">
${regionCard('📍', `${esc(district.nameIn)} Sineklik Hizmeti`, `<div class="grid md:grid-cols-5 gap-5 items-start">
<div class="md:col-span-3 space-y-3">
<p class="text-muted-foreground leading-relaxed">${esc(content.intro)}</p>
${content.serviceSummary ? `<p class="text-muted-foreground leading-relaxed">${esc(content.serviceSummary)}</p>` : ''}
</div>
<div class="md:col-span-2 rounded-xl overflow-hidden border border-border">
<img src="${esc(secondarySrc)}" alt="${esc(district.name)} sineklik uygulama örneği" class="w-full aspect-[4/3] object-cover" loading="lazy" decoding="async"/>
</div>
</div>`)}

${regionCard('🛠', 'Hizmet Detayları', `<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
<div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">${serviceGrid}</div>
<div class="rounded-xl overflow-hidden border border-border min-h-[10rem]">
<img src="${esc(accentSrc)}" alt="${esc(district.name)} sineklik modelleri" class="w-full h-full min-h-[10rem] object-cover" loading="lazy" decoding="async"/>
</div>
</div>`)}

${regionCard('🗺', `${esc(district.name)} Konumu`, `<p class="text-sm text-muted-foreground mb-4">Atölyemiz Kocasinan'da; ${esc(district.name)} ${district.nameIn} keşif ve montaj için planlı randevu ile hizmet veriyoruz.</p>
<div class="region-map-wrap rounded-xl overflow-hidden border border-border">
<iframe src="${mapsSrc}" class="w-full h-72 sm:h-80" loading="lazy" title="${esc(district.name)} haritası — Kayseri sineklik hizmet bölgesi" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>`)}

${regionCard('❓', 'Sık Sorulan Sorular', `<div class="space-y-2">${faqItems}</div>`)}

${regionCard('🔗', 'Diğer Bölgeler ve Ürünler', `<div class="space-y-5">
<div>
<p class="text-sm font-semibold mb-2">${esc(district.name)} ilçesine yakın diğer bölgeler</p>
<div class="flex flex-wrap gap-2">${nearbyLinks || '<span class="text-sm text-muted-foreground">Yakında eklenecek.</span>'}</div>
</div>
<div>
<p class="text-sm font-semibold mb-2">${esc(district.nameIn)} en çok tercih edilen ürünler</p>
<div class="flex flex-wrap gap-2">${productLinks}</div>
</div>
<div class="flex flex-wrap gap-3 pt-2">
<a href="${url('sineklik-fiyatlari.html')}" class="text-sm font-semibold text-primary hover:underline">Fiyat listesi →</a>
<a href="${url('sineklik-montaji.html')}" class="text-sm font-semibold text-primary hover:underline">Montaj süreci →</a>
<a href="${url('bolgeler/index.html')}" class="text-sm font-semibold text-primary hover:underline">Tüm hizmet bölgeleri →</a>
</div>
</div>`)}
</section>

<section class="region-cta-band border-t border-border bg-muted/40">
<div class="container region-cta-wrap">
<div class="region-cta-card rounded-2xl border bg-card">
<div class="region-cta-body">
<h2 class="region-cta-title font-display">${esc(district.name)} için teklif alın</h2>
<p class="region-cta-text">WhatsApp'tan ölçü gönderin veya <a href="tel:${site.phoneIntl}" class="region-cta-text-link">${esc(site.phone)}</a> numarasından arayın. ${esc(site.workingHours)}.</p>
</div>
<div class="region-cta-actions">
<a href="${wa(waMsg)}" target="_blank" rel="noreferrer" class="region-cta-btn region-cta-btn--wa">WhatsApp Teklif</a>
<a href="tel:${site.phoneIntl}" class="region-cta-btn region-cta-btn--phone">${esc(site.phone)}</a>
</div>
</div>
</div>
</section>`
}

export function renderRegionsIndex({ esc, url, districtGroups, publishedDistricts, getDistrictById, getDistrictImages, assetPrefix = '' }) {
  const groupOrder = ['merkez', 'cevre']
  const sections = groupOrder.map(key => {
    const meta = districtGroups[key]
    const items = publishedDistricts.filter(d => d.group === key)
    if (!items.length) return ''
    const cards = items.map(d => {
      const nearby = d.nearby.slice(0, 2).map(id => getDistrictById(id)?.name).filter(Boolean).join(', ')
      const cardImg = assetPrefix + getDistrictImages(d).card.replace(/^\//, '')
      return `<a href="${url(`bolgeler/${d.slug}.html`)}" class="region-index-card rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors block">
<div class="aspect-[16/9] overflow-hidden bg-muted/30">
<img src="${esc(cardImg)}" alt="${esc(d.name)} sineklik hizmeti" class="w-full h-full object-cover" loading="lazy" decoding="async"/>
</div>
<div class="p-5">
<h3 class="font-bold text-lg font-display">${esc(d.name)} Sineklik</h3>
<p class="text-sm text-muted-foreground mt-2">${esc(d.nameIn)} ölçüye özel üretim ve montaj.</p>
${nearby ? `<p class="text-xs text-muted-foreground/80 mt-3">Yakın bölgeler: ${esc(nearby)}</p>` : ''}
<span class="inline-block mt-4 text-sm font-semibold text-primary">Sayfayı gör →</span>
</div>
</a>`
    }).join('')
    return `<div class="region-index-group">
<h2 class="text-2xl font-bold font-display mb-2">${esc(meta.label)}</h2>
<p class="text-sm text-muted-foreground mb-5">${esc(meta.description)}</p>
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</div>
</div>`
  }).join('<div class="mt-12"></div>')

  return `<div class="region-hero hero-gradient">
<div class="container py-10 md:py-14">
<div class="text-xs text-muted-foreground mb-4"><a href="${url('index.html')}">Anasayfa</a> › Hizmet Bölgeleri</div>
<div class="grid lg:grid-cols-2 gap-8 items-center">
<div>
<h1 class="text-3xl md:text-4xl font-extrabold font-display">Kayseri Hizmet Bölgelerimiz</h1>
<p class="mt-3 text-lg text-muted-foreground">Merkez ilçelerde günlük keşif ve montaj; Kayseri genelinde ölçüye özel sineklik üretimi ve kargo.</p>
</div>
<div class="region-hero-visual rounded-2xl overflow-hidden border border-border shadow-sm">
<img src="${esc(assetPrefix + 'assets/regions/yazin-sineklik-banner.webp')}" alt="Kayseri sineklik — yazın plise sineklik neden şart" class="w-full h-auto object-cover" loading="lazy" decoding="async"/>
</div>
</div>
</div></div>
<section class="container py-10 max-w-5xl space-y-0">${sections}</section>`
}
