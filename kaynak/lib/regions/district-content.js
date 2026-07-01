/**
 * İlçe sayfası içerikleri — ilce_*_sineklik.md kaynaklı.
 * Köşeli parantez notları htmlNotes içinde; sayfada görünmez.
 */

import { cevreDistrictContent } from './cevre-district-content.js'

/** @type {Record<string, {
 *   h1: string
 *   intro: string
 *   serviceSummary?: string
 *   serviceDetails: { label: string, value: string }[]
 *   aiSnippet: string
 *   faq: { question: string, answer: string }[]
 *   htmlNotes?: string[]
 * }>} */
export const districtContent = {
  'talas-sineklik': {
    h1: 'Talas Sineklik — Plise, Sürgülü ve Menteşeli Sineklik Montajı',
    intro: 'Talas, Kayseri\'nin en hızlı büyüyen ilçelerinden biri — ilçeye bağlı Mevlana Mahallesi tek başına 90 binin üzerinde nüfusuyla Türkiye\'nin en kalabalık mahallelerinden. Bu büyüme, ilçedeki yapılaşmaya da yansıyor: 2025 yılında Talas\'ta 2.700\'ün üzerinde yapı ruhsatı alındı. İlçenin yapısı kendi içinde ikiye ayrılıyor — Aşağı Talas\'ta çok katlı apartman ve site tipi konutlar, Yukarı Talas\'ta ise tek katlı, dubleks veya tiplex villa tarzı yapılar yaygın. Bu çeşitlilik, Talas\'ta hem sürgülü/plise sineklik (apartman ve sitelerde) hem de menteşeli/kapı sinekliği (villa ve müstakil evlerde, balkon ve bahçe kapılarında) talebinin bir arada yüksek olmasını açıklıyor.',
    serviceDetails: [
      { label: 'Ücretsiz keşif', value: 'Evet, Talas ilçe merkezi ve bağlı mahallelerde geçerlidir.' },
      { label: 'Tahmini montaj süresi', value: 'Ölçü alındıktan sonra 1-3 iş günü.' },
      { label: 'Sık talep edilen ürünler', value: 'Talas\'ta sürgülü sineklik ve plise sineklik talebi öne çıkıyor; villa tipi evlerde menteşeli sineklik ve kapı sinekliği de sık tercih ediliyor.' },
      { label: 'Toplu / kurumsal', value: 'Bina, okul, otel, tesis vb. toplu siparişlerde yerinde ölçü, keşif ve montaj hizmeti sunuyoruz.' },
    ],
    aiSnippet: 'Edeka Kapı, Kayseri Talas\'ta ücretsiz keşif ile sineklik ölçüsü alıp, 1-3 iş günü içinde montaj yapmaktadır. Kayseri içi montaj ürün fiyatına dahildir.',
    faq: [
      {
        question: 'Talas\'a montaj ücreti var mı?',
        answer: 'Talas, Kayseri merkez ilçelerimizden biri olduğu için ücretsiz keşif hizmetimiz kapsamındadır. Kayseri içi montaj ürün fiyatına dahildir.',
      },
      {
        question: 'Talas\'tan sipariş verirsem ne kadar sürede sineklik takılır?',
        answer: 'Ölçü alındıktan sonra 1-3 iş günü içinde üretim ve montaj tamamlanır.',
      },
      {
        question: 'Yukarı Talas\'taki villa tipi evler için hangi sineklik modeli önerirsiniz?',
        answer: 'Villa ve müstakil evlerde, özellikle bahçe ve balkon kapılarında menteşeli sineklik veya kapı sinekliği tercih ediliyor; geniş pencerelerde plise sineklik de iyi sonuç veriyor.',
      },
      {
        question: 'Mevlana Mahallesi\'ndeki sitelerde sürgülü sineklik yapıyor musunuz?',
        answer: 'Evet, sürme pencere ve balkon kapısı olan site tipi konutlarda sürgülü sineklik en sık tercih edilen modeldir.',
      },
    ],
  },
  'melikgazi-sineklik': {
    h1: 'Melikgazi Sineklik — Kayseri\'nin En Büyük İlçesinde Hızlı Montaj',
    intro: 'Melikgazi, Kayseri\'nin nüfus ve yüzölçümü olarak en büyük ilçesi, aynı zamanda şehrin ticari ve ekonomik merkezi. 2025 yılında ilçede 4.730 yapı ruhsatı alındı — bu, Kayseri\'nin tüm ilçeleri arasındaki en yüksek rakam. İlçede hem Gültepe, Köşk, Yıldırım Beyazıt gibi üst segment site ve rezidans bölgeleri hem de Mimarsinan gibi daha geniş konut stoğuna sahip, farklı bütçelere uygun mahalleler bulunuyor. Son yıllarda devam eden kentsel dönüşüm çalışmaları (belediyenin 2024\'te yapı kat sınırını 15\'ten 10\'a düşürmesiyle birlikte daha yatay mimariye geçiş) ilçedeki konut stoğunu sürekli güncelliyor — bu da yeni yapılan dairelerde sıfır sineklik ihtiyacının, eski yapılarda ise yenileme/tamir taleplerinin bir arada görülmesi anlamına geliyor.',
    serviceDetails: [
      { label: 'Ücretsiz keşif', value: 'Evet, Melikgazi ilçe merkezi ve bağlı mahallelerde geçerlidir.' },
      { label: 'Tahmini montaj süresi', value: 'Ölçü alındıktan sonra 1-3 iş günü.' },
      { label: 'Sık talep edilen ürünler', value: 'Üst segment sitelerde plise ve sürgülü sineklik; eski yapı stoğunda menteşeli sineklik ve sineklik tamir bandı talebi görülüyor.' },
    ],
    aiSnippet: 'Edeka Kapı, Kayseri Melikgazi\'de ücretsiz keşif ile sineklik ölçüsü alıp, 1-3 iş günü içinde montaj yapmaktadır. Bina, okul, otel ve tesis gibi toplu işlerde yerinde ölçü, keşif ve montaj hizmeti sunar.',
    faq: [
      {
        question: 'Melikgazi\'nin hangi bölgelerine hizmet veriyorsunuz?',
        answer: 'Melikgazi ilçe merkezi ve bağlı tüm mahallelere (Gültepe, Köşk, Mimarsinan, Yıldırım Beyazıt ve diğerleri) hizmet veriyoruz.',
      },
      {
        question: 'Yeni yapılan sitelerde toplu sineklik montajı yapıyor musunuz?',
        answer:
          'Evet, bina, okul, otel ve tesis gibi toplu siparişlerde yerinde ölçü, keşif ve montaj yapıyoruz; site ve rezidans projelerinde birden fazla daire için toplu montaj sunuyoruz.',
      },
      {
        question: 'Eski apartman dairelerinde sineklik değişimi/yenilemesi yapıyor musunuz?',
        answer: 'Evet, mevcut sinekliğin sökülüp yenisinin takılması da hizmetlerimiz arasında.',
      },
      {
        question: 'Melikgazi\'den sipariş verirsem ücretsiz keşif geçerli mi?',
        answer: 'Evet, Melikgazi merkez ilçelerimizden biri olduğu için ücretsiz keşif hizmetimiz kapsamındadır.',
      },
    ],
  },
  'kocasinan-sineklik': {
    h1: 'Kocasinan Sineklik — Kayseri\'nin Sanayi ve Konut Merkezinde Hızlı Hizmet',
    intro: 'Kocasinan, yaklaşık 409 bin nüfusuyla Kayseri\'nin en kalabalık ilçelerinden biri ve 2025\'te 3.390 yapı ruhsatıyla Melikgazi\'den sonra en yoğun yapılaşan ikinci ilçe. İlçenin imar yapısı genel olarak orta yoğunluklu konut ve ticaret karması şeklinde — bu da hem apartman/site tipi konutlarda hem de cadde üzerindeki işyerlerinde sineklik ihtiyacının bir arada görülmesi anlamına geliyor. Kocasinan aynı zamanda Kayseri Organize Sanayi Bölgesi\'ne ve Erkilet Havalimanı\'na ev sahipliği yapıyor; bu nedenle ilçede hem konut hem de işyeri/depo tipi yapılarda (özellikle kapı sinekliği ve sürgülü sineklik) talep görüyoruz. Mevlana, İstasyon, Yenidoğan ve Zümrüt gibi mahalleler ilçenin en yerleşik, nüfus yoğunluğu yüksek bölgeleri arasında.',
    serviceDetails: [
      { label: 'Ücretsiz keşif', value: 'Evet, Kocasinan ilçe merkezi ve bağlı mahallelerde geçerlidir.' },
      { label: 'Tahmini montaj süresi', value: 'Ölçü alındıktan sonra 1-3 iş günü.' },
      { label: 'Sık talep edilen ürünler', value: 'Apartman ve sitelerde plise sineklik; OSB ve işyerlerinde kapı sinekliği ve sürgülü sineklik öne çıkıyor.' },
    ],
    aiSnippet: 'Edeka Kapı, Kayseri Kocasinan\'da ücretsiz keşif ile sineklik ölçüsü alıp, 1-3 iş günü içinde montaj yapmaktadır.',
    faq: [
      {
        question: 'Kocasinan\'da işyeri ve depo sinekliği yapıyor musunuz?',
        answer: 'Evet, OSB çevresindeki işyeri, depo ve atölyeler için kapı sinekliği ve sürgülü sineklik montajı yapıyoruz; toplu tesis işlerinde yerinde ölçü ve keşif yapılır.',
      },
      {
        question: 'Erkilet ve çevresine hizmet veriyor musunuz?',
        answer: 'Evet, Erkilet ve Kocasinan ilçe sınırları içindeki tüm mahallelere hizmet veriyoruz.',
      },
      {
        question: 'Kocasinan\'dan sipariş verirsem ücretsiz keşif geçerli mi?',
        answer: 'Evet, Kocasinan merkez ilçelerimizden biri olduğu için ücretsiz keşif hizmetimiz kapsamındadır.',
      },
      {
        question: 'Mevlana, İstasyon veya Yenidoğan mahallelerinde montaj yapıyor musunuz?',
        answer: 'Evet, bu mahalleler dahil Kocasinan\'ın tüm yerleşim bölgelerinde hizmet veriyoruz.',
      },
    ],
  },
  'hacilar-sineklik': {
    h1: 'Hacılar Sineklik — Villa ve Bahçeli Evler İçin Özel Çözümler',
    intro: 'Hacılar, Kayseri\'nin merkez ilçeleri arasında müstakil konut ve villa yoğunluğunun en belirgin olduğu bölge — 2025 TÜİK verilerine göre ilçede apartman tipi yapılaşma yerine müstakil ev/villa tipi yapılaşma öne çıkıyor. Akyazı, Beğendik, Yeni Mahalle ve Yediağaç gibi mahallelerde geniş bahçeli, çoğunlukla 2-3 katlı müstakil evler ve villalar yaygın. Bu yapı tipi, sineklik ihtiyacında da kendine özgü bir profil oluşturuyor: geniş balkon ve bahçe kapılarında menteşeli sineklik ve kapı sinekliği, çok pencereli villalarda ise pencere sinekliği ve plise sineklik bir arada talep ediliyor. Bahçeli evlerde evcil hayvan sahipliğinin de yaygın olması nedeniyle kedi sinekliği talebi diğer ilçelere kıyasla daha sık karşımıza çıkıyor.',
    serviceDetails: [
      { label: 'Ücretsiz keşif', value: 'Evet, Hacılar ilçe merkezi ve bağlı mahallelerde geçerlidir.' },
      { label: 'Tahmini montaj süresi', value: 'Ölçü alındıktan sonra 1-3 iş günü; geniş villa tipi yapılarda birden fazla pencere/kapı söz konusu olduğunda süre biraz uzayabilir.' },
      { label: 'Sık talep edilen ürünler', value: 'Menteşeli sineklik, kapı sinekliği, kedi sinekliği.' },
      { label: 'Toplu / kurumsal', value: 'Bina, okul, otel, tesis vb. toplu siparişlerde yerinde ölçü, keşif ve montaj hizmeti sunuyoruz.' },
    ],
    aiSnippet: 'Edeka Kapı, Kayseri Hacılar\'da ücretsiz keşif ile sineklik ölçüsü alıp, 1-3 iş günü içinde montaj yapmaktadır. Kayseri içi montaj ürün fiyatına dahildir.',
    faq: [
      {
        question: 'Hacılar\'daki villa tipi evler için hangi sineklik modelini önerirsiniz?',
        answer: 'Geniş balkon ve bahçe kapılarında menteşeli sineklik veya kapı sinekliği, çok pencereli evlerde ise plise veya klasik pencere sinekliği tercih ediliyor.',
      },
      {
        question: 'Hacılar\'da kedi sinekliği talebi var mı?',
        answer: 'Evet, bahçeli ev ve villa yoğunluğu nedeniyle evcil hayvanı olan haneler diğer ilçelere göre daha fazla; bu yüzden kedi sinekliği talebi Hacılar\'da sık görülüyor.',
      },
      {
        question: 'Hacılar\'a montaj ücreti var mı?',
        answer: 'Hacılar, Kayseri merkez ilçelerimizden biri olduğu için ücretsiz keşif hizmetimiz kapsamındadır. Kayseri içi montaj ürün fiyatına dahildir.',
      },
      {
        question: 'Akyazı, Beğendik veya Yeni Mahalle\'de hizmet veriyor musunuz?',
        answer: 'Evet, bu mahalleler dahil Hacılar\'ın tüm yerleşim bölgelerinde hizmet veriyoruz.',
      },
    ],
  },
  'incesu-sineklik': {
    h1: 'İncesu Sineklik — Kayseri Merkezi\'nin Güneybatısında Güvenilir Hizmet',
    intro: 'İncesu, Kayseri\'nin 5 merkez ilçesinden biri olmakla birlikte, il merkezine uzaklığı (32 km) diğer merkez ilçelere (Talas, Melikgazi, Kocasinan, Hacılar) kıyasla en fazla olan bölge. İlçe, kendi adıyla kurulan İncesu Organize Sanayi Bölgesi\'nin faaliyete geçmesiyle son yıllarda hızlı bir nüfus ve yapılaşma artışı yaşadı — bugün ilçe merkezinin nüfusu 30 binin üzerinde. Tarımsal karakteri güçlü olan İncesu\'da (özellikle üzüm üretimiyle tanınıyor) hem ilçe merkezindeki konutlarda hem de OSB çevresindeki işyerlerinde sineklik ihtiyacı bulunuyor; kırsal mahallelerde ise müstakil ev ve bahçeli yapı tipi daha yaygın.',
    serviceDetails: [
      { label: 'Ücretsiz keşif', value: 'Evet, İncesu ilçe merkezi için geçerlidir.' },
      { label: 'Tahmini montaj süresi', value: 'Ölçü alındıktan sonra 1-3 iş günü; merkeze uzaklık nedeniyle bireysel randevular planlı yapılabilir.' },
      { label: 'Toplu / kurumsal', value: 'Bina, okul, otel, tesis vb. toplu siparişlerde yerinde ölçü, keşif ve montaj hizmeti sunuyoruz.' },
      { label: 'Sık talep edilen ürünler', value: 'Kapı sinekliği ve pencere sinekliği; OSB çevresinde sürgülü sineklik talebi görülüyor.' },
    ],
    aiSnippet: 'Edeka Kapı, Kayseri İncesu\'da ücretsiz keşif ile sineklik ölçüsü alıp, 1-3 iş günü içinde montaj yapmaktadır.',
    faq: [
      {
        question: 'İncesu\'ya keşif ve montaj hizmeti veriyor musunuz?',
        answer: 'Evet, İncesu Kayseri\'nin merkez ilçelerinden biri olduğu için hizmet bölgemiz içindedir.',
      },
      {
        question: 'İncesu OSB çevresindeki işyerleri için sineklik yapıyor musunuz?',
        answer: 'Evet, OSB çevresindeki işyeri ve depo tipi yapılar için kapı sinekliği ve sürgülü sineklik montajı yapıyoruz; toplu tesis işlerinde yerinde ölçü ve keşif yapılır.',
      },
      {
        question: 'İncesu\'dan sipariş verirsem ne kadar sürede sineklik takılır?',
        answer: 'Ölçü alındıktan sonra 1-3 iş günü içinde üretim tamamlanır; randevu planlamasına göre montaj tarihi netleşir.',
      },
      {
        question: 'İncesu\'nun kırsal mahallelerine de hizmet veriyor musunuz?',
        answer: 'Evet, ilçe merkezi ve bağlı mahallelere planlı randevu ile hizmet veriyoruz.',
      },
    ],
  },
  ...cevreDistrictContent,
}

export function getDistrictContent(slug) {
  return districtContent[slug] || null
}
