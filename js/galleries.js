function addPhoto(galleryId) {
    localStorage.setItem("currentGalleryId", galleryId);
    window.location.href = "upload.html";
}

document
    .getElementById("dashboard-label")
    .addEventListener("click", function () {
        var dropdown = document.getElementById("dropdown-options");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        } else {
            dropdown.style.display = "block";
        }
    });

function viewGallery(galleryId) {
    localStorage.setItem("currentGalleryId", galleryId);
    window.location.href = "view_gallery.html";
}