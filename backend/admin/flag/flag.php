<?php
session_start();

if ($_SESSION['username'] !== 'admin') {
    http_response_code(403);
    die("Forbidden");
}

echo "CTF{r1gged_d4sh_co0k13_c4sh}";
?>