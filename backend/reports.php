<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");   
header("Access-Control-Allow-Credentials: true");
session_start();

if (!isset($_SESSION['username']) || $_SESSION['username'] !== 'admin') {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once 'config.php';

$result = $conn->query("SELECT * FROM reports ORDER BY created_at DESC");

$reports = [];
while ($row = $result->fetch_assoc()) {
    $reports[] = $row;
}

echo json_encode($reports);
?>