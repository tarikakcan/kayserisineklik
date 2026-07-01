# Kayseri İlçe Bazlı Sineklik Sayfaları — Yapı, İçerik ve AI-Ajan Optimizasyon Raporu

**Hedef:** "Hacılar sineklik" diye arayan biri sizi bulsun, "Talas sineklik" diye arayan da sizi bulsun — her ilçe için ayrı, birbirinden farklı, gerçek değer sunan sayfalarla.

---

## 1. Önce Doğru Kapsamı Belirleyelim

Kayseri'nin 16 ilçesi var, ama hepsi aynı önceliğe sahip değil. Resmi ayrım şöyle:

**5 Merkez İlçe** (şehrin içinde, günlük montaj/keşif hizmeti verebileceğiniz alan):
Kocasinan, Melikgazi, Talas, Hacılar, İncesu

**11 Çevre/Taşra İlçesi** (daha uzak, montaj için ekstra planlama gerekebilir, ama hâlâ "Kayseri" arama hacminin parçası):
Develi, Yahyalı, Bünyan, Tomarza, Pınarbaşı, Sarıoğlan, Sarız, Akkışla, Felahiye, Özvatan, Yeşilhisar

Bu ayrımı doğrudan sayfa stratejinize yansıtmanızı öneririm — sizin "Merkez İlçeleri / Çevre İlçeleri" şeklindeki ayrımınız da tam buna karşılık geliyor.

**Öncelik sıralaması (nüfus ve arama hacmine göre mantıklı sıra):**
1. Melikgazi (en kalabalık, ekonomik merkez)
2. Kocasinan (gelişmiş konut bölgeleri)
3. Talas (yoğun yapılaşma, üniversite çevresi)
4. Hacılar
5. İncesu
6. Develi, Yahyalı, Bünyan (çevre ilçelerin en büyükleri)
7. Kalan 8 ilçe (Tomarza, Pınarbaşı, Sarıoğlan, Sarız, Akkışla, Felahiye, Özvatan, Yeşilhisar)

Hepsini aynı anda yazmaya çalışmayın — ilk 5 merkez ilçeyle başlayıp, trafiği görüp sonra genişletmek, hem emek hem de kalite açısından daha sürdürülebilir.

---

## 2. URL ve Sayfa Yapısı

```
kayserisineklik.com.tr/
└── /bolgeler/                          (opsiyonel: ilçe sayfalarının listelendiği bir index)
    ├── /talas-sineklik/
    ├── /melikgazi-sineklik/
    ├── /kocasinan-sineklik/
    ├── /hacilar-sineklik/
    ├── /incesu-sineklik/
    ├── /develi-sineklik/
    ├── /yahyali-sineklik/
    └── ... (sırayla diğerleri)
```

**Neden `/bolgeler/ilce-sineklik/` formatı:**
- "İlçe + sineklik" kelime sırası, kullanıcıların gerçekte arattığı kalıpla birebir örtüşüyor ("talas sineklik", "hacılar sineklik fiyatları" vb.)
- `/bolgeler/` üst klasörü, bu sayfaların hepsinin "aynı türde" içerik olduğunu hem Google'a hem site içi navigasyona net gösteriyor

**Kritik teknik nokta — Cursor'a aynen söyleyin:**
Bu 16 (veya başlangıçta 5) sayfa, **birbirinin kopyası olmamalı.** Aynı şablonu, sadece ilçe adını değiştirerek 16 kere basmak ("find-replace SEO") Google'ın 2024-2025'teki "yararlı içerik" güncellemeleriyle ciddi şekilde cezalandırdığı bir yöntem. Her sayfa gerçekten o ilçeye özgü, benzersiz bilgi içermeli (bkz. Bölüm 3).

---

## 3. Her İlçe Sayfasında Ne Olmalı (İçerik İskeleti)

Sayfa şablonu sabit olabilir (kart yapısı, başlık sırası), ama **içerik her ilçede değişmeli**:

### a) İlçeye Özgü Açılış Paragrafı
Genel "biz Kayseri'de sineklik üretiyoruz" cümlesi yerine, o ilçeye özgü gerçek bir detay:
- Talas için: "Talas'ın yoğun yapılaşmış sitelerinde, özellikle [X mahallesi] gibi yüksek katlı konutlarda sürgülü ve plise sineklik talebi öne çıkıyor."
- Hacılar için: "Hacılar'ın müstakil ev ve bahçeli konut yoğunluğu, balkon kapısı ve geniş pencere sinekliklerini öne çıkarıyor."

Bu detayları gerçekten biliyorsanız (geçmiş siparişlerinizden, montaj deneyiminizden) kullanın — bilmiyorsanız en azından "bu ilçede en çok sürme/sürgülü pencere mi, klasik kanat pencere mi yaygın" gibi genel ama doğru bir gözlemle başlayın. Uydurmayın; yanlış bir iddia (örn. olmayan bir mahalle adı) güveni zedeler.

### b) Hizmet Detayları (İlçeye Göre Değişen Kısım)
- Ücretsiz keşif bu ilçede geçerli mi? (Merkez ilçelerde evet, çok uzak çevre ilçelerinde belki ek koşullu)
- Montaj süresi bu ilçe için tahmini ne kadar? (Merkeze yakınlık değişebilir)
- Bu ilçede hangi mahallelerde daha sık hizmet verdiğiniz (varsa)

### c) Google Maps Gömme
Her sayfaya, o ilçeyi merkeze alan bir Google Maps embed'i koymak — hem kullanıcı için pratik hem de Google'a "bu sayfa gerçekten o bölgeyle ilgili" sinyali güçlü bir şekilde veriyor.

### d) İlçeye Özgü SSS (FAQ)
"Hacılar'a montaj ücreti var mı?", "Talas'tan sipariş verirsem ne kadar sürede gelir?" gibi — bu hem kullanıcı için faydalı hem de aşağıda anlatacağım AI-ajan optimizasyonu için kritik.

### e) Diğer İlçelere ve Ürün Sayfalarına Çapraz Linkler
"Talas'a yakın diğer bölgeler: Melikgazi, Kocasinan" gibi linkler + "Bu bölgede en çok tercih edilen ürünler: Plise Sineklik, Sürgülü Sineklik" gibi ürün sayfası linkleri.

---

## 4. Schema.org — Yerel SEO'nun Bel Kemiği

Her ilçe sayfasına **`LocalBusiness` (veya `HomeAndConstructionBusiness`) şeması, `areaServed` alanı o ilçeye özel olacak şekilde** eklenmeli:

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Kayseri Sineklik - Edeka Otomatik Kapı Sistemleri",
  "areaServed": {
    "@type": "City",
    "name": "Talas, Kayseri"
  },
  "address": { ... aynı ana adres ... }
}
```

Bu, `areaServed` dışında ana sayfadakiyle birebir aynı olabilir — önemli olan her ilçe sayfasının kendi `areaServed` değerini taşıması. Ayrıca `FAQPage` şeması (bölüm 3.d'deki sorular) ve `BreadcrumbList` şeması da eklenmeli.

---

## 5. Google Tarafında: Klasik Yerel SEO Adımları

Bu sayfalar tek başına yeterli değil, şu üçü birlikte çalışıyor:

1. **Google İşletme Profili** — eğer henüz oluşturmadıysanız (önceki raporlarımızda bunu Acil madde olarak işaretlemiştik), hizmet alanı (service area) kısmına bu ilçeleri tek tek ekleyebiliyorsunuz. Bu, Google Maps'te "yakınımdaki sineklik" aramalarında çıkma şansınızı doğrudan artırıyor.
2. **Google Search Console** — her ilçe sayfası yayınlandığında sitemap'e eklenip "dizine eklenmesini iste" yapılmalı (önceki raporumuzdaki süreçle aynı).
3. **Yerel backlink/dizin kaydı** — Kayseri'ye özgü yerel işletme dizinleri, esnaf odası sayfaları gibi yerlerde firma bilginizin (özellikle ilçe bazlı) geçmesi, Google'a "bu firma gerçekten bu bölgede hizmet veriyor" sinyalini güçlendiriyor.

---

## 6. AI Ajanlarının (ChatGPT, Claude, Gemini, Perplexity) Sizi Önermesi İçin

Bu kısım klasik SEO'dan farklı çalışıyor — AI ajanları "en iyi sıralanan sayfa" değil, "soruyu en doğrudan cevaplayan, en net bilgi" arıyor:

### a) Doğrudan Cevaplanabilir Cümleler
Bir kullanıcı AI'a "Hacılar'da sineklik yaptıran var mı" diye sorduğunda, AI'ın alıntılayacağı malzeme net, sayısal, doğrudan cümleler olmalı:
> "Edeka Kapı, Kayseri Hacılar'da ücretsiz keşif ile sineklik ölçüsü alıp, 1-3 iş günü içinde montaj yapmaktadır."

Bu tarz bir cümle, dolaylı/süslü anlatımdan çok daha kolay alıntılanır.

### b) Her İlçe Sayfasında "Bu Bölgede Hizmet Veriyoruz" Netliği
AI ajanları, bir firmanın belirli bir bölgede gerçekten hizmet verip vermediğini anlamak için sayfanın **açıkça o bölgeden bahsetmesini** arar — sadece URL'de ilçe adı geçmesi yetmez, sayfa metninde de net ifade olmalı.

### c) FAQ Formatı (Tekrar Vurgu)
Önceki raporlarımızda da bahsettiğimiz gibi, soru-cevap formatı AI'ların en kolay işlediği yapı. İlçe sayfalarında bu özellikle değerli, çünkü "X ilçesinde Y hizmeti var mı" tipi sorular son kullanıcıların AI'a sorma ihtimalinin en yüksek olduğu kalıp.

### d) Tutarlı, Çoklu-Kaynak Doğrulama
AI ajanları bir bilgiyi tek kaynaktan değil, birden fazla yerde görüp doğrulayınca daha güvenle aktarır. Bu yüzden:
- Google İşletme Profili'nde hizmet bölgelerinin web sitenizdeki ilçe sayfalarıyla **birebir aynı isimlerle** geçmesi
- Mümkünse yerel dizin/platformlarda da aynı ilçe isimleriyle hizmet bölgesi bilgisi paylaşılması

bu çoklu doğrulamayı güçlendiriyor.

### e) `llms.txt` Dosyasına İlçe Listesi Eklemek
Önceki raporda bahsettiğimiz `llms.txt` dosyasına (AI ajanlarına yönelik kısa özet dosyası), hizmet verdiğiniz ilçelerin düz bir listesini eklemek, bu yeni standardı kullanan ajanlar için ek bir doğrulama kaynağı oluşturuyor.

---

## 7. Hangi Sırayla İlerleyelim (Önerilen Yol Haritası)

### Aşama 1 — İlk 5 Sayfa (Merkez İlçeler)
Talas, Melikgazi, Kocasinan, Hacılar, İncesu sayfalarını yazıp yayınlayın. Her biri benzersiz içerik taşısın (Bölüm 3).

### Aşama 2 — Ölçüm
2-4 hafta sonra Google Search Console'da bu sayfaların hangi aramalarda görünmeye başladığını izleyin. Hangi ilçe daha çok trafik getiriyor, hangi anahtar kelimeler çıkıyor — bu, çevre ilçelere geçerken önceliklendirmeyi netleştirir.

### Aşama 3 — Çevre İlçeler
Develi, Yahyalı, Bünyan gibi daha büyük çevre ilçelerden başlayarak kalan 11 sayfayı sırayla ekleyin.

### Aşama 4 — Google İşletme Profili Senkronizasyonu
Tüm ilçe sayfaları yayında olduğunda, Google İşletme Profili'ndeki hizmet alanlarını bu listeyle birebir eşleştirin.

---

## 8. Cursor'a Verilecek Özet Talimat (Aşama 1 İçin)

```
"bolgeler" klasörü altında, talas-sineklik.html, melikgazi-sineklik.html,
kocasinan-sineklik.html, hacilar-sineklik.html, incesu-sineklik.html
adlarında 5 sayfa oluştur. Her sayfa, sitenin mevcut kart şablonunu
(dikey-plise-sineklik.html'deki yapı) kullanmalı ve şu bölümleri
içermeli: ilçeye özgü açılış paragrafı, hizmet detayları kartı, Google
Maps embed, o ilçeye özgü 3-4 soruluk SSS, diğer ilçe sayfalarına ve
ürün sayfalarına çapraz linkler. Her sayfaya HomeAndConstructionBusiness
şeması (areaServed alanı o ilçeye özel), FAQPage şeması ve BreadcrumbList
şeması ekle. Sayfaları sitemap.xml'e ekle ve header/footer'da "Bölgeler"
veya "Hizmet Bölgelerimiz" başlıklı bir menü/link grubu oluştur.

[İlçeye özgü gerçek içerik metinlerini ben ayrıca vereceğim — şimdilik
yapısal iskeleti kur, içerik placeholder olarak "İLÇE ADI ÖZEL İÇERİK"
şeklinde işaretli kalsın.]
```

Asıl ilçeye özgü metinleri (Bölüm 3.a'daki gerçek detaylarla) ayrı bir adımda, sizinle birlikte yazmamızı öneririm — çünkü bu kısmın değeri, gerçek/doğru yerel bilgiden geliyor.

---

## Özet

Yapı basit: her ilçe için ayrı URL, ayrı (ama benzersiz) içerik, ayrı `areaServed` şeması. Asıl emek, 16 sayfayı bir şablonun kopyası yapmamak — her birine o ilçeye özgü gerçek bir cümle, gerçek bir SSS sorusu eklemek. Bunu yaptığınızda hem Google hem AI ajanları "Hacılar'dan biri sorduğunda" ve "Talas'tan biri sorduğunda" sizi ayrı ayrı, doğru bölgeyle eşleştirerek önerebilir.
