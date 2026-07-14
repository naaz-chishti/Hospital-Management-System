import mongoose from "mongoose";

const reportUploadSchema =
  new mongoose.Schema(
    {
      uploadId: {
        type: String,
        unique: true
      },

      patient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
      },

      reportType: {
  type: String,
  enum: [
    "Laboratory",
    "Radiology",
    "Prescription",
    "Discharge"
  ],
  required: true
},

      reportName: {
        type: String,
        required: true
      },

      filePath: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "ReportUpload",
  reportUploadSchema
);