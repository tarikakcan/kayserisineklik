import olcuBlocks from './blog-content/sineklik-olcusu-nasil-alinir.js'
import yirtikBlocks, { yirtikDelikTamiriFaq } from './blog-content/sineklik-yirtik-delik-tamiri.js'

import sivrisinekBlocks, { sivrisinekleBasEtmeFaq } from './blog-content/sivrisinekle-bas-etme-7-yol.js'

export const blogPosts = [
  {
    slug: 'sineklik-cesitleri-nelerdir',
    title: 'Sineklik Çeşitleri Nelerdir? Hangi Modeli Seçmelisiniz?',
    description: 'Plise, menteşeli, sürgülü, kedi ve pencere sineklikleri arasındaki farkları öğrenin ve eviniz için en uygun olanı seçin.',
    date: '2025-05-10',
    readTime: '6 dk',
    cover: '/assets/products/duble-plise-sineklik.webp',
    content: [
      { h: 'Plise Sineklik Nedir?', p: 'Plise sineklikler, akordeon gibi katlanan özel bir kumaş ile çalışır. Hem dikey hem yatay modelleri mevcuttur. Yer kaplamadan estetik bir görünüm sağlar ve pencere/kapı kullanımını engellemez.' },
      { h: 'Menteşeli Sineklik', p: 'Klasik bir kapı gibi açılıp kapanır. Mıknatıslı kilit mekanizması sayesinde elle kapatmaya gerek kalmaz. Ekonomik ve dayanıklıdır.' },
      { h: 'Sürgülü Sineklik', p: 'Ray üzerinde yana kayan sürgülü modeller, özellikle sürgülü PVC pencerelerde tercih edilir. Sessiz çalışır, yer kaplamaz.' },
      { h: 'Kedi Sinekliği', p: 'Evcil hayvan sahipleri için özel olarak üretilmiştir. Güçlendirilmiş polyester teli kedi pençe ve dişlerine karşı dayanıklıdır.' },
      { h: 'Hangisini Seçmeliyim?', p: 'Eğer pencerelerinizde modern ve estetik bir çözüm istiyorsanız plise sineklik; ekonomik bir seçenek arıyorsanız menteşeli sineklik; kedi/köpek sahibiyseniz mutlaka kedi sinekliği tercih etmenizi öneririz.' }
    ]
  },
  {
    slug: 'plise-sineklik-avantajlari',
    title: 'Plise Sineklik Avantajları: Neden Tercih Edilmeli?',
    description: 'Plise sinekliklerin estetik, dayanıklılık ve kullanım kolaylığı açısından sunduğu avantajları detaylıca inceledik.',
    date: '2025-05-18',
    readTime: '5 dk',
    cover: '/assets/products/dikey-plise-sineklik.webp',
    content: [
      { h: 'Estetik Görünüm', p: 'Plise sineklikler, ince kasaları ve katlanabilir kumaşları sayesinde pencerenizin görüntüsünü bozmaz. Kullanılmadığında neredeyse görünmezdir.' },
      { h: 'Yer Tasarrufu', p: 'Pencere veya kapı önünde alan kaplamazlar. Açılıp kapanmaları için ekstra boşluk gerekmez.' },
      { h: 'Uzun Ömür', p: 'Alüminyum kasa ve fiberglas plise kumaş yıllarca formunu kaybetmez. Bakım gerektirmez.' },
      { h: 'Geniş Açıklıklara Uygun', p: 'Duble plise modeller 3 metreye kadar açıklıklarda tek parça olarak uygulanabilir.' }
    ]
  },
  {
    slug: 'sineklik-olcusu-nasil-alinir',
    title: 'Sineklik Ölçüsü Nasıl Alınır? Adım Adım Rehber',
    description: 'Pencere ve kapı sinekliği ölçüsünü contadan contaya nasıl alacağınızı, kasa payını ve sık yapılan hataları adım adım anlatıyoruz.',
    date: '2025-05-25',
    readTime: '12 dk',
    cover: '/assets/blog/sineklik-olcusu-nasil-alinir.webp',
    blocks: olcuBlocks,
  },
  {
    slug: 'kedi-sinekligi-neden-onemli',
    title: 'Kedi Sinekliği Neden Önemli? Evcil Hayvan Güvenliği',
    description: 'Kedi sahipleri için sıradan sinekliklerin yetersiz kaldığı durumlar ve özel kedi sinekliği çözümleri.',
    date: '2025-06-01',
    readTime: '5 dk',
    cover: 'https://images.pexels.com/photos/33447584/pexels-photo-33447584.jpeg',
    content: [
      { h: 'Klasik Tellerin Zayıflığı', p: 'Standart fiberglas sineklik telleri, kedilerin pençeleri ve dişleriyle çok kolay yırtılabilir. Bu da hem evcil hayvanınızın düşme tehlikesi yaşamasına hem sineklerin içeri girmesine sebep olur.' },
      { h: 'Polyester Kaplı Tel', p: 'Kedi sinekliklerinde kullanılan polyester kaplı tel, standart telden 7 kat daha dayanıklıdır. Pençe ve ısırığa karşı yüksek dirençlidir.' },
      { h: 'Yüksek Kat Daireler İçin Hayati', p: 'Özellikle apartman dairelerinde balkon ve pencerelerde mutlaka kedi sinekliği kullanılmalıdır.' },
      { h: 'Hem Kedinizi Hem Evinizi Koruyun', p: 'Edeka Kapı kedi sineklikleri ile hem evcil dostunuz güvende olur hem de eviniz sineklerden korunur.' }
    ]
  },
  {
    slug: 'sineklik-bakimi-ve-temizligi',
    title: 'Sineklik Bakımı ve Temizliği: Uzun Ömür İçin İpuçları',
    description: 'Sinekliğinizin yıllarca ilk günkü gibi kalması için bakım ve temizlik önerileri.',
    date: '2025-06-08',
    readTime: '4 dk',
    cover: '/assets/products/yatay-plise-sineklik.webp',
    content: [
      { h: 'Düzenli Tozdan Arındırma', p: 'Ayda bir kez kuru bir bezle veya elektrikli süpürge fırça başlığıyla sinekliğinizi tozdan arındırın.' },
      { h: 'Sezon Başı Yıkama', p: 'Yaz sezonu başlamadan ılık sabunlu su ve yumuşak bir fırça ile teli yıkayın. Sonra durulayın ve kuruyana kadar açık bırakın.' },
      { h: 'Ray ve Menteşelere Yağlama', p: 'Sürgülü ve plise modellerde rayları yılda bir kez ince makine yağıyla yağlayarak akıcı çalışmasını sağlayın.' },
      { h: 'Yumuşak Kullanım', p: 'Plise modelleri çok hızlı çekmemeye ve kapağı sertçe kapatmamaya özen gösterin.' }
    ]
  },
  {
    slug: 'sineklik-yirtik-delik-tamiri',
    title: 'Sineklik Yırtık ve Delik Tamiri Nasıl Yapılır?',
    pageTitle: 'Sineklik Yırtık ve Delik Tamiri Nasıl Yapılır? | Kayseri Sineklik',
    description: 'Sinekliğinizdeki yırtık ve delikleri evde nasıl onarabileceğinizi adım adım anlatıyoruz.',
    date: '2026-06-28',
    readTime: '8 dk',
    cover: '/assets/blog/sineklik-yirtik-delik-tamiri.webp',
    blocks: yirtikBlocks,
    faq: yirtikDelikTamiriFaq,
  },
  {
    slug: 'sivrisinekle-bas-etme-7-yol',
    title: 'Sivrisinekle Baş Etme: 7 Etkili Mücadele Yolu',
    pageTitle: 'Sivrisinekle Baş Etme: 7 Etkili Mücadele Yolu | Kayseri Sineklik',
    description: 'Sivrisinekle baş etmenin yolları nelerdir? Sineklik, kaynakta mücadele ve profesyonel ilaçlama dahil 7 etkili yöntemi Kayseri için derledik.',
    date: '2026-06-30',
    readTime: '9 dk',
    cover: '/assets/blog/sivrisinekle-bas-etme-7-yol.webp',
    blocks: sivrisinekBlocks,
    faq: sivrisinekleBasEtmeFaq,
  },
];

export const getBlogPost = (slug) => blogPosts.find(p => p.slug === slug);
