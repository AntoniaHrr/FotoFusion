document.addEventListener("DOMContentLoaded", function () {
    const galleryId = localStorage.getItem("currentGalleryId");

    // Set the value of the hidden gallery_id input field
    if (document.getElementById('gallery_id')) {
        document.getElementById('gallery_id').value = galleryId;
    }

    // Fetch galleries and populate move-to-gallery select options
    fetch("./models/get_galleries.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                const galleries = data.galleries;
                const selectGallery = document.getElementById("move-to-gallery");

                galleries.forEach(gallery => {
                    const option = document.createElement("option");
                    option.value = gallery.id;
                    option.textContent = gallery.name_collection;
                    selectGallery.appendChild(option);
                });
            } else {
                displayMessage('Failed to fetch galleries: ' + data.message, 'error');
            }
        })
        .catch(error => {
            displayMessage('Error fetching galleries: ' + error.message, 'error');
        });

    // Event listener for datetime search button click
    document.getElementById("date-time-btn").addEventListener("click", () => {
        const searchDate = document.getElementById("date-time").value;
        const endDate = document.getElementById("end-date").value;
        const startHour = document.getElementById("start-hour").value;
        const endHour = document.getElementById("end-hour").value;

        if (searchDate && endDate && startHour && endHour) {
            displayImages(galleryId, searchDate, endDate, startHour, endHour);
        } else {
            displayMessage('Please fill in all date and time fields.', 'error');
        }
    });

    // Event listener for move photos button click
    document.getElementById("move-photos-btn").addEventListener("click", () => {
        const selectedPhotos = document.querySelectorAll(".gallery-item input[type='checkbox']:checked");
        const moveToGalleryId = document.getElementById("move-to-gallery").value;

        if (selectedPhotos.length === 0) {
            displayMessage('Please select one or more photos to move.', 'error');
            return;
        }

        const photoIds = Array.from(selectedPhotos).map(checkbox => checkbox.value);

        fetch("./models/move_photos.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                galleryId: galleryId,
                moveToGalleryId: moveToGalleryId,
                photoIds: photoIds
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'SUCCESS') {
                    displayMessage('Photos moved successfully.', 'success');
                    // Optionally, update the UI to reflect the changes
                    displayImages(galleryId); // Reload current gallery after moving photos
                } else {
                    displayMessage('Failed to move photos: ' + data.message, 'error');
                }
            })
            .catch(error => {
                displayMessage('Error moving photos: ' + error.message, 'error');
            });
    });

    // Function to display images in the gallery
    function displayImages(galleryId, searchDate = "", endDate = "", startHour = "", endHour = "") {
        const galleryContainer = document.querySelector(".gallery");

        // Clear the gallery contents
        galleryContainer.innerHTML = "";

        // Fetch images from the server with AJAX request
        fetch(`./models/view_gallery.php?gallery_id=${galleryId}`)
            .then(response => response.json())
            .then(data => {
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
                                <label>
                                    <input type="checkbox" value="${image.id}">
                                    <img src="./models/${image.image_dir}" alt="Image">
                                </label>`;
                            galleryContainer.appendChild(imageElement);
                        });
                    } else {
                        displayMessage('No images found for the selected date and time range.', 'info');
                    }
                } else {
                    displayMessage('Failed to fetch images: ' + data.message, 'error');
                }
            })
            .catch((error) => {
                displayMessage('Error fetching images: ' + error.message, 'error');
            });
    }

    // Call the displayImages function initially to show all images
    if (galleryId) {
        displayImages(galleryId);
    }

    function addPhoto() {
        window.location.href = "upload.html";
    }

    // Function to display messages on the page
    function displayMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        messageContainer.appendChild(messageElement);
        // Optionally, remove the message after some time
        setTimeout(() => {
            messageElement.remove();
        }, 5000); // Remove message after 5 seconds
    }
});
