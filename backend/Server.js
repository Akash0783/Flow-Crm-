const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Import routes
const cusRoutes = require(".../backend/Routes/cusRoutes");
const invoiceRoutes = require("../backend/Routes/invoices");
const AuthRoutes = require("../backend/Routes/AuthRoutes")
const authMiddleware = require("../backend/Middleware/Auth")

// Use routes
app.use("/api/auth", AuthRoutes)
app.use("/api/customers",  cusRoutes);
app.use("/api/invoices",  invoiceRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("CRM Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));