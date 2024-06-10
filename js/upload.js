(function () {
    const imageInput = document.getElementById("image");
    const form = document.getElementById("upload-form");
    const dateInput = document.getElementById("date_taken");
    const responseDiv = document.getElementById("response-message");
    const preview = document.getElementById("preview");

    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        responseDiv.classList.add("no-show");
        responseDiv.innerHTML = null;

        const formData = new FormData(form);
        formData.append("date_taken", dateInput.value);
        const galleryId = localStorage.getItem("currentGalleryId");
        formData.append("gallery_id", galleryId);

        uploadImage(formData)
            .then((responseMessage) => {
                if (responseMessage["status"] === "ERROR") {
                    throw new Error(responseMessage["message"]);
                } else {
                    createSuccessDivContent(responseDiv, responseMessage["message"]);
                }
            })
            .catch((errorMessage) => {
                createErrorDivContent(responseDiv, errorMessage.message);
            });
    });

    // Set the gallery ID from local storage
    const galleryId = localStorage.getItem("currentGalleryId");
    if (galleryId) {
        document.getElementById("gallery_id").value = galleryId;
    }
})();

function uploadImage(data) {
    return fetch("./models/upload.php", {
        method: "POST",
        body: data,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data); // Log the entire response for debugging
        return data;
    })
    .catch((error) => {
        console.error("Fetch error:", error); // Log the fetch error
        throw new Error("Failed to fetch: " + error.message);
    });
}

function createErrorDivContent(div, response) {
    let messageContainer = document.createElement("span");
    let message = document.createElement("p");
    message.textContent = response;
    messageContainer.append(message);
    div.appendChild(messageContainer);
    div.classList.remove("no-show");
}

function createSuccessDivContent(div, response) {
    let messageContainer = document.createElement("span");
    let message = document.createElement("p");
    message.textContent = response;
    messageContainer.append(message);
    div.appendChild(messageContainer);
    div.classList.remove("no-show");
}
