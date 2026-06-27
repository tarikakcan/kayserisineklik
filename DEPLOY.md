# Kayseri Sineklik — Deploy (Saf HTML)

## Ana site (kayserisineklik.com.tr)

**Hazır zip:** `canli-site.zip` (1-CANLI-SITE içeriği)

1. Hostinger → Dosya Yöneticisi → `public_html`
2. **İçindeki her şeyi sil**
3. `1-CANLI-SITE/` **içindekilerin tamamını** yükle (klasörün kendisini değil)

Kök dizinde olması gerekenler:

```
index.html
logo.svg
.htaccess
assets/css/site.css
assets/js/site.js
api/contact.php
api/quote.php
urunler/...
blog/...
```

**`_next` klasörü YOK** — bu saf HTML sürüm.

4. `api/.env` oluştur (`.env.example`'dan kopyala, SMTP_PASS doldur)

## Admin (admin.kayserisineklik.com.tr)

1. `2-ADMIN/` içeriğini admin subdomain document root'a yükle
2. `.env` oluştur (`ADMIN_PASS_HASH` ile)
3. Giriş: https://admin.kayserisineklik.com.tr/

## Site güncelleme (geliştirici)

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik
npm run build
```

Sonra `1-CANLI-SITE/` içeriğini tekrar `public_html`'e yükle.

Git akışı için: `GIT.md`
