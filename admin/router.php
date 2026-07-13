<?php
/**
 * PHP yerleşik sunucu yönlendiricisi.
 * Kullanım: cd admin && php -S localhost:4000 router.php
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;

if ($path !== '/' && is_file($file)) {
    return false;
}

if ($path === '/' || $path === '/admin' || $path === '/admin/') {
    require __DIR__ . '/admin/index.php';
    return true;
}

http_response_code(404);
echo 'Not found';
return true;
