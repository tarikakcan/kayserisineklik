<?php
/**
 * Oturum ve admin kimlik doğrulama.
 */

function admin_start_session(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start([
            'cookie_httponly' => true,
            'cookie_samesite' => 'Lax',
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
