// admin/backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const employeeRoutes = require("./routes/emp");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://sri951591:8At1ARY1sNp09Czj@cluster0.glhre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {




  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));

// Use routes


const PORT = 3003;
app.listen(PORT, () => console.log(`Admin backend running on port ${PORT}`));
