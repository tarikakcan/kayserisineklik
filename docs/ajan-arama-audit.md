# Ajan Tabanlı Arama / AI Keşfedilebilirlik Denetimi

**Tarih:** 2026-07-01  
**Kapsam:** `kaynak/` kaynak kodu + `1-CANLI-SITE/` build çıktısı  
**Durum:** Eksiklikler kayıt altına alındı — uygulama bekliyor

---

## Özet

Teknik SEO altyapısı birçok yerel işletme sitesinden iyi durumda. Ajan/LLM tarafında puanı düşüren ana nedenler: **eksik veya hatalı yapılandırılmış veri**, **yüzeysel `llms.txt`**, **yanıltıcı ürün fiyat schema'sı**.

---

## Mevcut Güçlü Yanlar

| Alan | Durum |
|------|--------|
| Merkezi SEO pipeline | `build.mjs` her sayfaya title, description, canonical, OG/Twitter üretiyor |
| `llms.txt` | Var ve otomatik üretiliyor |
| JSON-LD | Ürün, blog, ilçe, breadcrumb, FAQ (çoğu sayfada) |
| İlçe sayfaları | Uzun içerik, `aiSnippet`, FAQ hem HTML hem schema |
| Ürün sayfaları | Hesaplayıcı + `product-content/*.js` ile derin içerik |
| Sitemap | 43 URL (ürün, blog, 16 ilçe) |
| URL yapısı | Uzantısız, tutarlı canonical |

---

## Puanı Düşüren Sorunlar (Öncelik Sırasıyla)

### 1. Kırık FAQ schema — sivrisinek blogu (YÜKSEK)

`sivrisinekle-bas-etme-7-yol` FAQ'ları `q` / `a` kullanıyor; `schemaFaq()` ise `question` / `answer` bekliyor. Sonuç: boş soru-cevap JSON-LD.

- **Dosya:** `kaynak/lib/blog-content/sivrisinekle-bas-etme-7-yol.js`
- **Schema:** `kaynak/pure-html/build.mjs` → `schemaFaq()`
- **Karşılaştırma:** `sineklik-yirtik-delik-tamiri.js` doğru formatta

### 2. `llms.txt` çok yüzeysel (YÜKSEK)

Şu an ~45 satır. Eksikler:

- 9 ürünün tek tek URL'leri yok
- 7 blog yazısının linkleri yok
- 16 ilçe sadece isim — `/bolgeler/melikgazi-sineklik` gibi linkler yok
- Fiyat özeti yok (m² aralıkları, min sipariş, tamir bandı paketleri)
- `robots.txt` içinde `llms.txt` referansı yok

- **Üretim:** `writeLlmsTxt()` in `kaynak/pure-html/build.mjs`

### 3. Ürün schema fiyatı yanıltıcı (YÜKSEK)

`schemaProduct()` `minPrice` (ör. 850 TL) yazıyor; sayfada görünen m² fiyatı (ör. 1.450 TL/m²) farklı. Ajanlar yanlış fiyat cevabı üretebilir.

- **Dosya:** `kaynak/pure-html/build.mjs` → `schemaProduct()`

### 4. LocalBusiness eksik (ORTA)

`site.workingHours` config'de var ama schema'da yok. `sameAs: []` — Google Business, sosyal medya bağlantısı yok.

- **Dosya:** `kaynak/pure-html/build.mjs` → `schemaLocalBusiness()`

### 5. İnce sayfalar ve zayıf iç bağlantı (ORTA)

| Sayfa | Sorun |
|-------|--------|
| `sineklik-montaji` | ~5 madde, ürün/ilçe linki yok |
| Ana sayfa | İlçe bloğu yok (sadece menü/footer) |
| Eski blog yazıları (5 adet) | Kısa, ürün sayfalarına çapraz link az |
| Blog index | `ItemList` schema yok |

### 6. Diğer teknik boşluklar (DÜŞÜK–ORTA)

- `check-seo.mjs` var ama `package.json`'da yok → regresyonlar kaçabilir
- `kedi-sinekligi-neden-onemli` kapak görseli harici Pexels URL
- Sitemap'te tüm `lastmod` aynı build tarihi
- Breadcrumb HTML'de `<nav aria-label>` yok (JSON-LD var)

---

## Önerilen Aksiyon Planı

### Hızlı kazanımlar (1–2 saat, yüksek ROI)

1. FAQ anahtarlarını düzelt (`q`/`a` → `question`/`answer`) veya `schemaFaq()` her iki formatı kabul etsin
2. `llms.txt` zenginleştir: tüm ürün + blog + ilçe URL'leri, fiyat tablosu, sık sorulan 5–10 Q&A
3. `robots.txt`'e ekle: `# LLM context: https://kayserisineklik.com.tr/llms.txt`
4. Schema'ya `openingHours` ve gerçek `sameAs` linkleri ekle
5. `npm run check:seo` script'i ekle; build sonrası çalışsın

### Orta vadeli (yarım gün)

6. Ürün Offer schema — m² birim fiyatı + min sipariş ayrı alanlar
7. `sineklik-montaji` sayfasını derinleştir
8. Ana sayfaya "Kayseri ilçeleri" bölümü
9. Eski blog yazılarına ürün/ilçe iç linkleri + kısa FAQ blokları
10. `llms-full.txt` — tam site özeti

### Uzun vadeli

11. Blog yazılarında topic cluster (plise → dikey/duble/yatay; tamir → tamir bandı)
12. Müşteri yorumları varsa `aggregateRating`
13. Harici Pexels görsellerini kendi WebP dosyalarıyla değiştir

---

## Dosya Referansları

| Varlık | Yol |
|--------|-----|
| Build / SEO mantığı | `kaynak/pure-html/build.mjs` |
| Site config | `kaynak/lib/site-config.js` |
| Ürünler | `kaynak/lib/products-config.js` |
| Blog | `kaynak/lib/blog-posts.js` |
| İlçe içerik + aiSnippet | `kaynak/lib/regions/district-content.js` |
| Canlı llms.txt | `1-CANLI-SITE/llms.txt` |
| SEO doğrulayıcı | `scripts/check-seo.mjs` |

---

## Bu Oturumda Tamamlanan İyileştirmeler (2026-07-01)

- Ana sayfadan tamir bandı kartı kaldırıldı
- Tüm görseller WebP'ye geçirildi
- Sivrisinek blog kapak görseli eklendi
- PageSpeed / header / mobil menü / ürün layout düzeltmeleri
- Admin güvenlik (rate limit, CSRF, session)
- İlçe sayfaları, tamir bandı ürünü, yeni blog yazıları

---

*Sonraki adım: Yukarıdaki "Hızlı kazanımlar" listesinden başlanması önerilir.*
