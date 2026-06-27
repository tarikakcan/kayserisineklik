# AGENT-NOTLAR — Kayseri Sineklik Saf HTML

## Mimari

- **1-CANLI-SITE/** → Hostinger `public_html` (saf HTML, `_next` yok)
- **2-ADMIN/** → admin subdomain (PHP fiyat paneli)
- **Kaynak build:** `kaynak/pure-html/build.mjs` (proje kökünden `npm run build`)

## Teknoloji

| Parça | Teknoloji |
|-------|-----------|
| Sayfalar | Statik `.html` (22 sayfa) |
| Stil | `assets/css/site.css` (Tailwind derlemesi, tek dosya) |
| JS | `assets/js/site.js` (vanilla) |
| Fiyat API | `https://admin.kayserisineklik.com.tr/api/pricing.php` |
| Formlar | `/api/contact.php`, `/api/quote.php` |

## Fiyat formülü

```
alan = genişlik × yükseklik / 10000
ham = max(alan × birim_m2, minimum_fiyat)
fiyat = round(ham × (1 + kdv_orani))  // KDV dahil
```

Tablo/rozetler: KDV **hariç** m² birim. Hesaplayıcı toplam: KDV **dahil**.

## Tasarım (DEĞİŞTİRME)

- Terracotta primary, olive accent, cream background
- Fontlar: Inter + Playfair Display (Google Fonts)
- WhatsApp: `#25D366`

## Veri kaynakları

Build sırasında okunur:
- `kaynak/lib/site-config.js`
- `kaynak/lib/products-config.js`
- `kaynak/lib/blog-posts.js`

Admin panelden fiyat güncellenince site anında yansır (API fetch).

## Bilinen tuzaklar

1. Zip açarken `1-CANLI-SITE` klasörünü değil **içeriğini** yükle
2. `api/.env` sunucuda olmalı (Git'e koyma)
3. Eski Next.js `_next/` klasörü bu sürümde **yok**

## Cursor bağlantısı

Workspace: `C:\Users\mosta\Desktop\kayserisineklik`
Git ayarları: `GIT.md`
