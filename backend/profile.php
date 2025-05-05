<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once 'config.php';

$username = $_SESSION['username'];

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($query);

    if ($result && $result->num_rows === 1) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "User not found"]);
    }
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $defaultPic = "uploads/default.jpg";
    $updateQuery = "UPDATE users SET profile_pic = '$defaultPic' WHERE username = '$username'";

    if ($conn->query($updateQuery)) {
        echo json_encode(["success" => true, "message" => "Profile picture removed"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to remove profile picture"]);
    }
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $display_name = $_POST['display_name'] ?? '';
    $new_username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';

    if (!empty($_FILES["profile_pic"]["name"])) {
        $upload_dir = "uploads/";
        $filename = basename($_FILES["profile_pic"]["name"]);
        $tmp_name = $_FILES["profile_pic"]["tmp_name"];
        $file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'html', 'js'];

        if ($file_ext === 'php' || $file_ext === 'phtml' || $file_ext === 'php5') {
            echo json_encode(["error" => "Disallowed file extension."]);
            exit;
        }

        if (!in_array($file_ext, $allowed_extensions)) {
            echo json_encode(["error" => "Invalid file extension."]);
            exit;
        }

        $destination = $upload_dir . $filename;

        if (move_uploaded_file($tmp_name, $destination)) {
            $query = "UPDATE users SET profile_pic='$destination' WHERE username='$username'";
            $conn->query($query);

            echo json_encode([
                "success" => true,
                "message" => "Profile updated successfully.",
                "uploaded_path" => $destination
            ]);
            exit;
        } else {
            echo json_encode(["error" => "File upload failed. Please try again."]);
            exit;
        }
    }

    $query = "UPDATE users SET display_name='$display_name', username='$new_username', email='$email' WHERE username='$username'";
    $conn->query($query);
    $_SESSION['username'] = $new_username;

    echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    exit;
}

echo json_encode(["error" => "Invalid request"]);
exit;
?>
