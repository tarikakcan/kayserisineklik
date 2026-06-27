# Git & GitHub

## Branch yapısı

| Branch | Ne var | Hostinger |
|--------|--------|-----------|
| **`main`** | Sadece canlı site | ✅ public_html |
| **`dev`** | Kaynak kod + build çıktıları | ❌ |

Repo: https://github.com/tarikakcan/kayserisineklik.git

## Deploy (canlıya gönder)

```powershell
cd C:\Users\mosta\Desktop\kayserisineklik
npm run deploy:github
```

Hostinger otomatik `main`'i çeker.

## Günlük geliştirme

```powershell
# dev branch'te çalış
git checkout dev

# kaynak/lib/, kaynak/pure-html/ düzenle
npm run build
git add .
git commit -m "Açıklama"
npm run deploy:github   # main + dev push
```

## Yerel klasör yapısı (dev)

```
kaynak/           ← düzenle
1-CANLI-SITE/     ← build çıktısı (main'e gider)
2-ADMIN/          ← admin kaynağı
```

Detay: `DEPLOY.md`
