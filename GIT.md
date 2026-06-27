# Git & GitHub Ayarları

## Depo bilgileri

| Ayar | Değer |
|------|-------|
| **Klasör** | `C:\Users\mosta\Desktop\kayserisineklik` |
| **Remote** | `https://github.com/tarikakcan/kayserisineklik.git` |
| **Branch** | `main` |
| **Site** | https://kayserisineklik.com.tr |
| **Admin** | https://admin.kayserisineklik.com.tr |

## Cursor workspace

Cursor'da **File → Open Folder** ile şu klasörü aç:

```
C:\Users\mosta\Desktop\kayserisineklik
```

Eski `kayserisineklik-emergent` klasörü artık gerekli değil.

## Günlük geliştirme akışı

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik

# 1. Kaynak dosyaları düzenle (kaynak/lib/, kaynak/pure-html/)
# 2. Siteyi üret
npm run build

# 3. Git'e kaydet
git add .
git commit -m "Açıklama"
git push origin main
```

## Klasör yapısı (Git'te ne var)

```
kayserisineklik/
├── kaynak/           ← DÜZENLE (lib, build script, admin kaynağı)
├── 1-CANLI-SITE/     ← npm run build çıktısı → Hostinger public_html
├── 2-ADMIN/          ← npm run build çıktısı → admin subdomain
├── DEPLOY.md
├── GIT.md            ← bu dosya
└── AGENT-NOTLAR.md
```

## Hostinger'a yayınlama

GitHub push sonrası:

1. `1-CANLI-SITE/` içeriğini `public_html`'e yükle
2. veya `npm run zip` → `canli-site.zip` aç → yükle

Detay: `DEPLOY.md`

## İlk push (eski Next.js repo yerine)

GitHub'da hâlâ eski Next.js kodu var. Bu klasörden ilk push **yeni saf HTML yapısını** yükler:

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik
git init
git remote add origin https://github.com/tarikakcan/kayserisineklik.git
git add .
git commit -m "Saf HTML sürümü: kaynak + canlı site + admin"
git branch -M main
git pull origin main --allow-unrelated-histories   # birleştirme gerekirse
git push -u origin main
```

> Eğer `pull` karmaşık olursa: `git push -u origin main --force` eski Next.js kodunu siler. Sadece emin olduğunuzda kullanın.

## Düzenlenecek dosyalar

| Ne değişecek | Dosya |
|--------------|-------|
| Telefon, adres, slogan | `kaynak/lib/site-config.js` |
| Ürünler, fiyatlar | `kaynak/lib/products-config.js` |
| Blog yazıları | `kaynak/lib/blog-posts.js` |
| Sayfa şablonları | `kaynak/pure-html/build.mjs` |
| JS (hesaplayıcı, form) | `kaynak/pure-html/assets/site.js` |
| CSS (nadir) | `kaynak/assets/css/site.css` |
| Admin panel | `kaynak/admin/` |

Her değişiklikten sonra: `npm run build`

## Güvenlik

- `.env` dosyaları `.gitignore`'da — commit edilmez
- Sunucuda `1-CANLI-SITE/api/.env` ve `2-ADMIN/.env` elle oluşturulur
- GitHub token'ı sohbette paylaşıldıysa iptal edin, yeni token kullanın
