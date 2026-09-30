const express = require("express");

const {
  createBooking,
  getCustomerBookings,
  getWorkerBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All booking routes require authentication

router.use(protect);

// Create booking

router.post("/", createBooking);

// Customer bookings

router.get(
  "/customer",
  getCustomerBookings
);

// Worker bookings

router.get(
  "/worker",
  getWorkerBookings
);

// Single booking

router.get(
  "/:id",
  getBookingById
);

// Update booking status

router.patch(
  "/:id/status",
  updateBookingStatus
);

module.exports = router;