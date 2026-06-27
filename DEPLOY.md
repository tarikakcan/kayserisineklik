# Kayseri Sineklik — Deploy

## GitHub = sadece canlı dosyalar (`main`)

Hostinger Git → branch **`main`**. Bu branch'te yalnızca `public_html`'e gidecek dosyalar var.

```powershell
npm run deploy:github
```

Bu komut:
1. Siteyi build eder
2. GitHub **`main`** → sadece canlı dosyalar (force push)
3. GitHub **`dev`** → kaynak kod (geliştirme yedeği)

## Canlı dosya yapısı (main branch)

```
index.html
api/          → api.kayserisineklik.com.tr
admin/        → admin.kayserisineklik.com.tr
assets/
urunler/
blog/
```

## Hostinger (bir kez)

1. Git → branch: **`main`**
2. `public_html` içini temizle (yanlış eski yükleme varsa)
3. Deploy tetikle

## Sunucuda elle

- `public_html/api/.env` — SMTP
- `public_html/admin/.env` — ADMIN_PASS_HASH

## Geliştirme

Kaynak kod `dev` branch'te. Yerel çalışma:

```powershell
npm run build
npm run deploy:github
```
