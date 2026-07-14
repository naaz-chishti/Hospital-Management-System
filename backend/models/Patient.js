import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      trim: true
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    dob: {
      type: Date,
      required: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },

    bloodGroup: {
      type: String,
      trim: true
    },

    allergies: [
      {
        type: String,
        trim: true
      }
    ],

    medicalHistory: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Patient = mongoose.model(
  "Patient",
  patientSchema
);

export default Patient;