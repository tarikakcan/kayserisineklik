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
| `mail_configured: false` | `api/.env` eksik, `SMTP_PASS` boş veya dosya adı `.env.txt` |
| 500 / gönderilemedi | Şifreyi tırnak içine alın; port 465+ssl veya 587+tls deneyin |
| Form çalışıyor ama mail gelmiyor | Spam klasörü; `MAIL_TO` adresini doğrulayın |
| Hata mesajını görmek | `.env` içine `FORM_DEBUG=true` ekleyin, formu tekrar deneyin |
