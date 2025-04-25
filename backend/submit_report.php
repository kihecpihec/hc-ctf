<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once 'config.php';

$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');
$submitted_by = $_SESSION['username'];
$file_path = "";

if (empty($title) || empty($description)) {
    echo json_encode(["success" => false, "error" => "Title and description are required."]);
    exit;
}

if (!empty($_FILES["attachment"]["name"])) {
    $upload_dir = "uploads/";
    $filename = basename($_FILES["attachment"]["name"]);
    $file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];

    if (!in_array($file_ext, $allowed_extensions)) {
        echo json_encode(["error" => "Bad file type."]);
        exit;
    }

    $new_filename = uniqid("report_", true) . "." . $file_ext;
    $destination = $upload_dir . $new_filename;

    if (!move_uploaded_file($_FILES["attachment"]["tmp_name"], $destination)) {
        echo json_encode(["error" => "Failed to upload attachment."]);
        exit;
    }

    $file_path = $destination;
}

$stmt = $conn->prepare("INSERT INTO reports (submitted_by, title, description, file_path) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["error" => "Failed to prepare statement."]);
    exit;
}
$stmt->bind_param("ssss", $submitted_by, $title, $description, $file_path);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Report submitted"]);
} else {
    echo json_encode(["error" => "Failed to submit report."]);
}
?>