/** Saf HTML site JS — fiyat, formlar, menü */
(function () {
  const CFG = window.SITE_CONFIG || {}
  const DEFAULT_KDV = 0.2
  let pricingCache = null
  let pricingAt = 0

  function $(sel, root) { return (root || document).querySelector(sel) }
  function $$(sel, root) { return [...(root || document).querySelectorAll(sel)] }

  function formatTry(n) {
    const x = Number(n)
    if (!Number.isFinite(x)) return '—'
    return x.toLocaleString('tr-TR')
  }

  function productFallback(slug) {
    const p = (CFG.products || []).find(x => x.slug === slug)
    return {
      birim_m2_fiyati: Number(p?.pricePerM2) || 0,
      minimum_fiyat: Number(p?.minPrice) || 0,
      kdv_orani: DEFAULT_KDV,
    }
  }

  function normalizeRow(slug, map) {
    const raw = map?.[slug] || {}
    const fb = productFallback(slug)
    return {
      birim_m2_fiyati: Number(raw.birim_m2_fiyati ?? fb.birim_m2_fiyati) || fb.birim_m2_fiyati,
      minimum_fiyat: Number(raw.minimum_fiyat ?? fb.minimum_fiyat) || fb.minimum_fiyat,
      kdv_orani: Number(raw.kdv_orani ?? fb.kdv_orani) || DEFAULT_KDV,
    }
  }

  function calcPrice(w, h, row) {
    const birim = Number(row.birim_m2_fiyati) || 0
    const min = Number(row.minimum_fiyat) || 0
    const kdv = Number(row.kdv_orani ?? DEFAULT_KDV) || DEFAULT_KDV
    const area = Math.max(0, Number(w) || 0) * Math.max(0, Number(h) || 0) / 10000
    const ham = Math.max(area * birim, min)
    const price = Math.round(ham * (1 + kdv))
    return { area, price, ham, perM2: birim }
  }

  function fallbackMap() {
    const map = {}
    for (const p of CFG.products || []) {
      map[p.slug] = { id: p.slug, ...productFallback(p.slug) }
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
      const row = normalizeRow(slug, map)
      if (row.birim_m2_fiyati) el.textContent = `₺${formatTry(row.birim_m2_fiyati)}/m² + KDV`
    })
  }

  // Prices table page — statik tabloyu API fiyatlarıyla güncelle (SEO için HTML zaten build'de)
  async function renderPricesTable() {
    const wrap = $('#prices-table')
    if (!wrap) return
    const map = await fetchPricing()
    $$('.price-cell', wrap).forEach(el => {
      const row = normalizeRow(el.dataset.slug, map)
      if (row.birim_m2_fiyati) el.textContent = `₺${formatTry(row.birim_m2_fiyati)}`
    })
    $$('.min-cell', wrap).forEach(el => {
      const row = normalizeRow(el.dataset.slug, map)
      if (row.minimum_fiyat) el.textContent = `₺${formatTry(row.minimum_fiyat)}`
    })
  }

  // Product calculator
  async function initCalculator() {
    const box = $('#calculator')
    if (!box) return
    const slug = box.dataset.slug
    const name = box.dataset.name || ''
    const wEl = $('#calc-w', box)
    const hEl = $('#calc-h', box)
    const optEl = $('#calc-opt', box)
    const colorEl = $('#calc-color', box)
    const qtyEl = $('#calc-qty', box)
    const qtyMinus = $('#calc-qty-minus', box)
    const qtyPlus = $('#calc-qty-plus', box)
    const colorBtns = $$('.calc-color-swatch', box)
    const priceEl = $('#calc-price', box)
    const detailEl = $('#calc-detail', box)
    const waEl = $('#calc-wa', box)
    const calcBtn = $('#calc-btn', box)
    if (!wEl || !hEl || !priceEl) return

    let row = normalizeRow(slug, fallbackMap())
    let qty = 1

    function getQty() {
      return Math.max(1, Math.min(99, qty))
    }

    function setQty(n) {
      qty = Math.max(1, Math.min(99, n))
      if (qtyEl) qtyEl.textContent = String(qty)
      refresh()
    }

    function getColor() {
      return colorEl?.value || colorBtns[0]?.dataset.color || 'Beyaz'
    }

    function refresh() {
      const q = getQty()
      const { area, price, perM2 } = calcPrice(wEl.value, hEl.value, row)
      const total = price * q
      priceEl.textContent = total > 0 ? `₺${formatTry(total)}` : '—'
      if (perM2 > 0 && q > 1) {
        detailEl.textContent = `${q} adet × ${area.toFixed(2)} m² × ₺${formatTry(perM2)}/m² (KDV hariç)`
      } else if (perM2 > 0) {
        detailEl.textContent = `${area.toFixed(2)} m² × ₺${formatTry(perM2)}/m² (KDV hariç)`
      } else {
        detailEl.textContent = 'Ölçü girin ve Fiyat Hesapla\'ya basın'
      }
      if (waEl) {
        const parts = [
          `Merhaba, ${name} için teklif almak istiyorum.`,
          `• Adet: ${q}`,
          `• Ölçü: ${wEl.value} x ${hEl.value} cm`,
          `• Renk: ${getColor()}`,
        ]
        if (optEl?.value) parts.push(`• Açılım: ${optEl.value}`)
        parts.push(`• Yaklaşık: ₺${formatTry(total)}`)
        const waNum = CFG.whatsappNumber || '905388202036'
        waEl.href = `https://wa.me/${waNum}?text=${encodeURIComponent(parts.join('\n'))}`
      }
      box.dataset.price = String(total > 0 ? total : '')
      box.dataset.qty = String(q)
    }

    refresh()

    try {
      const map = await fetchPricing()
      row = normalizeRow(slug, map)
      refresh()
    } catch { /* fallback row already set */ }

    wEl.addEventListener('input', refresh)
    hEl.addEventListener('input', refresh)
    if (optEl) optEl.addEventListener('change', refresh)
    if (calcBtn) calcBtn.addEventListener('click', refresh)
    if (qtyMinus) qtyMinus.addEventListener('click', () => setQty(getQty() - 1))
    if (qtyPlus) qtyPlus.addEventListener('click', () => setQty(getQty() + 1))

    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colorBtns.forEach(b => {
          b.classList.remove('border-primary', 'ring-2', 'ring-primary/25')
          b.classList.add('border-border')
          b.setAttribute('aria-pressed', 'false')
        })
        btn.classList.remove('border-border')
        btn.classList.add('border-primary', 'ring-2', 'ring-primary/25')
        btn.setAttribute('aria-pressed', 'true')
        if (colorEl) colorEl.value = btn.dataset.color || ''
        refresh()
      })
    })

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
            quantity: getQty(),
            width: wEl.value,
            height: hEl.value,
            color: getColor(),
            option: optEl?.value || '',
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

  function boot() {
    updateBadges()
    renderPricesTable()
    initCalculator()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
