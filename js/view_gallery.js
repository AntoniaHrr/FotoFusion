document.addEventListener("DOMContentLoaded", function () {
    // Getting the gallery ID from local storage or URL parameter
    const galleryId = localStorage.getItem("currentGalleryId");

    // Set the value of the hidden gallery_id input field
    if (document.getElementById('gallery_id')) {
        document.getElementById('gallery_id').value = galleryId;
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
                                <a href="view_photo.html?photoId=${image.id}">
                                    <img src="./models/${image.image_dir}" alt="Image">
                                </a>`;
                            galleryContainer.appendChild(imageElement);
                        });
                    } else {
                        galleryContainer.innerHTML = `<p>No images found for the selected date and time range.</p>`;
                    }
                } else {
                    const errorMessage = `<p>${data.message}</p>`;
                    galleryContainer.innerHTML = errorMessage;
                }
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
                const errorMessage = `<p>Failed to fetch images. Please try again later.</p>`;
                galleryContainer.innerHTML = errorMessage;
            });
    }

    // Call the displayImages function initially to show all images
    if (galleryId) {
        displayImages(galleryId);
    }
});

function addPhoto() {
    window.location.href = "upload.html";
}
