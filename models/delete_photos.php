<?php
session_start();
require_once("../database/connect.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "ERROR", "message" => "Method not allowed. Please use a POST request to delete photos."]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['galleryId']) || !isset($data['photoIds'])) {
    http_response_code(400);
    echo json_encode(["status" => "ERROR", "message" => "Missing required parameters."]);
    exit();
}

$galleryId = $data['galleryId'];
$photoIds = $data['photoIds'];

try {
    $db = new DB();
    $connection = $db->getConnection();
    error_log("Connected to DB");

    // Ensure the user has access to delete photos from the specified gallery
    $stmt = $connection->prepare("SELECT * FROM collections WHERE id = :galleryId AND by_username = :userId");
    $stmt->execute(['galleryId' => $galleryId, 'userId' => $_SESSION['user']['id']]);
    $gallery = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$gallery) {
        http_response_code(403);
        echo json_encode(["status" => "ERROR", "message" => "You do not have permission to delete photos from this gallery."]);
        exit();
    }

    // Delete the physical files from the server
    foreach ($photoIds as $photoId) {
        $stmt = $connection->prepare("SELECT image_dir FROM images WHERE id = :photoId");
        $stmt->execute(['photoId' => $photoId]);
        $imagePath = $stmt->fetchColumn();
        error_log($imagePath);

        if ($imagePath) {
            if (file_exists($imagePath)) {
                error_log("File exists");
                unlink($imagePath);
            }
        }
    }

        // Prepare the SQL statement to delete photos from the images table
        $placeholders = implode(',', array_fill(0, count($photoIds), '?'));
        $stmt = $connection->prepare("DELETE FROM images WHERE id IN ($placeholders)");
    
        // Execute the statement with the list of photo IDs
        $stmt->execute($photoIds);

    // Optionally, update the collections table or perform other related tasks

    http_response_code(200);
    echo json_encode(["status" => "SUCCESS", "message" => "Photos deleted successfully."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "ERROR", "message" => "Database error: " . $e->getMessage()]);
}
?>
