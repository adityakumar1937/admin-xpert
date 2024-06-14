const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// User data retrieval route
router.get("/user-dashboard", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// User profile picture upload and data update route
router.put(
  "/update/:id",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        id,
        name,
        email,
        phone,
        designation,
        pastExperience,
        skillSets,
        education,
      } = req.body;
      
      const photo = req.file ? req.file.buffer.toString("base64") : undefined;

      if (
        !name ||
        !email ||
        !phone ||
        !designation ||
        !pastExperience ||
        !skillSets ||
        !education
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const updateData = {
        name,
        email,
        phone,
        designation,
        pastExperience,
        skillSets,
        education,
        photo,
      };

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// User sign-up route
router.post("/sign-up", async (req, res) => {
  const { firstName, lastName, email, telephone, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      telephone,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
});

// Get user profile
router.get("/profile/:id", userController.getProfile);

// Send OTP route
router.post("/sendOtp", userController.sendOtp);

// Verify OTP route
router.post("/verifyOtp", userController.verifyOtp);

module.exports = router;
