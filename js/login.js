function login(userId) {
    localStorage.setItem("currentUserId", userId);
    window.location.href = "galleries.html";
}