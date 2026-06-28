/**
 * Yasal sayfa HTML üretici
 */
export function renderLegalPage(doc, { esc, site, url, legalNav, legalMeta }) {
  const navItems = legalNav.map(item => {
    const active = item.slug === doc.slug
    const href = url(`${item.slug}.html`)
    const cls = active
      ? 'legal-nav-link legal-nav-link--active'
      : 'legal-nav-link'
    return `<li><a href="${href}" class="${cls}">${esc(item.label)}</a></li>`
  }).join('')

  const sections = doc.sections.map(section => {
    let inner = ''
    if (section.paragraphs?.length) {
      inner += section.paragraphs.map(p =>
        `<p class="legal-p">${esc(p)}</p>`
      ).join('')
    }
    if (section.highlights?.length) {
      inner += `<div class="legal-highlight-grid">${section.highlights.map(h =>
        `<div class="legal-highlight-card"><div class="legal-highlight-label">${esc(h.label)}</div><p>${esc(h.text)}</p></div>`
      ).join('')}</div>`
    }
    if (section.purposes?.length) {
      inner += `<div class="legal-purpose-grid">${section.purposes.map(p =>
        `<div class="legal-purpose-card"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`
      ).join('')}</div>`
    }
    if (section.important) {
      inner += `<div class="legal-callout"><strong>Önemli:</strong> ${esc(section.important)}</div>`
    }
    if (section.rights?.length) {
      inner += `<div class="legal-rights-grid">${section.rights.map((r, i) =>
        `<div class="legal-right-card"><span class="legal-right-num">${i + 1}</span><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></div>`
      ).join('')}</div>`
    }
    return `<section class="legal-section" id="bolum-${esc(section.num)}">
<div class="legal-section-head"><span class="legal-section-num">${esc(section.num)}</span><h2>${esc(section.title)}</h2></div>
<div class="legal-section-body">${inner}</div>
</section>`
  }).join('')

  const contactBlock = `<section class="legal-section" id="iletisim">
<div class="legal-section-head"><span class="legal-section-num">07</span><h2>İletişim</h2></div>
<div class="legal-section-body">
<p class="legal-p">KVKK kapsamındaki taleplerinizi aşağıdaki iletişim kanalları üzerinden bize iletebilirsiniz:</p>
<div class="legal-contact-grid">
<a href="mailto:${esc(site.email)}" class="legal-contact-card"><span>E-posta</span><strong>${esc(site.email)}</strong></a>
<a href="${esc(site.url)}" class="legal-contact-card"><span>Web Sitesi</span><strong>${esc(site.domain)}</strong></a>
<a href="tel:${site.phoneIntl}" class="legal-contact-card"><span>Telefon</span><strong>${esc(site.phone)}</strong></a>
</div></div></section>`

  const controllerBlock = `<section class="legal-section" id="veri-sorumlusu">
<div class="legal-section-head"><span class="legal-section-num">08</span><h2>Veri Sorumlusu</h2></div>
<div class="legal-section-body">
<div class="legal-controller-card">
<dl>
<div><dt>Veri Sorumlusu</dt><dd>${esc(legalMeta.dataController)}</dd></div>
<div><dt>Şirket</dt><dd>${esc(legalMeta.companyLegal)}</dd></div>
<div><dt>Adres</dt><dd>${esc(site.address.full)}</dd></div>
<div><dt>E-posta</dt><dd><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></dd></div>
<div><dt>Web</dt><dd><a href="${esc(site.url)}">${esc(site.url)}/</a></dd></div>
</dl>
<p class="legal-updated">Son Güncelleme: ${esc(doc.updated)}</p>
<p class="legal-footnote">Bu gizlilik politikası, yasal düzenlemelerdeki değişiklikler doğrultusunda güncellenebilir.</p>
</div></div></section>`

  return `<section class="hero-gradient legal-hero">
<div class="container py-12 md:py-14">
<p class="text-xs font-semibold uppercase tracking-wider text-primary">Yasal</p>
<h1 class="text-3xl md:text-4xl font-extrabold mt-2">${esc(doc.title)}</h1>
<p class="mt-3 text-lg text-muted-foreground max-w-2xl">${esc(doc.subtitle)}</p>
</div></section>
<section class="container py-10 md:py-12">
<div class="legal-layout">
<aside class="legal-sidebar">
<nav class="legal-sidebar-nav" aria-label="Yasal sayfalar">
<p class="legal-sidebar-title">Yasal Metinler</p>
<ul>${navItems}</ul>
<a href="${url('index.html')}" class="legal-back-home">← Ana sayfa</a>
</nav></aside>
<article class="legal-article">
<div class="legal-intro-card">
<p>${esc(doc.lead)}</p>
<div class="legal-callout legal-callout--soft"><strong>Önemli:</strong> ${esc(doc.notice)}</div>
</div>
${sections}
${contactBlock}
${controllerBlock}
</article></div></section>`
}
