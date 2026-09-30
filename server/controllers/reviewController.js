const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Worker = require("../models/Worker");

/*
=========================================================
CREATE REVIEW
POST /api/reviews
=========================================================
*/
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (String(booking.customer) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to review this booking.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review only completed bookings.",
      });
    }

    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking.",
      });
    }

    const worker = await Worker.findById(booking.worker);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    const review = await Review.create({
      booking: booking._id,
      customer: booking.customer,
      worker: booking.worker,
      rating: numericRating,
      comment:
        typeof comment === "string"
          ? comment.trim().slice(0, 500)
          : "",
    });

    const oldTotalReviews = Number(worker.totalReviews || 0);
    const oldRating = Number(worker.rating || 0);

    const newTotalReviews = oldTotalReviews + 1;

    const newRating =
      (oldRating * oldTotalReviews + numericRating) /
      newTotalReviews;

    worker.totalReviews = newTotalReviews;
    worker.rating = Number(newRating.toFixed(2));

    await worker.save();

    const populatedReview = await Review.findById(review._id)
      .populate("customer", "name")
      .populate("worker");

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully ⭐",
      review: populatedReview,
      workerRating: worker.rating,
      totalReviews: worker.totalReviews,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This booking has already been reviewed.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
};

/*
=========================================================
GET WORKER REVIEWS
GET /api/reviews/worker/:workerId
=========================================================
*/
const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;

    const reviews = await Review.find({
      worker: workerId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET WORKER REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};

/*
=========================================================
CHECK BOOKING REVIEW
GET /api/reviews/booking/:bookingId
=========================================================
*/
const getBookingReview = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Sirf booking ka customer apni review status check kar sakta hai
    if (String(booking.customer) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this review.",
      });
    }

    const review = await Review.findOne({
      booking: booking._id,
    });

    return res.status(200).json({
      success: true,
      reviewed: Boolean(review),
      review: review || null,
    });
  } catch (error) {
    console.error("GET BOOKING REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to check review status.",
    });
  }
};

module.exports = {
  createReview,
  getWorkerReviews,
  getBookingReview,
};