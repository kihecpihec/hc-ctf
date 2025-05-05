<?php
session_start();

if ($_SESSION['username'] !== 'admin') {
    http_response_code(403);
    die("Forbidden");
}

echo "CTF{flag_goes_gere}";
?>