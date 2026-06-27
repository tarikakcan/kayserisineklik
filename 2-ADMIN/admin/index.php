<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/auth.php';

admin_start_session();

if (isset($_GET['logout'])) {
    admin_logout();
    header('Location: /');
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $user = trim($_POST['username'] ?? '');
    $pass = $_POST['password'] ?? '';
    if (admin_login($user, $pass)) {
        header('Location: /');
        exit;
    }
    $error = 'Kullanıcı adı veya şifre hatalı.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_pricing'])) {
    admin_require_login();
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
    $success = 'Fiyatlar kaydedildi.';
}

$loggedIn = admin_is_logged_in();
$products = admin_is_logged_in() ? admin_all_products() : [];
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kayseri Sineklik — Fiyat Yönetimi</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f7f3ec; color: #2d2419; margin: 0; padding: 24px; }
    .box { max-width: 920px; margin: 0 auto; background: #fff; border: 1px solid #e4d8c8; border-radius: 12px; padding: 24px; }
    h1 { margin: 0 0 8px; font-size: 1.4rem; color: #c45a1f; }
    p { color: #6b5f52; }
    label { display: block; font-size: 0.85rem; margin-bottom: 4px; }
    input[type=text], input[type=password], input[type=number] { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.9rem; }
    th, td { border-bottom: 1px solid #eee; padding: 10px 8px; text-align: left; vertical-align: top; }
    th { background: #faf6f0; }
    .btn { display: inline-block; background: #c45a1f; color: #fff; border: 0; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-weight: 600; }
    .btn.secondary { background: #2f5d52; text-decoration: none; }
    .msg { padding: 10px 12px; border-radius: 8px; margin: 12px 0; }
    .err { background: #fde8e8; color: #9b1c1c; }
    .ok { background: #e8f5ee; color: #1f6b42; }
    .row-actions { margin-top: 16px; display: flex; gap: 12px; align-items: center; }
    .num { width: 110px; }
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
      <p>8 ürünün m² birim fiyatı (KDV hariç), minimum fiyat (KDV hariç) ve KDV oranını güncelleyin. Değişiklikler sitede anında yansır.</p>
      <?php if ($success): ?><div class="msg ok"><?= htmlspecialchars($success) ?></div><?php endif; ?>
      <form method="post">
        <input type="hidden" name="update_pricing" value="1">
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
                <td>
                  <strong><?= htmlspecialchars($p['name']) ?></strong><br>
                  <small><?= htmlspecialchars($p['id']) ?></small>
                </td>
                <td><input class="num" type="number" step="1" min="1" name="products[<?= htmlspecialchars($p['id']) ?>][birim_m2_fiyati]" value="<?= htmlspecialchars((string) $p['birim_m2_fiyati']) ?>"></td>
                <td><input class="num" type="number" step="1" min="0" name="products[<?= htmlspecialchars($p['id']) ?>][minimum_fiyat]" value="<?= htmlspecialchars((string) $p['minimum_fiyat']) ?>"></td>
                <td><input class="num" type="number" step="0.01" min="0" max="1" name="products[<?= htmlspecialchars($p['id']) ?>][kdv_orani]" value="<?= htmlspecialchars((string) $p['kdv_orani']) ?>"></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <div class="row-actions">
          <button class="btn" type="submit">Kaydet</button>
          <a class="btn secondary" href="?logout=1">Çıkış</a>
        </div>
      </form>
    <?php endif; ?>
  </div>
</body>
</html>
