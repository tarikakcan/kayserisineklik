/** Otomatik üretildi — import:product-content */
import dikey_plise_sineklik from './product-content/dikey-plise-sineklik.js'
import duble_plise_sineklik from './product-content/duble-plise-sineklik.js'
import yatay_plise_sineklik from './product-content/yatay-plise-sineklik.js'
import menteseli_sineklik from './product-content/menteseli-sineklik.js'
import kapi_sinekligi from './product-content/kapi-sinekligi.js'
import pencere_sinekligi from './product-content/pencere-sinekligi.js'
import kedi_sinekligi from './product-content/kedi-sinekligi.js'
import surgulu_sineklik from './product-content/surgulu-sineklik.js'
import sineklik_tamir_bandi from './product-content/sineklik-tamir-bandi.js'

export const productContentBySlug = {
  'dikey-plise-sineklik': dikey_plise_sineklik,
  'duble-plise-sineklik': duble_plise_sineklik,
  'yatay-plise-sineklik': yatay_plise_sineklik,
  'menteseli-sineklik': menteseli_sineklik,
  'kapi-sinekligi': kapi_sinekligi,
  'pencere-sinekligi': pencere_sinekligi,
  'kedi-sinekligi': kedi_sinekligi,
  'surgulu-sineklik': surgulu_sineklik,
  'sineklik-tamir-bandi': sineklik_tamir_bandi,
}

export function getProductContent(slug) {
  const c = productContentBySlug[slug]
  if (!c) return null
  if (c.sections?.length) return c
  if (!c.howItWorks?.length) return null
  return c
}
