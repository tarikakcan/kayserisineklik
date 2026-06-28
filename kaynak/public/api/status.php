<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

form_load_env();

header('Content-Type: application/json; charset=utf-8');
$pass = form_env('SMTP_PASS');
echo json_encode([
    'ok' => true,
    'env_file' => form_env_file() !== null,
    'mail_configured' => $pass !== '',
    'smtp_host' => form_env('SMTP_HOST', 'smtp.hostinger.com'),
    'smtp_port' => (int) (form_env('SMTP_PORT', '465') ?: 465),
    'smtp_secure' => form_env('SMTP_SECURE', 'ssl'),
    'smtp_user' => form_env('SMTP_USER', form_env('MAIL_FROM', '')),
    'mail_to' => form_env('MAIL_TO', form_env('MAIL_FROM', '')),
], JSON_UNESCAPED_UNICODE);
