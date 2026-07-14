import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    admissionId: {
      type: String,
      unique: true
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

    ward: {
      type: String,
      required: true
    },

    bedNumber: {
      type: String,
      required: true
    },

    reason: {
      type: String,
      required: true
    },

    admissionDate: {
      type: Date,
      default: Date.now
    },

    dischargeDate: {
      type: Date
    },

    status: {
      type: String,
      enum: [
        "Admitted",
        "Discharged"
      ],
      default: "Admitted"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model(
  "Admission",
  admissionSchema
);