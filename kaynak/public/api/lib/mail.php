<?php
declare(strict_types=1);

/**
 * Hostinger SMTP ile e-posta gönderimi (PHPMailer gerektirmez).
 * SMTP_SECURE=ssl + SMTP_PORT=465 veya SMTP_SECURE=tls + SMTP_PORT=587
 */
function form_send_mail(string $subject, string $htmlBody, ?string $replyToEmail = null, ?string $replyToName = null): void
{
    form_load_env();
    $from = getenv('MAIL_FROM') ?: 'info@edekakapi.com';
    $toRaw = getenv('MAIL_TO') ?: $from;
    $fromName = getenv('MAIL_FROM_NAME') ?: 'Kayseri Sineklik Web';
    $host = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
    $port = (int) (getenv('SMTP_PORT') ?: 587);
    $user = getenv('SMTP_USER') ?: $from;
    $pass = getenv('SMTP_PASS') ?: '';
    $secure = strtolower(trim(getenv('SMTP_SECURE') ?: ($port === 465 ? 'ssl' : 'tls')));

    if ($pass === '') {
        throw new RuntimeException('SMTP yapılandırması eksik (api/.env içinde SMTP_PASS).');
    }

    $recipients = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', $toRaw))));
    if (!$recipients) {
        $recipients = [$from];
    }

    $remote = ($secure === 'ssl' ? 'ssl' : 'tcp') . "://{$host}:{$port}";
    $socket = @stream_socket_client($remote, $errno, $errstr, 25);
    if (!$socket) {
        throw new RuntimeException("SMTP bağlantı hatası: {$errstr}");
    }

    stream_set_timeout($socket, 25);
    form_smtp_expect($socket, [220]);
    form_smtp_cmd($socket, 'EHLO kayserisineklik.com.tr', [250]);

    if ($secure === 'tls') {
        form_smtp_cmd($socket, 'STARTTLS', [220]);
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('STARTTLS başarısız.');
        }
        form_smtp_cmd($socket, 'EHLO kayserisineklik.com.tr', [250]);
    }

    form_smtp_cmd($socket, 'AUTH LOGIN', [334]);
    form_smtp_cmd($socket, base64_encode($user), [334]);
    form_smtp_cmd($socket, base64_encode($pass), [235]);

    form_smtp_cmd($socket, 'MAIL FROM:<' . $from . '>', [250]);
    foreach ($recipients as $rcpt) {
        if (!filter_var($rcpt, FILTER_VALIDATE_EMAIL)) {
            continue;
        }
        form_smtp_cmd($socket, 'RCPT TO:<' . $rcpt . '>', [250, 251]);
    }
    form_smtp_cmd($socket, 'DATA', [354]);

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . form_encode_header($fromName) . ' <' . $from . '>',
        'To: ' . implode(', ', array_map(static fn ($r) => '<' . $r . '>', $recipients)),
        'Subject: ' . form_encode_header($subject),
        'Date: ' . date('r'),
        'X-Mailer: KayseriSineklik-Form',
    ];
    if ($replyToEmail && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
        $label = $replyToName ? form_encode_header($replyToName) . ' ' : '';
        $headers[] = 'Reply-To: ' . $label . '<' . $replyToEmail . '>';
    }

    $message = implode("\r\n", $headers) . "\r\n\r\n" . $htmlBody . "\r\n.";
    fwrite($socket, $message . "\r\n");
    form_smtp_expect($socket, [250]);
    form_smtp_cmd($socket, 'QUIT', [221]);
    fclose($socket);
}

function form_encode_header(string $text): string
{
    return '=?UTF-8?B?' . base64_encode($text) . '?=';
}

/** @param resource $socket */
function form_smtp_cmd($socket, string $cmd, array $okCodes): string
{
    fwrite($socket, $cmd . "\r\n");
    return form_smtp_expect($socket, $okCodes);
}

/** @param resource $socket */
function form_smtp_expect($socket, array $okCodes): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $okCodes, true)) {
        throw new RuntimeException('SMTP hatası: ' . trim($response));
    }
    return $response;
}

function form_mail_row(string $label, string $value): string
{
    if ($value === '') {
        return '';
    }
    return '<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top;width:120px;">' . form_esc($label) . '</td><td style="padding:6px 12px;">' . nl2br(form_esc($value)) . '</td></tr>';
}

function form_mail_wrap(string $title, string $rows): string
{
    return '<html><body style="font-family:system-ui,sans-serif;color:#2d2419;line-height:1.5;">'
        . '<h2 style="color:#c45a1f;margin:0 0 12px;">' . form_esc($title) . '</h2>'
        . '<table style="border-collapse:collapse;width:100%;max-width:560px;">' . $rows . '</table>'
        . '<p style="margin-top:16px;font-size:12px;color:#888;">kayserisineklik.com.tr form bildirimi</p>'
        . '</body></html>';
}
