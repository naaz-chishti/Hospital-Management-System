import mongoose from "mongoose";

const imagingSchema = new mongoose.Schema(
  {
    imagingId: {
      type: String,
      unique: true
    },

    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    imagingType: {
      type: String,
      enum: [
        "X-Ray",
        "Ultrasound",
        "CT Scan",
        "MRI",
        "ECG"
      ],
      required: true
    },

    findings: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Ordered",
        "Completed"
      ],
      default: "Ordered"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model(
  "Imaging",
  imagingSchema
);