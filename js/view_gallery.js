document.addEventListener("DOMContentLoaded", function () {
    // Получаване на идентификатора на галерията от URL параметъра
    const urlParams = new URLSearchParams(window.location.search);
    const galleryId = localStorage.getItem("currentGalleryId");

    // Настройка на стойността на скритото поле
    document.getElementById('gallery_id').value = galleryId;

    // Функция за изобразяване на изображенията в галерията
    function displayImages(galleryId) {
        const galleryContainer = document.querySelector('.gallery');

        // Изчистване на съдържанието на галерията
        galleryContainer.innerHTML = '';

        // Извличане на изображенията от галерията с AJAX заявка
        fetch(`./models/view_gallery.php?gallery_id=${galleryId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'SUCCESS') {
                    const images = data.images;
                    images.forEach(image => {
                        const imageElement = document.createElement('div');
                        imageElement.classList.add('gallery-item');
                        imageElement.innerHTML = `<img src="./models/${image}" alt="Image">`;
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

    // Извикване на функцията за изобразяване на изображенията
    if (galleryId) {
        displayImages(galleryId);
    }
});
