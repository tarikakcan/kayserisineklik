/** Saf HTML site JS — fiyat, formlar, menü */
(function () {
  const CFG = window.SITE_CONFIG || {}
  const DEFAULT_KDV = 0.2
  let pricingCache = null
  let pricingAt = 0

  function $(sel, root) { return (root || document).querySelector(sel) }
  function $$(sel, root) { return [...(root || document).querySelectorAll(sel)] }

  function formatTry(n) { return Number(n).toLocaleString('tr-TR') }

  function calcPrice(w, h, row) {
    const area = Math.max(0, w) * Math.max(0, h) / 10000
    const ham = Math.max(area * row.birim_m2_fiyati, row.minimum_fiyat)
    const price = Math.round(ham * (1 + (row.kdv_orani ?? DEFAULT_KDV)))
    return { area, price, ham, perM2: row.birim_m2_fiyati }
  }

  function fallbackMap() {
    const map = {}
    for (const p of CFG.products || []) {
      map[p.slug] = {
        id: p.slug,
        birim_m2_fiyati: p.pricePerM2,
        minimum_fiyat: p.minPrice,
        kdv_orani: DEFAULT_KDV,
      }
    }
    return map
  }

  async function fetchPricing() {
    if (pricingCache && Date.now() - pricingAt < 60000) return pricingCache
    try {
      const res = await fetch(CFG.pricingApi, { cache: 'no-store' })
      if (!res.ok) throw new Error('pricing')
      const data = await res.json()
      const map = {}
      for (const row of data) {
        if (row?.id) map[row.id] = row
      }
      if (!Object.keys(map).length) throw new Error('empty')
      pricingCache = map
      pricingAt = Date.now()
      return map
    } catch {
      return fallbackMap()
    }
  }

  async function submitForm(url, fields) {
    const body = new FormData()
    for (const [k, v] of Object.entries(fields)) {
      if (v != null && v !== '') body.append(k, String(v))
    }
    body.append('website', '')
    const res = await fetch(url, { method: 'POST', body })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) throw new Error(data.error || 'Gönderim başarısız')
    return data
  }

  // Mobile menu
  const menuBtn = $('#menu-btn')
  const mobileMenu = $('#mobile-menu')
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'))
  }

  // Price badges
  async function updateBadges() {
    const map = await fetchPricing()
    $$('.price-badge').forEach(el => {
      const slug = el.dataset.slug
      const row = map[slug] || fallbackMap()[slug]
      if (row) el.textContent = `₺${formatTry(row.birim_m2_fiyati)}/m² + KDV`
    })
  }

  // Prices table page
  async function renderPricesTable() {
    const wrap = $('#prices-table')
    if (!wrap) return
    const map = await fetchPricing()
    const rows = (CFG.products || []).map(p => {
      const row = map[p.slug] || { birim_m2_fiyati: p.pricePerM2, minimum_fiyat: p.minPrice }
      return `<tr class="border-b"><td class="p-3 font-medium">${p.name}</td>
        <td class="p-3 text-right font-semibold text-primary">₺${formatTry(row.birim_m2_fiyati)}</td>
        <td class="p-3 text-right hidden sm:table-cell text-muted-foreground">₺${formatTry(row.minimum_fiyat)}</td>
        <td class="p-3 text-right"><a href="urunler/${p.slug}.html" class="text-primary font-semibold">Hesapla →</a></td></tr>`
    }).join('')
    wrap.innerHTML = `<table class="w-full text-sm"><thead><tr class="border-b bg-muted/50">
      <th class="p-3 text-left">Ürün</th><th class="p-3 text-right">m² (KDV hariç)</th>
      <th class="p-3 text-right hidden sm:table-cell">Min.</th><th></th></tr></thead><tbody>${rows}</tbody></table>`
  }

  // Product calculator
  async function initCalculator() {
    const box = $('#calculator')
    if (!box) return
    const slug = box.dataset.slug
    const name = box.dataset.name
    const map = await fetchPricing()
    const fb = (CFG.products || []).find(p => p.slug === slug)
    const row = map[slug] || {
      birim_m2_fiyati: fb?.pricePerM2,
      minimum_fiyat: fb?.minPrice,
      kdv_orani: DEFAULT_KDV,
    }

    const wEl = $('#calc-w', box)
    const hEl = $('#calc-h', box)
    const optEl = $('#calc-opt', box)
    const priceEl = $('#calc-price', box)
    const detailEl = $('#calc-detail', box)
    const waEl = $('#calc-wa', box)

    function refresh() {
      const { area, price, perM2 } = calcPrice(Number(wEl.value), Number(hEl.value), row)
      priceEl.textContent = `₺${formatTry(price)}`
      detailEl.textContent = `${area.toFixed(2)} m² × ₺${formatTry(perM2)}/m² (KDV hariç)`
      const msg = `Merhaba, ${name} için teklif almak istiyorum.\n• Ölçü: ${wEl.value} x ${hEl.value} cm\n• ${optEl.value}\n• Yaklaşık: ₺${formatTry(price)}`
      const waNum = CFG.whatsappNumber || '905388202036'
      waEl.href = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`
      box.dataset.price = String(price)
    }
    wEl.addEventListener('input', refresh)
    hEl.addEventListener('input', refresh)
    optEl.addEventListener('change', refresh)
    refresh()

    const modal = $('#quote-modal')
    const openBtn = $('#quote-open')
    const closeBtn = $('#quote-close')
    const form = $('#quote-form')
    if (openBtn && modal) openBtn.addEventListener('click', () => modal.classList.remove('hidden'))
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.add('hidden'))
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault()
        const fd = new FormData(form)
        try {
          await submitForm(CFG.formQuote, {
            name: fd.get('name'),
            phone: fd.get('phone'),
            email: fd.get('email'),
            note: fd.get('note'),
            product: name,
            width: wEl.value,
            height: hEl.value,
            option: optEl.value,
            price: box.dataset.price,
          })
          alert('Talebiniz alındı!')
          modal.classList.add('hidden')
          form.reset()
        } catch (err) {
          alert(err.message || 'Hata oluştu')
        }
      })
    }
  }

  // Contact form
  const contactForm = $('#contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault()
      const fd = new FormData(contactForm)
      const msg = $('#contact-msg')
      try {
        await submitForm(CFG.formContact, {
          name: fd.get('name'),
          phone: fd.get('phone'),
          email: fd.get('email'),
          subject: fd.get('subject'),
          message: fd.get('message'),
        })
        if (msg) { msg.textContent = 'Mesajınız alındı!'; msg.classList.remove('hidden') }
        contactForm.reset()
      } catch (err) {
        if (msg) { msg.textContent = err.message; msg.classList.remove('hidden') }
      }
    })
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateBadges()
    renderPricesTable()
    initCalculator()
  })
})()
