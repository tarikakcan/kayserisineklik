# Kayseri Sineklik — Deploy (Saf HTML)

## Hostinger Git (otomatik canlı)

Hostinger GitHub'a bağlı. Branch **`live`** → `public_html`.

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik
npm run deploy:github
```

Build + `live` branch push → Hostinger otomatik çeker.

## Alt alan adları

Hostinger'da alt alan adları `public_html` alt klasörlerine bağlı:

| Alt alan adı | Dizin | İçerik |
|--------------|-------|--------|
| (ana domain) | `public_html/` | HTML site |
| api.kayserisineklik.com.tr | `public_html/api/` | contact.php, quote.php |
| admin.kayserisineklik.com.tr | `public_html/admin/` | Fiyat paneli + pricing.php |

`live` branch'te hepsi bir arada:

```
public_html/
├── index.html
├── api/
├── admin/
├── assets/
├── urunler/
└── blog/
```

## Hostinger Git ayarı

- Repo: `https://github.com/tarikakcan/kayserisineklik.git`
- Branch: **`live`**
- Path: `public_html`

## Sunucuda elle oluştur

- `public_html/api/.env` — SMTP (`.env.example`'dan)
- `public_html/admin/.env` — `ADMIN_PASS_HASH`

## Geliştirme branch'i

`main` = kaynak kod. Hostinger'a deploy edilmez.

Git akışı: `GIT.md`
