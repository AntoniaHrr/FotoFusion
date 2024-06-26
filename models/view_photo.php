<?php
require_once("../database/connect.php");

header('Content-Type: application/json');

$photo_id = isset($_GET['photo_id']) ? trim($_GET['photo_id']) : null;

if (!$photo_id) {
    http_response_code(400);
    echo json_encode(["status" => "ERROR", "message" => "Missing photo ID."]);
    exit();
}

try {
    $db = new DB();
    $connection = $db->getConnection();
    error_log("Connected to DB");

    $stmt = $connection->prepare("
        SELECT i.id, i.image_dir, i.name, i.size, i.type, i.date_created, i.last_modified, i.make, i.model, i.width, i.height, i.datetime, u.username as author
        FROM images i
        JOIN users u ON i.author = u.id
        WHERE i.id = :photo_id
    ");
    $stmt->execute(['photo_id' => $photo_id]);

    $image = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($image) {
        http_response_code(200);
        echo json_encode(["status" => "SUCCESS", "image" => $image]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "ERROR", "message" => "Photo not found."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "ERROR", "message" => "Database error: " . $e->getMessage()]);
}
?>
