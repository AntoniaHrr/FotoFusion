<?php 

require_once("../database/connect.php");
require_once("./check_JSON_validity.php");


// php://input is a readonly stream which allows us to read raw data from the request body - it returnes all the raw data after the HTTP headers of the request no matter the content type
// file_get_contents() reads file into a string, but in this case it parses the raw data from the stream into the string
$data = file_get_contents("php://input");

$user_data = null; // used to store the decoded JSON string $data

// check if the JSON is correct
if (strlen($data) > 0 && check_json($data)) {
    $user_data = json_decode($data, true);
}
else {
    http_response_code(400);
    exit(json_encode(["status" => "ERROR", "message" => "Невалиден JSON формат!"]));
}

$username = $user_data["username"]; // get input last name
$fullname = $user_data["fullname"]; // get input first name
$email = $user_data["email"]; // get input email
$password = $user_data["password"]; // get input password
$repeated_password = $user_data["repeat_password"]; // get input repeated password
$hashed_password = $password;
//$hashed_password = hash('sha256', $password);
//$hashed_password = password_hash($password, PASSWORD_DEFAULT); // hash the input password


// check if the user has repeated the password correctly
if ($password != $repeated_password) {
    http_response_code(400);
    exit(json_encode(["status" => "ERROR", "message" => "Паролите не съвпадат!"]));
}

try {
    $db = new DB();
    $connection = $db->getConnection();
    
    $search = "SELECT * 
               FROM users 
               WHERE email = :email";

    $stmt = $connection->prepare($search);
    $stmt->execute(["email" => $email]);

    // if a user with the inputted email already exist, then we can't create a new account
    if ($stmt->rowCount() != 0) {
        http_response_code(400);
        exit(json_encode(["status" => "ERROR", "message" => "Потребител с дадения имейл вече съществува!"]));
    }
} catch (PDOException $e) {
    http_response_code(500);
    return json_encode(["status" => "ERROR", "message" => "Неочаквана грешка настъпи в сървъра!"]);
}

try {
    $insert = "INSERT INTO users (fullname, username, email, password)
                      VALUES (:fullname, :username, :email, :password)";

    $stmt = $connection->prepare($insert);
    
    // if the execution passed with no failure, then create the user session
    if ($stmt->execute(["fullname" => $fullname, "username" => $username, "email" => $email, "password" => $hashed_password])) {
        
        $user_id = $connection->lastInsertId(); // get the newly created user's id
        session_start();
        
        $user = array("id" => $user_id, "fullname" => $fullname, "username" => $username, "email" => $email, "password" => $hashed_password);
        $_SESSION["user"] = $user; // create his session
        
        // set cookies
        setcookie("email", $email, time() + 600);
        setcookie("password", $password, time() + 600);

        http_response_code(200);
        exit(json_encode(["status" => "SUCCESS", "message" => "Успешна регистрация!"]));
    }
    else {
        http_response_code(500);
        exit(json_encode(["status" => "ERROR", "message" => "Неочаквана грешка настъпи в сървъра!"]));
    }
} catch (PDOException $e) {
    http_response_code(500);
    exit(json_encode(["status" => "ERROR", "message" => "Неочаквана грешка настъпи в сървъра!"]));
}

?>