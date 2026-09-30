const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const workerRoutes = require("./routes/workers");
const bookingRoutes = require("./routes/booking");
const reviewRoutes = require("./routes/reviews");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Skill-Link Backend is running 🚀",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Skill-Link API is healthy ✅",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use("/api/auth", authRoutes);

// Workers
app.use("/api/workers", workerRoutes);

// Bookings
app.use("/api/bookings", bookingRoutes);

app.use("/api/reviews", reviewRoutes);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `🚀 Skill-Link server running on http://localhost:${PORT}`
  );
});