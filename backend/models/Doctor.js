import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    department: {
      type: String,
      required: true
    },

    specialization: {
      type: String,
      required: true
    },

    qualification: {
      type: String
    },

    experience: {
      type: Number
    },

    consultationFee: {
      type: Number
    },

    role: {
      type: String,
      default: "Doctor"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Doctor",
  doctorSchema
);