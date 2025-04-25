<?php
// /admin/flag.php
session_start();

if ($_SESSION['role'] !== 'admin') {
    http_response_code(403);
    die("Forbidden");
}

echo "CTF{stor3d_xss_pwned_admin}";
?>