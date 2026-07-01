/** Blog yazısı zengin içerik blokları */

const BLOG_ICONS = {
  search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  wrench: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  bandage: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M10 20.5a4.5 4.5 0 0 0 4.5-4.5h-4.5v4.5Z"/><path d="M10 8.5V4a4.5 4.5 0 0 1 4.5 4.5h-4.5Z"/><path d="M14 14h4.5a4.5 4.5 0 0 0-4.5-4.5V14Z"/><path d="M4 10h4.5a4.5 4.5 0 0 1 4.5 4.5V10Z"/></svg>',
  refresh: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  square: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>',
  layers: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="m12.83 2.18 8 4.5a1 1 0 0 1 0 1.73l-8 4.5a2 2 0 0 1-2 0l-8-4.5a1 1 0 0 1 0-1.73l8-4.5a2 2 0 0 1 2 0Z"/><path d="M2.5 10.5 12 15l9.5-4.5"/><path d="M12 22V15"/></svg>',
  paw: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>',
}

function blogCardHead(title, iconKey) {
  const icon = BLOG_ICONS[iconKey] || BLOG_ICONS.square
  return `<div class="flex items-center gap-2.5 mb-3">
<span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">${icon}</span>
<h2 class="text-lg font-bold font-display leading-snug">${title}</h2>
</div>`
}

function renderBlogCard(card, { esc }) {
  let body = ''
  if (card.paragraphs?.length) {
    body += card.paragraphs.map(p =>
      `<p class="text-sm text-muted-foreground leading-relaxed">${esc(p)}</p>`
    ).join('')
  }
  if (card.html) {
    body += `<p class="text-sm text-muted-foreground leading-relaxed">${card.html}</p>`
  }
  if (card.intro) {
    body += `<p class="text-sm text-muted-foreground leading-relaxed mb-2">${esc(card.intro)}</p>`
  }
  if (card.listItems?.length) {
    const tag = card.ordered ? 'ol' : 'ul'
    const cls = card.ordered
      ? 'list-decimal pl-5 mt-2 space-y-2 text-sm text-muted-foreground leading-relaxed'
      : 'list-disc pl-5 mt-2 space-y-2 text-sm text-muted-foreground leading-relaxed'
    body += `<${tag} class="${cls}">${card.listItems.map(i => `<li>${esc(i)}</li>`).join('')}</${tag}>`
  }
  if (card.after) {
    body += `<p class="text-sm text-muted-foreground leading-relaxed mt-3">${esc(card.after)}</p>`
  }
  return `<article class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm h-full">${blogCardHead(esc(card.title), card.icon)}${body}</article>`
}

export function renderBlogBlocks(blocks, { esc, assetPrefix = '../' }) {
  return blocks.map((b) => {
    switch (b.type) {
      case 'p':
        return `<p class="text-muted-foreground mt-4 leading-relaxed">${b.html ?? esc(b.text)}</p>`
      case 'h2':
        return `<h2 class="text-xl font-bold mt-10">${esc(b.text)}</h2>`
      case 'h3':
        return `<h3 class="text-lg font-semibold mt-6">${esc(b.text)}</h3>`
      case 'ul':
        return `<ul class="list-disc pl-5 mt-3 space-y-2 text-muted-foreground leading-relaxed">${b.items.map((i) => `<li>${b.htmlItems ? i : esc(i)}</li>`).join('')}</ul>`
      case 'img': {
        const cap = b.caption
          ? `<figcaption class="text-xs text-muted-foreground mt-2 text-center leading-relaxed">${esc(b.caption)}</figcaption>`
          : ''
        return `<figure class="mt-8"><img src="${assetPrefix}${b.src}" alt="${esc(b.alt)}" class="rounded-2xl w-full border" loading="lazy"/>${cap}</figure>`
      }
      case 'cardGrid':
        return `<div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">${b.cards.map(c => renderBlogCard(c, { esc })).join('')}</div>`
      case 'closing': {
        const paras = (b.paragraphs || []).map(p =>
          `<p class="text-muted-foreground leading-relaxed mt-3">${p}</p>`
        ).join('')
        const cta = b.cta
          ? `<a href="${b.cta.href}"${b.cta.external ? ' target="_blank" rel="noreferrer"' : ''} class="inline-flex mt-6 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold no-underline hover:bg-[#20bd5a] transition-colors">${esc(b.cta.text)}</a>`
          : ''
        return `<section class="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">${paras}${cta}</section>`
      }
      case 'cta':
        return `<a href="${b.href}"${b.external ? ' target="_blank" rel="noreferrer"' : ''} class="inline-flex mt-8 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold no-underline hover:bg-[#20bd5a] transition-colors">${esc(b.text)}</a>`
      default:
        return ''
    }
  }).join('\n')
}
