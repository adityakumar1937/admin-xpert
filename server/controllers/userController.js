const User = require("../models/User");
const speakeasy = require("speakeasy");
const twilio = require("twilio");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Register Controller (if needed)
exports.register = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Passwords do not match" });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Fetch user profile Controller
exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update user profile Controller
exports.updateProfile = async (req, res) => {
  try {
    const { id, photo, ...restOfBody } = req.body;
    console.log(req.body);
    if (!id) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // If photo exists in the body, convert it to a Buffer
    const updateData = photo
      ? { ...restOfBody, photo: Buffer.from(photo, "base64") }
      : restOfBody;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// sendOtp Controller
exports.sendOtp = async (req, res) => {
  const { telephone } = req.body;

  // Validate that the phone number is exactly 10 digits
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const countryCode = "91";
  const formattedTelephone = `+${countryCode}${telephone}`;

  if (!isValidPhoneNumber(telephone)) {
    return res.status(400).json({ msg: "Invalid phone number" });
  }

  try {
    // Check if user exists in the database
    const user = await User.findOne({ telephone });
    if (!user) {
      return res.status(400).json({ msg: "Telephone number not registered." });
    }

    // Generate OTP
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    // Save the OTP to the user's record
    user.otp = token;
    await user.save();

    // Send OTP via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    try {
      await client.messages.create({
        body: `Your AdminXpert OTP is ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedTelephone,
      });
      return res
        .status(200)
        .json({ success: true, msg: "OTP sent successfully" });
    } catch (err) {
      console.error("Twilio error: ", err);
      return res
        .status(500)
        .json({ success: false, msg: "Failed to send OTP" });
    }
  } catch (err) {
    console.error("Server error: ", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// verifyOtp Controller
exports.verifyOtp = async (req, res) => {
  const { telephone, otp } = req.body;

  try {
    const user = await User.findOne({ telephone });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    const isMatch = otp === user.otp;
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid OTP" });
    }

    // Clear the OTP from the user's record
    user.otp = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        photo: user.photo,
        designation: user.designation,
        experience: user.experience,
        skills: user.skills,
        education: user.education,
      },
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
