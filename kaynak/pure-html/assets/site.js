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
    const res = await fetch(url, { method: 'POST', body, credentials: 'same-origin' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) throw new Error(data.error || 'Gönderim başarısız')
    return data
  }

  let formToastTimer = null

  function hideFormToast() {
    const el = $('#form-toast')
    if (!el) return
    el.classList.remove('form-toast--visible')
    clearTimeout(formToastTimer)
    formToastTimer = setTimeout(() => el.classList.add('hidden'), 280)
  }

  function showFormToast(message, type = 'success') {
    let el = $('#form-toast')
    if (!el) {
      el = document.createElement('div')
      el.id = 'form-toast'
      el.className = 'form-toast hidden'
      el.setAttribute('role', 'alertdialog')
      el.setAttribute('aria-live', 'polite')
      el.innerHTML = `<div class="form-toast-backdrop" data-toast-close></div>
<div class="form-toast-panel">
<button type="button" class="form-toast-close" data-toast-close aria-label="Kapat">×</button>
<div class="form-toast-icon" aria-hidden="true"></div>
<p class="form-toast-message"></p>
<button type="button" class="form-toast-ok" data-toast-close>Tamam</button>
</div>`
      document.body.appendChild(el)
      el.querySelectorAll('[data-toast-close]').forEach(btn => {
        btn.addEventListener('click', hideFormToast)
      })
    }
    const msgEl = $('.form-toast-message', el)
    const iconEl = $('.form-toast-icon', el)
    el.classList.remove('hidden', 'form-toast--success', 'form-toast--error')
    el.classList.add(type === 'error' ? 'form-toast--error' : 'form-toast--success')
    if (msgEl) msgEl.textContent = message
    if (iconEl) iconEl.textContent = type === 'error' ? '!' : '✓'
    requestAnimationFrame(() => el.classList.add('form-toast--visible'))
    clearTimeout(formToastTimer)
    formToastTimer = setTimeout(hideFormToast, type === 'error' ? 8000 : 5500)
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
    const qtyEl = $('.calc-qty-value', box)
    const qtyGroup = $('.calc-qty-group', box)
    const colorBtns = $$('.calc-color-swatch', box)
    const priceEl = $('#calc-price', box)
    const detailEl = $('#calc-detail', box)
    const waEl = $('#calc-wa', box)
    const calcBtn = $('#calc-btn', box)
    if (!wEl || !hEl || !priceEl) return

    let row = normalizeRow(slug, fallbackMap())
    let qty = 1

    function getQty() {
      const fromDom = parseInt(qtyEl?.textContent || '', 10)
      if (Number.isFinite(fromDom)) qty = fromDom
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
      if (detailEl) {
        if (perM2 > 0 && q > 1) {
          detailEl.textContent = `${q} adet × ${area.toFixed(2)} m² × ₺${formatTry(perM2)}/m² (KDV hariç)`
        } else if (perM2 > 0) {
          detailEl.textContent = `${area.toFixed(2)} m² × ₺${formatTry(perM2)}/m² (KDV hariç)`
        } else {
          detailEl.textContent = 'Ölçü girin ve Fiyat Hesapla\'ya basın'
        }
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

    wEl.addEventListener('input', refresh)
    hEl.addEventListener('input', refresh)
    if (optEl) optEl.addEventListener('change', refresh)
    if (calcBtn) calcBtn.addEventListener('click', refresh)
    if (qtyGroup) {
      qtyGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.calc-qty-minus, .calc-qty-plus')
        if (!btn || !qtyGroup.contains(btn)) return
        e.preventDefault()
        if (btn.classList.contains('calc-qty-minus')) setQty(getQty() - 1)
        else setQty(getQty() + 1)
      })
    }

    try {
      const map = await fetchPricing()
      row = normalizeRow(slug, map)
      refresh()
    } catch { /* fallback row already set */ }

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
          modal.classList.add('hidden')
          form.reset()
          showFormToast('Talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.')
        } catch (err) {
          showFormToast(err.message || 'Gönderim başarısız. Lütfen tekrar deneyin.', 'error')
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
        if (msg) msg.classList.add('hidden')
        contactForm.reset()
        showFormToast('Mesajınız alındı! En kısa sürede size dönüş yapacağız.')
      } catch (err) {
        if (msg) msg.classList.add('hidden')
        showFormToast(err.message || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.', 'error')
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
