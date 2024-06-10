<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once("../database/connect.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Handle file upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        // Move the uploaded file to a desired directory
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($_FILES["image"]["name"]);
        
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            // File successfully uploaded
            error_log("Image successfully uploaded to: " . $target_file);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "ERROR", "message" => "Грешка при качването на изображението."]);
            exit();
        }
    } else {
        $error_message = isset($_FILES['image']['error']) ? $_FILES['image']['error'] : 'Няма избрано изображение.';
        http_response_code(400);
        echo json_encode(["status" => "ERROR", "message" => "Грешка при качването на изображението. " . $error_message]);
        exit();
    }

    // Get additional data
    $date_taken = isset($_POST['date_taken']) ? $_POST['date_taken'] : null;
    $gallery = isset($_POST['gallery_id']) ? $_POST['gallery_id'] : null;

    if (!$date_taken) {
        http_response_code(400);
        error_log("No data");
        echo json_encode(["status" => "ERROR", "message" => "Дата на заснемане е задължителна."]);
        exit();
    }
    if (!$gallery) {
        http_response_code(400);
        error_log("No gallery");
        echo json_encode(["status" => "ERROR", "message" => "Галерията е задължителна."]);
        exit();
    }
    error_log("Date and gallery taken");

    try {
        $db = new DB();
        $connection = $db->getConnection();
        error_log("Connected to DB");
        
        // Insert data into the images table
        $stmt = $connection->prepare("INSERT INTO images (date_created, image_dir) VALUES (:date_created, :image_dir)");
        $stmt->execute(['date_created' => $date_taken, 'image_dir' => $target_file]);
        $image_id = $connection->lastInsertId();

        error_log("Image inserted into images table with ID: " . $image_id);

        // Update collections table
        $stmt = $connection->prepare("SELECT images FROM collections WHERE name_collection = :gallery");
        $stmt->execute(['gallery' => $gallery]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $images_json = $result['images'];
            $images_array = json_decode($images_json, true);
            $images_array[] = $image_id;
            error_log("Images in gallery {$gallery} before update: " . print_r($images_array, true));
        } else {
            $images_array = [$image_id];
            error_log("No existing images for gallery {$gallery}, creating new entry with images: " . print_r($images_array, true));
            $stmt = $connection->prepare("INSERT INTO collections (name_collection, images) VALUES (:gallery, :images)");
        }

        $new_images_json = json_encode($images_array);
        if ($result) {
            $stmt = $connection->prepare("UPDATE collections SET images = :images WHERE name_collection = :gallery");
        }
        $stmt->execute(['images' => $new_images_json, 'gallery' => $gallery]);

        error_log("Images in gallery {$gallery} after update: " . print_r($images_array, true));

        http_response_code(200);
        echo json_encode(["status" => "SUCCESS", "message" => "Изображението и данните бяха успешно качени."]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Database error: " . $e->getMessage());
        echo json_encode(["status" => "ERROR", "message" => "Грешка при записването в базата данни."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "ERROR", "message" => "Методът не е позволен."]);
}
?>
