import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["App", "Web", "Game", "Desktop", "AI"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    deadline: {
      type: Date,
      default: null,
    },
    picture: {
      type: String,
      default: "",
    },
    member:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member"
    }


  },
  { timestamps: true }
);

const ProjectForm = mongoose.model("ProjectForm", projectSchema);

export default ProjectForm;