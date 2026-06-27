# Admin — Fiyat API ve Panel

## Yerel çalıştırma

```bash
cd admin
copy .env.example .env
php scripts/hash-password.php SIFRENIZ
# Çıkan hash'i .env içindeki ADMIN_PASS_HASH satırına yapıştırın

php -S localhost:4000 router.php
```

- API: http://localhost:4000/api/pricing.php
- Panel: http://localhost:4000/admin/

## Hostinger deploy

1. `admin/` klasörünün tamamını `admin.kayserisineklik.com.tr` document root'a yükleyin
2. `data/` klasörü yazılabilir olmalı (chmod 755 veya 775)
3. `.env` dosyasını sunucuda oluşturun (`ADMIN_USER`, `ADMIN_PASS_HASH`)

## Depolama

Fiyatlar `data/pricing.json` dosyasında tutulur (SQLite gerekmez).
