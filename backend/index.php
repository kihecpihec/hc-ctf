<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if ($input) {
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
    } else {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
    }

    $query = "SELECT * FROM users WHERE (username = '$username') AND (password = MD5('$password'))";

    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $_SESSION['username'] = $row['username'];
        echo json_encode(["success" => true, "message" => "Welcome, {$row['username']}!", "username" => $row['username']]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid login"]);
    } 
}
?>