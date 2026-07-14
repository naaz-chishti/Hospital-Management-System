import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    reportType: {
      type: String,
      enum: [
        "Patient",
        "Revenue",
        "Admission",
        "Laboratory",
      ],
      required: true,
    },

    generatedBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Report", reportSchema);