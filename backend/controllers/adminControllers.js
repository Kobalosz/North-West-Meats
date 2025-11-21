import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new admin
const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username, email, and password",
    });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email or username already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
    });
  } catch (error) {
    console.error(`Error registering admin: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password",
    });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(`Error logging in admin: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error(`Error fetching admin profile: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { registerAdmin, loginAdmin, getAdminProfile };
