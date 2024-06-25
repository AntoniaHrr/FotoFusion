<?php
session_start();
require_once("../database/connect.php");

header('Content-Type: application/json');

try {
    $db = new DB();
    $connection = $db->getConnection();
    error_log("Connected to DB");

    $stmt = $connection->prepare("SELECT * FROM collections");
    $stmt->execute();

    $galleries = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(["status" => "SUCCESS", "galleries" => $galleries]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "ERROR", "message" => "Database error: " . $e->getMessage()]);
}
?>
