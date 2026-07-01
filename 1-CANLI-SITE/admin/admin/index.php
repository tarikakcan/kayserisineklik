<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/auth.php';
require_once dirname(__DIR__) . '/lib/repair-tape.php';

admin_start_session();

if (isset($_GET['logout'])) {
    admin_logout();
    header('Location: /');
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if (!admin_csrf_verify()) {
        $error = 'Oturum doğrulanamadı. Sayfayı yenileyip tekrar deneyin.';
    } elseif (!admin_login_rate_limit_ok()) {
        $error = 'Çok fazla başarısız deneme. Lütfen 15 dakika sonra tekrar deneyin.';
    } else {
        $user = trim($_POST['username'] ?? '');
        $pass = $_POST['password'] ?? '';
        if (admin_login($user, $pass)) {
            admin_login_rate_limit_clear();
            header('Location: /');
            exit;
        }
        admin_login_rate_limit_hit();
        $error = 'Kullanıcı adı veya şifre hatalı.';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_pricing'])) {
    admin_require_login();
    if (!admin_csrf_verify()) {
        $error = 'İşlem doğrulanamadı. Sayfayı yenileyip tekrar deneyin.';
    } else {
        $updates = [];
        foreach ($_POST['products'] ?? [] as $id => $fields) {
            $id = preg_replace('/[^a-z0-9\-]/', '', (string) $id);
            if ($id === '') {
                continue;
            }
            $m2 = (float) str_replace(',', '.', (string) ($fields['birim_m2_fiyati'] ?? 0));
            $min = (float) str_replace(',', '.', (string) ($fields['minimum_fiyat'] ?? 0));
            $kdv = (float) str_replace(',', '.', (string) ($fields['kdv_orani'] ?? 0.20));
            if ($m2 <= 0 || $min < 0 || $kdv < 0 || $kdv > 1) {
                continue;
            }
            $updates[$id] = [
                'birim_m2_fiyati' => $m2,
                'minimum_fiyat' => $min,
                'kdv_orani' => $kdv,
            ];
        }
        admin_update_products($updates);
        $success = 'Sineklik m² fiyatları kaydedildi.';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_repair_tape'])) {
    admin_require_login();
    if (!admin_csrf_verify()) {
        $error = 'İşlem doğrulanamadı. Sayfayı yenileyip tekrar deneyin.';
    } else {
        admin_save_repair_tape([
            'kdv_orani' => $_POST['repair_kdv_orani'] ?? 0.20,
            'variants' => $_POST['variants'] ?? [],
        ]);
        $success = 'Tamir bandı ürünleri kaydedildi.';
    }
}

$loggedIn = admin_is_logged_in();
$products = $loggedIn ? admin_all_products() : [];
$repairTape = $loggedIn ? admin_read_repair_tape_raw() : ['kdv_orani' => 0.20, 'variants' => []];
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kayseri Sineklik — Fiyat Yönetimi</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f7f3ec; color: #2d2419; margin: 0; padding: 24px; }
    .box { max-width: 1100px; margin: 0 auto 24px; background: #fff; border: 1px solid #e4d8c8; border-radius: 12px; padding: 24px; }
    h1 { margin: 0 0 8px; font-size: 1.4rem; color: #c45a1f; }
    h2 { margin: 0 0 8px; font-size: 1.1rem; color: #2d2419; }
    p { color: #6b5f52; }
    label { display: block; font-size: 0.85rem; margin-bottom: 4px; }
    input[type=text], input[type=password], input[type=number] { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.85rem; }
    th, td { border-bottom: 1px solid #eee; padding: 8px 6px; text-align: left; vertical-align: middle; }
    th { background: #faf6f0; font-size: 0.78rem; }
    .btn { display: inline-block; background: #c45a1f; color: #fff; border: 0; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
    .btn.secondary { background: #2f5d52; text-decoration: none; color: #fff; }
    .btn.ghost { background: #f0ebe3; color: #2d2419; }
    .btn.danger { background: #b42318; }
    .msg { padding: 10px 12px; border-radius: 8px; margin: 12px 0; }
    .err { background: #fde8e8; color: #9b1c1c; }
    .ok { background: #e8f5ee; color: #1f6b42; }
    .row-actions { margin-top: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .num { width: 100%; min-width: 70px; }
    .num-sm { max-width: 88px; }
    .section-gap { margin-top: 28px; padding-top: 24px; border-top: 1px solid #eee; }
    .chk { width: auto; margin: 0; }
    .toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
    .kdv-inline { max-width: 120px; }
    @media (max-width: 900px) {
      table, thead, tbody, th, td, tr { display: block; }
      thead { display: none; }
      tr { border: 1px solid #eee; border-radius: 10px; margin-bottom: 12px; padding: 10px; }
      td { border: 0; padding: 6px 0; }
      td::before { content: attr(data-label); display: block; font-size: 0.72rem; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 4px; }
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>Kayseri Sineklik — Fiyat Yönetimi</h1>
    <?php if (!$loggedIn): ?>
      <p>Admin paneline giriş yapın.</p>
      <?php if ($error): ?><div class="msg err"><?= htmlspecialchars($error) ?></div><?php endif; ?>
      <form method="post" style="max-width:360px;margin-top:16px;">
        <input type="hidden" name="login" value="1">
        <?= admin_csrf_field() ?>
        <div style="margin-bottom:12px;">
          <label>Kullanıcı adı</label>
          <input type="text" name="username" required autocomplete="username">
        </div>
        <div style="margin-bottom:12px;">
          <label>Şifre</label>
          <input type="password" name="password" required autocomplete="current-password">
        </div>
        <button class="btn" type="submit">Giriş Yap</button>
      </form>
    <?php else: ?>
      <?php if ($success): ?><div class="msg ok"><?= htmlspecialchars($success) ?></div><?php endif; ?>

      <p>Ölçüye özel sinekliklerin m² fiyatlarını ve tamir bandı paket ürünlerini buradan yönetin. Değişiklikler sitede birkaç dakika içinde yansır.</p>

      <form method="post">
        <input type="hidden" name="update_pricing" value="1">
        <?= admin_csrf_field() ?>
        <h2>Sineklik Modelleri (m²)</h2>
        <p style="margin-top:0;font-size:0.9rem;">8 ürünün m² birim fiyatı (KDV hariç), minimum fiyat (KDV hariç) ve KDV oranı.</p>
        <table>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>m² Fiyat (KDV hariç)</th>
              <th>Min. Fiyat (KDV hariç)</th>
              <th>KDV Oranı</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($products as $p): ?>
              <tr>
                <td data-label="Ürün">
                  <strong><?= htmlspecialchars($p['name']) ?></strong><br>
                  <small><?= htmlspecialchars($p['id']) ?></small>
                </td>
                <td data-label="m² Fiyat"><input class="num" type="number" step="1" min="1" name="products[<?= htmlspecialchars($p['id']) ?>][birim_m2_fiyati]" value="<?= htmlspecialchars((string) $p['birim_m2_fiyati']) ?>"></td>
                <td data-label="Min. Fiyat"><input class="num" type="number" step="1" min="0" name="products[<?= htmlspecialchars($p['id']) ?>][minimum_fiyat]" value="<?= htmlspecialchars((string) $p['minimum_fiyat']) ?>"></td>
                <td data-label="KDV"><input class="num num-sm" type="number" step="0.01" min="0" max="1" name="products[<?= htmlspecialchars($p['id']) ?>][kdv_orani]" value="<?= htmlspecialchars((string) $p['kdv_orani']) ?>"></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <div class="row-actions">
          <button class="btn" type="submit">Sineklik Fiyatlarını Kaydet</button>
        </div>
      </form>

      <form method="post" class="section-gap" id="repair-tape-form">
        <input type="hidden" name="update_repair_tape" value="1">
        <?= admin_csrf_field() ?>
        <h2>Sineklik Tamir Bandı (Paket Ürünler)</h2>
        <p style="margin-top:0;font-size:0.9rem;">Her satır bir satış seçeneğidir. En, boy ve genişlik (mm/cm) ile renk, paket ve fiyat girin. Pasif satırlar sitede görünmez.</p>
        <div style="margin-top:12px;">
          <label>KDV Oranı (tüm tamir bandı ürünleri)</label>
          <input class="num kdv-inline" type="number" step="0.01" min="0" max="1" name="repair_kdv_orani" value="<?= htmlspecialchars((string) ($repairTape['kdv_orani'] ?? 0.20)) ?>">
        </div>
        <table id="repair-tape-table">
          <thead>
            <tr>
              <th>Renk</th>
              <th>En (mm)</th>
              <th>Boy (cm)</th>
              <th>Genişlik (mm)</th>
              <th>Paket</th>
              <th>Fiyat (KDV hariç)</th>
              <th>Aktif</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody id="repair-tape-rows">
            <?php foreach ($repairTape['variants'] ?? [] as $i => $v): ?>
              <tr>
                <td data-label="Renk">
                  <input type="hidden" name="variants[<?= $i ?>][id]" value="<?= htmlspecialchars((string) ($v['id'] ?? '')) ?>">
                  <input class="num" type="text" name="variants[<?= $i ?>][renk]" value="<?= htmlspecialchars((string) ($v['renk'] ?? '')) ?>" placeholder="Gri">
                </td>
                <td data-label="En (mm)"><input class="num num-sm" type="number" step="0.1" min="0.1" name="variants[<?= $i ?>][en]" value="<?= htmlspecialchars((string) ($v['en'] ?? '')) ?>"></td>
                <td data-label="Boy (cm)"><input class="num num-sm" type="number" step="0.1" min="0.1" name="variants[<?= $i ?>][boy]" value="<?= htmlspecialchars((string) ($v['boy'] ?? '')) ?>"></td>
                <td data-label="Genişlik (mm)"><input class="num num-sm" type="number" step="0.1" min="0.1" name="variants[<?= $i ?>][genislik]" value="<?= htmlspecialchars((string) ($v['genislik'] ?? '')) ?>"></td>
                <td data-label="Paket"><input class="num" type="text" name="variants[<?= $i ?>][paket]" value="<?= htmlspecialchars((string) ($v['paket'] ?? '')) ?>" placeholder="Tek Parça"></td>
                <td data-label="Fiyat"><input class="num num-sm" type="number" step="1" min="0" name="variants[<?= $i ?>][fiyat]" value="<?= htmlspecialchars((string) ($v['fiyat'] ?? 0)) ?>"></td>
                <td data-label="Aktif"><input class="chk" type="checkbox" name="variants[<?= $i ?>][aktif]" value="1" <?= !isset($v['aktif']) || !empty($v['aktif']) ? 'checked' : '' ?>></td>
                <td data-label="Sil"><input class="chk" type="checkbox" name="variants[<?= $i ?>][_delete]" value="1"></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <div class="toolbar">
          <button class="btn ghost" type="button" id="add-repair-row">+ Yeni Ürün Satırı</button>
        </div>
        <div class="row-actions">
          <button class="btn" type="submit">Tamir Bandı Ürünlerini Kaydet</button>
          <a class="btn secondary" href="?logout=1">Çıkış</a>
        </div>
      </form>
    <?php endif; ?>
  </div>
  <?php if ($loggedIn): ?>
  <template id="repair-row-template">
    <tr>
      <td data-label="Renk">
        <input type="hidden" name="variants[__INDEX__][id]" value="">
        <input class="num" type="text" name="variants[__INDEX__][renk]" value="" placeholder="Gri">
      </td>
      <td data-label="En (mm)"><input class="num num-sm" type="number" step="0.1" min="0.1" name="variants[__INDEX__][en]" value="48"></td>
      <td data-label="Boy (cm)"><input class="num num-sm" type="number" step="0.1" min="0.1" name="variants[__INDEX__][boy]" value="200"></td>
      <td data-label="Genişlik (mm)"><input class="num num-sm" type="number" step="0.1" min="0.1" name="variants[__INDEX__][genislik]" value="48"></td>
      <td data-label="Paket"><input class="num" type="text" name="variants[__INDEX__][paket]" value="" placeholder="Tek Parça"></td>
      <td data-label="Fiyat"><input class="num num-sm" type="number" step="1" min="0" name="variants[__INDEX__][fiyat]" value="0"></td>
      <td data-label="Aktif"><input class="chk" type="checkbox" name="variants[__INDEX__][aktif]" value="1" checked></td>
      <td data-label="Sil"><input class="chk" type="checkbox" name="variants[__INDEX__][_delete]" value="1"></td>
    </tr>
  </template>
  <script>
    (function () {
      const tbody = document.getElementById('repair-tape-rows');
      const tpl = document.getElementById('repair-row-template');
      const addBtn = document.getElementById('add-repair-row');
      if (!tbody || !tpl || !addBtn) return;

      function nextIndex() {
        return tbody.querySelectorAll('tr').length;
      }

      addBtn.addEventListener('click', function () {
        const html = tpl.innerHTML.replace(/__INDEX__/g, String(nextIndex()));
        const wrap = document.createElement('tbody');
        wrap.innerHTML = html.trim();
        tbody.appendChild(wrap.firstElementChild);
      });
    })();
  </script>
  <?php endif; ?>
</body>
</html>
