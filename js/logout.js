// logout.js

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout-button");

  // Add event listener to logout button
  logoutButton.addEventListener("click", function () {
    // Perform logout actions
    logoutUser();
  });

  // Function to logout the user
  function logoutUser() {
    console.log("Logging out user...");
    localStorage.removeItem("loggedInUser");
    console.log("User logged out successfully.");
    window.location.href = "../login.html"; // Redirect to login page
  }
});
