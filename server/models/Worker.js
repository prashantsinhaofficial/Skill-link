const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profession: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    serviceRadius: {
      type: Number,
      default: 10,
      min: 1,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
      min: 0,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);