document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const photoId = urlParams.get('photoId');

    function displayPhotoDetails(photoId) {
        fetch(`./models/view_photo.php?photo_id=${photoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'SUCCESS') {
                    const image = data.image;

                    // Display image details
                    document.querySelector('.photo-section img').src = `./models/${image.image_dir}`;
                    document.querySelector('.info-section').innerHTML = `
                        <h2>${image.name}</h2>
                        <p><strong>Author:</strong> ${image.author}</p>
                        <p><strong>Date Created:</strong> ${image.date_created}</p>
                        <p><strong>Size:</strong> ${image.size}</p>
                        <p><strong>Type:</strong> ${image.type}</p>
                        <p><strong>Last Modified:</strong> ${image.last_modified}</p>
                        <p><strong>Make:</strong> ${image.make}</p>
                        <p><strong>Model:</strong> ${image.model}</p>
                        <p><strong>Width:</strong> ${image.width}</p>
                        <p><strong>Height:</strong> ${image.height}</p>
                        <p><strong>DateTime:</strong> ${image.datetime}</p>
                    `;
                } else {
                    document.querySelector('.info-section').innerHTML = `<p>${data.message}</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching photo details:', error);
                document.querySelector('.info-section').innerHTML = `<p>Failed to fetch photo details. Please try again later.</p>`;
            });
    }

    if (photoId) {
        displayPhotoDetails(photoId);
    } else {
        document.querySelector('.info-section').innerHTML = `<p>No photo selected.</p>`;
    }
});


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