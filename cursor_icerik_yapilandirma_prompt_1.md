# Cursor Prompt — Ürün Açıklamalarını Yapılandırılmış Bölümlere Dönüştürme

Aşağıdaki metni Cursor'un chat'ine (Cmd/Ctrl+L) yapıştırın. `urun_aciklama_metinleri.md` dosyasını da projeye sürükleyip context'e ekleyin ki Cursor gerçek metinlere erişsin.

---

## PROMPT (kopyala-yapıştır)

```
Elimde `urun_aciklama_metinleri.md` dosyasında 8 sineklik ürünü için yazılmış,
her biri ~500-570 kelimelik düz metin açıklamalar var. Bu metinleri,
projenin 8 ürün sayfasına (urunler/dikey-plise-sineklik.html,
urunler/duble-plise-sineklik.html, urunler/yatay-plise-sineklik.html,
urunler/menteseli-sineklik.html, urunler/kapi-sinekligi.html,
urunler/pencere-sinekligi.html, urunler/kedi-sinekligi.html,
urunler/surgulu-sineklik.html) eklemek istiyorum, ama düz paragraf bloğu
olarak değil — sitenin tasarım diline uygun, görsel olarak bölümlenmiş bir
yapı olarak.

Her metin zaten şu mantıksal sırayla yazıldı, bu yapıyı koru ve her bölüme
bir alt başlık ver:

1. "Nasıl Çalışır?" — ürünün çalışma mantığını anlatan ilk 1-2 paragraf
2. "Nerelerde Kullanılır?" — kullanım alanları/senaryoları anlatan paragraf(lar)
3. "Malzeme ve Yapı" — alüminyum kasa, tül/file, ray/menteşe gibi üretim
   detaylarını anlatan paragraf
4. "Renk ve Seçenekler" — renk veya açılım yönü seçeneklerini anlatan
   kısa paragraf
5. "Bakım Önerileri" — temizlik/bakım tavsiyelerini anlatan paragraf
6. "Fiyat Hakkında" — fiyatlandırma mantığını/konumlandırmasını anlatan
   kısa paragraf

Her ürün sayfasında bu 6 başlığı uygulayacaksın. Yapısal ve görsel
gereksinimler:

- Her bölüm başlığı `<h2>` veya `<h3>` (sayfanın mevcut H1/H2 hiyerarşisine
  göre sen karar ver — sayfada zaten bir H1 var, o yüzden bu başlıklar H2
  veya H3 olmalı) olarak işaretlenmeli.
- Mevcut paragraf metnini olduğu gibi koru, kelimesi kelimesine değiştirme
  veya kısaltma — sadece bölümler halinde organize et ve görsel olarak
  zenginleştir.
- Sitenin tasarım diline uygun (Tailwind class'ları, kart/border stilleri
  zaten kullanılıyor — bunlarla tutarlı kal) her bölüme uygun bir ikon
  ekle (lucide ikonları kullanılıyorsa onunla tutarlı git, yoksa basit
  inline SVG kullan). Örneğin "Nasıl Çalışır?" için bir hareket/mekanizma
  ikonu, "Bakım Önerileri" için bir temizlik/bakım ikonu gibi anlamlı
  eşleşmeler seç.
- "Nerelerde Kullanılır?" bölümünü, paragraf yerine küçük kartlar/etiketler
  (chip/badge) halinde göster — metindeki kullanım senaryolarını
  (örn. "Mutfak Pencereleri", "Yazlık Evler", "Balkon Kapıları" gibi)
  kısa başlıklara çıkarıp, her birini bir kart içinde, altında 1 cümlelik
  açıklamayla sun. Kart sayısı metinde geçen senaryo sayısına göre
  3-4 olabilir.
- "Malzeme ve Yapı" bölümünde, metinde geçen somut teknik terimleri
  (alüminyum kasa, dayanıklı tül, paslanmaz menteşe vb.) **bold**
  (`<strong>`) ile vurgula — bütün cümleyi değil, sadece o teknik terimi.
- "Renk ve Seçenekler" bölümünde, mevcut hesaplayıcıdaki renk/yön
  seçenekleriyle görsel bir bağ kur (örnek: küçük renk noktaları/swatch
  gösterimi, sayfadaki hesaplayıcının select elementindeki seçeneklerle
  aynı isimleri kullan).
- "Bakım Önerileri" bölümünü maddeler halinde (bullet list, 2-4 madde)
  düzenle — metindeki bakım tavsiyelerini cümlelerden maddelere çıkar.
- "Fiyat Hakkında" bölümünü, sayfadaki mevcut fiyat hesaplayıcı kutusunun
  hemen üstüne veya altına, ona görsel olarak yakın bir konuma yerleştir
  — çünkü bu bölüm okuyucuyu doğal olarak hesaplayıcıya yönlendiriyor.
- Tüm bu yeni içerik bloğunu, sayfadaki mevcut kısa açıklamanın
  (üstteki 4 madde işaretli kısa özet) ALTINA ekle, üstüne yazma veya
  onu silme.
- Üretici firma SITE_CONFIG'teki pricePerM2 ve minPrice değerlerini
  "Fiyat Hakkında" bölümünde, düz metin olarak da göster (örn:
  "Bu modelde m² fiyatımız {pricePerM2} TL + KDV, minimum sipariş
  bedeli {minPrice} TL + KDV'dir.") — bu hem kullanıcı hem arama
  motorları için fiyatın HTML içinde okunabilir olmasını sağlıyor,
  sadece JavaScript objesinde kalmasın.
- Mobilde de düzgün görünmesi için kartları/ikonları responsive
  (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gibi) yap.

Önce dikey-plise-sineklik.html üzerinde bu yapıyı uygula, bana göster,
onaylarsam aynı şablonu diğer 7 sayfaya da uygula.
```

---

## Neden Bu Yapı?

- **SEO açısından:** Google, başlıklarla bölünmüş, madde işaretli içeriği düz paragraf yığınından daha kolay "anlıyor" ve "People Also Ask" / öne çıkan snippet kutularına çıkma ihtimali artıyor.
- **AI ajanları açısından:** Bir AI ajanı "kedi sinekliği nerede kullanılır" diye sorduğunda, kart/başlık yapısı sayesinde doğrudan o bölümü bulup alıntılayabilir — düz paragrafta aranan bilgiyi bulmak daha zor.
- **Kullanıcı deneyimi açısından:** 500+ kelimelik düz metin bloğu, mobilde özellikle, okunması zor ve sıkıcı görünür. Başlık + kart + bold yapısı, kullanıcının metni "taraması"nı (scan etmesini) kolaylaştırır — çoğu kullanıcı zaten tüm metni okumaz, ilgilendiği bölüme gözüyle atlar.
- **"Fiyat Hakkında" metnini hesaplayıcıya yakın koymak:** Kullanıcı fiyat mantığını okuduktan hemen sonra hesaplayıcıyı görüp kendi ölçüsünü girme isteği duyar — bu doğal bir akış/CTA köprüsü oluşturur.

## Cursor Çalışırken Dikkat Edilecekler

- Cursor bazen "iyileştirme" yaparken metni kısaltma veya yeniden yazma eğiliminde olabilir — eğer bunu yaparsa, "metni kelimesi kelimesine koru, sadece yapısal olarak böl" talimatını tekrarlayın.
- İlk sayfada (dikey-plise-sineklik.html) çıkan sonucu onaylamadan diğer 7 sayfaya geçmesini istemeyin — tasarım dilini bir sayfada netleştirip sonra "şablonu diğerlerine uygula" demek, 8 sayfada birbirinden tutarsız bir görsel dil oluşmasını önler.
- Schema.org (Product, BreadcrumbList) eklemesini bu işlemle aynı anda istemeyin — onu ayrı bir adım olarak yapın, böylece her adımı ayrı ayrı test edip onaylayabilirsiniz.
