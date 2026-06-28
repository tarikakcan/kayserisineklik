/**
 * Yasal sayfa HTML üretici
 */
function renderContactMethods({ esc, site }) {
  return `<div class="legal-contact-grid">
<a href="mailto:${esc(site.email)}" class="legal-contact-card"><span>E-posta</span><strong>${esc(site.email)}</strong></a>
<div class="legal-contact-card"><span>Posta</span><strong>${esc(site.address.full)}</strong></div>
<a href="tel:${site.phoneIntl}" class="legal-contact-card"><span>Telefon</span><strong>${esc(site.phone)}</strong></a>
</div>`
}

function renderController({ esc, site, legalMeta, updated, footnote }) {
  return `<div class="legal-controller-card">
<dl>
<div><dt>Veri Sorumlusu</dt><dd>${esc(legalMeta.dataController)}</dd></div>
<div><dt>Şirket</dt><dd>${esc(legalMeta.companyLegal)}</dd></div>
<div><dt>Adres</dt><dd>${esc(site.address.full)}</dd></div>
<div><dt>E-posta</dt><dd><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></dd></div>
<div><dt>Web</dt><dd><a href="${esc(site.url)}">${esc(site.url)}/</a></dd></div>
</dl>
<p class="legal-updated">Son Güncelleme: ${esc(updated)}</p>
${footnote ? `<p class="legal-footnote">${esc(footnote)}</p>` : ''}
</div>`
}

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
    if (section.listIntro) {
      inner += `<p class="legal-p legal-list-intro">${esc(section.listIntro)}</p>`
    }
    if (section.listItems?.length) {
      inner += `<ul class="legal-list">${section.listItems.map(item =>
        `<li>${esc(item)}</li>`
      ).join('')}</ul>`
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
    if (section.subsections?.length) {
      inner += `<div class="legal-subsections">${section.subsections.map(sub =>
        `<div class="legal-subsection"><h3>${esc(sub.title)}</h3><p>${esc(sub.text)}</p></div>`
      ).join('')}</div>`
    }
    if (section.relatedLegal?.length) {
      inner += `<div class="legal-related-grid">${section.relatedLegal.map(link =>
        `<a href="${url(`${link.slug}.html`)}" class="legal-related-card"><strong>${esc(link.title)}</strong><span>${esc(link.text)}</span></a>`
      ).join('')}</div>`
    }
    if (section.contactMethods) {
      inner += renderContactMethods({ esc, site })
    }
    if (section.footnote && !section.controller) {
      inner += `<p class="legal-footnote legal-section-footnote">${esc(section.footnote)}</p>`
    }
    if (section.controller) {
      inner += renderController({
        esc,
        site,
        legalMeta,
        updated: doc.updated,
        footnote: section.footnote || '',
      })
    }
    return `<section class="legal-section" id="bolum-${esc(section.num)}">
<div class="legal-section-head"><span class="legal-section-num">${esc(section.num)}</span><h2>${esc(section.title)}</h2></div>
<div class="legal-section-body">${inner}</div>
</section>`
  }).join('')

  const introNotice = doc.notice
    ? `<div class="legal-callout legal-callout--soft"><strong>Önemli:</strong> ${esc(doc.notice)}</div>`
    : ''

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
${introNotice}
</div>
${sections}
</article></div></section>`
}
