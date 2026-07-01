/** Blog: Sineklik yırtık ve delik tamiri — kelimesi kelimesine içerik */
export default [
  {
    type: 'p',
    text: 'Sinekliğinizde küçük bir yırtık ya da delik fark ettiğinizde, hemen "yenisini mi taktırsam" diye düşünmenize gerek yok. Çoğu hasar, doğru malzeme ve birkaç dakikalık işlemle evde kendiniz onarabileceğiniz kadar basit. Bu rehberde, hasarın büyüklüğüne göre hangi yöntemi seçmeniz gerektiğini, hangi malzemelere ihtiyacınız olduğunu ve adım adım nasıl uygulayacağınızı anlatıyoruz.',
  },
  {
    type: 'img',
    src: 'assets/blog/sineklik-tamir-bandi-kullanim.webp',
    alt: 'Sineklik tamir bandı uygulama örneği — hasarlı tül üzerine yama yerleştirme',
    caption: 'Küçük delik ve yırtıklarda tamir bandı pratik bir çözüm sunar.',
  },
  {
    type: 'cardGrid',
    cards: [
      {
        icon: 'search',
        title: 'Önce Hasarı Değerlendirin',
        paragraphs: [
          'Her hasar aynı çözümü gerektirmiyor. Genel kural şu: 1 cm\'den küçük delik veya kısa bir yırtıkta tamir bandı yeterli oluyor. Daha büyük, yayılan bir yırtıkta veya tül genel olarak gevşemiş/eskimişse, bandı boşa harcamadan komple tül değişimini düşünmek daha mantıklı.',
        ],
      },
      {
        icon: 'wrench',
        title: 'Gerekli Malzemeler',
        intro: 'Küçük bir onarım için yanınızda şunlar olsun:',
        listItems: [
          'Sineklik tamir bandı (kendinden yapışkanlı)',
          'Temizlik için alkollü mendil veya hafif sabunlu su + bez',
          'Makas veya maket bıçağı',
          'Komple tül değişimi yapacaksanız ek olarak: yeni tül, fitil (spline) ve fitil yerleştirme aparatı (roller)',
        ],
      },
      {
        icon: 'bandage',
        title: 'Küçük Yırtık ve Delikleri Bantla Onarma',
        ordered: true,
        listItems: [
          'Hasarlı bölgeyi alkollü bir mendil veya hafif sabunlu suyla temizleyip iyice kurutun — yağ ve toz kalıntısı bandın yapışmasını zayıflatır.',
          'Bandı, hasarı her yönden en az 1-2 cm taşıracak ölçüde, köşeleri oval keserek hazırlayın. Köşelerin oval olması, zamanla kalkmasını geciktirir.',
          'Koruyucu filmi soyup bandı hasarlı bölgeye yapıştırın, kenarlarını parmağınızla iyice bastırarak hava kabarcığı kalmamasına dikkat edin.',
          'Mümkünse aynı işlemi tülün karşı yüzünden de tekrarlayıp çift taraflı uygulayın — özellikle güneş alan pencerelerde bu, bandın ömrünü uzatır.',
        ],
        after: 'Güneşe açık yüzeylerde tamir bandının ömrü gölgeye göre daha kısa olabilir; bu yüzden çok geniş veya tekrarlayan bir yırtıkta bandı kalıcı çözüm değil, tül değişimine kadar geçici bir önlem olarak düşünmenizi öneririz.',
      },
      {
        icon: 'refresh',
        title: 'Büyük Yırtıklarda Tül Değişimi',
        intro: 'Hasar büyükse ya da tül genel olarak yıpranmışsa, en sağlıklı çözüm tülü komple değiştirmek:',
        ordered: true,
        listItems: [
          'Sinekliği çerçeveden çıkarıp düz bir zemine yatırın.',
          'Fitilin (spline) bir ucunu düz bir tornavidayla kaldırıp kanaldan çekerek çıkarın, eski tülü alın.',
          'Yeni tülü çerçeveye, her kenardan 3-5 cm pay bırakacak şekilde serin.',
          'Fitili bir köşeden başlayarak roller (fitil yerleştirme aparatı) ile kanala bastırın, kademeli olarak gerginlik verin — tek seferde aşırı germek dalga/kırışıklık yapar.',
          'Fazla tülü maket bıçağıyla temiz bir şekilde kesin.',
        ],
      },
      {
        icon: 'square',
        title: 'Çerçeve ve Köşe Kontrolü',
        paragraphs: [
          'Tül değişiminden önce ya da tamir sonrası, çerçevenin köşegenlerini kontrol etmekte fayda var — köşegenler birbirine eşitse çerçeve gerçekten kare/dik duruyor demektir. Köşe birleşimlerinde gevşeme varsa, bunu düzeltmeden yapılan bir tül değişimi kısa sürede tekrar gevşeyebilir.',
        ],
      },
      {
        icon: 'layers',
        title: 'Sistem Tipine Göre Küçük Farklar',
        listItems: [
          'Plise (akordeon) sineklikler: Tül katlanarak hareket ettiği için ip/halat gerginliği ayrı bir konu — aşırı germek kat kırığına yol açabilir, ray temizliği de düzenli yapılmalı.',
          'Sürgülü sineklikler: Alt ray ve teker ayarının düzgün olması, kanadın paralel çalışmasını sağlar.',
          'Menteşeli sineklikler: Menteşe ve mıknatıs/çıt-çıt bağlantıları zamanla aşınabilir, onarım sırasında aynı vida deliklerini kullanmak hizalamayı korur.',
        ],
      },
      {
        icon: 'paw',
        title: 'Evcil Hayvanı Olan Evler İçin Not',
        html: 'Eğer hasar tekrar tekrar aynı bölgede oluşuyorsa ve evde kedi/köpek varsa, sorun büyük ihtimalle tülün kendisinde — standart tül, tırnak darbelerine karşı yeterince dayanıklı değil. Bu durumda her seferinde bant yamamak yerine, doğrudan güçlendirilmiş tül kullanan <a href="/urunler/kedi-sinekligi" class="text-primary font-semibold hover:underline">Kedi Sinekliği</a> modelimize geçmeniz, uzun vadede hem zaman hem masraf olarak daha mantıklı.',
      },
    ],
  },
  {
    type: 'img',
    src: 'assets/products/sineklik-tamir-bandi-steps.webp',
    alt: 'Sineklik tamir bandı kullanım adımları — delik tespiti, kesim, uygulama ve sonuç',
    caption: 'Dört adımda sineklik tamir bandı uygulaması.',
  },
  {
    type: 'closing',
    paragraphs: [
      'Küçük bir yırtık veya delik için elinizin altında hızlı bir çözüm bulundurmak isterseniz, <a href="/urunler/sineklik-tamir-bandi" class="text-primary font-semibold hover:underline">Sineklik Tamir Bandımızı</a> inceleyebilirsiniz — 48 mm x 2 metre ölçüsünde, gri ve siyah renk seçenekleriyle, kendinden yapışkanlı ve birkaç dakikada uygulanabilen pratik bir çözüm.',
      'Hasar çok büyükse ya da tül komple değişmesi gerekiyorsa, bize WhatsApp\'tan ulaşabilir, fotoğraf gönderip değerlendirme talep edebilirsiniz.',
    ],
    cta: { text: "WhatsApp'tan Destek Al", href: '__WA_SUPPORT__' },
  },
]

export const yirtikDelikTamiriFaq = [
  {
    question: 'Sinekliklerdeki küçük yırtıklar nasıl tamir edilir?',
    answer: '1 cm\'den küçük delik veya kısa yırtıklarda hasarlı bölgeyi temizleyip kuruladıktan sonra, kendinden yapışkanlı sineklik tamir bandını hasarı her yönden 1-2 cm taşıracak şekilde kesip yapıştırmanız yeterlidir. Köşeleri oval kesmek ve mümkünse çift taraflı uygulamak dayanıklılığı artırır.',
  },
  {
    question: 'Sineklik tamir bandı nasıl kullanılır?',
    answer: 'Hasarlı alanı alkollü mendil veya hafif sabunlu suyla temizleyip kurulayın. Bandı oval köşeli olacak şekilde kesin, koruyucu filmi soyun ve hasarlı bölgeye yapıştırın. Kenarları parmağınızla bastırarak hava kabarcığı bırakmayın; güneş alan yüzeylerde karşı taraftan da uygulayabilirsiniz.',
  },
  {
    question: 'Büyük delikler için en etkili sineklik onarım yöntemi nedir?',
    answer: 'Büyük veya yayılan yırtıklarda en sağlıklı çözüm komple tül değişimidir: sinekliği çerçeveden çıkarın, eski fitili ve tülü sökün, yeni tülü pay bırakarak serin ve fitil yerleştirme aparatıyla kanala kademeli gerginlik vererek yerleştirin.',
  },
  {
    question: 'Evcil hayvanların açtığı delikler nasıl önlenir?',
    answer: 'Tekrarlayan tırnak hasarlarında standart tül yeterli dayanıklılığı sunmaz. Küçük delikler için tamir bandı geçici çözüm olabilir; kalıcı çözüm için güçlendirilmiş polyester telli Kedi Sinekliği modeline geçmeniz önerilir.',
  },
]
