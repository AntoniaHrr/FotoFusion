function addPhoto(galleryId) {
    const url = new URL('project_new/FotoFusion/upload.html', window.location.origin);
    url.searchParams.append('gallery', galleryId);
    window.location.href = url;
}

function viewGallery() {
    alert("Viewing gallery!");
}

function addGallery() {
    alert("Add new gallery functionality here!");
}

document.getElementById("dashboard-label").addEventListener("click", function () {
    var dropdown = document.getElementById("dropdown-options");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
});
