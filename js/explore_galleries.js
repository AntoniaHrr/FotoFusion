document.addEventListener("DOMContentLoaded", function () {
    fetchAllGalleries();
    document.getElementById("search-input").addEventListener("input", handleSearch);
});

let allGalleries = [];

function fetchAllGalleries() {
    fetch('./models/get_all_galleries.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "SUCCESS") {
                allGalleries = data.galleries;
                displayGalleries(allGalleries);
            } else {
                console.error("Error fetching galleries:", data.message);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const filteredGalleries = allGalleries.filter(gallery => {
        const nameMatch = gallery.name_collection.toLowerCase().includes(query);
        const tagsMatch = gallery.tags.toLowerCase().includes(query);
        return nameMatch || tagsMatch;
    });
    displayGalleries(filteredGalleries);
}

function displayGalleries(galleries) {
    const galleryContainer = document.getElementById("gallery-container");
    galleryContainer.innerHTML = '';

    galleries.forEach(gallery => {
        const galleryDiv = document.createElement("div");
        galleryDiv.classList.add("gallery");

        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");

        const h2 = document.createElement("h2");
        h2.textContent = gallery.name_collection;
        headerDiv.appendChild(h2);

        if (gallery.visibility === 0) {
            const addButton = document.createElement("button");
            addButton.textContent = "Add Photo";
            addButton.onclick = function() {
                addPhoto(gallery.id);
            };
            headerDiv.appendChild(addButton);
        }

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = "./styles/gallery.jpg"; // Replace with actual thumbnail if available
        img.alt = "Placeholder Image";
        imageContainer.appendChild(img);

        const viewButton = document.createElement("button");
        viewButton.classList.add("view-button");
        viewButton.textContent = "View";
        viewButton.onclick = function() {
            viewGallery(gallery.id);
        };
        imageContainer.appendChild(viewButton);

        galleryDiv.appendChild(headerDiv);
        galleryDiv.appendChild(imageContainer);
        galleryContainer.appendChild(galleryDiv);
    });
}

function addGallery() {
    window.location.href = './add_gallery.html';
}

function addPhoto(galleryId) {
    localStorage.setItem("currentGalleryId", galleryId);
    window.location.href = "upload.html";
}

function viewGallery(galleryId) {
    localStorage.setItem("currentGalleryId", galleryId);
    window.location.href = "view_gallery.html";
}
