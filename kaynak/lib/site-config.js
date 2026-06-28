export const site = {
  name: 'Kayseri Sineklik',
  domain: 'kayserisineklik.com.tr',
  url: 'https://kayserisineklik.com.tr',
  company: 'Edeka Otomatik Kapı Sistemleri',
  address: {
    street: 'Fevzi Çakmak, Fuzuli Cd. No:63',
    postalCode: '38020',
    district: 'Kocasinan',
    city: 'Kayseri',
    country: 'TR',
    full: 'Fevzi Çakmak, Fuzuli Cd. No:63, 38020 Kocasinan/Kayseri'
  },
  phone: '0538 820 20 36',
  phoneIntl: '+905388202036',
  whatsappNumber: '905388202036',
  email: 'info@edekakapi.com',
  logo: '/logo.svg',
  slogans: [
    'İçeri sinek girmesin, ferahlık gelsin.',
    'Her Ölçüye Uyan Sineklik, Her Bütçeye Uygun Fiyat.'
  ],
  shipping: {
    headline: 'Türkiye\u2019nin Her Yerine Kargo',
    short: '81 İl\u2019e Güvenli Kargo',
    detail: 'Ölçüye özel ürettiğimiz sinekliğinizi Türkiye\u2019nin her noktasına anlaşmalı kargolarımızla gönderiyoruz. Kayseri dışı müşterilerimiz WhatsApp\u2019tan ölçü göndererek kolayca sipariş verebilir.',
    daysCity: 'Kayseri içi 1-2 iş günü',
    daysCountry: 'Türkiye geneli 2-5 iş günü'
  },
  description: 'Türkiye\u2019nin her yerine kargo! Plise, menteşeli, sürgülü, kedi ve pencere sinekliği ölçüye özel üretim. Kayseri\u2019de montajlı, 81 il\u2019de güvenli kargo seçeneği.',
  workingHours: 'Pzt - Cmt: 09:00 - 19:00',
  geo: { latitude: 38.7335, longitude: 35.4855 }
};

export const whatsappLink = (msg = 'Merhaba, sineklik için bilgi almak istiyorum.') =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
