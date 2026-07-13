/** Saf HTML site JS — fiyat, formlar, menü */
(function () {
  const CFG = window.SITE_CONFIG || {}
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
      id: slug,
      carpan1: Number(p?.carpan1) || 3.6,
      sabit: Number(p?.sabit) || 0,
      carpan2: Number(p?.carpan2) || 1.45,
    }
  }

  function normalizeRow(slug, map) {
    const raw = map?.[slug] || {}
    const fb = productFallback(slug)
    return {
      id: slug,
      carpan1: Number(raw.carpan1 ?? fb.carpan1) || fb.carpan1,
      sabit: Number(raw.sabit ?? fb.sabit) || 0,
      carpan2: Number(raw.carpan2 ?? fb.carpan2) || fb.carpan2,
    }
  }

  /** Formül: ((En+Boy)×carpan1+sabit)×carpan2 — sabit=0 → fiyat kapalı */
  function calcPrice(w, h, row) {
    const en = Math.max(0, Number(w) || 0)
    const boy = Math.max(0, Number(h) || 0)
    const carpan1 = Number(row.carpan1) || 3.6
    const sabit = Number(row.sabit) || 0
    const carpan2 = Number(row.carpan2) || 1.45
    if (sabit <= 0 || en <= 0 || boy <= 0) return { price: 0, sabit, carpan1, carpan2 }
    const price = Math.round(((en + boy) * carpan1 + sabit) * carpan2)
    return { price, sabit, carpan1, carpan2 }
  }

  function fallbackMap() {
    const map = {}
    for (const p of CFG.products || []) {
      if (p.saleType === 'package') continue
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
        if (!row?.id) continue
        map[row.id] = {
          id: row.id,
          name: row.name,
          carpan1: Number(row.carpan1) || 3.6,
          sabit: Number(row.sabit) || 0,
          carpan2: Number(row.carpan2) || 1.45,
        }
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

  function privacyConsentOk(form) {
    const cb = form?.querySelector('[name="privacy_consent"]')
    if (!cb) return true
    if (cb.checked) return true
    showFormToast('Devam etmek için gizlilik onayını işaretleyin.', 'error')
    return false
  }

  function privacyConsentValue(form) {
    const cb = form?.querySelector('[name="privacy_consent"]')
    return cb?.checked ? '1' : ''
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
  const menuBackdrop = $('#mobile-menu-backdrop')

  if (menuBtn && mobileMenu) {
    const setMenuOpen = (open) => {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
      menuBtn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç')
      document.body.classList.toggle('mobile-menu-open', open)
      mobileMenu.classList.toggle('is-open', open)
      mobileMenu.style.display = open ? 'flex' : 'none'
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true')
      if (menuBackdrop) {
        menuBackdrop.classList.toggle('is-open', open)
        menuBackdrop.style.display = open ? 'block' : 'none'
        menuBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true')
      }
    }

    const toggleMenu = (e) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      setMenuOpen(!mobileMenu.classList.contains('is-open'))
    }

    menuBtn.addEventListener('click', toggleMenu)
    menuBackdrop?.addEventListener('click', () => setMenuOpen(false))
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) setMenuOpen(false)
    })
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setMenuOpen(false))
    })
    setMenuOpen(false)
  }

  // Price badges
  async function updateBadges() {
    const map = await fetchPricing()
    $$('.price-badge').forEach(el => {
      const slug = el.dataset.slug
      if (slug === 'sineklik-tamir-bandi') return
      const row = normalizeRow(slug, map)
      el.textContent = row.sabit > 0 ? 'Ölçüye göre fiyat' : 'Fiyat için iletişime geçin'
    })
  }

  // Prices table page
  async function renderPricesTable() {
    const wrap = $('#prices-table')
    if (!wrap) return
    const map = await fetchPricing()
    $$('.price-cell', wrap).forEach(el => {
      const row = normalizeRow(el.dataset.slug, map)
      if (row.sabit > 0) {
        el.textContent = `${row.carpan1} / ${row.sabit} / ${row.carpan2}`
      } else {
        el.textContent = 'Fiyat belirlenmedi'
      }
    })
    $$('.min-cell', wrap).forEach(el => {
      const row = normalizeRow(el.dataset.slug, map)
      if (row.sabit > 0) {
        const ornek = Math.round(((100 + 150) * row.carpan1 + row.sabit) * row.carpan2)
        el.textContent = `₺${formatTry(ornek)}`
      } else {
        el.textContent = '—'
      }
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
    const minusBtn = $('.calc-qty-minus', box)
    const plusBtn = $('.calc-qty-plus', box)
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
      if (minusBtn) minusBtn.disabled = qty <= 1
      if (plusBtn) plusBtn.disabled = qty >= 99
      refresh()
    }

    function getColor() {
      if (!colorEl && !colorBtns.length) return ''
      return colorEl?.value || colorBtns[0]?.dataset.color || ''
    }

    function refresh() {
      const q = getQty()
      const { price, sabit } = calcPrice(wEl.value, hEl.value, row)
      const total = price * q

      priceEl.textContent = total > 0 ? `₺${formatTry(total)}` : '—'

      if (detailEl) {
        if (sabit === 0) {
          detailEl.textContent = 'Bu ürün için fiyat henüz belirlenmedi — lütfen iletişime geçin'
        } else if (total > 0 && q > 1) {
          detailEl.textContent = `${q} adet × ₺${formatTry(price)} · KDV ve kargo hariçtir`
        } else if (total > 0) {
          detailEl.textContent = 'Fiyata KDV ve kargo dahil değildir'
        } else {
          detailEl.textContent = 'Ölçü girin ve Fiyat Hesapla\'ya basın'
        }
      }

      if (waEl) {
        const parts = [
          `Merhaba, ${name} için fiyat teklifi almak istiyorum.`,
          `• Adet: ${q}`,
          `• Ölçü: ${wEl.value} × ${hEl.value} cm`,
        ]
        const color = getColor()
        if (color) parts.push(`• Renk/Model: ${color}`)
        if (optEl?.value) parts.push(`• Açılım: ${optEl.value}`)
        if (total > 0) parts.push(`• Tahmini fiyat: ₺${formatTry(total)} (KDV ve kargo hariç)`)
        const waNum = CFG.whatsappNumber || '905388202036'
        waEl.href = `https://wa.me/${waNum}?text=${encodeURIComponent(parts.join('\n'))}`
      }
      box.dataset.price = String(total > 0 ? total : '')
      box.dataset.qty = String(q)
    }

    wEl.addEventListener('input', refresh)
    hEl.addEventListener('input', refresh)
    if (optEl) optEl.addEventListener('change', refresh)
    if (calcBtn) calcBtn.addEventListener('click', refresh)

    function onQtyChange(delta) {
      setQty(getQty() + delta)
    }

    if (minusBtn) {
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault()
        onQtyChange(-1)
      })
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', (e) => {
        e.preventDefault()
        onQtyChange(1)
      })
    }

    setQty(getQty())
    refresh()

    // API fiyatını hemen al; başarısız olursa SITE_CONFIG fallback kalır
    let pricingPrefetched = false
    const prefetchPricing = async () => {
      if (pricingPrefetched) return
      pricingPrefetched = true
      try {
        const map = await fetchPricing()
        row = normalizeRow(slug, map)
        refresh()
      } catch { /* fallback row already set */ }
    }
    prefetchPricing()
    const prefetchTargets = [wEl, hEl, optEl, colorEl, calcBtn, minusBtn, plusBtn, ...colorBtns].filter(Boolean)
    prefetchTargets.forEach(el => {
      el.addEventListener('focus', prefetchPricing, { once: true })
      el.addEventListener('pointerdown', prefetchPricing, { once: true })
    })

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
    const closeModal = () => modal?.classList.add('hidden')
    if (openBtn && modal) openBtn.addEventListener('click', () => modal.classList.remove('hidden'))
    if (closeBtn && modal) closeBtn.addEventListener('click', closeModal)
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal()
      })
    }
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault()
        if (!privacyConsentOk(form)) return
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
            privacy_consent: privacyConsentValue(form),
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

  function initRepairTapeSelector() {
    const box = $('#repair-tape-selector')
    if (!box) return
    const name = box.dataset.name || 'Sineklik Tamir Bandı'
    const select = $('#repair-variant-select')
    const priceEl = $('#repair-tape-price')
    const detailEl = $('#repair-tape-detail')
    const waBtn = $('#repair-tape-wa')
    const waBottom = $('#repair-tape-wa-bottom')
    let catalog = null
    let variants = []

    function variantLabel(v) {
      return `${v.renk} · En ${v.en} mm · Boy ${v.boy} cm · Genişlik ${v.genislik} mm · ${v.paket}`
    }

    function priceWithKdv(v) {
      const kdv = Number(catalog?.kdv_orani ?? 0.20) || 0.20
      const base = Number(v?.fiyat) || 0
      if (base <= 0) return null
      return Math.round(base * (1 + kdv))
    }

    function currentVariant() {
      const id = select?.value
      return variants.find(v => v.id === id) || variants[0] || null
    }

    function buildMsg(v) {
      if (!v) return `Merhaba, ${name} için sipariş vermek istiyorum.`
      const price = priceWithKdv(v)
      const pricePart = price ? ` — yaklaşık ₺${formatTry(price)} (KDV dahil)` : ''
      return `Merhaba, ${name} - ${v.renk} renk - En ${v.en} mm, Boy ${v.boy} cm, Genişlik ${v.genislik} mm - ${v.paket} için sipariş vermek istiyorum${pricePart}.`
    }

    function refresh() {
      const v = currentVariant()
      const price = v ? priceWithKdv(v) : null
      if (priceEl) priceEl.textContent = price ? `₺${formatTry(price)}` : (v?.fiyat > 0 ? '—' : 'WhatsApp ile sorun')
      if (detailEl) {
        detailEl.textContent = v
          ? (price ? `${variantLabel(v)} · KDV dahil` : `${variantLabel(v)} · Fiyat için WhatsApp`)
          : ''
      }
      const href = `https://wa.me/${CFG.whatsappNumber}?text=${encodeURIComponent(buildMsg(v))}`
      if (waBtn) waBtn.href = href
      if (waBottom) waBottom.href = href
      const badge = document.querySelector('.price-badge[data-slug="sineklik-tamir-bandi"]')
      if (badge && price) badge.textContent = `₺${formatTry(price)}'den`
    }

    function renderOptions() {
      if (!select) return
      if (!variants.length) {
        select.innerHTML = '<option value="">Ürün bulunamadı</option>'
        refresh()
        return
      }
      select.innerHTML = variants.map(v =>
        `<option value="${String(v.id).replace(/"/g, '&quot;')}">${variantLabel(v)}</option>`
      ).join('')
      refresh()
    }

    function mergeRepairCatalog(apiCatalog) {
      const fallback = CFG.repairTapeFallback
      if (!fallback?.variants?.length) return apiCatalog
      const variants = (apiCatalog?.variants || []).map(v => {
        const fb = fallback.variants.find(f =>
          f.id === v.id || (f.renk === v.renk && f.paket === v.paket)
        )
        const fiyat = Number(v.fiyat) > 0 ? Number(v.fiyat) : Number(fb?.fiyat) || 0
        return { ...v, fiyat }
      })
      return { ...apiCatalog, variants, kdv_orani: apiCatalog?.kdv_orani ?? fallback.kdv_orani }
    }

    async function loadCatalog() {
      try {
        const res = await fetch(CFG.repairTapeApi, { cache: 'no-store' })
        if (!res.ok) throw new Error('repair-tape')
        catalog = mergeRepairCatalog(await res.json())
        variants = Array.isArray(catalog?.variants) ? catalog.variants : []
        if (!variants.length) throw new Error('empty')
      } catch {
        catalog = CFG.repairTapeFallback || { kdv_orani: 0.20, variants: [] }
        variants = catalog.variants || []
      }
      renderOptions()
    }

    select?.addEventListener('change', refresh)
    loadCatalog()
  }

  function initRepairTapeGallery() {
    const main = $('#repair-tape-main')
    if (!main) return
    $$('.repair-gallery-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        main.src = btn.dataset.src || main.src
        $$('.repair-gallery-thumb').forEach(b => b.classList.remove('ring-2', 'ring-primary'))
        btn.classList.add('ring-2', 'ring-primary')
      })
    })
  }

  // Contact form
  const contactForm = $('#contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault()
      if (!privacyConsentOk(contactForm)) return
      const fd = new FormData(contactForm)
      const msg = $('#contact-msg')
      try {
        await submitForm(CFG.formContact, {
          name: fd.get('name'),
          phone: fd.get('phone'),
          email: fd.get('email'),
          subject: fd.get('subject'),
          message: fd.get('message'),
          privacy_consent: privacyConsentValue(contactForm),
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
    // Rozet / fiyat tablosu: idle'da veya en geç ~2.5 sn (kritik yolu engellemez)
    const runPricing = () => {
      updateBadges()
      renderPricesTable()
    }
    if ('requestIdleCallback' in window) {
      requestIdleCallback(runPricing, { timeout: 2500 })
    } else {
      setTimeout(runPricing, 1200)
    }
    // Hesaplayıcı: fallback fiyatla hemen açılır; API fetch odak/3sn ile ertelenir
    initCalculator()
    initRepairTapeSelector()
    initRepairTapeGallery()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
