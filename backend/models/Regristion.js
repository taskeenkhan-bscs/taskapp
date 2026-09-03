import mongoose, { Schema } from "mongoose";

let regscheme = new Schema(
  {
    // NAME
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // EMAIL
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // PASSWORD
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim:true 
    },

    // ROLE
    role: {
      type: String,
      enum: ["admin", "manager", "employee","clerk"],
      default: "employee",
    },

    // ADDRESS
    address: {
      type: String,
      required: true,
    },

    // CNIC
    cnic: {
      type: String,
      required: true,
      unique: true,
    },

    // AGE
    age: {
      type: Number,
      required: true,
      min: 15,
      max: 55,
    },
  },
  {
    timestamps: true,
  }
);

let regmodel = mongoose.model("regestion", regscheme);

export default regmodel;