<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

form_load_env();

header('Content-Type: application/json; charset=utf-8');

$pass = form_env('SMTP_PASS');
$response = [
    'ok' => true,
    'mail_configured' => $pass !== '',
];

$secret = form_env('STATUS_SECRET');
$key = (string) ($_GET['key'] ?? '');
if ($secret !== '' && hash_equals($secret, $key)) {
    $response['env_file'] = form_env_file() !== null;
    $response['phpmailer'] = class_exists(\PHPMailer\PHPMailer\PHPMailer::class);
    $response['smtp_host'] = form_env('SMTP_HOST', 'smtp.hostinger.com');
    $response['smtp_port'] = (int) (form_env('SMTP_PORT', '465') ?: 465);
    $response['smtp_encryption'] = form_env('SMTP_SECURE', 'ssl');
    $response['smtp_user'] = form_env('SMTP_USER', form_env('MAIL_FROM', ''));
    $response['mail_to'] = form_env('MAIL_TO', form_env('MAIL_FROM', ''));
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
