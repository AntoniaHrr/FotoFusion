<?php 

$conn = mysqli_connect("localhost", "root", "", "photos_system");
if (!$conn) {
    die("". mysqli_connect_error());    
}

if (isset($_POST["submit"])) {
    $file = $_FILES['image']['name'];
    $tempname = $_FILES['image']['tmp_name'];
    $folder = "uploades/".$file;

    $query = mysqli_query($conn,"Insert into images3 (name) values ('$file')");

    if (move_uploaded_file($tempname, $folder)) {
        echo "success";
    } else {
        echo "fail";
    }
}

/*$targetDir = "uploads/";
$targetFile = $targetDir.basename($_FILES['image']['name']);
$success = move_uploaded_file($_FILES['image']['tmp_name'], $targetFile);

if ($success) {
    echo "success";
} else { 
    echo "fail";
}****/
?>