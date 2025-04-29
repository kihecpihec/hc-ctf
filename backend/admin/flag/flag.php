<?php
session_start();

if ($_SESSION['role'] !== 'admin') {
    http_response_code(403);
    die("Forbidden");
}

echo "CTF{flag_goes_gere}";
?>