<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

form_load_env();

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'ok' => true,
    'mail_configured' => (getenv('SMTP_PASS') ?: '') !== '',
    'mail_to' => getenv('MAIL_TO') ?: getenv('MAIL_FROM') ?: '',
], JSON_UNESCAPED_UNICODE);
