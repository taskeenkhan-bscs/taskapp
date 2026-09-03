import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import regmodel from "../models/Regristion.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("The API is hit");

    const { name, email, password, role, cnic, age, address } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await regmodel.create({
      name,
      email,
      password: hashpassword,
      role,
      cnic,
      age,
      address,
    });

    const jwthash = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", jwthash, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.status(201).json({
      success: true,
      message: "User saved successfully",
      token: jwthash, // ← Electron/localStorage flow ke liye add kiya
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await regmodel.findOne({
      email,
      role,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or role",
      });
    }

    const result = await bcrypt.compare(
      password,
      user.password
    );

    if (!result) {
      return res.json({
        success: false,
        message: "Password not matched",
      });
    }

    const jwthash = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", jwthash, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.json({
      success: true,
      message: "Login successful",
      token: jwthash, // ← Electron/localStorage flow ke liye add kiya
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logout successful",
  });
});

export default router;