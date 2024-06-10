<?php 

$conn = mysqli_connect("localhost", "root", "", "photos_system");
if (!$conn) {
    die("". mysqli_connect_error());    
}

if (isset($_POST['submit'])) {

    $file = $_FILES['image']['name'];
    $tempname = $_FILES['image']['tmp_name'];
    $folder = "uploads/".$file;

    $query = mysqli_query($conn,"Insert into images3 (name) values ('$file')");

    if (move_uploaded_file($tempname, $folder)) {
        echo "success";
    } else {
        echo "fail";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Image</title>
</head>
<body>
    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="image" id="image">
        <input type="submit" name="submit" value="Качване">
    </form>
    <div>
        <?php
            $res = mysqli_query($conn,"select * from images3");

            while( $row = mysqli_fetch_assoc($res) ) {

        ?>
        <img src="uploads/<?php echo $row["name"] ?>" />
        <?php } ?>
    </div>
    </body>
</html>