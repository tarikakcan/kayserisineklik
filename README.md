# Kayseri Sineklik — Saf HTML

Statik HTML site + PHP admin paneli. Next.js / `_next` yok.

**Canlı:** https://kayserisineklik.com.tr

## Hızlı başlangıç

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik
npm run build          # 1-CANLI-SITE + 2-ADMIN üret
npm run zip            # canli-site.zip (opsiyonel)
```

## Deploy

- Ana site: `1-CANLI-SITE/` → Hostinger `public_html`
- Admin: `2-ADMIN/` → admin subdomain

Detaylar: [DEPLOY.md](DEPLOY.md)

## Git & GitHub

Detaylar: [GIT.md](GIT.md)

Remote: `https://github.com/tarikakcan/kayserisineklik.git`

## Kaynak dosyalar

| Dosya | İçerik |
|-------|--------|
| `kaynak/lib/site-config.js` | Site bilgileri |
| `kaynak/lib/products-config.js` | 8 ürün |
| `kaynak/lib/blog-posts.js` | Blog yazıları |
| `kaynak/pure-html/build.mjs` | HTML üretici |
| `kaynak/pure-html/assets/site.js` | Fiyat, form, menü JS |
