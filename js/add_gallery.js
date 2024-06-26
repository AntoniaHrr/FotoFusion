document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("gallery-form");
    const responseDiv = document.getElementById("response-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        responseDiv.innerHTML = "";

        const formData = new FormData(form);
        formData.append("visibility", document.getElementById("gallery-private").checked ? 1 : 0);

        createGallery(formData)
            .then((response) => {
                if (response.status === "ERROR") {
                    throw new Error(response.message);
                } else {
                    responseDiv.textContent = "Gallery created successfully!";
                    setTimeout(() => {
                        window.location.href = "galleries.html";
                    }, 2000);
                }
            })
            .catch((error) => {
                responseDiv.textContent = error.message;
            });
    });

    function createGallery(data) {
        return fetch("./models/add_gallery.php", {
            method: "POST",
            body: data,
        })
            .then((response) => response.json())
            .catch((error) => {
                throw new Error("Failed to create gallery: " + error.message);
            });
    }
});
