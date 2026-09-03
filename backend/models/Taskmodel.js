import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Urgent",
      ],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Started",
        "In Progress",
        "Completed",
      ],
      default: "Pending",
    },

    deadline: {
      type: Date,
      default: null,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectForm",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);