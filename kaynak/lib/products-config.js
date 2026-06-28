// Tüm ürünler ve m² birim fiyatları (TL). Buradan kolayca güncellenebilir.
export const FRAME_COLOR_OPTIONS = ['Beyaz', 'Vizon', 'Meşe', 'Altın Meşe', 'Antrasit']

export const products = [
  {
    slug: 'dikey-plise-sineklik',
    name: 'Dikey Plise Sineklik',
    shortName: 'Dikey Plise',
    pricePerM2: 1450,
    minPrice: 850,
    image: 'https://customer-assets.emergentagent.com/job_262fdf16-1181-40c4-aecb-3d93097f2d17/artifacts/xnicr7at_dikey-plise-sineklik-bipencerecom-hesapla.jpg',
    selectionType: 'color',
    options: [...FRAME_COLOR_OPTIONS],
    tagline: 'Pencereler için yukarıdan aşağıya çalışan, estetik ve dayanıklı plise sineklik.',
    description: 'Dikey Plise Sineklik, pencerelerinizde yukarıdan aşağıya doğru hareket eden plise kanat sistemiyle yer kaplamadan etkili koruma sağlar. Alüminyum kasası ve fiberglas kumaşı uzun ömürlüdür. Her ölçüye özel imal edilir.',
    features: [
      'Yukarıdan aşağıya plise hareket',
      'Alüminyum kasa, fiberglas kumaş',
      'Yer kaplamaz, estetik görünüm',
      'Ölçüye özel üretim ve montaj'
    ]
  },
  {
    slug: 'duble-plise-sineklik',
    name: 'Duble Plise Sineklik',
    shortName: 'Duble Plise',
    pricePerM2: 1750,
    minPrice: 1100,
    image: 'https://customer-assets.emergentagent.com/job_262fdf16-1181-40c4-aecb-3d93097f2d17/artifacts/g3q50959_duble-plise-sineklik-bipencerecom-hesapla.jpg',
    selectionType: 'color',
    options: [...FRAME_COLOR_OPTIONS],
    tagline: 'Geniş açıklıklar için ortadan açılan çift kanatlı plise sineklik sistemi.',
    description: 'Duble Plise Sineklik, geniş pencere ve balkon açıklıklarında ortadan birleşip iki yana açılan çift kanatlı plise sistemdir. Büyük açıklıkları tek parça halinde koruyabilir.',
    features: [
      'Çift kanatlı, ortadan açılır',
      '300 cm genişliğe kadar uygulanabilir',
      'Pratik kullanım ve dayanıklı yapı',
      'Balkon ve teras pencereleri için ideal'
    ]
  },
  {
    slug: 'yatay-plise-sineklik',
    name: 'Yatay Plise Sineklik',
    shortName: 'Yatay Plise',
    pricePerM2: 1550,
    minPrice: 900,
    image: 'https://customer-assets.emergentagent.com/job_262fdf16-1181-40c4-aecb-3d93097f2d17/artifacts/d85u5wqo_yatay-plise-sineklik-bipencerecom-hesapla.jpg',
    selectionType: 'direction',
    options: ['Sağdan Açılır', 'Soldan Açılır', 'Ortadan Açılır'],
    tagline: 'Kapı ve geniş pencereler için yana doğru hareket eden yatay plise sistem.',
    description: 'Yatay Plise Sineklik, kapı ve geniş pencere açıklıklarında yana doğru hareket ederek yer kazandırır. Tek veya çift kanatlı seçenekleri ile balkon kapıları için uygundur.',
    features: [
      'Yana doğru plise hareket',
      'Tek/çift kanat seçeneği',
      'Balkon ve teras kapısı için ideal',
      'Sessiz ve akıcı kullanım'
    ]
  },
  {
    slug: 'menteseli-sineklik',
    name: 'Menteşeli Sineklik',
    shortName: 'Menteşeli',
    pricePerM2: 1100,
    minPrice: 750,
    image: 'https://customer-assets.emergentagent.com/job_262fdf16-1181-40c4-aecb-3d93097f2d17/artifacts/oybme104_menteseli-sineklik-bipencerecom-hesapla.jpg',
    selectionType: 'direction',
    options: ['Sağdan Açılır', 'Soldan Açılır'],
    tagline: 'Kapı gibi açılıp kapanan, sağlam menteşe sistemiyle uzun ömürlü sineklik.',
    description: 'Menteşeli Sineklik, kapı gibi açılıp kapanan menteşe sistemiyle çalışan klasik bir çözümdür. Mıknatıslı kilit mekanizması sayesinde otomatik kapanır. En ekonomik ve dayanıklı seçeneklerden biridir.',
    features: [
      'Kapı gibi açılır kapanır',
      'Mıknatıslı otomatik kilit',
      'Yüksek dayanım, uzun ömür',
      'Ekonomik fiyat avantajı'
    ]
  },
  {
    slug: 'kapi-sinekligi',
    name: 'Kapı Sinekliği',
    shortName: 'Kapı',
    pricePerM2: 1650,
    minPrice: 1100,
    image: '/assets/products/kapi-sinekligi.png',
    selectionType: 'direction',
    options: ['Sağdan Açılır', 'Soldan Açılır', 'Çift Kanat', 'Sürgülü'],
    tagline: 'Balkon, teras ve giriş kapıları için özel ölçüde üretilen kapı sineklikleri.',
    description: 'Kapı Sinekliği, balkon, teras ve bahçe kapılarınız için ölçüye özel üretilir. Menteşeli, plise veya sürgülü modeller arasından ihtiyacınıza en uygun olanı seçebilirsiniz.',
    features: [
      'Balkon ve teras kapısı için özel',
      'Sağdan/soldan/çift kanat seçenekleri',
      'Mıknatıslı veya plise mekanizma',
      'Profesyonel ölçüm ve montaj'
    ]
  },
  {
    slug: 'pencere-sinekligi',
    name: 'Pencere Sinekliği',
    shortName: 'Pencere',
    pricePerM2: 900,
    minPrice: 450,
    image: 'https://images.pexels.com/photos/17756267/pexels-photo-17756267.jpeg',
    selectionType: 'color',
    options: [...FRAME_COLOR_OPTIONS],
    tagline: 'Klasik sabit kasalı pencere sineklikleri – ekonomik ve dayanıklı.',
    description: 'Pencere Sinekliği, pencerelerinize sabit veya çıkarılabilir olarak monte edilen klasik sineklik çözümüdür. Alüminyum kasası ve fiberglas teli ile uzun yıllar kullanılır.',
    features: [
      'Sabit veya çıkarılabilir kasa',
      'Alüminyum çerçeve, fiberglas tel',
      'En ekonomik sineklik çözümü',
      'Hızlı montaj'
    ]
  },
  {
    slug: 'kedi-sinekligi',
    name: 'Kedi Sinekliği',
    shortName: 'Kedi',
    pricePerM2: 1350,
    minPrice: 850,
    image: '/assets/products/kedi-sinekligi.png',
    selectionType: 'color',
    options: [...FRAME_COLOR_OPTIONS],
    tagline: 'Kedi pençesine dayanıklı güçlendirilmiş polyester telli sineklik.',
    description: 'Kedi Sinekliği, normal fiberglas tellere göre 7 kat daha dayanıklı polyester kaplı tel ile üretilir. Kedinizin pençelerinden ve dişlerinden etkilenmez, hem sineklerden hem evcil hayvan kaçışından koruma sağlar.',
    features: [
      'Güçlendirilmiş polyester tel',
      'Pençe ve ısırığa dayanıklı',
      'Kedi/köpek güvenliği için ideal',
      'Sineklere karşı tam koruma'
    ]
  },
  {
    slug: 'surgulu-sineklik',
    name: 'Sürgülü Sineklik',
    shortName: 'Sürgülü',
    pricePerM2: 1450,
    minPrice: 1050,
    image: 'https://images.pexels.com/photos/13600834/pexels-photo-13600834.jpeg',
    selectionType: 'direction',
    options: ['Sağdan Açılır', 'Soldan Açılır', 'Çift Kanat'],
    tagline: 'Ray üzerinde yana kayan sürgülü sineklik – ideal pratik çözüm.',
    description: 'Sürgülü Sineklik, alt ve üst raylar üzerinde yana doğru kayarak hareket eden pratik bir sineklik sistemidir. Sürgülü pencere ve balkon kapılarına uyumludur.',
    features: [
      'Sürgülü ray sistemi',
      'Sessiz ve akıcı çalışma',
      'Tek/çift kanat seçeneği',
      'Sürgülü PVC pencerelere ideal'
    ]
  }
];

export const getProduct = (slug) => products.find(p => p.slug === slug);
