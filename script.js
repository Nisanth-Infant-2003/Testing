const API_URL = "http://localhost:5000";

async function fetchBikes() {
  const response = await fetch(`${API_URL}/bikes`);
  return await response.json();
}

async function renderBikes() {
  const bikes = await fetchBikes();
  const bikeList = document.getElementById("bikeList");
  bikeList.innerHTML = bikes
    .map(
      (bike) => `
      <div class="bike-container">
        <img src="${API_URL}/${bike.image}" alt="${bike.name}">
        <h2>${bike.name}</h2>
        <p class="price">Ex-Showroom Price: ₹${bike.exPrice}</p>
        <p class="price">On-Road Price: ₹${bike.onPrice}</p>
      </div>
    `
    )
    .join("");
}

async function populateAdminForm() {
  const bikes = await fetchBikes();
  const adminForm = document.getElementById("adminForm");
  adminForm.innerHTML = bikes
    .map(
      (bike) => `
      <div class="bike-form">
        <h3>${bike.name}</h3>
        <label for="exPrice-${bike.id}">Ex-Showroom Price:</label>
        <input type="number" id="exPrice-${bike.id}" value="${bike.exPrice}">
        <label for="onPrice-${bike.id}">On-Road Price:</label>
        <input type="number" id="onPrice-${bike.id}" value="${bike.onPrice}">
        <label for="image-${bike.id}">Bike Image:</label>
        <input type="file" id="image-${bike.id}">
        <button onclick="updateBike(${bike.id})">Update</button>
      </div>
    `
    )
    .join("");
}

async function addNewBike() {
  const name = document.getElementById("newBikeName").value;
  const exPrice = document.getElementById("newExPrice").value;
  const onPrice = document.getElementById("newOnPrice").value;
  const imageInput = document.getElementById("newBikeImage");
  const formData = new FormData();

  formData.append("name", name);
  formData.append("exPrice", exPrice);
  formData.append("onPrice", onPrice);
  formData.append("image", imageInput.files[0]);

  const response = await fetch(`${API_URL}/bikes`, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    alert("Bike added successfully!");
    populateAdminForm();
    renderBikes();
  } else {
    alert("Failed to add bike.");
  }
}

async function updateBike(id) {
  const exPrice = document.getElementById(`exPrice-${id}`).value;
  const onPrice = document.getElementById(`onPrice-${id}`).value;
  const imageInput = document.getElementById(`image-${id}`);
  const formData = new FormData();

  formData.append("exPrice", exPrice);
  formData.append("onPrice", onPrice);
  if (imageInput.files[0]) {
    formData.append("image", imageInput.files[0]);
  }

  const response = await fetch(`${API_URL}/bikes/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (response.ok) {
    alert("Bike updated successfully!");
    populateAdminForm();
    renderBikes();
  } else {
    alert("Failed to update bike.");
  }
}

// Load functions on page load
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("index.html")) {
    renderBikes();
  } else if (window.location.pathname.includes("admin.html")) {
    populateAdminForm();
  }
});
