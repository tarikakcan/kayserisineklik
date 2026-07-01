/**
 * Kayseri ilçe bazlı yerel SEO sayfaları — metadata.
 * published: true olanlar build sırasında üretilir (Aşama 1: 5 merkez ilçe).
 */

export const districtGroups = {
  merkez: { label: 'Merkez İlçeler', description: 'Günlük keşif ve montaj hizmeti' },
  cevre: { label: 'Çevre İlçeler', description: 'Bireysel siparişlerde kargo; toplu işlerde yerinde montaj' },
}

/** @type {Array<{
 *   slug: string
 *   id: string
 *   name: string
 *   nameIn: string
 *   group: 'merkez' | 'cevre'
 *   priority: number
 *   published: boolean
 *   mapsQuery: string
 *   nearby: string[]
 *   featuredProducts: string[]
 * }>} */
export const districts = [
  {
    slug: 'melikgazi-sineklik',
    id: 'melikgazi',
    name: 'Melikgazi',
    nameIn: "Melikgazi'de",
    group: 'merkez',
    priority: 1,
    published: true,
    mapsQuery: 'Melikgazi, Kayseri',
    nearby: ['kocasinan', 'talas', 'hacilar'],
    featuredProducts: ['pencere-sinekligi', 'dikey-plise-sineklik', 'sineklik-tamir-bandi'],
  },
  {
    slug: 'kocasinan-sineklik',
    id: 'kocasinan',
    name: 'Kocasinan',
    nameIn: "Kocasinan'da",
    group: 'merkez',
    priority: 2,
    published: true,
    mapsQuery: 'Kocasinan, Kayseri',
    nearby: ['melikgazi', 'talas', 'incesu'],
    featuredProducts: ['kapi-sinekligi', 'surgulu-sineklik', 'pencere-sinekligi'],
  },
  {
    slug: 'talas-sineklik',
    id: 'talas',
    name: 'Talas',
    nameIn: "Talas'ta",
    group: 'merkez',
    priority: 3,
    published: true,
    mapsQuery: 'Talas, Kayseri',
    nearby: ['melikgazi', 'kocasinan', 'hacilar'],
    featuredProducts: ['surgulu-sineklik', 'dikey-plise-sineklik', 'menteseli-sineklik'],
  },
  {
    slug: 'hacilar-sineklik',
    id: 'hacilar',
    name: 'Hacılar',
    nameIn: "Hacılar'da",
    group: 'merkez',
    priority: 4,
    published: true,
    mapsQuery: 'Hacılar, Kayseri',
    nearby: ['talas', 'kocasinan', 'melikgazi'],
    featuredProducts: ['kedi-sinekligi', 'menteseli-sineklik', 'kapi-sinekligi'],
  },
  {
    slug: 'incesu-sineklik',
    id: 'incesu',
    name: 'İncesu',
    nameIn: "İncesu'da",
    group: 'merkez',
    priority: 5,
    published: true,
    mapsQuery: 'İncesu, Kayseri',
    nearby: ['hacilar', 'kocasinan'],
    featuredProducts: ['kapi-sinekligi', 'pencere-sinekligi', 'surgulu-sineklik'],
  },
  {
    slug: 'develi-sineklik',
    id: 'develi',
    name: 'Develi',
    nameIn: "Develi'de",
    group: 'cevre',
    priority: 6,
    published: true,
    mapsQuery: 'Develi, Kayseri',
    nearby: ['incesu', 'yesilhisar', 'tomarza'],
    featuredProducts: ['pencere-sinekligi', 'menteseli-sineklik'],
  },
  {
    slug: 'yahyali-sineklik',
    id: 'yahyali',
    name: 'Yahyalı',
    nameIn: "Yahyalı'da",
    group: 'cevre',
    priority: 7,
    published: true,
    mapsQuery: 'Yahyalı, Kayseri',
    nearby: ['develi', 'yesilhisar'],
    featuredProducts: ['menteseli-sineklik', 'pencere-sinekligi'],
  },
  {
    slug: 'bunyan-sineklik',
    id: 'bunyan',
    name: 'Bünyan',
    nameIn: "Bünyan'da",
    group: 'cevre',
    priority: 8,
    published: true,
    mapsQuery: 'Bünyan, Kayseri',
    nearby: ['talas', 'sarioglan', 'tomarza'],
    featuredProducts: ['pencere-sinekligi', 'menteseli-sineklik'],
  },
  {
    slug: 'tomarza-sineklik',
    id: 'tomarza',
    name: 'Tomarza',
    nameIn: "Tomarza'da",
    group: 'cevre',
    priority: 9,
    published: true,
    mapsQuery: 'Tomarza, Kayseri',
    nearby: ['develi', 'bunyan', 'pinarbasi'],
    featuredProducts: ['kapi-sinekligi', 'pencere-sinekligi'],
  },
  {
    slug: 'pinarbasi-sineklik',
    id: 'pinarbasi',
    name: 'Pınarbaşı',
    nameIn: "Pınarbaşı'nda",
    group: 'cevre',
    priority: 10,
    published: true,
    mapsQuery: 'Pınarbaşı, Kayseri',
    nearby: ['bunyan', 'sariz', 'tomarza'],
    featuredProducts: ['pencere-sinekligi', 'kapi-sinekligi'],
  },
  {
    slug: 'sarioglan-sineklik',
    id: 'sarioglan',
    name: 'Sarıoğlan',
    nameIn: "Sarıoğlan'da",
    group: 'cevre',
    priority: 11,
    published: true,
    mapsQuery: 'Sarıoğlan, Kayseri',
    nearby: ['bunyan', 'akkisla', 'felahiye'],
    featuredProducts: ['pencere-sinekligi', 'menteseli-sineklik'],
  },
  {
    slug: 'sariz-sineklik',
    id: 'sariz',
    name: 'Sarız',
    nameIn: "Sarız'da",
    group: 'cevre',
    priority: 12,
    published: true,
    mapsQuery: 'Sarız, Kayseri',
    nearby: ['tomarza', 'pinarbasi'],
    featuredProducts: ['menteseli-sineklik', 'pencere-sinekligi'],
  },
  {
    slug: 'akkisla-sineklik',
    id: 'akkisla',
    name: 'Akkışla',
    nameIn: "Akkışla'da",
    group: 'cevre',
    priority: 13,
    published: true,
    mapsQuery: 'Akkışla, Kayseri',
    nearby: ['sarioglan', 'felahiye'],
    featuredProducts: ['pencere-sinekligi', 'menteseli-sineklik'],
  },
  {
    slug: 'felahiye-sineklik',
    id: 'felahiye',
    name: 'Felahiye',
    nameIn: "Felahiye'de",
    group: 'cevre',
    priority: 14,
    published: true,
    mapsQuery: 'Felahiye, Kayseri',
    nearby: ['sarioglan', 'akkisla', 'ozvatan'],
    featuredProducts: ['pencere-sinekligi', 'menteseli-sineklik'],
  },
  {
    slug: 'ozvatan-sineklik',
    id: 'ozvatan',
    name: 'Özvatan',
    nameIn: "Özvatan'da",
    group: 'cevre',
    priority: 15,
    published: true,
    mapsQuery: 'Özvatan, Kayseri',
    nearby: ['felahiye', 'sarioglan'],
    featuredProducts: ['pencere-sinekligi', 'menteseli-sineklik'],
  },
  {
    slug: 'yesilhisar-sineklik',
    id: 'yesilhisar',
    name: 'Yeşilhisar',
    nameIn: "Yeşilhisar'da",
    group: 'cevre',
    priority: 16,
    published: true,
    mapsQuery: 'Yeşilhisar, Kayseri',
    nearby: ['incesu', 'develi', 'yahyali'],
    featuredProducts: ['pencere-sinekligi', 'menteseli-sineklik'],
  },
]

export const publishedDistricts = districts.filter(d => d.published)

export function getDistrictById(id) {
  return districts.find(d => d.id === id)
}

export function getDistrictBySlug(slug) {
  return districts.find(d => d.slug === slug)
}
