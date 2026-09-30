const Worker = require("../models/Worker");
const User = require("../models/User");

// =====================================================
// CREATE / UPDATE WORKER PROFILE
// =====================================================

const createOrUpdateWorkerProfile = async (req, res) => {
  try {
    const {
      profession,
      skills,
      experience,
      bio,
      phone,
      city,
      address,
      hourlyRate,
      serviceRadius,
      profileImage,
    } = req.body;

    if (!profession || !profession.trim()) {
      return res.status(400).json({
        success: false,
        message: "Profession is required",
      });
    }

    // Only workers can create worker profiles
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can create a worker profile",
      });
    }

    let worker = await Worker.findOne({
      user: req.user.id,
    });

    const workerData = {
      user: req.user.id,
      profession: profession.trim(),
      skills: Array.isArray(skills) ? skills : [],
      experience: Number(experience) || 0,
      bio: bio ? bio.trim() : "",
      phone: phone ? phone.trim() : "",
      city: city ? city.trim() : "",
      address: address ? address.trim() : "",
      hourlyRate: Number(hourlyRate) || 0,
      serviceRadius: Number(serviceRadius) || 10,
      profileImage: profileImage || "",
    };

    if (worker) {
      worker = await Worker.findOneAndUpdate(
        { user: req.user.id },
        workerData,
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      worker = await Worker.create(workerData);
    }

    const populatedWorker = await Worker.findById(
      worker._id
    ).populate(
      "user",
      "name email role isVerified"
    );

    return res.status(200).json({
      success: true,
      message: "Worker profile saved successfully",
      worker: populatedWorker,
    });
  } catch (error) {
    console.error(
      "CREATE/UPDATE WORKER PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error while saving worker profile",
    });
  }
};

// =====================================================
// GET MY WORKER PROFILE
// =====================================================

const getMyWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      user: req.user.id,
    }).populate(
      "user",
      "name email role isVerified"
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    console.error("GET MY WORKER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// GET ALL WORKERS
// =====================================================

const getWorkers = async (req, res) => {
  try {
    const {
      profession,
      city,
      available,
    } = req.query;

    const filter = {};

    if (profession) {
      filter.profession = {
        $regex: profession,
        $options: "i",
      };
    }

    if (city) {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    if (available === "true") {
      filter.isAvailable = true;
    }

    const workers = await Worker.find(filter)
      .populate(
        "user",
        "name email role isVerified"
      )
      .sort({
        rating: -1,
        completedJobs: -1,
      });

    return res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("GET WORKERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching workers",
    });
  }
};

// =====================================================
// GET SINGLE WORKER
// =====================================================

const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(
      req.params.id
    ).populate(
      "user",
      "name email role isVerified"
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    return res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    console.error("GET WORKER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// UPDATE WORKER AVAILABILITY
// =====================================================

const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be true or false",
      });
    }

    const worker = await Worker.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        isAvailable,
      },
      {
        new: true,
      }
    ).populate(
      "user",
      "name email role isVerified"
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Worker is now ${
        isAvailable ? "available" : "unavailable"
      }`,
      worker,
    });
  } catch (error) {
    console.error(
      "UPDATE AVAILABILITY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createOrUpdateWorkerProfile,
  getMyWorkerProfile,
  getWorkers,
  getWorkerById,
  updateAvailability,
};