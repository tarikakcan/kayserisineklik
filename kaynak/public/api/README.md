# Form API — E-posta (SMTP)

İletişim (`contact.php`) ve teklif (`quote.php`) formları bu klasör üzerinden **info@edekakapi.com** adresine mail gönderir.

## Hostinger kurulumu (bir kez)

1. **hPanel → E-posta** hesabının şifresini bilin (`info@edekakapi.com`).
2. **Dosya Yöneticisi → public_html/api/** içinde `.env` oluşturun (`.env.example` şablonunu kopyalayın).
3. `SMTP_PASS=` alanına e-posta şifresini yazın, kaydedin.
4. `https://kayserisineklik.com.tr/api/status.php` adresini açın — `mail_configured: true` görmelisiniz.

`.env` dosyası Git ile deploy **edilmez**; sunucuda elle kalır.

## Test

- İletişim: site **İletişim** sayfasındaki form
- Teklif: ürün sayfası **Form ile Teklif** modalı

## Sorun giderme

| Belirti | Çözüm |
|--------|--------|
| `mail_configured: false` | `api/.env` eksik veya `SMTP_PASS` boş |
| 500 / gönderilemedi | Hostinger SMTP şifresini kontrol edin; port 587 deneyin, olmazsa `.env` içinde `SMTP_PORT=465` ve `SMTP_SECURE=ssl` |
| Form çalışıyor ama mail gelmiyor | Spam klasörü; `MAIL_TO` adresini doğrulayın |
