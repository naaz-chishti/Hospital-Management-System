import mongoose from "mongoose";

const labTestSchema =
  new mongoose.Schema(
    {
      testId: {
        type: String,
        unique: true
      },

      consultation: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Consultation",
        required: true
      },

      patient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
      },

      doctor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      testName: {
        type: String,
        required: true
      },

      status: {
        type: String,
        enum: [
          "Ordered",
          "Collected",
          "Processing",
          "Completed"
        ],
        default: "Ordered"
      },

      result: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "LabTest",
  labTestSchema
);