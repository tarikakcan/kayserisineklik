# AGENT-NOTLAR — Kayseri Sineklik Saf HTML

## Mimari

- **GitHub `main`** → Hostinger `public_html` (sadece canlı dosyalar)
- **GitHub `dev`** → kaynak kod (deploy edilmez)
- **1-CANLI-SITE/** → build çıktısı; `main`'e gider
- **Build:** `npm run deploy:github`

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

1. Hostinger Git → branch **`main`** (içinde sadece canlı dosyalar olmalı)
2. **`dev`** branch Hostinger'a bağlanmamalı
3. Güncelleme: `npm run deploy:github`
4. `.env` dosyaları sunucuda elle
5. public_html'de `kaynak/`, `1-CANLI-SITE/` klasör adı olmamalı

## Cursor bağlantısı

Workspace: `C:\Users\mosta\Desktop\kayserisineklik`
Git ayarları: `GIT.md`
