# Kayseri Sineklik — Deploy (Saf HTML)

## GitHub branch'leri (otomatik)

| Branch | Ne var | Hostinger |
|--------|--------|-----------|
| `main` | Kaynak kod + build çıktıları | — |
| **`live`** | Sadece canlı site (`index.html` kökte) | Ana domain → `public_html` |
| **`admin`** | Sadece admin panel | admin subdomain |

Deploy komutu (geliştirici veya agent):

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik
npm run deploy:github
```

Bu komut: `npm run build` → `live` branch push → `admin` branch push.

## Hostinger Git bağlantısı (bir kez)

### Ana site (kayserisineklik.com.tr)

1. Hostinger → Websites → **Git**
2. Repo: `https://github.com/tarikakcan/kayserisineklik.git`
3. Branch: **`live`** (main değil!)
4. Deploy path: `public_html`
5. `public_html` içini önce boşalt (eski yanlış yükleme varsa sil)

Kökte olması gerekenler (`live` branch):

```
index.html
logo.svg
.htaccess
assets/
api/
urunler/
blog/
sitemap.xml
robots.txt
```

4. Sunucuda `api/.env` oluştur (`.env.example`'dan, `SMTP_PASS` doldur)

### Admin (admin.kayserisineklik.com.tr)

1. Admin subdomain → Git
2. Aynı repo, branch: **`admin`**
3. Sunucuda `.env` oluştur (`ADMIN_PASS_HASH`)

## Manuel alternatif

```powershell
npm run zip   # canli-site.zip = 1-CANLI-SITE içeriği
```

Zip içeriğini `public_html` köküne yükle (klasör adı olmadan).

## Site güncelleme

Kaynak değiştir → `npm run deploy:github` → Hostinger Git otomatik çeker (veya panelden Deploy).

Git akışı: `GIT.md`
