document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const galleryId = localStorage.getItem("currentGalleryId");

    document.getElementById('gallery_id').value = galleryId;

    function displayImages(galleryId) {
        const galleryContainer = document.querySelector('.gallery');

        galleryContainer.innerHTML = '';

        fetch(`./models/view_gallery.php?gallery_id=${galleryId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'SUCCESS') {
                    const images = data.images;
                    images.forEach(image => {
                        const imageElement = document.createElement('div');
                        imageElement.classList.add('gallery-item');
                        imageElement.innerHTML = `
                        <a href="view_photo.html?photoId=${image.id}">    
                        <img src="./models/${image.image_dir}" alt="Image">
                        </a>`;

                        galleryContainer.appendChild(imageElement);
                    });
                } else {
                    const errorMessage = `<p>${data.message}</p>`;
                    galleryContainer.innerHTML = errorMessage;
                }
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                const errorMessage = `<p>Failed to fetch images. Please try again later.</p>`;
                galleryContainer.innerHTML = errorMessage;
            });
    }

    if (galleryId) {
        displayImages(galleryId);
    }
});

function addPhoto() {
    window.location.href = "upload.html";
}
