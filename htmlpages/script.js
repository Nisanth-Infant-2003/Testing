// Default bike data
const defaultBikes = [
  { id: 1, name: "Yamaha MT-15", exPrice: 162000, onPrice: 182000, image: "bikeimages/mt15.jpg" },
  { id: 2, name: "Yamaha R15", exPrice: 172000, onPrice: 192000, image: "bikeimages/r15.jpg" },
  { id: 3, name: "Pulsar 150", exPrice: 112000, onPrice: 132000, image: "bikeimages/pulsar150.jpg" },
  { id: 4, name: "Apache RR 310", exPrice: 249000, onPrice: 269000, image: "bikeimages/apache-rr310.jpg" },
  { id: 5, name: "Apache RTR 200", exPrice: 131000, onPrice: 151000, image: "bikeimages/Apache rtr200.jpg" },
  { id: 6, name: "KTM RC 390", exPrice: 320000, onPrice: 350000, image: "bikeimages/rc390.jpg" },
];

// Fetch bike data from localStorage or use default
const bikes = JSON.parse(localStorage.getItem("bikes")) || defaultBikes;

// Render bike details on main.html
function renderBikes() {
  const bikeList = document.getElementById("bikeList");
  if (!bikeList) {
    console.error("Element with ID 'bikeList' not found!");
    return;
  }
  bikeList.innerHTML = bikes
    .map(
      (bike) => `
      <div class="bike-container">
        <img src="${bike.image}" alt="${bike.name}">
        <h2>${bike.name}</h2>
        <p class="price">Ex-Showroom Price: ₹<span>${bike.exPrice}</span></p>
        <p class="price">On-Road Price: ₹<span>${bike.onPrice}</span></p>
      </div>
    `
    )
    .join("");
}

// Populate admin form on admin.html
function populateAdminForm() {
  const adminForm = document.getElementById("adminForm");
  if (!adminForm) {
    console.error("Element with ID 'adminForm' not found!");
    return;
  }
  adminForm.innerHTML = bikes
    .map(
      (bike) => `
      <div class="bike-form">
        <h3>${bike.name}</h3>
        <label for="exPrice-${bike.id}">Ex-Showroom Price:</label>
        <input type="number" id="exPrice-${bike.id}" value="${bike.exPrice}">
        <label for="onPrice-${bike.id}">On-Road Price:</label>
        <input type="number" id="onPrice-${bike.id}" value="${bike.onPrice}">
      </div>
    `
    )
    .join("");
}

// Save updated prices from admin.html
function savePrices() {
  const updatedBikes = bikes.map((bike) => {
    const exPriceInput = document.getElementById(`exPrice-${bike.id}`);
    const onPriceInput = document.getElementById(`onPrice-${bike.id}`);

    return {
      ...bike,
      exPrice: parseInt(exPriceInput.value, 10),
      onPrice: parseInt(onPriceInput.value, 10),
    };
  });

  // Save to localStorage
  localStorage.setItem("bikes", JSON.stringify(updatedBikes));
  alert("Prices updated successfully!");
}

// Add a new bike
function addNewBike() {
  const name = document.getElementById("newBikeName").value;
  const exPrice = parseInt(document.getElementById("newExPrice").value, 10);
  const onPrice = parseInt(document.getElementById("newOnPrice").value, 10);
  const image = document.getElementById("newBikeImage").value;

  if (name && !isNaN(exPrice) && !isNaN(onPrice) && image) {
    const newBike = {
      id: bikes.length + 1,
      name: name,
      exPrice: exPrice,
      onPrice: onPrice,
      image: image,
    };
    bikes.push(newBike);
    localStorage.setItem("bikes", JSON.stringify(bikes));
    alert("New bike added successfully!");
    populateAdminForm();  // Re-populate the admin form with updated bike list
  } else {
    alert("Please fill in all fields correctly.");
  }
}

// Run functions based on the current page
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  if (path.includes("index.html")) {
    renderBikes();
  } else if (path.includes("htmlpages/admin.html")) {
    populateAdminForm();
  }
});

// Expose savePrices globally for use in admin.html
window.savePrices = savePrices;
