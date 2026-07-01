/**
 * Çevre ilçe sayfa içerikleri — kargo (bireysel) + toplu işlerde yerinde montaj.
 */

const URETIM_KARGO =
  'Üretim süresi 1-3 iş günü; kargo teslimatı bölgeye göre genellikle 2-5 iş günü eklenir.'
const OLCU_SUREC =
  'Bireysel siparişlerde ölçü rehberimiz ve WhatsApp desteği yeterlidir; fotoğraf göndererek ölçünüzü birlikte netleştiririz.'
const TOPLU_IS =
  'Bina, okul, otel, tesis vb. toplu siparişlerde yerinde ölçü, keşif ve montaj hizmeti sunuyoruz.'
const OLCU_CEVAP =
  'Ölçü rehberimizi takip edebilir, emin olmadığınız noktalarda WhatsApp\'tan fotoğraf gönderip destek alabilirsiniz. Toplu işlerde ekibimiz yerinde ölçü ve keşif yapar.'
const TESLIM_CEVAP =
  'Üretim 1-3 iş günü sürer, kargo süresi bölgeye göre ek olarak eklenir.'
const TOPLU_CEVAP =
  'Evet, bina, okul, otel ve tesis gibi toplu siparişlerde ilgili ilçede yerinde ölçü, keşif ve montaj yapıyoruz.'

function kargoCevap(nameIn) {
  return `Evet, ${nameIn} bireysel siparişlerde güvenli kargo ile gönderim yapıyoruz. Bina, okul, otel ve tesis gibi toplu siparişlerde yerinde ölçü, keşif ve montaj hizmetimiz vardır.`
}

function cevreService(bolge) {
  return [
    { label: 'Hizmet bölgesi', value: bolge },
    { label: 'Tahmini süre', value: URETIM_KARGO },
    { label: 'Ölçü süreci', value: OLCU_SUREC },
    { label: 'Toplu / kurumsal', value: TOPLU_IS },
  ]
}

function aiSnippet(nameIn) {
  return `Edeka Kapı, Kayseri ${nameIn} bireysel siparişlerde ölçüye özel sineklik üretip güvenli kargo ile göndermektedir; bina, okul, otel ve tesis gibi toplu işlerde yerinde montaj hizmeti sunar.`
}

export const cevreDistrictContent = {
  'develi-sineklik': {
    h1: 'Develi Sineklik — Kayseri\'nin Güneydoğusunda Güvenilir Hizmet',
    intro: 'Develi, Kayseri\'nin çevre ilçeleri arasında nüfus ve yapılaşma açısından en büyüğü — yaklaşık 67.800 nüfusuyla şehrin sınırları dışındaki en kalabalık yerleşim. 2025 yılında 952 yapı ruhsatı ile çevre ilçeler arasında en yüksek yapılaşma oranına sahip oldu; bu ruhsatların çoğu apartman tipi yapılara ait. Develi ekonomisi büyük ölçüde tarım ve hayvancılığa dayanıyor, ilçede ayrıca halı üretimi yapan fabrikalar ve küçük sanayi siteleri de bulunuyor. Bu çeşitlilik, hem apartman dairelerinde hem de tarımsal işletmelerin bulunduğu kırsal mahallelerdeki müstakil evlerde sineklik ihtiyacının bir arada görülmesi anlamına geliyor.',
    serviceDetails: cevreService('Develi ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Develi\'ye'),
    faq: [
      { question: 'Develi\'ye sineklik gönderiyor musunuz?', answer: kargoCevap('Develi\'ye') },
      {
        question: 'Develi\'deki apartman daireleri için hangi sineklik modelini önerirsiniz?',
        answer:
          'Apartman tipi konutlarda pencere sinekliği, sürgülü sineklik ve plise sineklik en sık tercih edilen modeller arasında.',
      },
      {
        question: 'Develi\'nin kırsal mahallelerindeki müstakil evler için ne öneriyorsunuz?',
        answer: 'Bahçeli müstakil evlerde menteşeli sineklik ve kapı sinekliği daha pratik bir çözüm sunuyor.',
      },
      {
        question: 'Develi\'ye montaj/teslimat ne kadar sürer?',
        answer:
          'Bireysel siparişlerde ölçü WhatsApp ve rehberimizle onaylandıktan sonra üretim 1-3 iş günü sürer; kargo ile teslimat genellikle 2-5 iş günü içinde tamamlanır. Toplu işlerde süre yerinde keşif sonrası planlanır.',
      },
    ],
  },
  'yahyali-sineklik': {
    h1: 'Yahyalı Sineklik — Kayseri\'nin En Güneyinde Kaliteli Hizmet',
    intro: 'Yahyalı, Kayseri\'nin en güneyinde, Aladağlar\'ın eteklerinde, bir vadi boyunca 8 kilometreye yayılan bir ilçe. Bölge Kapuzbaşı Şelaleleri ve Yedigöller gibi doğa turizmi noktalarıyla tanınıyor, aynı zamanda yüzyıllardır süren geleneksel el halıcılığı kültürüne ev sahipliği yapıyor. İlçenin vadi içindeki uzun-dar yerleşim yapısı, evlerin çoğunlukla bahçeli ve müstakil olmasıyla birleşiyor; bu da pencere ve kapı sinekliği ihtiyacının ilçede yaygın olmasını açıklıyor. Yahyalı\'nın Kayseri-Adana karayolundan 31 km içeride, nispeten merkeze uzak bir konumda olması, hizmet planlamasında dikkat edilmesi gereken bir detay.',
    serviceDetails: cevreService('Yahyalı ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Yahyalı\'ya'),
    faq: [
      { question: 'Yahyalı\'ya sineklik gönderiyor musunuz?', answer: kargoCevap('Yahyalı\'ya') },
      { question: 'Yahyalı\'da ölçümü nasıl alabilirim?', answer: OLCU_CEVAP },
      {
        question: 'Yahyalı\'daki müstakil ve bahçeli evler için hangi modeli önerirsiniz?',
        answer:
          'Bahçe ve balkon kapılarında menteşeli sineklik veya kapı sinekliği, pencerelerde klasik pencere sinekliği veya plise sineklik tercih ediliyor.',
      },
      { question: 'Yahyalı\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'bunyan-sineklik': {
    h1: 'Bünyan Sineklik — Geleneksel Dokumanın Memleketinde Modern Çözümler',
    intro: 'Bünyan, adıyla özdeşleşen geleneksel el halıcılığı kültürüyle tanınan, Kayseri merkezine yaklaşık 40 km uzaklıkta bir ilçe. İlçe ekonomisi tarım, hayvancılık ve mevsimlik inşaat işçiliğine dayanıyor; organize sanayi bölgesi bulunmuyor. Konut yapısında da bu geleneksel karakter görülüyor — eski konutlar genellikle bitişik nizam ve toprak örtülü çatılarla inşa edilmiş, yeni yapılan binalar ise betonarme ve çatılı. Bu karma yapı, Bünyan\'da hem eski tip evlerde sineklik yenileme/montaj ihtiyacının hem de yeni yapılan konutlarda sıfır sineklik talebinin bir arada görülmesi anlamına geliyor.',
    serviceDetails: cevreService('Bünyan ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Bünyan\'a'),
    faq: [
      { question: 'Bünyan\'a sineklik gönderiyor musunuz?', answer: kargoCevap('Bünyan\'a') },
      {
        question: 'Bünyan\'daki eski konutlar için sineklik montajı yapılabilir mi?',
        answer:
          'Evet, bitişik nizam ve geleneksel yapılı evlerde de pencere ölçüsüne uygun sineklik üretimi yapıyoruz; bireysel siparişlerde kargo ile gönderim, toplu işlerde yerinde montaj sunulur.',
      },
      {
        question: 'Yeni yapılan binalarda toplu sineklik siparişi alıyor musunuz?',
        answer:
          'Evet, bina ve site tipi toplu siparişlerde yerinde ölçü, keşif ve montaj yapıyoruz; birden fazla pencere/kapı siparişini bir arada değerlendirebiliyoruz.',
      },
      { question: 'Bünyan\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'tomarza-sineklik': {
    h1: 'Tomarza Sineklik — Tarımın Kalbinde Güvenilir Hizmet',
    intro: 'Tomarza, Türkiye\'nin çekirdeklik kabak üretiminin önemli merkezlerinden biri — Kayseri ilinin bu üründeki payının dörtte biri Tomarza\'dan geliyor. İlçe ekonomisi büyük ölçüde tarım ve hayvancılığa dayanıyor; kabağın yanı sıra patates üretimi ve küçük-büyükbaş hayvancılık da önemli geçim kaynakları arasında. Kayseri merkezine yaklaşık 55 km uzaklıktaki bu tarım odaklı ilçede, geniş bahçeli ve müstakil ev tipi yapılaşma yaygın — bu da pencere ve kapı sinekliğinin günlük yaşamda önemli bir ihtiyaç olmasını açıklıyor, özellikle tarım ürünlerinin depolandığı veya işlendiği yapılarda haşere kontrolü ayrıca önem taşıyor.',
    serviceDetails: cevreService('Tomarza ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Tomarza\'ya'),
    faq: [
      { question: 'Tomarza\'ya sineklik gönderiyor musunuz?', answer: kargoCevap('Tomarza\'ya') },
      {
        question: 'Tomarza\'daki tarım işletmeleri veya depolar için sineklik yapıyor musunuz?',
        answer:
          'Evet, kapı sinekliği ve sürgülü sineklik depo ve işlik tipi yapılarda kullanılabiliyor; tesis ve toplu siparişlerde yerinde ölçü, keşif ve montaj yapıyoruz.',
      },
      {
        question: 'Tomarza\'daki müstakil evler için hangi modeli önerirsiniz?',
        answer: 'Bahçe ve balkon kapılarında menteşeli sineklik, pencerelerde klasik pencere sinekliği tercih ediliyor.',
      },
      { question: 'Tomarza\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'pinarbasi-sineklik': {
    h1: 'Pınarbaşı Sineklik — Kayseri\'nin En Geniş İlçesinde Hizmet',
    intro: 'Pınarbaşı, yüzölçümü açısından Türkiye\'nin beşinci büyük ilçesi ve Kayseri merkezine yaklaşık 89 km uzaklıkta — ilin en uzak ilçelerinden biri. Uzunyayla platosu üzerinde kurulu bu geniş bölgede ekonomi tarım, hayvancılık, alabalık yetiştiriciliği ve madencilik üzerine kurulu. İlçenin geniş ve dağınık yerleşim yapısı (merkez dışında çok sayıda köy ve kasaba) nedeniyle, sineklik hizmetinde lojistik planlama özellikle önem taşıyor — bu kadar uzak bir bölgede doğru ölçü bilgisinin ilk seferde net alınması, gidiş-geliş kaynaklı zaman kaybını önlüyor.',
    serviceDetails: cevreService('Pınarbaşı ilçe merkezi ve bağlı köy/kasabalar.'),
    aiSnippet: aiSnippet('Pınarbaşı\'na'),
    faq: [
      {
        question: 'Pınarbaşı\'na bu kadar uzak bir bölgeye sineklik gönderiyor musunuz?',
        answer: kargoCevap('Pınarbaşı\'na'),
      },
      { question: 'Pınarbaşı\'da kendi ölçümü nasıl doğru alabilirim?', answer: OLCU_CEVAP },
      {
        question: 'Pınarbaşı\'nın köylerine de gönderim yapıyor musunuz?',
        answer:
          'Evet, Pınarbaşı ilçe merkezi ve bağlı köylere bireysel siparişlerde kargo ile gönderim yapıyoruz. Toplu işlerde yerinde hizmet planlanır.',
      },
      {
        question: 'Pınarbaşı\'dan sipariş verirsem ne kadar sürede elime ulaşır?',
        answer: 'Üretim 1-3 iş günü sürer, kargo süresi bu bölge için biraz daha uzun olabilir.',
      },
    ],
  },
  'sarioglan-sineklik': {
    h1: 'Sarıoğlan Sineklik — Kızılırmak Kıyısında Güvenilir Hizmet',
    intro: 'Sarıoğlan, Kayseri\'nin kuzeyinde, Kızılırmak Nehri kıyısında kurulu bir ilçe. Ekonomisi tarım ve hayvancılığa dayanıyor, ilçenin geniş tarım arazileri ve çayır-mera alanları bölgenin kırsal karakterini belirliyor. Nehir kıyısındaki yerleşim ve tarımsal yapı, ilçede genellikle müstakil ev ve bahçeli konut tipinin yaygın olmasıyla birleşiyor — bu da pencere ve kapı sinekliği ihtiyacının günlük yaşamın doğal bir parçası olmasını açıklıyor.',
    serviceDetails: cevreService('Sarıoğlan ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Sarıoğlan\'a'),
    faq: [
      { question: 'Sarıoğlan\'a sineklik gönderiyor musunuz?', answer: kargoCevap('Sarıoğlan\'a') },
      {
        question: 'Sarıoğlan\'daki müstakil evler için hangi modeli önerirsiniz?',
        answer: 'Bahçe ve balkon kapılarında menteşeli sineklik, pencerelerde klasik pencere sinekliği tercih ediliyor.',
      },
      { question: 'Sarıoğlan\'da kendi ölçümü nasıl alabilirim?', answer: OLCU_CEVAP },
      { question: 'Sarıoğlan\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'sariz-sineklik': {
    h1: 'Sarız Sineklik — Yayla Kültürünün Memleketinde Hizmet',
    intro: 'Sarız, Kayseri\'nin en güney ilçelerinden biri; yaylacılık ve bal üretimiyle tanınan, yüksek rakımlı bir bölge. Yayla kültürünün hâlâ canlı olduğu ilçede konutlar genellikle müstakil ve bahçeli yapıda. Sarız, Kayseri\'nin nüfus artış hızı en düşük (göç oranı en yüksek) ilçelerinden biri olsa da, ilçe merkezinde yaşayan ve mevsimlik olarak yaylaya çıkan ailelerin evlerinde sineklik ihtiyacı sürüyor — özellikle yüksek rakımlı bölgelerde yaz aylarında haşere yoğunluğu fark edilir derecede artıyor.',
    serviceDetails: cevreService('Sarız ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Sarız\'a'),
    faq: [
      { question: 'Sarız\'a sineklik gönderiyor musunuz?', answer: kargoCevap('Sarız\'a') },
      {
        question: 'Sarız\'daki müstakil evler için hangi modeli önerirsiniz?',
        answer: 'Bahçe ve balkon kapılarında menteşeli sineklik, pencerelerde klasik pencere sinekliği tercih ediliyor.',
      },
      {
        question: 'Yayla evleri için sineklik üretiyor musunuz?',
        answer:
          'Evet, mevsimlik kullanılan yayla evleri için standart ölçülerde sineklik üretip kargo ile gönderebiliyoruz; toplu tesis işlerinde yerinde montaj da yapılır.',
      },
      { question: 'Sarız\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'akkisla-sineklik': {
    h1: 'Akkışla Sineklik — Kayseri\'nin En Sakin İlçesinde Hizmet',
    intro: 'Akkışla, Kayseri\'nin en küçük nüfuslu ilçesi — yaklaşık 5.500 kişilik, sakin ve geleneksel bir yerleşim. İlçede tarım ve hayvancılık büyük ölçüde ticari amaçlı değil, ailelerin kendi ihtiyaçlarını karşılamak için yapılıyor. Bu küçük ölçekli, geleneksel yaşam tarzı, konutların da genellikle müstakil ve bahçeli olmasıyla örtüşüyor. Akkışla gibi küçük ve sakin bir ilçede sineklik ihtiyacı, büyük şehirlerdeki kadar sık dile getirilmese de, yaz aylarında haşere kontrolü için aynı şekilde önemli.',
    serviceDetails: cevreService('Akkışla ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Akkışla\'ya'),
    faq: [
      { question: 'Akkışla\'ya sineklik gönderiyor musunuz?', answer: kargoCevap('Akkışla\'ya') },
      {
        question: 'Akkışla\'daki müstakil evler için hangi modeli önerirsiniz?',
        answer: 'Bahçe ve balkon kapılarında menteşeli sineklik, pencerelerde klasik pencere sinekliği tercih ediliyor.',
      },
      { question: 'Akkışla\'da kendi ölçümü nasıl alabilirim?', answer: OLCU_CEVAP },
      { question: 'Akkışla\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'felahiye-sineklik': {
    h1: 'Felahiye Sineklik — Kayseri\'nin Kuzeyinde Güvenilir Hizmet',
    intro: 'Felahiye, Kayseri\'nin kuzeyinde yer alan, tarım ve hayvancılıkla geçinen küçük bir ilçe. Nüfusu yaklaşık 5.500 kişi olan bölgede yerleşim genellikle müstakil ve bahçeli ev tipinde. Felahiye gibi küçük ölçekli, tarım odaklı ilçelerde sineklik ihtiyacı, hem ev içi konforu hem de tarımsal ürünlerin saklandığı alanlarda haşere kontrolünü kapsıyor.',
    serviceDetails: cevreService('Felahiye ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Felahiye\'ye'),
    faq: [
      { question: 'Felahiye\'ye sineklik gönderiyor musunuz?', answer: kargoCevap('Felahiye\'ye') },
      {
        question: 'Felahiye\'deki müstakil evler için hangi modeli önerirsiniz?',
        answer: 'Bahçe ve balkon kapılarında menteşeli sineklik, pencerelerde klasik pencere sinekliği tercih ediliyor.',
      },
      { question: 'Felahiye\'de kendi ölçümü nasıl alabilirim?', answer: OLCU_CEVAP },
      { question: 'Felahiye\'den sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'ozvatan-sineklik': {
    h1: 'Özvatan Sineklik — Elma Bahçelerinin Memleketinde Hizmet',
    intro: 'Özvatan, Kayseri\'nin en az nüfuslu ilçesi — yaklaşık 4.000 kişilik küçük ve sakin bir yerleşim. İlçe, elma üretimiyle tanınıyor; çok sayıda hanede bahçe ve meyve ağacı bulunuyor. Bu tarımsal karakter, konutların genellikle bahçeli ve müstakil olmasıyla birleşiyor — bahçeli evlerde pencere ve kapı sinekliği, hem ev içi konfor hem de bahçe/meyve alanına yakınlık nedeniyle artan haşere yoğunluğuna karşı önemli bir çözüm sunuyor.',
    serviceDetails: cevreService('Özvatan ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Özvatan\'a'),
    faq: [
      { question: 'Özvatan\'a sineklik gönderiyor musunuz?', answer: kargoCevap('Özvatan\'a') },
      {
        question: 'Özvatan\'daki bahçeli evler için hangi modeli önerirsiniz?',
        answer: 'Bahçe ve balkon kapılarında menteşeli sineklik, pencerelerde klasik pencere sinekliği tercih ediliyor.',
      },
      { question: 'Özvatan\'da kendi ölçümü nasıl alabilirim?', answer: OLCU_CEVAP },
      { question: 'Özvatan\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
  'yesilhisar-sineklik': {
    h1: 'Yeşilhisar Sineklik — Soğanlı Vadisi\'nin Yakınında Hizmet',
    intro: 'Yeşilhisar, Kayseri\'nin güneybatısında, Soğanlı Vadisi gibi tarihi ve doğal güzelliklere ev sahipliği yapan bir ilçe; Sultan Sazlığı kuş cennetinin büyük bir kısmı da ilçe sınırları içinde. Ekonomisi tamamen tarıma dayalı — ticaret ve sanayi ilçede gelişmemiş durumda. Bu tarımsal karakter, konutların büyük ölçüde müstakil ve bahçeli olmasıyla örtüşüyor. Doğa turizmi açısından da dikkat çeken Yeşilhisar\'da, hem yerleşik ailelerin evlerinde hem de bölgeyi ziyaret eden misafirlerin kaldığı pansiyon/ev tipi konaklamalarda sineklik ihtiyacı görülüyor.',
    serviceDetails: cevreService('Yeşilhisar ilçe merkezi ve bağlı mahalleler.'),
    aiSnippet: aiSnippet('Yeşilhisar\'a'),
    faq: [
      { question: 'Yeşilhisar\'a sineklik gönderiyor musunuz?', answer: kargoCevap('Yeşilhisar\'a') },
      {
        question: 'Yeşilhisar\'daki müstakil evler için hangi modeli önerirsiniz?',
        answer: 'Bahçe ve balkon kapılarında menteşeli sineklik, pencerelerde klasik pencere sinekliği tercih ediliyor.',
      },
      { question: 'Yeşilhisar\'da kendi ölçümü nasıl alabilirim?', answer: OLCU_CEVAP },
      { question: 'Yeşilhisar\'dan sipariş verirsem ne kadar sürede elime ulaşır?', answer: TESLIM_CEVAP },
    ],
  },
}
