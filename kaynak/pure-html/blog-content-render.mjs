/** Blog yazısı zengin içerik blokları */

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
      case 'cta':
        return `<a href="${b.href}"${b.external ? ' target="_blank" rel="noreferrer"' : ''} class="inline-flex mt-8 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold no-underline hover:bg-[#20bd5a] transition-colors">${esc(b.text)}</a>`
      default:
        return ''
    }
  }).join('\n')
}
