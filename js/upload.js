(function () {
  let metadata = {
    name: "",
    size: "",
    type: "",
    lastModified: "",
    make: "",
    model: "",
    width: "",
    height: "",
    datetime: "",
  };

  document.getElementById("image").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) {
      document.getElementById("metadata").textContent = "No image uploaded.";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function () {
        EXIF.getData(img, function () {
          const exifData = EXIF.getAllTags(this);

          metadata.name = file.name;
          metadata.size = file.size;
          metadata.type = file.type;
          metadata.lastModified = new Date(file.lastModified).toISOString();
          metadata.make = exifData.Make || "Unknown";
          metadata.model = exifData.Model || "Unknown";
          metadata.width = exifData.PixelXDimension || "Unknown";
          metadata.height = exifData.PixelYDimension || "Unknown";
          metadata.datetime = exifData.DateTimeOriginal || "Unknown";

          console.log(metadata);
        });
      };
    };

    reader.readAsDataURL(file);
  });

  const imageInput = document.getElementById("image");
  const form = document.getElementById("upload-form");
  const dateInput = document.getElementById("date_taken");
  const responseDiv = document.getElementById("response-message");
  const preview = document.getElementById("preview");

  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
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
    formData.append("name", metadata.name);
    formData.append("size", metadata.size);
    formData.append("type", metadata.type);
    formData.append("lastModified", metadata.lastModified);
    formData.append("make", metadata.make);
    formData.append("model", metadata.model);
    formData.append("width", metadata.width);
    formData.append("height", metadata.height);
    formData.append("datetime", metadata.datetime);

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
  debugger;
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
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
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
