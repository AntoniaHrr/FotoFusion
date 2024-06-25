<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once("../database/connect.php");

header('Content-Type: application/json');

if (!isset($_GET['gallery_id'])) {
    http_response_code(400);
    echo json_encode(["status" => "ERROR", "message" => "Gallery ID is required."]);
    exit();
}

$gallery_id = $_GET['gallery_id'];

try {
    $db = new DB();
    $connection = $db->getConnection();

    // Get images from the collections table
    $stmt = $connection->prepare("SELECT images FROM collections WHERE id = :gallery_id");
    $stmt->execute(['gallery_id' => $gallery_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $images_json = $result['images'];
        $images_array = json_decode($images_json, true);

        // Fetch image details including datetime from the images table
        $images_details = [];
        foreach ($images_array as $image_id) {
            $stmt = $connection->prepare("SELECT image_dir, datetime FROM images WHERE id = :image_id");
            $stmt->execute(['image_id' => $image_id]);
            $image_result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($image_result) {
                $images_details[] = [
                    'src' => $image_result['image_dir'],
                    'datetime' => $image_result['datetime']
                ];
            }
        }

        echo json_encode(["status" => "SUCCESS", "images" => $images_details]);
    } else {
        echo json_encode(["status" => "ERROR", "message" => "No images found for this gallery."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "ERROR", "message" => "Error fetching data from the database."]);
}
?>
