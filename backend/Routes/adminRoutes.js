import express from "express";
import jwt from "jsonwebtoken";
import regmodel from "../models/Regristion.js";

const router = express.Router();

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return req.cookies?.token;
}

// CHECK ADMIN
router.get("/isadmin", async (req, res) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.json({
        success: false,
        msg: "Token not found",
      });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    const existingAdmin = await regmodel.findById(data._id);

    if (!existingAdmin) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    if (existingAdmin.role !== "admin") {
      return res.json({
        success: false,
        msg: "Access denied",
      });
    }

    return res.json({
      success: true,
      msg: "Admin verified",
      user: existingAdmin,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }
});


router.get("/islogin", async (req, res) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.json({
        success: false,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      success: true,
    });

  } catch (error) {
    res.json({
      success: false,
    });
  }
});

export default router;