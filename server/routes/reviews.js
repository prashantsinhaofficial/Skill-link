const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getWorkerReviews,
  getBookingReview,
} = require("../controllers/reviewController");

const router = express.Router();

/*
=========================================================
PUBLIC
Worker ke reviews dekhna
=========================================================
*/
router.get("/worker/:workerId", getWorkerReviews);

/*
=========================================================
PROTECTED
Customer ki booking review status check
=========================================================
*/
router.get("/booking/:bookingId", protect, getBookingReview);

/*
=========================================================
PROTECTED
Customer review submit karega
=========================================================
*/
router.post("/", protect, createReview);

module.exports = router;