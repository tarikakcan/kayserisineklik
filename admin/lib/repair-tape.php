<?php
/**
 * Sineklik tamir bandı varyantları — JSON (pricing.json'dan ayrı).
 */

require_once __DIR__ . '/db.php';

function admin_repair_tape_path(): string
{
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir . '/repair-tape.json';
}

function admin_repair_tape_default_price(string $paket): float
{
    $map = [
        'Tek Parça' => 99,
        '12\'li Paket' => 990,
        '24\'lü Paket' => 1860,
        '36\'lı Paket' => 2610,
    ];
    return (float) ($map[$paket] ?? 0);
}

function admin_repair_tape_seed_variants(): array
{
    $colors = ['Gri', 'Siyah'];
    $packages = ['Tek Parça', '12\'li Paket', '24\'lü Paket', '36\'lı Paket'];
    $variants = [];
    foreach ($colors as $renk) {
        foreach ($packages as $paket) {
            $variants[] = [
                'id' => admin_repair_tape_variant_id($renk, 48, 200, 48, $paket),
                'renk' => $renk,
                'en' => 48,
                'boy' => 200,
                'genislik' => 48,
                'paket' => $paket,
                'fiyat' => admin_repair_tape_default_price($paket),
                'aktif' => true,
            ];
        }
    }
    return $variants;
}

function admin_repair_tape_variant_id(string $renk, float $en, float $boy, float $genislik, string $paket): string
{
    $base = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $renk . '-' . $en . '-' . $boy . '-' . $genislik . '-' . $paket));
    $base = trim($base, '-');
    return $base !== '' ? $base : 'variant-' . substr(md5((string) microtime(true)), 0, 8);
}

function admin_repair_tape_seed(): array
{
    return [
        'kdv_orani' => 0.20,
        'updated_at' => gmdate('c'),
        'variants' => admin_repair_tape_seed_variants(),
    ];
}

function admin_read_repair_tape_raw(): array
{
    $path = admin_repair_tape_path();
    if (!is_file($path)) {
        $seed = admin_repair_tape_seed();
        admin_write_repair_tape_raw($seed);
        return $seed;
    }
    $json = file_get_contents($path);
    $data = json_decode($json, true);
    if (!is_array($data) || !isset($data['variants']) || !is_array($data['variants'])) {
        $seed = admin_repair_tape_seed();
        admin_write_repair_tape_raw($seed);
        return $seed;
    }
    return $data;
}

function admin_write_repair_tape_raw(array $data): void
{
    $path = admin_repair_tape_path();
    $fp = fopen($path, 'c+');
    if ($fp === false) {
        throw new RuntimeException('Cannot open repair-tape data file');
    }
    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

function admin_repair_tape_public(): array
{
    admin_load_env();
    $raw = admin_read_repair_tape_raw();
    $variants = [];
    foreach ($raw['variants'] ?? [] as $row) {
        if (empty($row['aktif'])) {
            continue;
        }
        $paket = (string) ($row['paket'] ?? '');
        $fiyat = (float) ($row['fiyat'] ?? 0);
        if ($fiyat <= 0) {
            $fiyat = admin_repair_tape_default_price($paket);
        }
        $variants[] = [
            'id' => (string) ($row['id'] ?? ''),
            'renk' => (string) ($row['renk'] ?? ''),
            'en' => (float) ($row['en'] ?? 0),
            'boy' => (float) ($row['boy'] ?? 0),
            'genislik' => (float) ($row['genislik'] ?? 0),
            'paket' => $paket,
            'fiyat' => $fiyat,
        ];
    }
    return [
        'id' => 'sineklik-tamir-bandi',
        'name' => 'Sineklik Tamir Bandı',
        'kdv_orani' => (float) ($raw['kdv_orani'] ?? 0.20),
        'variants' => $variants,
        'updated_at' => $raw['updated_at'] ?? null,
    ];
}

function admin_save_repair_tape(array $payload): void
{
    $kdv = (float) ($payload['kdv_orani'] ?? 0.20);
    if ($kdv < 0 || $kdv > 1) {
        $kdv = 0.20;
    }

    $variants = [];
    $seen = [];
    foreach ($payload['variants'] ?? [] as $row) {
        if (!empty($row['_delete'])) {
            continue;
        }
        $renk = trim((string) ($row['renk'] ?? ''));
        $paket = trim((string) ($row['paket'] ?? ''));
        $en = (float) str_replace(',', '.', (string) ($row['en'] ?? 0));
        $boy = (float) str_replace(',', '.', (string) ($row['boy'] ?? 0));
        $genislik = (float) str_replace(',', '.', (string) ($row['genislik'] ?? 0));
        $fiyat = (float) str_replace(',', '.', (string) ($row['fiyat'] ?? 0));

        if ($renk === '' || $paket === '' || $en <= 0 || $boy <= 0 || $genislik <= 0) {
            continue;
        }

        $id = trim((string) ($row['id'] ?? ''));
        if ($id === '') {
            $id = admin_repair_tape_variant_id($renk, $en, $boy, $genislik, $paket);
        }
        if (isset($seen[$id])) {
            $id .= '-' . substr(md5((string) microtime(true) . $id), 0, 4);
        }
        $seen[$id] = true;

        $variants[] = [
            'id' => $id,
            'renk' => $renk,
            'en' => $en,
            'boy' => $boy,
            'genislik' => $genislik,
            'paket' => $paket,
            'fiyat' => max(0, $fiyat),
            'aktif' => !isset($row['aktif']) || !empty($row['aktif']),
        ];
    }

    admin_write_repair_tape_raw([
        'kdv_orani' => $kdv,
        'updated_at' => gmdate('c'),
        'variants' => $variants,
    ]);
}
