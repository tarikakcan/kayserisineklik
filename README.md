# Kayseri Sineklik — Saf HTML

Statik HTML site + PHP admin. Next.js yok.

**Canlı:** https://kayserisineklik.com.tr

## Geliştirme (yerel)

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik
npm run build              # 1-CANLI-SITE üret
npm run deploy:github      # GitHub main = canlı, dev = kaynak
```

## GitHub

| Branch | İçerik |
|--------|--------|
| `main` | Sadece canlı site — Hostinger bunu çeker |
| `dev` | Kaynak kod |

## Hostinger

Git branch: **`main`** → `public_html`

Detay: [DEPLOY.md](DEPLOY.md)

## Kaynak dosyalar (dev branch)

| Dosya | İçerik |
|-------|--------|
| `kaynak/lib/site-config.js` | Site bilgileri |
| `kaynak/lib/products-config.js` | 8 ürün |
| `kaynak/lib/blog-posts.js` | Blog |
| `kaynak/pure-html/build.mjs` | HTML üretici |
