const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createOrUpdateWorkerProfile,
  getMyWorkerProfile,
  getWorkers,
  getWorkerById,
  updateAvailability,
} = require("../controllers/workerController");

const router = express.Router();

// Public routes

router.get("/", getWorkers);

router.get("/:id", getWorkerById);

// Protected worker routes

router.get(
  "/profile/me",
  protect,
  getMyWorkerProfile
);

router.post(
  "/profile",
  protect,
  createOrUpdateWorkerProfile
);

router.patch(
  "/availability",
  protect,
  updateAvailability
);

module.exports = router;