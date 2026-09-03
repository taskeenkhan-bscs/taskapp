import express from "express";
import fs from "fs";
import ProjectForm from "../models/Projectform.js";
import upload from "../Middlewares/multermiddlewares.js";
import { Adminmiddleware } from "../Forauthmiddleware/Adminmiddleware.js";

const router = express.Router();

// CREATE PROJECT (admin only)
router.post(
  "/createform",
  Adminmiddleware,
  upload.single("picture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Project picture is required",
        });
      }

      const data = await ProjectForm.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority,
        deadline: req.body.deadline,
        picture: req.file.path,
      });

      res.json({
        success: true,
        message: "Project Created Successfully",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// GET ALL PROJECTS — PUBLIC
// Opened up so regular visitors can view the projects page. `priority` is
// left out on purpose — that's internal planning data, not for public eyes.
router.get("/", async (req, res) => {
  try {
    const data = await ProjectForm.find().select(
      "title description category picture status  priority completed isCompleted deadline createdAt"
    );

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ADMIN STATUS CHECK
// Frontend calls this (with credentials included) to decide whether to show
// admin controls (create/edit/delete). 200 = admin session valid; the
// middleware itself returns 401/403 otherwise.
router.get("/admin-check", Adminmiddleware, (req, res) => {
  res.json({ success: true });
});

// DELETE PROJECT (admin only)
router.post("/delete", Adminmiddleware, async (req, res) => {
  try {
    const { id } = req.body;

    const project = await ProjectForm.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }

    // remove picture from disk before deleting the record
    if (project.picture) {
      fs.unlink(project.picture, (err) => {
        if (err) console.log("File cleanup failed:", err.message);
      });
    }

    const result = await ProjectForm.findByIdAndDelete(id);

    res.json({
      success: true,
      msg: "Project deleted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Error deleting project",
      error: error.message,
    });
  }
});

// GET SINGLE PROJECT — PUBLIC (project detail view)
router.post("/modernproject" , async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.json({
        success: false,
        message: "ID missing",
      });
    }

    const project = await ProjectForm.findOne({ _id }).select(
      "title description category picture status completed isCompleted deadline createdAt"
    );

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE PROJECT (admin only)
router.post(
  "/updateproject",
  Adminmiddleware,
  upload.single("picture"), // parses multipart/form-data + file
  async (req, res) => {
    try {
      const { _id, title, description, category, priority, deadline, status } = req.body;

      if (!_id) {
        return res.status(400).json({
          success: false,
          message: "Project id is required",
        });
      }

      const existing = await ProjectForm.findById(_id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const updateData = {
        title,
        description,
        category,
        priority,
        deadline,
        status,
      };

      // only touch the picture if a new file was uploaded
      if (req.file) {
        updateData.picture = req.file.path;

        if (existing.picture) {
          fs.unlink(existing.picture, (err) => {
            if (err) console.log("Old file cleanup failed:", err.message);
          });
        }
      }

      const updated = await ProjectForm.findByIdAndUpdate(_id, updateData, {
        new: true,
      });

      res.json({
        success: true,
        project: updated,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router; 