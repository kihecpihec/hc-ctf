<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

session_start();
if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$response = [
    "totalUsers" => 15234,
    "activeUsers" => 3289,
    "suspendedUsers" => 123,
    "bettingTrends" => [4000, 5200, 6100, 6900, 8500, 9200],
    "winLossRatio" => ["wins" => 35, "losses" => 65],
    "topPlayers" => [
        ["username" => "highroller_1", "totalBets" => "$15,000"],
        ["username" => "betKing99", "totalBets" => "$12,500"],
        ["username" => "LuckyLuke", "totalBets" => "$10,000"],
        ["username" => "RNGod", "totalBets" => "$9,200"],
        ["username" => "SpinMaster", "totalBets" => "$8,500"],
    ]
];

echo json_encode($response);
exit;
?>