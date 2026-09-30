const Booking = require("../models/Booking");
const Worker = require("../models/Worker");

// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {
  try {
    const {
      workerId,
      service,
      description,
      address,
      city,
      phone,
      bookingDate,
      estimatedHours,
      customerNote,
    } = req.body;

    // -------------------------------------------------
    // Validation
    // -------------------------------------------------

    if (
      !workerId ||
      !service ||
      !address ||
      !city ||
      !phone ||
      !bookingDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Worker, service, address, city, phone and booking date are required",
      });
    }

    // -------------------------------------------------
    // Find worker
    // -------------------------------------------------

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // -------------------------------------------------
    // Check availability
    // -------------------------------------------------

    if (worker.isAvailable === false) {
      return res.status(400).json({
        success: false,
        message: "This worker is currently unavailable",
      });
    }

    // -------------------------------------------------
    // Validate booking date
    // -------------------------------------------------

    const selectedDate = new Date(bookingDate);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date",
      });
    }

    if (selectedDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    // -------------------------------------------------
    // Hours
    // -------------------------------------------------

    const hours =
      Number(estimatedHours) > 0
        ? Number(estimatedHours)
        : 1;

    // -------------------------------------------------
    // Pricing
    // -------------------------------------------------

    const hourlyRate = Number(worker.hourlyRate) || 0;

    const serviceAmount = hourlyRate * hours;

    // Current Skill-Link doorstep pricing
    // Default starting fee = ₹49

    const doorstepFee = 49;

    // 3% welfare cess

    const welfareCess = Number(
      ((serviceAmount + doorstepFee) * 0.03).toFixed(2)
    );

    const totalAmount = Number(
      (
        serviceAmount +
        doorstepFee +
        welfareCess
      ).toFixed(2)
    );

    // -------------------------------------------------
    // Create booking
    // -------------------------------------------------

    const booking = await Booking.create({
      customer: req.user.id,
      worker: worker._id,

      service: service.trim(),

      description: description
        ? description.trim()
        : "",

      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),

      bookingDate: selectedDate,

      estimatedHours: hours,

      workerHourlyRate: hourlyRate,

      serviceAmount,
      doorstepFee,
      welfareCess,
      totalAmount,

      customerNote: customerNote
        ? customerNote.trim()
        : "",

      status: "pending",
      paymentStatus: "pending",
    });

    // -------------------------------------------------
    // Populate response
    // -------------------------------------------------

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate(
          "customer",
          "name email phone role"
        )
        .populate({
          path: "worker",
          populate: {
            path: "user",
            select: "name email phone role",
          },
        });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating booking",
    });
  }
};

// =====================================================
// GET CUSTOMER BOOKINGS
// =====================================================

const getCustomerBookings = async (
  req,
  res
) => {
  try {
    const bookings = await Booking.find({
      customer: req.user.id,
    })
      .populate(
        "customer",
        "name email phone role"
      )
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select:
            "name email phone role",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET CUSTOMER BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching bookings",
    });
  }
};

// =====================================================
// GET WORKER BOOKINGS
// =====================================================

const getWorkerBookings = async (
  req,
  res
) => {
  try {
    const worker = await Worker.findOne({
      user: req.user.id,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message:
          "Worker profile not found",
      });
    }

    const bookings = await Booking.find({
      worker: worker._id,
    })
      .populate(
        "customer",
        "name email phone role"
      )
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select:
            "name email phone role",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET WORKER BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching worker bookings",
    });
  }
};

// =====================================================
// GET SINGLE BOOKING
// =====================================================

const getBookingById = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate(
          "customer",
          "name email phone role"
        )
        .populate({
          path: "worker",
          populate: {
            path: "user",
            select:
              "name email phone role",
          },
        });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const customerId =
      booking.customer?._id?.toString();

    const workerUserId =
      booking.worker?.user?._id?.toString();

    const currentUserId =
      req.user.id.toString();

    const isCustomer =
      customerId === currentUserId;

    const isWorker =
      workerUserId === currentUserId;

    if (!isCustomer && !isWorker) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this booking",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(
      "GET BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching booking",
    });
  }
};

// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

const updateBookingStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "rejected",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking =
      await Booking.findById(
        req.params.id
      ).populate({
        path: "worker",
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const currentUserId =
      req.user.id.toString();

    const worker = await Worker.findById(
      booking.worker._id
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const isCustomer =
      booking.customer.toString() ===
      currentUserId;

    const isWorker =
      worker.user.toString() ===
      currentUserId;

    // Worker controls job acceptance/progress/completion

    if (
      [
        "accepted",
        "rejected",
        "in-progress",
        "completed",
      ].includes(status) &&
      !isWorker
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the assigned worker can update this status",
      });
    }

    // Customer can cancel

    if (
      status === "cancelled" &&
      !isCustomer &&
      !isWorker
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to cancel this booking",
      });
    }

    booking.status = status;

    if (status === "completed") {
      booking.paymentStatus = "paid";

      await Worker.findByIdAndUpdate(
        worker._id,
        {
          $inc: {
            completedJobs: 1,
          },
        }
      );
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message:
        "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "UPDATE BOOKING STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating booking",
    });
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getWorkerBookings,
  getBookingById,
  updateBookingStatus,
};