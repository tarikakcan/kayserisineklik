<?php
declare(strict_types=1);

$apiRoot = dirname(__DIR__);
$vendorAutoload = $apiRoot . '/vendor/autoload.php';
if (is_file($vendorAutoload)) {
    require_once $vendorAutoload;
}

function form_load_env(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }

    $apiRoot = dirname(__DIR__);
    if (class_exists(\Dotenv\Dotenv::class) && is_readable($apiRoot . '/.env')) {
        \Dotenv\Dotenv::createImmutable($apiRoot)->safeLoad();
        $loaded = true;
        return;
    }

    $candidates = [
        $apiRoot . '/.env',
        dirname($apiRoot) . '/api/.env',
    ];
    foreach ($candidates as $envFile) {
        if (!is_readable($envFile)) {
            continue;
        }
        $content = (string) file_get_contents($envFile);
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content) ?? $content;
        foreach (preg_split('/\R/', $content) as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = form_parse_env_value($value);
            if ($key === '') {
                continue;
            }
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
        break;
    }
    $loaded = true;
}

function form_parse_env_value(string $raw): string
{
    $raw = trim($raw);
    if ($raw === '') {
        return '';
    }
    $q = $raw[0];
    if (($q === '"' || $q === "'") && str_ends_with($raw, $q) && strlen($raw) >= 2) {
        return substr($raw, 1, -1);
    }
    if (($pos = strpos($raw, ' #')) !== false) {
        $raw = substr($raw, 0, $pos);
    }
    return trim($raw);
}

function form_env_raw(string $key): string
{
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return (string) $_ENV[$key];
    }
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '' && !str_starts_with($key, 'HTTP_')) {
        return (string) $_SERVER[$key];
    }
    $v = getenv($key);
    if ($v !== false && $v !== '') {
        return (string) $v;
    }
    return '';
}

/** Hostinger (.env) ve eski anahtar adlarını destekler */
function form_env(string $key, string $default = ''): string
{
    form_load_env();
    $aliases = [
        'SMTP_USER' => ['SMTP_USERNAME', 'SMTP_USER'],
        'SMTP_PASS' => ['SMTP_PASSWORD', 'SMTP_PASS'],
        'SMTP_SECURE' => ['SMTP_ENCRYPTION', 'SMTP_SECURE'],
        'MAIL_FROM' => ['SMTP_FROM', 'MAIL_FROM'],
        'MAIL_FROM_NAME' => ['SMTP_FROM_NAME', 'MAIL_FROM_NAME'],
        'MAIL_TO' => ['MAIL_TO', 'SMTP_FROM', 'MAIL_FROM'],
    ];
    foreach ($aliases[$key] ?? [$key] as $candidate) {
        $value = form_env_raw($candidate);
        if ($value !== '') {
            return $value;
        }
    }
    return $default;
}

function form_env_file(): ?string
{
    $apiRoot = dirname(__DIR__);
    $candidates = [
        $apiRoot . '/.env',
        dirname($apiRoot) . '/api/.env',
    ];
    foreach ($candidates as $path) {
        if (is_readable($path)) {
            return $path;
        }
    }
    return null;
}

function form_json(bool $ok, array $extra = [], int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge(['ok' => $ok], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function form_cors(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = form_env('CORS_ORIGINS');
        if ($allowed === '*' || ($origin && ($allowed === '*' || str_contains($allowed, $origin)))) {
            header('Access-Control-Allow-Origin: ' . ($allowed === '*' ? '*' : $origin));
        }
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        return;
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = form_env('CORS_ORIGINS');
    if ($origin && $allowed !== '' && ($allowed === '*' || str_contains($allowed, $origin))) {
        header('Access-Control-Allow-Origin: ' . ($allowed === '*' ? '*' : $origin));
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}

function form_require_post(): void
{
    form_cors();
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        form_json(false, ['error' => 'Method not allowed'], 405);
    }
}

function form_honeypot_ok(): bool
{
    return trim((string) ($_POST['website'] ?? '')) === '';
}

function form_client_ip(): string
{
    $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($xff !== '') {
        $parts = array_map('trim', explode(',', $xff));
        if ($parts[0] !== '') {
            return $parts[0];
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function form_rate_limit_ok(string $bucket, int $max = 5, int $windowSec = 600): bool
{
    $dir = __DIR__ . '/../data/rate-limit';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $ip = preg_replace('/[^a-zA-Z0-9\.\:]/', '', form_client_ip());
    $file = $dir . '/' . $bucket . '_' . md5($ip) . '.json';
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = json_decode((string) file_get_contents($file), true) ?: [];
        $hits = array_values(array_filter($hits, static fn ($t) => ($now - (int) $t) < $windowSec));
    }
    if (count($hits) >= $max) {
        return false;
    }
    $hits[] = $now;
    file_put_contents($file, json_encode($hits));
    return true;
}

function form_str(string $key, int $max = 500): string
{
    $v = trim((string) ($_POST[$key] ?? ''));
    if (mb_strlen($v) > $max) {
        $v = mb_substr($v, 0, $max);
    }
    return $v;
}

function form_email(string $key): string
{
    $v = trim((string) ($_POST[$key] ?? ''));
    if ($v === '') {
        return '';
    }
    return filter_var($v, FILTER_VALIDATE_EMAIL) ? $v : '';
}

function form_esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

require_once __DIR__ . '/mail.php';
