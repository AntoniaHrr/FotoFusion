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
    if (!$date_taken) {
        http_response_code(400);
        echo json_encode(["status" => "ERROR", "message" => "Дата на заснемане е задължителна."]);
        exit();
    }

    // Insert data into the database
    try {
        $db = new DB();
        $connection = $db->getConnection();

        if ($connection) {
            $stmt = $connection->prepare("INSERT INTO images (date_created, image_dir) VALUES (:date_created, :image_dir)");
            $stmt->execute(['date_created' => $date_taken, 'image_dir' => $target_file]);
            
            http_response_code(200);
            echo json_encode(["status" => "SUCCESS", "message" => "Изображението и данните бяха успешно качени."]);
        } else {
            throw new Exception("Неуспешно свързване към базата данни.");
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage()); // Log the error message
        http_response_code(500);
        echo json_encode(["status" => "ERROR", "message" => "Грешка при записването в базата данни: " . $e->getMessage()]);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage()); // Log the error message
        http_response_code(500);
        echo json_encode(["status" => "ERROR", "message" => "Грешка: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "ERROR", "message" => "Методът не е позволен."]);
}
?>
