/**
 * Yasal sayfa HTML üretici
 */

function renderContactMethods({ esc, site }) {
  return `<div class="legal-contact-grid">
<a href="mailto:${esc(site.email)}" class="legal-contact-card"><span class="legal-contact-icon" aria-hidden="true">✉</span><span class="legal-contact-label">E-posta</span><strong>${esc(site.email)}</strong></a>
<div class="legal-contact-card"><span class="legal-contact-icon" aria-hidden="true">📍</span><span class="legal-contact-label">Posta</span><strong>${esc(site.address.full)}</strong></div>
<a href="tel:${site.phoneIntl}" class="legal-contact-card"><span class="legal-contact-icon" aria-hidden="true">☎</span><span class="legal-contact-label">Telefon</span><strong>${esc(site.phone)}</strong></a>
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

function renderLegalCta({ esc, site, wa, formConsentBlock }) {
  return `<section class="legal-cta-band" aria-labelledby="legal-cta-heading">
<div class="container py-12 md:py-16">
<div class="legal-cta-grid">
<div class="legal-cta-copy">
<p class="legal-cta-eyebrow">Ölçüye özel üretim</p>
<h2 id="legal-cta-heading" class="legal-cta-title">Sinekliğiniz İçin <span>Fiyat Teklifi</span> Alın</h2>
<p class="legal-cta-text">Plise, menteşeli, sürgülü ve pencere sinekliği modellerimiz için WhatsApp veya form ile hızlıca teklif isteyin. Kayseri içi montaj, 81 il kargo.</p>
<div class="legal-cta-actions">
<a href="${wa()}" target="_blank" rel="noreferrer" class="legal-cta-btn legal-cta-btn--wa">WhatsApp Teklif</a>
<a href="tel:${site.phoneIntl}" class="legal-cta-btn legal-cta-btn--outline">${esc(site.phone)}</a>
</div>
</div>
<div class="legal-cta-form-wrap">
<p class="legal-cta-form-title">Bize Yazın</p>
<form id="contact-form" class="legal-cta-form">
<input type="text" name="website" class="hidden" tabindex="-1" autocomplete="off"/>
<div class="legal-cta-form-row">
<input name="name" required placeholder="Ad Soyad *" class="legal-cta-input"/>
<input name="phone" required placeholder="Telefon *" class="legal-cta-input"/>
</div>
<input name="email" type="email" placeholder="E-posta" class="legal-cta-input"/>
<input type="hidden" name="subject" value="Yasal sayfa iletişim"/>
<textarea name="message" rows="3" placeholder="Mesajınız" class="legal-cta-input"></textarea>
${formConsentBlock()}
<button type="submit" class="legal-cta-submit">Gönder</button>
<p id="contact-msg" class="text-sm hidden"></p>
</form>
</div>
</div></div></section>`
}

export function renderLegalPage(doc, { esc, site, url, legalNav, legalMeta, wa, formConsentBlock }) {
  const navItems = legalNav.map(item => {
    const active = item.slug === doc.slug
    const href = url(`${item.slug}.html`)
    const cls = active ? 'legal-pill legal-pill--active' : 'legal-pill'
    return `<a href="${href}" class="${cls}">${esc(item.label)}</a>`
  }).join('')

  const tocItems = doc.sections.map(section =>
    `<a href="#bolum-${esc(section.num)}" class="legal-toc-link">${esc(section.num)}. ${esc(section.title)}</a>`
  ).join('')

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
      inner += `<div class="legal-callout"><span class="legal-callout-badge">Önemli</span><p>${esc(section.important)}</p></div>`
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
<div class="legal-section-head">
<span class="legal-section-num" aria-hidden="true">${esc(section.num)}</span>
<h2>${esc(section.title)}</h2>
</div>
<div class="legal-section-body">${inner}</div>
</section>`
  }).join('')

  const introNotice = doc.notice
    ? `<div class="legal-callout legal-callout--soft"><span class="legal-callout-badge">Bilgi</span><p>${esc(doc.notice)}</p></div>`
    : ''

  const cta = wa && formConsentBlock
    ? renderLegalCta({ esc, site, wa, formConsentBlock })
    : ''

  return `<section class="legal-hero-dark">
<div class="container py-10 md:py-14">
<nav class="legal-breadcrumb" aria-label="Breadcrumb">
<a href="${url('index.html')}">Anasayfa</a><span aria-hidden="true">›</span><span>Yasal</span><span aria-hidden="true">›</span><span aria-current="page">${esc(doc.title)}</span>
</nav>
<p class="legal-hero-eyebrow">Yasal Metinler</p>
<h1 class="legal-hero-title">${esc(doc.title)}</h1>
<p class="legal-hero-subtitle">${esc(doc.subtitle)}</p>
<p class="legal-hero-updated">Son güncelleme: ${esc(doc.updated)}</p>
</div></section>
<section class="legal-nav-bar">
<div class="container py-4">
<nav class="legal-pill-nav" aria-label="Yasal sayfalar">${navItems}</nav>
</div></section>
<section class="legal-content">
<div class="container py-10 md:py-14">
<article class="legal-article">
<div class="legal-intro-card">
<p class="legal-intro-lead">${esc(doc.lead)}</p>
${introNotice}
</div>
<nav class="legal-toc" aria-label="İçindekiler">
<p class="legal-toc-title">İçindekiler</p>
<div class="legal-toc-links">${tocItems}</div>
</nav>
${sections}
</article>
</div></section>
${cta}`
}
