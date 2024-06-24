<?php
session_start();
require_once("../database/connect.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['gallery-name']) ? trim($_POST['gallery-name']) : null;
    $tags = isset($_POST['gallery-tags']) ? trim($_POST['gallery-tags']) : null;
    $visibility = isset($_POST['visibility']) ? trim($_POST['visibility']) : 'public';
    $author = isset($_SESSION['user']['id']) ? $_SESSION['user']['id'] : null;

    // Check if name is provided
    if (!$name) {
        http_response_code(400);
        echo json_encode(["status" => "ERROR", "message" => "Gallery name is missing. Please provide a valid gallery name."]);
        exit();
    }

    // Check if author session is available
    if (!$author) {
        http_response_code(400);
        echo json_encode(["status" => "ERROR", "message" => "Session information is missing. Please log in to create a gallery."]);
        exit();
    }

    // Explode tags and trim spaces
    $tags = array_map('trim', explode(",", $tags));

    try {
        $db = new DB();
        $connection = $db->getConnection();
        error_log("Connected to the database successfully.");

        $stmt = $connection->prepare("INSERT INTO collections (name_collection, by_username, visibility, tags) VALUES (:name, :author, :visibility, :tags)");
        $stmt->execute([
            ':name' => $name,
            ':author' => $author,
            ':visibility' => $visibility,
            ':tags' => implode('#', $tags)
        ]);

        http_response_code(200);
        echo json_encode(["status" => "SUCCESS", "message" => "Gallery created successfully."]);
    } catch (PDOException $e) {
        // Log the detailed error message
        error_log("Database error: " . $e->getMessage());

        http_response_code(500);
        echo json_encode(["status" => "ERROR", "message" => "A database error occurred while creating the gallery. Please try again later. Detailed error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "ERROR", "message" => "Method not allowed. Please use a POST request to create a gallery."]);
}
?>
