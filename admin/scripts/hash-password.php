<?php
if ($argc < 2) {
    fwrite(STDERR, "Kullanım: php scripts/hash-password.php SIFRENIZ\n");
    exit(1);
}
echo password_hash($argv[1], PASSWORD_BCRYPT), PHP_EOL;
