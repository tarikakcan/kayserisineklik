<?php
/**
 * Oturum ve admin kimlik doğrulama.
 */

function admin_is_https(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }
    if (($_SERVER['SERVER_PORT'] ?? '') === '443') {
        return true;
    }
    return strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
}

function admin_start_session(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start([
            'cookie_httponly' => true,
            'cookie_samesite' => 'Lax',
            'cookie_secure' => admin_is_https(),
        ]);
    }
}

function admin_is_logged_in(): bool
{
    admin_start_session();
    return !empty($_SESSION['admin_logged_in']);
}

function admin_require_login(): void
{
    if (!admin_is_logged_in()) {
        header('Location: /');
        exit;
    }
}

function admin_client_ip(): string
{
    return preg_replace('/[^a-zA-Z0-9\.\:]/', '', (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'));
}

function admin_rate_limit_path(string $bucket): string
{
    $dir = dirname(__DIR__) . '/data/rate-limit';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir . '/' . $bucket . '_' . md5(admin_client_ip()) . '.json';
}

function admin_rate_limit_hits(string $bucket, int $windowSec): array
{
    $file = admin_rate_limit_path($bucket);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = json_decode((string) file_get_contents($file), true) ?: [];
        $hits = array_values(array_filter($hits, static fn ($t) => ($now - (int) $t) < $windowSec));
    }
    return $hits;
}

function admin_login_rate_limit_ok(int $max = 5, int $windowSec = 900): bool
{
    return count(admin_rate_limit_hits('admin_login', $windowSec)) < $max;
}

function admin_login_rate_limit_hit(): void
{
    $file = admin_rate_limit_path('admin_login');
    $hits = admin_rate_limit_hits('admin_login', 900);
    $hits[] = time();
    file_put_contents($file, json_encode($hits));
}

function admin_login_rate_limit_clear(): void
{
    $file = admin_rate_limit_path('admin_login');
    if (is_file($file)) {
        unlink($file);
    }
}

function admin_csrf_token(): string
{
    admin_start_session();
    if (empty($_SESSION['admin_csrf'])) {
        $_SESSION['admin_csrf'] = bin2hex(random_bytes(32));
    }
    return (string) $_SESSION['admin_csrf'];
}

function admin_csrf_verify(): bool
{
    admin_start_session();
    $token = (string) ($_POST['csrf_token'] ?? '');
    $expected = (string) ($_SESSION['admin_csrf'] ?? '');
    return $expected !== '' && hash_equals($expected, $token);
}

function admin_csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(admin_csrf_token(), ENT_QUOTES, 'UTF-8') . '">';
}

function admin_verify_credentials(string $user, string $pass): bool
{
    admin_load_env();
    $expectedUser = getenv('ADMIN_USER') ?: 'admin';
    $hash = getenv('ADMIN_PASS_HASH') ?: '';

    if ($user !== $expectedUser) {
        return false;
    }
    if ($hash === '') {
        return false;
    }
    return password_verify($pass, $hash);
}

function admin_login(string $user, string $pass): bool
{
    if (!admin_verify_credentials($user, $pass)) {
        return false;
    }
    admin_start_session();
    session_regenerate_id(true);
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user'] = $user;
    return true;
}

function admin_logout(): void
{
    admin_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

require_once __DIR__ . '/db.php';
