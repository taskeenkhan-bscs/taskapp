import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNo: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: [
        "Project Manager",
        "Developer",
        "Designer",
        "Tester",
      ],
      required: true,
    },

    profilePicture: {
      type: String, // Cloudinary/Image URL
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Membermodel = mongoose.model("Member", memberSchema);

export default Membermodel;