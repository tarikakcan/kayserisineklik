<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

form_require_post();
form_load_env();

if (!form_honeypot_ok()) {
    form_json(true);
}

if (!form_rate_limit_ok('quote')) {
    form_json(false, ['error' => 'Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin.'], 429);
}

$name = form_str('name', 120);
$phone = form_str('phone', 40);
$email = form_email('email');
$note = form_str('note', 3000);
$product = form_str('product', 160);
$width = form_str('width', 20);
$height = form_str('height', 20);
$quantity = form_str('quantity', 10);
$color = form_str('color', 40);
$option = form_str('option', 80);
$price = form_str('price', 20);

if ($name === '' || $phone === '') {
    form_json(false, ['error' => 'Ad ve telefon zorunludur.'], 400);
}

$mailSubject = '[Kayseri Sineklik] Yeni Teklif Talebi' . ($product ? ' — ' . $product : '');
$olcu = ($width !== '' && $height !== '') ? "{$width} x {$height} cm" : '';
$priceNum = is_numeric($price) ? (float) $price : 0;
$priceLine = $priceNum > 0 ? '₺' . number_format($priceNum, 0, ',', '.') . ' (KDV dahil yaklaşık)' : '';
$secenek = trim($color !== '' ? $color : $option);

$html = form_mail_wrap('Yeni Teklif Talebi',
    form_mail_row('Ad Soyad', $name)
    . form_mail_row('Telefon', $phone)
    . form_mail_row('E-posta', $email)
    . form_mail_row('Ürün', $product)
    . form_mail_row('Adet', $quantity)
    . form_mail_row('Ölçü', $olcu)
    . form_mail_row('Renk / Açılım', $secenek)
    . form_mail_row('Yaklaşık Fiyat', $priceLine)
    . form_mail_row('Not', $note)
    . form_mail_row('IP', form_client_ip())
    . form_mail_row('Tarih', date('d.m.Y H:i'))
);

try {
    form_send_mail($mailSubject, $html, $email ?: null, $name);
    form_json(true);
} catch (Throwable $e) {
    error_log('quote.php: ' . $e->getMessage());
    form_json(false, ['error' => 'Talep gönderilemedi. Lütfen WhatsApp ile iletişime geçin.'], 500);
}
