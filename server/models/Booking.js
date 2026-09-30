const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    estimatedHours: {
      type: Number,
      default: 1,
      min: 1,
      max: 24,
    },

    workerHourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },

    serviceAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    doorstepFee: {
      type: Number,
      default: 49,
      min: 0,
    },

    welfareCess: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "refunded",
      ],
      default: "pending",
    },

    customerNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({
  customer: 1,
  createdAt: -1,
});

bookingSchema.index({
  worker: 1,
  createdAt: -1,
});

bookingSchema.index({
  status: 1,
});

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);