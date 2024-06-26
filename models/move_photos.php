<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once("../database/connect.php");

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['photoIds']) || !isset($data['targetGalleryId'])) {
    http_response_code(400);
    echo json_encode(["status" => "ERROR", "message" => "Photo IDs and target gallery ID are required."]);
    exit();
}

$photoIds = $data['photoIds'];
$targetGalleryId = $data['targetGalleryId'];

try {
    $db = new DB();
    $connection = $db->getConnection();

    // Start a transaction
    $connection->beginTransaction();

    // Get the current images of the target gallery
    $stmt = $connection->prepare("SELECT images FROM collections WHERE id = :gallery_id");
    $stmt->execute(['gallery_id' => $targetGalleryId]);
    $targetResult = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$targetResult) {
        throw new Exception("Target gallery not found.");
    }

    $targetImages = json_decode($targetResult['images'], true) ?? [];

    // Get the current gallery ID
    $currentGalleryId = $data['currentGalleryId'];
    $stmt = $connection->prepare("SELECT images FROM collections WHERE id = :gallery_id");
    $stmt->execute(['gallery_id' => $currentGalleryId]);
    $currentResult = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$currentResult) {
        throw new Exception("Current gallery not found.");
    }

    $currentImages = json_decode($currentResult['images'], true) ?? [];

    // Update the collections table for the target gallery
    $newTargetImages = array_merge($targetImages, $photoIds);
    $stmt = $connection->prepare("UPDATE collections SET images = :images WHERE id = :gallery_id");
    $stmt->execute(['images' => json_encode($newTargetImages), 'gallery_id' => $targetGalleryId]);

    // Remove the photos from the current gallery
    $newCurrentImages = array_diff($currentImages, $photoIds);
    $stmt = $connection->prepare("UPDATE collections SET images = :images WHERE id = :gallery_id");
    $stmt->execute(['images' => json_encode($newCurrentImages), 'gallery_id' => $currentGalleryId]);

    // Commit the transaction
    $connection->commit();

    echo json_encode(["status" => "SUCCESS", "message" => "Photos moved successfully."]);
} catch (Exception $e) {
    // Rollback the transaction on error
    $connection->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "ERROR", "message" => "Error moving photos: " . $e->getMessage()]);
}
?>
