<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

function form_send_mail(string $subject, string $htmlBody, ?string $replyToEmail = null, ?string $replyToName = null): void
{
    if (class_exists(PHPMailer::class, false) || class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
        form_send_mail_phpmailer($subject, $htmlBody, $replyToEmail, $replyToName);
        return;
    }
    form_send_mail_socket($subject, $htmlBody, $replyToEmail, $replyToName);
}

/** Hostinger önerisi — PHPMailer (composer install sonrası) */
function form_send_mail_phpmailer(string $subject, string $htmlBody, ?string $replyToEmail, ?string $replyToName): void
{
    form_load_env();
    $host = form_env('SMTP_HOST', 'smtp.hostinger.com');
    $port = (int) (form_env('SMTP_PORT', '465') ?: 465);
    $user = form_env('SMTP_USER');
    $pass = form_env('SMTP_PASS');
    $secure = strtolower(form_env('SMTP_SECURE', $port === 465 ? 'ssl' : 'tls'));
    $from = form_env('MAIL_FROM', $user ?: 'info@edekakapi.com');
    $fromName = form_env('MAIL_FROM_NAME', 'Kayseri Sineklik');
    $toRaw = form_env('MAIL_TO', $from);

    if ($pass === '') {
        throw new RuntimeException('SMTP yapılandırması eksik (api/.env içinde SMTP_PASSWORD).');
    }

    $recipients = form_mail_recipients($toRaw, $from);
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = $secure;
        $mail->Port = $port;
        $mail->CharSet = PHPMailer::CHARSET_UTF8;

        $mail->setFrom($from, $fromName);
        foreach ($recipients as $rcpt) {
            $mail->addAddress($rcpt);
        }
        if ($replyToEmail && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($replyToEmail, $replyToName ?: $replyToEmail);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = trim(strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody)));

        $mail->send();
    } catch (MailException $e) {
        throw new RuntimeException($mail->ErrorInfo ?: $e->getMessage(), 0, $e);
    }
}

/** Yedek — PHPMailer yoksa ham SMTP soketi */
function form_send_mail_socket(string $subject, string $htmlBody, ?string $replyToEmail, ?string $replyToName): void
{
    form_load_env();
    $from = form_env('MAIL_FROM', 'info@edekakapi.com');
    $toRaw = form_env('MAIL_TO', $from);
    $fromName = form_env('MAIL_FROM_NAME', 'Kayseri Sineklik');
    $host = form_env('SMTP_HOST', 'smtp.hostinger.com');
    $port = (int) (form_env('SMTP_PORT', '465') ?: 465);
    $user = form_env('SMTP_USER', $from);
    $pass = form_env('SMTP_PASS');
    $secure = strtolower(trim(form_env('SMTP_SECURE', $port === 465 ? 'ssl' : 'tls')));

    if ($pass === '') {
        throw new RuntimeException('SMTP yapılandırması eksik (api/.env içinde SMTP_PASSWORD).');
    }

    $recipients = form_mail_recipients($toRaw, $from);
    $context = stream_context_create(['ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'SNI_enabled' => true,
        'peer_name' => $host,
    ]]);
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

    $message = implode("\r\n", $headers) . "\r\n\r\n" . form_smtp_dot_stuff($htmlBody) . "\r\n.";
    fwrite($socket, $message . "\r\n");
    form_smtp_expect($socket, [250]);
    form_smtp_cmd($socket, 'QUIT', [221]);
    fclose($socket);
}

/** @return list<string> */
function form_mail_recipients(string $toRaw, string $fallback): array
{
    $recipients = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', $toRaw))));
    $out = [];
    foreach ($recipients ?: [$fallback] as $rcpt) {
        if (filter_var($rcpt, FILTER_VALIDATE_EMAIL)) {
            $out[] = $rcpt;
        }
    }
    return $out ?: [$fallback];
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
