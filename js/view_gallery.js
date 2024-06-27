document.addEventListener("DOMContentLoaded", async function () {
    const galleryId = localStorage.getItem("currentGalleryId");
    var userGallery;

    // Set the value of the hidden gallery_id input field
    if (document.getElementById('gallery_id')) {
        document.getElementById('gallery_id').value = galleryId;
    }

    try {
        // Fetch galleries and populate move-to-gallery select options
        const response = await fetch("./models/get_galleries.php");
        const data = await response.json();

        if (data.status === 'SUCCESS') {
            const galleries = data.galleries;
            const selectGallery = document.getElementById("move-to-gallery");

            galleries.forEach(gallery => {
                const option = document.createElement("option");
                option.value = gallery.id;
                option.textContent = gallery.name_collection;
                selectGallery.appendChild(option);
            });

            // Fetch the current user ID from the session
            const currentUserId = data.currentUserId;  // Получаваме текущия потребител от отговора

            // Enable move and delete photos buttons only if the gallery belongs to the user
            const movePhotos = document.getElementById("move-photos");
            const deletePhotosBtn = document.getElementById("delete-photos-btn");
            const add = document.getElementById("add-photo");
            userGallery = galleries.find(gallery => gallery.id === parseInt(galleryId) && gallery.by_username == currentUserId);
            const openGallery = galleries.find(gallery => gallery.id === parseInt(galleryId) && (gallery => gallery.visibility === 0 || gallery.by_username == currentUserId));

            if (userGallery) {
                movePhotos.hidden = false;
                deletePhotosBtn.hidden = false;
            }
            if (openGallery) {
                add.hidden = false;
            }
        } else {
            console.error('Failed to fetch galleries:', data.message);
        }
    } catch (error) {
        console.error('Error fetching galleries:', error);
    }

    // Event listener for datetime search button click
    document.getElementById("date-time-btn").addEventListener("click", () => {
        const searchDate = document.getElementById("date-time").value;
        const endDate = document.getElementById("end-date").value;
        const startHour = document.getElementById("start-hour").value;
        const endHour = document.getElementById("end-hour").value;

        if (searchDate && endDate && startHour && endHour) {
            displayImages(galleryId, searchDate, endDate, startHour, endHour);
        }
    });

    // Event listener for move photos button click
    document.getElementById("move-photos-btn").addEventListener("click", async () => {
        const selectedPhotos = document.querySelectorAll(".gallery-item input[type='checkbox']:checked");
        const moveToGalleryId = document.getElementById("move-to-gallery").value;

        if (selectedPhotos.length === 0) {
            showMessage("Please select one or more photos to move.");
            return;
        }

        const photoIds = Array.from(selectedPhotos).map(checkbox => checkbox.value);

        try {
            const response = await fetch("./models/move_photos.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    galleryId: galleryId,
                    moveToGalleryId: moveToGalleryId,
                    photoIds: photoIds
                }),
            });
            const data = await response.json();

            if (data.status === 'SUCCESS') {
                showMessage("Photos moved successfully.");
                // Optionally, update the UI to reflect the changes
                displayImages(galleryId); // Reload current gallery after moving photos
            } else {
                showMessage("Failed to move photos: " + data.message);
            }
        } catch (error) {
            console.error('Error moving photos:', error);
            showMessage("Failed to move photos. Please try again later.");
        }
    });

    // Event listener for delete photos button click
    document.getElementById("delete-photos-btn").addEventListener("click", async () => {
        const selectedPhotos = document.querySelectorAll(".gallery-item input[type='checkbox']:checked");

        if (selectedPhotos.length === 0) {
            showMessage("Please select one or more photos to delete.");
            return;
        }

        if (!confirm("Are you sure you want to delete selected photos?")) {
            return;
        }

        const photoIds = Array.from(selectedPhotos).map(checkbox => checkbox.value);

        try {
            const response = await fetch("./models/delete_photos.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    galleryId: galleryId,
                    photoIds: photoIds
                }),
            });
            const data = await response.json();

            if (data.status === 'SUCCESS') {
                showMessage("Photos deleted successfully.");
                // Optionally, update the UI to reflect the changes
                displayImages(galleryId); // Reload current gallery after deleting photos
            } else {
                showMessage("Failed to delete photos: " + data.message);
            }
        } catch (error) {
            console.error('Error deleting photos:', error);
            showMessage("Failed to delete photos. Please try again later.");
        }
    });

    // Function to display images in the gallery
    async function displayImages(galleryId, searchDate = "", endDate = "", startHour = "", endHour = "") {
        const galleryContainer = document.querySelector(".gallery");

        // Clear the gallery contents
        galleryContainer.innerHTML = "";

        // Fetch images from the server with AJAX request
        try {
            const response = await fetch(`./models/view_gallery.php?gallery_id=${galleryId}`);
            const data = await response.json();

            if (data.status === 'SUCCESS') {
                const images = data.images;

                // Filter images based on searchDate and time range if provided
                const filteredImages = searchDate
                    ? images.filter((image) => {
                        const [imageDate, imageTime] = image.datetime.split(" ");

                        if (imageDate >= searchDate && imageDate <= endDate) {
                            const [imageHour, imageMinute, imageSecond] = imageTime.split(":").map(Number);
                            const [startHourInt, startMinute, startSecond] = startHour.split(":").map(Number);
                            const [endHourInt, endMinute, endSecond] = endHour.split(":").map(Number);

                            const imageTimeInSeconds = imageHour * 3600 + imageMinute * 60 + imageSecond;
                            const startTimeInSeconds = startHourInt * 3600 + startMinute * 60 + startSecond;
                            const endTimeInSeconds = endHourInt * 3600 + endMinute * 60 + endSecond;

                            return (
                                imageTimeInSeconds >= startTimeInSeconds &&
                                imageTimeInSeconds <= endTimeInSeconds
                            );
                        }
                        return false;
                    })
                    : images;

                // Display filtered images
                if (filteredImages.length > 0) {
                    filteredImages.forEach((image) => {
                        const imageElement = document.createElement("div");
                        imageElement.classList.add("gallery-item");
                        imageElement.innerHTML = `
                        <a href="view_photo.html?photoId=${image.id}">
                        <img src="./models/${image.image_dir}" alt="Image">
                        <label>
                                <input id="checkbox" hidden type="checkbox" value="${image.id}">
                            </label>
                        </a>`;
                        galleryContainer.appendChild(imageElement);
                    });
                    if (userGallery) {
                        document.getElementById("checkbox").hidden = false;
                    }
                } else {
                    galleryContainer.innerHTML = `<p>No images found for the selected date and time range.</p>`;
                }
            } else {
                const errorMessage = `<p>${data.message}</p>`;
                galleryContainer.innerHTML = errorMessage;
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            const errorMessage = `<p>Failed to fetch images. Please try again later.</p>`;
            galleryContainer.innerHTML = errorMessage;
        }
    }

    // Function to show messages in the UI
    function showMessage(message) {
        const messageContainer = document.getElementById("message-container");
        messageContainer.textContent = message;
        messageContainer.style.display = "block";

        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 3000);
    }

    // Call the displayImages function initially to show all images
    if (galleryId) {
        displayImages(galleryId);
    }

});

function addPhoto() {
    window.location.href = "upload.html";
}
