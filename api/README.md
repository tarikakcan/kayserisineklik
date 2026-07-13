# Form API — Hostinger SMTP

Site formları `api/contact.php` ve `api/quote.php` üzerinden mail gönderir.

## .env (Hostinger panelindeki isimlerle aynı)

`public_html/api/.env` dosyasına yapıştırın:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_ENCRYPTION=ssl
SMTP_USERNAME=info@edekakapi.com
SMTP_PASSWORD=gercek-sifre
SMTP_FROM=info@edekakapi.com
SMTP_FROM_NAME=Kayseri Sineklik
```

## Kontrol

`https://kayserisineklik.com.tr/api/status.php` → `{"ok":true,"mail_configured":true}`

Ayrıntılı SMTP bilgisi için `.env` içine rastgele bir `STATUS_SECRET` ekleyin ve şu adresi kullanın:

`https://kayserisineklik.com.tr/api/status.php?key=STATUS_SECRET_DEGERINIZ`

## PHPMailer (isteğe bağlı)

Hostinger kod örneği PHPMailer kullanır. Sunucuda bir kez:

```bash
cd public_html/api
composer install --no-dev
```

`vendor/` oluşunca PHPMailer otomatik devreye girer. Yoksa yerleşik SMTP soketi kullanılır.

## Hata ayıklama

`.env` içine geçici olarak `FORM_DEBUG=true` ekleyin; form hata mesajında SMTP detayı görünür.
