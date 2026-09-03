import express from "express";
import upload from "../Middlewares/multermiddlewares.js";
import Membermodel from "../models/Createmember.js";

const router = express.Router();

// CREATE MEMBER
router.post("/create", upload.single("profilePicture"), async (req, res) => {
  try {
    let body = req.body;

    body.profilePicture = req.file ? req.file.path : null;

    const data = await Membermodel.create(body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ALL MEMBERS
router.get("/", async (req, res) => {
  try {
    const members = await Membermodel.find();

    res.json({
      success: true,
      count: members.length,
      msg: "Getting all members",
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE MEMBER
router.delete("/deletemember", async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Membermodel.findByIdAndDelete(id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET SINGLE MEMBER
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Membermodel.findById(id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE MEMBER
router.post("/update", upload.single("profilePicture"), async (req, res) => {
  try {

    const { _id, ...updatedData } = req.body;

    const member = await Membermodel.findById(_id);

    if (!member) {
      return res.json({
        success: false,
        message: "Member not found",
      });
    }

    member.fullName = updatedData.fullName;
    member.email = updatedData.email;
    member.phoneNo = updatedData.phoneNo;
    member.role = updatedData.role;

    // Only replace image if user selected a new one
    if (req.file) {
      member.profilePicture = req.file.path;
    }

    await member.save();

    res.json({
      success: true,
      message: "Member Updated Successfully",
      data: member,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
});
export default router;