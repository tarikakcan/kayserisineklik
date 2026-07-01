# kayserisineklik.com.tr — Kaynak Kod İncelemesi: Güncellenmiş SEO & AI-Ajan Raporu
**İnceleme tarihi:** 28 Haziran 2026 — gerçek HTML kaynak dosyaları üzerinden
**Not:** Site henüz Google Search Console'a eklenmemiş ve tasarım aşamasında — bu rapor canlıya/duyuruya geçmeden önce uygulanacak bir kontrol listesi olarak hazırlandı.

---

## ÖZET

Önceki raporda (web üzerinden erişimle) tahmin ettiğim bazı şeyler kaynak kodu görünce **düzeldi**, bazıları **doğrulandı**, bir tane de **yeni ve kritik** bulgu çıktı:

| Önceki tahmin | Gerçek durum |
|---|---|
| Fiyat hesaplama JS ile geç yükleniyor, veri hiç yok | ✅ **Düzeltme:** Fiyat verisi (`pricePerM2`, `minPrice`) her sayfanın `<script>` içinde JSON olarak **zaten mevcut** — bu iyi haber, veri orada. Sorun, bu verinin "okunabilir metne" dönüştürülmemiş olması. |
| Schema.org hiç yok | ✅ **Doğrulandı:** Hiçbir sayfada `application/ld+json` veya schema.org niteliği yok. |
| robots.txt index'i engelliyor olabilir | ✅ **Temiz:** `robots.txt` doğru, engelleyici değil (`Allow: /`, sadece `/api/` kapalı — bu doğru bir karar). |
| — | 🆕 **Yeni bulgu:** `sitemap.xml`'deki URL'ler ile gerçek dosya/route yapısı arasında uyumsuzluk riski var (aşağıda detay). |
| — | 🆕 **Yeni bulgu:** `.htaccess` dosyası `_htaccess` adıyla yüklenmiş — sunucu bunu tanımıyor olabilir. |

---

## 1. 🔴 ACİL — `_htaccess` Dosya Adı Sorunu

Yüklediğiniz dosyanın adı **`_htaccess`** — başında nokta yok. Apache sunucular sadece **`.htaccess`** (noktayla başlayan) dosyasını tanır. Eğer sunucuya bu dosya `_htaccess` adıyla yüklendiyse:
- URL yönlendirme kuralları (uzantısız URL'lerin `.html` dosyasına yönlenmesi) **çalışmıyor olabilir**
- `/urunler/dikey-plise-sineklik` gibi "güzel" URL'lere gidildiğinde 404 hatası alınabilir
- Sadece `.html` uzantılı tam adresler çalışır

**Çözüm:** Sunucuya yüklerken dosyanın adının tam olarak `.htaccess` olduğunu kontrol edin (bazı işletim sistemleri/FTP istemcileri nokta ile başlayan dosyaları gizler, bu yüzden yanlışlıkla `_` ile kaydedilmiş olabilir).

---

## 2. 🔴 ACİL — Sitemap ile URL Yapısı Tutarsızlığı

`sitemap.xml` içindeki tüm URL'ler **uzantısız** yazılmış:
```
https://kayserisineklik.com.tr/urunler/dikey-plise-sineklik
```
Ama gerçek dosyalar **`.html` uzantılı**:
```
urunler/dikey-plise-sineklik.html
```

Bu, `.htaccess` doğru çalışıyorsa sorun değil (rewrite kuralı uzantısızı `.html`'e çeviriyor) — **ama** sitenizde gezinirken linkler `.html` uzantılı kullanılıyor (örn. `<a href="urunler/dikey-plise-sineklik.html">`). Yani:
- **Kullanıcılar/linkler** → `.html` uzantılı adrese gidiyor
- **Sitemap (Google'a bildirilen adres)** → uzantısız adrese işaret ediyor

İkisi de sonunda aynı içeriğe ulaşsa bile (htaccess çalışıyorsa), Google bazen bunu **iki farklı URL** olarak görüp "duplicate content" (yinelenen içerik) sinyali alabilir, çünkü `canonical` etiketi de uzantısız adresi gösteriyor (`<link rel="canonical" href="https://kayserisineklik.com.tr/urunler/dikey-plise-sineklik"/>`) ama sayfaya asıl ulaşılan adres `.html` ile.

**Çözüm — iki seçenekten biri, tutarlı olsun:**
- **Seçenek A (önerilen):** Tüm `<a href="...">` linklerini sitedeki her sayfada uzantısız hale getirin (`urunler/dikey-plise-sineklik`), `.htaccess` zaten bunu `.html`'e çeviriyor. Canonical ile linkler böylece eşleşir.
- **Seçenek B:** Sitemap'i `.html` uzantılı yazın, canonical etiketlerini de `.html` ile güncelleyin.

Hangisini seçerseniz seçin, **canonical etiketi, sitemap.xml, ve sayfa içi linkler aynı formatta olmalı.** Şu an üçü birbirinden farklı.

---

## 3. 🔴 ÖNEMLİ — Fiyat Verisi HTML'de Var Ama "Görünmez"

İncelediğimde her sayfanın sonunda şöyle bir veri buldum:
```html
<script>window.SITE_CONFIG={"products":[
  {"slug":"dikey-plise-sineklik","name":"Dikey Plise Sineklik","pricePerM2":1450,"minPrice":850, ...}
  ...
]};</script>
```

Bu **iyi bir haber** — fiyat verisi statik HTML'in içinde gerçekten var, sunucudan ayrıca çekilmiyor. **Ama** bu veri bir JavaScript objesi olarak gömülü; arama motoru ve AI ajanları bunu "30 satırlık kod" olarak görür, "Dikey Plise Sineklik m² fiyatı 1450 TL'dir" şeklinde bir **cümle** olarak görmez.

**Çözüm:** Her ürün sayfasına, hesaplayıcının üstüne veya altına, bu veriyi düz HTML metne döken bir blok ekleyin:

```html
<div class="text-sm text-muted-foreground mt-3">
  <strong>Dikey Plise Sineklik m² fiyatı:</strong> 1.450 TL/m² + KDV
  (minimum sipariş tutarı 850 TL + KDV). Fiyata Kayseri içi montaj dahildir.
</div>
```

Bu tek değişiklik hem Google hem AI ajanları için büyük fark yaratır — fiyat artık "kod" değil "okunabilir bilgi" oluyor. Aynı mantıkla **"Sineklik Fiyatları" sayfasındaki** "Fiyatlar yükleniyor…" yazısının yerine, build/yayın anında bu `SITE_CONFIG` verisinden üretilmiş **statik bir HTML tablo** koymalısınız (8 satır, 8 ürün — JS hiç çalışmasa bile tablo orada dursun, JS sadece görsel zenginlik/interaktiflik için ek olsun).

---

## 4. 🔴 ÖNEMLİ — Schema.org (Structured Data) Hiçbir Sayfada Yok

Doğrulandı: 13 sayfanın hiçbirinde `<script type="application/ld+json">` yok. Aşağıda **doğrudan kopyalayıp yapıştırabileceğiniz** şemalar var.

### a) Ana sayfaya (`index.html`) — Organization + LocalBusiness
`</head>` etiketinden hemen önce ekleyin:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Kayseri Sineklik - Edeka Otomatik Kapı Sistemleri",
  "image": "https://kayserisineklik.com.tr/logo.svg",
  "url": "https://kayserisineklik.com.tr/",
  "telephone": "+905388202036",
  "email": "info@edekakapi.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Fevzi Çakmak, Fuzuli Cd. No:63",
    "addressLocality": "Kocasinan",
    "addressRegion": "Kayseri",
    "postalCode": "38020",
    "addressCountry": "TR"
  },
  "areaServed": ["Kayseri", "Türkiye"],
  "priceRange": "₺₺",
  "sameAs": []
}
</script>
```
> `sameAs` dizisine ileride Facebook/Instagram/Google İşletme Profili linklerinizi ekleyin.

### b) Her ürün sayfasına — Product şeması
Örnek, `dikey-plise-sineklik.html` için (`</head>`'ten önce):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Dikey Plise Sineklik",
  "description": "Pencereler için yukarıdan aşağıya çalışan, estetik ve dayanıklı plise sineklik.",
  "image": "https://customer-assets.emergentagent.com/job_262fdf16-1181-40c4-aecb-3d93097f2d17/artifacts/xnicr7at_dikey-plise-sineklik-bipencerecom-hesapla.jpg",
  "brand": { "@type": "Brand", "name": "Edeka Kapı" },
  "offers": {
    "@type": "Offer",
    "url": "https://kayserisineklik.com.tr/urunler/dikey-plise-sineklik",
    "priceCurrency": "TRY",
    "price": "850",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "areaServed": "TR"
  }
}
</script>
```
> `price` alanına minimum fiyatı (`minPrice`) yazdım — m² bazlı değişken fiyat için bu Google'ın kabul ettiği en doğru yaklaşım ("X TL'den başlayan fiyatlarla"). Diğer 7 ürün sayfası için aynı şablonu kendi `name`, `description`, `image`, `price` (minPrice) değerleriyle tekrarlayın — bu veriler zaten her sayfanın `SITE_CONFIG` objesinde mevcut, oradan kopyalamanız yeterli.

### c) Her sayfaya — BreadcrumbList şeması
Örnek, ürün sayfası için:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Anasayfa", "item": "https://kayserisineklik.com.tr/"},
    {"@type": "ListItem", "position": 2, "name": "Ürünler", "item": "https://kayserisineklik.com.tr/urunler"},
    {"@type": "ListItem", "position": 3, "name": "Dikey Plise Sineklik", "item": "https://kayserisineklik.com.tr/urunler/dikey-plise-sineklik"}
  ]
}
</script>
```

### d) İleride eklenecek SSS bölümleri için — FAQPage şeması
Ürün sayfalarına SSS eklediğinizde (bkz. Bölüm 6):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Dikey plise sineklik montajı kaç gün sürer?",
      "acceptedAnswer": {"@type": "Answer", "text": "Ölçü alındıktan sonra 1-3 iş günü içinde üretim tamamlanır ve Kayseri içinde montaj yapılır."}
    }
  ]
}
</script>
```

---

## 5. 🟡 Görsellerde Eksik `alt` Metni

Tarama sonucu, çoğu görselde `alt` doğru ve açıklayıcı, ama şu yerlerde **boş** (`alt=""`):
- `index.html` — ana sayfadaki "Koleksiyon" bölümünün hero/arka plan görseli (60. satır civarı)
- `index.html` — blog bölümündeki 3 kapak görseli (88, 90, 92. satırlar)

**Çözüm:** Her birine ürün/konu adını yazın, örn:
```html
<img src="...g3q50959_duble-plise-sineklik..." alt="Duble plise sineklik Kayseri kurulum örneği" .../>
```

---

## 6. 🟡 İçerik Derinliği — Sayfalar Çok Kısa

Kaynak kodda gördüğüm gerçek metin miktarı:
- **Hakkımızda sayfası:** 2 cümle ("10+ yıl deneyim, 5.000+ montaj, %98 müşteri memnuniyeti" + 1 cümle tanıtım)
- **Ürün sayfaları:** 1 açıklama cümlesi + 4 madde işareti
- **Blog yazıları:** ~5-6 kısa paragraf

Google'ın 2024-2025'te güçlendirdiği "yararlı içerik" (helpful content) değerlendirmesi, şablon gibi tekrarlayan, az metinli sayfaları düşük öncelikli görme eğiliminde. Önerilen ek içerik (ürün sayfası başına):
- Teknik özellikler tablosu (kasa malzemesi, tül/file tipi, ağırlık kapasitesi, garanti süresi)
- "Bu ürün kimler için uygun?" kısa paragraf
- En az 3 SSS (hem kullanıcı hem AI ajanları için — bkz. Bölüm 4.d)
- Hakkımızda sayfasına: firma hikayesi, Edeka Kapı ile ilişki, üretim süreci kısa anlatımı

---

## 7. 🟡 Görseller Üçüncü Taraf Domain'den Geliyor

Ürün görsellerinin çoğu `customer-assets.emergentagent.com` üzerinden, bazıları `images.pexels.com` üzerinden sunuluyor (stok görseller). Tasarım aşamasında olduğunuz için bu normal, ama canlıya geçmeden önce:
- Gerçek ürün fotoğraflarınız çekildiğinde, görselleri **kendi domaininize** (`kayserisineklik.com.tr/assets/images/...`) taşıyın.
- Pexels stok görselleri (Kapı Sinekliği, Pencere Sinekliği, Kedi Sinekliği, Sürgülü Sineklik için kullanılan) gerçek ürün fotoğrafıyla değiştirilmeli — hem güven hem de görsel SEO (gerçek ürün fotoğrafları arama sonuçlarında daha değerli) açısından önemli.

---

## 8. ✅ İyi Yapılanlar (Değişiklik Gerekmiyor)

- `robots.txt` doğru yapılandırılmış, indexlemeyi engellemiyor
- Her sayfada benzersiz `title`/`meta description`
- `meta viewport` doğru
- H1/H2 hiyerarşisi mantıklı (her sayfada tek H1)
- NAP bilgisi (isim/adres/telefon) tüm sayfalarda tutarlı
- WhatsApp entegrasyonu ve sticky buton iyi kurulmuş
- Fiyat hesaplayıcının veri kaynağı (`SITE_CONFIG`) zaten statik ve build-time'da mevcut — ayrı bir API çağrısına gerek yok demek, bu basitlik avantajı
- `.htaccess` mantığı (dosya adı sorunu hariç) doğru yazılmış

---

## 9. Henüz Search Console'a Eklenmemiş Olması Hakkında

Tasarım aşamasında olduğunuzu belirttiniz — bu doğru bir sıralama, **Search Console'a eklemeyi son adım olarak bırakmanız mantıklı.** Sırayla öneri:

1. Önce bu rapordaki 🔴 maddeleri (htaccess dosya adı, sitemap/canonical tutarlılığı, schema.org, fiyat verisinin görünür metne dönüşmesi) düzeltin.
2. Gerçek ürün görselleri ve biraz daha derin içerikle (Bölüm 6) sayfaları zenginleştirin.
3. Tasarım/içerik onaylandıktan sonra Google Search Console'a ekleyin, `sitemap.xml`'i gönderin, ana sayfa dahil önemli sayfalar için "Dizine eklenmesini iste" yapın.
4. Google İşletme Profili'ni bu aşamada paralel kurabilirsiniz (bağımsız bir adım, siteyle senkron olmasına gerek yok).

Bu sırayla gidersek, Google ilk kez taradığında zaten düzeltilmiş, zengin içerikli bir site bulacak — "önce yarım yükle, sonra düzelt" yaklaşımından daha sağlıklı.

---

## 10. Güncellenmiş Öncelik Listesi

### Bu hafta (canlıya/duyuruya geçmeden önce mutlaka)
1. `_htaccess` dosya adını sunucuda `.htaccess` olarak doğrula
2. Sitemap / canonical / link yapısını tek formatta birleştir (uzantılı ya da uzantısız, hepsi aynı olsun)
3. "Sineklik Fiyatları" sayfasına statik HTML tablo ekle (JS'siz de görünsün)
4. Her ürün sayfasına Product + BreadcrumbList şeması ekle
5. Ana sayfaya HomeAndConstructionBusiness şeması ekle

### Tasarım bitmeden önce
6. Boş `alt` metinlerini doldur
7. Ürün sayfalarına 3-5 SSS ekle (+ FAQPage şeması)
8. Hakkımızda ve ürün sayfalarına ek içerik (Bölüm 6)
9. Gerçek ürün fotoğraflarıyla stok görselleri değiştir

### Canlıya geçtikten sonra
10. Google Search Console'a ekle, sitemap gönder
11. Google İşletme Profili oluştur
12. `llms.txt` ekle (AI ajanları için kısa firma/ürün özeti)
