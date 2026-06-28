<?php
declare(strict_types=1);

/**
 * Hostinger SMTP ile e-posta gönderimi (PHPMailer gerektirmez).
 * SMTP_SECURE=ssl + SMTP_PORT=465 veya SMTP_SECURE=tls + SMTP_PORT=587
 */
function form_send_mail(string $subject, string $htmlBody, ?string $replyToEmail = null, ?string $replyToName = null): void
{
    form_load_env();
    $from = form_env('MAIL_FROM', 'info@edekakapi.com');
    $toRaw = form_env('MAIL_TO', $from);
    $fromName = form_env('MAIL_FROM_NAME', 'Kayseri Sineklik Web');
    $host = form_env('SMTP_HOST', 'smtp.hostinger.com');
    $port = (int) (form_env('SMTP_PORT', '465') ?: 465);
    $user = form_env('SMTP_USER', $from);
    $pass = form_env('SMTP_PASS');
    $secure = strtolower(trim(form_env('SMTP_SECURE', $port === 465 ? 'ssl' : 'tls')));

    if ($pass === '') {
        throw new RuntimeException('SMTP yapılandırması eksik (api/.env içinde SMTP_PASS).');
    }

    $recipients = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', $toRaw))));
    if (!$recipients) {
        $recipients = [$from];
    }

    $ssl = [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'allow_self_signed' => false,
        'SNI_enabled' => true,
        'peer_name' => $host,
    ];
    $context = stream_context_create(['ssl' => $ssl]);
    $remote = ($secure === 'ssl' ? 'ssl' : 'tcp') . "://{$host}:{$port}";
    $socket = @stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        throw new RuntimeException("SMTP bağlantı hatası ({$host}:{$port}): {$errstr}");
    }

    stream_set_timeout($socket, 30);
    form_smtp_expect($socket, [220]);
    form_smtp_cmd($socket, 'EHLO kayserisineklik.com.tr', [250]);

    if ($secure === 'tls') {
        form_smtp_cmd($socket, 'STARTTLS', [220]);
        $crypto = STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $crypto |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
        }
        if (!stream_socket_enable_crypto($socket, true, $crypto)) {
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

    $body = form_smtp_dot_stuff($htmlBody);
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

    $message = implode("\r\n", $headers) . "\r\n\r\n" . $body . "\r\n.";
    fwrite($socket, $message . "\r\n");
    form_smtp_expect($socket, [250]);
    form_smtp_cmd($socket, 'QUIT', [221]);
    fclose($socket);
}

function form_smtp_dot_stuff(string $body): string
{
    $body = str_replace(["\r\n", "\r"], "\n", $body);
    $lines = explode("\n", $body);
    foreach ($lines as $i => $line) {
        if (str_starts_with($line, '.')) {
            $lines[$i] = '.' . $line;
        }
    }
    return implode("\r\n", $lines);
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

function form_mail_error_message(Throwable $e): string
{
    if (in_array(form_env('FORM_DEBUG'), ['1', 'true', 'yes'], true)) {
        return 'Talep gönderilemedi: ' . $e->getMessage();
    }
    return 'Talep gönderilemedi. Lütfen WhatsApp ile iletişime geçin.';
}

function form_contact_error_message(Throwable $e): string
{
    if (in_array(form_env('FORM_DEBUG'), ['1', 'true', 'yes'], true)) {
        return 'Mesaj gönderilemedi: ' . $e->getMessage();
    }
    return 'Mesaj gönderilemedi. Lütfen WhatsApp veya telefon ile ulaşın.';
}
