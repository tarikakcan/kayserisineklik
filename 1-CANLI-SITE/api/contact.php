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

if (!form_privacy_ok()) {
    form_json(false, ['error' => 'Gizlilik Politikası ve KVKK Aydınlatma Metni onayı zorunludur.'], 400);
}

$mailSubject = '[Kayseri Sineklik] İletişim Formu' . ($subject ? ' — ' . $subject : '');
$html = form_mail_wrap('Yeni İletişim Mesajı',
    form_mail_row('Ad Soyad', $name)
    . form_mail_row('Telefon', $phone)
    . form_mail_row('E-posta', $email)
    . form_mail_row('Konu', $subject)
    . form_mail_row('Mesaj', $message)
    . form_mail_row('KVKK Onayı', 'Evet')
    . form_mail_row('IP', form_client_ip())
    . form_mail_row('Tarih', date('d.m.Y H:i'))
);

try {
    form_send_mail($mailSubject, $html, $email ?: null, $name);
    form_json(true);
} catch (Throwable $e) {
    error_log('contact.php: ' . $e->getMessage());
    form_json(false, ['error' => form_contact_error_message($e)], 500);
}
