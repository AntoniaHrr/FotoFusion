<!-- 
 Not usable at
 <?php 

include 'connect.php';

if(isset($_POST['signUp'])){
    $fullName=$_POST['fName'];
    $username=$_POST['uName'];
    $email=$_POST['email'];
    $password=$_POST['password'];
    $password=md5($password);

     $checkEmail="SELECT * From users where email='$email'";
     $result=$conn->query($checkEmail);
     if($result->num_rows>0){
        echo "Email Address Already Exists !";
     }
     else{
        $insertQuery="INSERT INTO users(fullName,username,email,password)
                       VALUES ('$fullName','$username','$email','$password')";
            if($conn->query($insertQuery)==TRUE){
                header("location: index.html");
            }
            else{
                echo "Error:".$conn->error;
            }
     }
   

}

if(isset($_POST['signIn'])){
   $email=$_POST['email'];
   $password=$_POST['password'];
   $password=md5($password) ;
   
   $sql="SELECT * FROM users WHERE email='$email'";
   $result=$conn->query($sql);
  
   if($result->num_rows>0){
    session_start();
    $row=$result->fetch_assoc();
    $_SESSION['email']=$row['email'];
    header("Location: homepage.html");
    exit();
   }
   else{
    echo "Not Found, Incorrect Email or Password";
   }

}
?> -->