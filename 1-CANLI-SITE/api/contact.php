<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

form_require_post();
form_load_env();

if (!form_honeypot_ok()) {
    form_json(true);
}

if (!form_rate_limit_ok('contact')) {
    form_json(false, ['error' => 'Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin.'], 429);
}

$name = form_str('name', 120);
$phone = form_str('phone', 40);
$email = form_email('email');
$subject = form_str('subject', 160);
$message = form_str('message', 5000);

if ($name === '' || $phone === '') {
    form_json(false, ['error' => 'Ad ve telefon zorunludur.'], 400);
}

$mailSubject = '[Kayseri Sineklik] İletişim Formu' . ($subject ? ' — ' . $subject : '');
$html = '<html><body style="font-family:system-ui,sans-serif;color:#2d2419;">'
    . '<h2 style="color:#c45a1f;">Yeni İletişim Mesajı</h2>'
    . '<table style="border-collapse:collapse;width:100%;max-width:560px;">'
    . form_mail_row('Ad Soyad', $name)
    . form_mail_row('Telefon', $phone)
    . form_mail_row('E-posta', $email)
    . form_mail_row('Konu', $subject)
    . form_mail_row('Mesaj', $message)
    . form_mail_row('IP', form_client_ip())
    . form_mail_row('Tarih', date('d.m.Y H:i'))
    . '</table></body></html>';

try {
    form_send_mail($mailSubject, $html, $email ?: null, $name);
    form_json(true);
} catch (Throwable $e) {
    error_log('contact.php: ' . $e->getMessage());
    form_json(false, ['error' => 'Mesaj gönderilemedi. Lütfen WhatsApp veya telefon ile ulaşın.'], 500);
}
