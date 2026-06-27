<?php
declare(strict_types=1);

function form_load_env(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $candidates = [
        __DIR__ . '/../.env',
        dirname(__DIR__, 2) . '/api/.env',
    ];
    foreach ($candidates as $envFile) {
        if (!is_file($envFile)) {
            continue;
        }
        foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value, " \t\"'");
            if ($key !== '' && getenv($key) === false) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
        break;
    }
    $loaded = true;
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
        $allowed = getenv('CORS_ORIGINS') ?: '';
        if ($allowed === '*' || ($origin && ($allowed === '*' || str_contains($allowed, $origin)))) {
            header('Access-Control-Allow-Origin: ' . ($allowed === '*' ? '*' : $origin));
        }
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        return;
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = getenv('CORS_ORIGINS') ?: '';
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
    return $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? '0.0.0.0';
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
