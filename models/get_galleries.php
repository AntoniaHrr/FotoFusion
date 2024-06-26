<?php
session_start();
require_once("../database/connect.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $author = isset($_SESSION['user']['id']) ? $_SESSION['user']['id'] : null;

    if (!$author) {
        http_response_code(400);
        echo json_encode(["status" => "ERROR", "message" => "Session information is missing. Please log in to view galleries."]);
        exit();
    }

    try {
        $db = new DB();
        $connection = $db->getConnection();
        error_log("Connected to the database successfully.");

        $stmt = $connection->prepare("SELECT * FROM collections WHERE by_username = :author");
        $stmt->execute([':author' => $author]);
        $galleries = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(["status" => "SUCCESS", "galleries" => $galleries]);
    } catch (PDOException $e) {
        // Log the detailed error message
        error_log("Database error: " . $e->getMessage());

        http_response_code(500);
        echo json_encode(["status" => "ERROR", "message" => "A database error occurred while fetching galleries. Please try again later. Detailed error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "ERROR", "message" => "Method not allowed. Please use a GET request to fetch galleries."]);
}
?>