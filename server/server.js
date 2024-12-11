const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// In-memory bike data
let bikes = [
  { id: 1, name: "Yamaha MT-15", exPrice: 162000, onPrice: 182000, image: "uploads/mt15.jpg" },
  { id: 2, name: "Yamaha R15", exPrice: 172000, onPrice: 192000, image: "uploads/r15.jpg" },
];

// API endpoints
app.get("/bikes", (req, res) => {
  res.json(bikes);
});

app.post("/bikes", upload.single("image"), (req, res) => {
  const { name, exPrice, onPrice } = req.body;
  const image = req.file ? req.file.path : null;

  if (!name || !exPrice || !onPrice || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newBike = {
    id: bikes.length + 1,
    name,
    exPrice: parseInt(exPrice, 10),
    onPrice: parseInt(onPrice, 10),
    image,
  };

  bikes.push(newBike);
  res.status(201).json(newBike);
});

app.put("/bikes/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, exPrice, onPrice } = req.body;
  const image = req.file ? req.file.path : req.body.image;

  const bike = bikes.find((b) => b.id === parseInt(id, 10));
  if (!bike) {
    return res.status(404).json({ message: "Bike not found." });
  }

  bike.name = name || bike.name;
  bike.exPrice = parseInt(exPrice, 10) || bike.exPrice;
  bike.onPrice = parseInt(onPrice, 10) || bike.onPrice;
  bike.image = image || bike.image;

  res.json(bike);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
