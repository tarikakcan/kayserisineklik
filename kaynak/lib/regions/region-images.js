/**
 * İlçe sayfalarında kullanılan görseller.
 * hero: ana tanıtım banner'ı (tüm merkez ilçelerde)
 * pool: ilçe bazlı kararlı "rastgele" atama için havuz
 */

export const regionHeroImage = '/assets/regions/yazin-sineklik-banner.webp'

export const regionImagePool = [
  '/assets/regions/yazin-sineklik-banner.webp',
  '/assets/hero-home.webp',
  '/assets/products/pencere-sinekligi.webp',
  '/assets/products/kapi-sinekligi.webp',
  '/assets/products/kedi-sinekligi.webp',
  '/assets/products/kedi-sinekligi-balkon.webp',
  '/assets/blog/sineklik-olcusu-nasil-alinir.webp',
  '/assets/blog/sineklik-yirtik-delik-tamiri.webp',
]

function hashId(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

/** İlçe kimliğine göre kararlı rastgele görsel seçimi (her build'de aynı) */
export function pickRegionImages(districtId, count = 2) {
  const pool = [...regionImagePool]
  const start = hashId(districtId) % pool.length
  const picked = []
  for (let i = 0; i < count; i++) {
    picked.push(pool[(start + i) % pool.length])
  }
  return picked
}

export function getDistrictImages(district) {
  const [secondary, accent] = pickRegionImages(district.id, 2)
  return {
    hero: regionHeroImage,
    secondary: secondary === regionHeroImage ? pickRegionImages(district.id + '-alt', 1)[0] : secondary,
    accent,
    card: pickRegionImages(district.id + '-card', 1)[0],
  }
}
