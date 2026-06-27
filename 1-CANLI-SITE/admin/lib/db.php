<?php
/**
 * Fiyat verisi — JSON dosyası (SQLite gerektirmez, Hostinger uyumlu).
 */

function admin_load_env(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $envFile = dirname(__DIR__) . '/.env';
    if (!is_file($envFile)) {
        $loaded = true;
        return;
    }
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
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
    $loaded = true;
}

function admin_data_path(): string
{
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir . '/pricing.json';
}

function admin_seed_products(): array
{
    return [
        ['id' => 'dikey-plise-sineklik', 'name' => 'Dikey Plise Sineklik', 'birim_m2_fiyati' => 1450, 'minimum_fiyat' => 850, 'kdv_orani' => 0.20],
        ['id' => 'duble-plise-sineklik', 'name' => 'Duble Plise Sineklik', 'birim_m2_fiyati' => 1750, 'minimum_fiyat' => 1100, 'kdv_orani' => 0.20],
        ['id' => 'yatay-plise-sineklik', 'name' => 'Yatay Plise Sineklik', 'birim_m2_fiyati' => 1550, 'minimum_fiyat' => 900, 'kdv_orani' => 0.20],
        ['id' => 'menteseli-sineklik', 'name' => 'Menteşeli Sineklik', 'birim_m2_fiyati' => 1100, 'minimum_fiyat' => 750, 'kdv_orani' => 0.20],
        ['id' => 'kapi-sinekligi', 'name' => 'Kapı Sinekliği', 'birim_m2_fiyati' => 1650, 'minimum_fiyat' => 1100, 'kdv_orani' => 0.20],
        ['id' => 'pencere-sinekligi', 'name' => 'Pencere Sinekliği', 'birim_m2_fiyati' => 900, 'minimum_fiyat' => 450, 'kdv_orani' => 0.20],
        ['id' => 'kedi-sinekligi', 'name' => 'Kedi Sinekliği', 'birim_m2_fiyati' => 1350, 'minimum_fiyat' => 850, 'kdv_orani' => 0.20],
        ['id' => 'surgulu-sineklik', 'name' => 'Sürgülü Sineklik', 'birim_m2_fiyati' => 1450, 'minimum_fiyat' => 1050, 'kdv_orani' => 0.20],
    ];
}

function admin_read_products_raw(): array
{
    $path = admin_data_path();
    if (!is_file($path)) {
        $seed = admin_seed_products();
        admin_write_products_raw($seed);
        return $seed;
    }
    $json = file_get_contents($path);
    $data = json_decode($json, true);
    if (!is_array($data) || count($data) === 0) {
        $seed = admin_seed_products();
        admin_write_products_raw($seed);
        return $seed;
    }
    return $data;
}

function admin_write_products_raw(array $rows): void
{
    $path = admin_data_path();
    $fp = fopen($path, 'c+');
    if ($fp === false) {
        throw new RuntimeException('Cannot open pricing data file');
    }
    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

function admin_all_products(): array
{
    admin_load_env();
    $rows = admin_read_products_raw();
    return array_map(static function (array $row): array {
        return [
            'id' => $row['id'],
            'name' => $row['name'],
            'birim_m2_fiyati' => (float) $row['birim_m2_fiyati'],
            'minimum_fiyat' => (float) $row['minimum_fiyat'],
            'kdv_orani' => (float) ($row['kdv_orani'] ?? 0.20),
        ];
    }, $rows);
}

function admin_update_products(array $updates): void
{
    $rows = admin_read_products_raw();
    $byId = [];
    foreach ($rows as $row) {
        $byId[$row['id']] = $row;
    }
    foreach ($updates as $id => $fields) {
        if (!isset($byId[$id])) {
            continue;
        }
        $byId[$id]['birim_m2_fiyati'] = (float) $fields['birim_m2_fiyati'];
        $byId[$id]['minimum_fiyat'] = (float) $fields['minimum_fiyat'];
        $byId[$id]['kdv_orani'] = (float) $fields['kdv_orani'];
        $byId[$id]['updated_at'] = gmdate('c');
    }
    admin_write_products_raw(array_values($byId));
}
