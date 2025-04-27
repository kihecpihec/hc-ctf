<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

session_start();
$_SESSION = [];
session_destroy();

setcookie(session_name(), '', time() - 3600, '/');
echo json_encode(["success" => true]);
?>