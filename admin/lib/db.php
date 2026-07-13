<?php
/**
 * Fiyat verisi — JSON dosyası (SQLite gerektirmez, Hostinger uyumlu).
 * Formül: ((En + Boy) × carpan1 + sabit) × carpan2  (KDV ve kargo hariç)
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
        ['id' => 'dikey-plise-sineklik', 'name' => 'Dikey Plise Sineklik', 'carpan1' => 3.6, 'sabit' => 215.0, 'carpan2' => 1.45],
        ['id' => 'duble-plise-sineklik', 'name' => 'Duble Plise Sineklik', 'carpan1' => 3.6, 'sabit' => 0.0, 'carpan2' => 1.45],
        ['id' => 'yatay-plise-sineklik', 'name' => 'Yatay Plise Sineklik', 'carpan1' => 3.6, 'sabit' => 215.0, 'carpan2' => 1.45],
        ['id' => 'menteseli-sineklik', 'name' => 'Menteşeli Sineklik', 'carpan1' => 3.6, 'sabit' => 0.0, 'carpan2' => 1.45],
        ['id' => 'kapi-sinekligi', 'name' => 'Kapı Sinekliği', 'carpan1' => 3.6, 'sabit' => 215.0, 'carpan2' => 1.45],
        ['id' => 'pencere-sinekligi', 'name' => 'Pencere Sinekliği', 'carpan1' => 3.6, 'sabit' => 0.0, 'carpan2' => 1.45],
        ['id' => 'kedi-sinekligi', 'name' => 'Kedi Sinekliği', 'carpan1' => 3.6, 'sabit' => 320.0, 'carpan2' => 1.45],
        ['id' => 'surgulu-sineklik', 'name' => 'Sürgülü Sineklik', 'carpan1' => 3.6, 'sabit' => 0.0, 'carpan2' => 1.45],
    ];
}

function admin_pricing_schema_ok(array $data): bool
{
    $first = $data[0] ?? null;
    if (!is_array($first)) {
        return false;
    }
    // Eski m² şeması → yeniden seed
    if (array_key_exists('birim_m2_fiyati', $first) || array_key_exists('minimum_fiyat', $first)) {
        return false;
    }
    return array_key_exists('carpan1', $first) && array_key_exists('sabit', $first) && array_key_exists('carpan2', $first);
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
    if (!is_array($data) || count($data) === 0 || !admin_pricing_schema_ok($data)) {
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
            'carpan1' => (float) ($row['carpan1'] ?? 3.6),
            'sabit' => (float) ($row['sabit'] ?? 0),
            'carpan2' => (float) ($row['carpan2'] ?? 1.45),
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
        $byId[$id]['carpan1'] = (float) $fields['carpan1'];
        $byId[$id]['sabit'] = (float) $fields['sabit'];
        $byId[$id]['carpan2'] = (float) $fields['carpan2'];
        $byId[$id]['updated_at'] = gmdate('c');
    }
    admin_write_products_raw(array_values($byId));
}
