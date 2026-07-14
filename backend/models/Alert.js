import mongoose from "mongoose";

const alertSchema =
  new mongoose.Schema(
    {
      alertId: {
        type: String,
        unique: true
      },

      title: {
        type: String,
        required: true
      },

      message: {
        type: String,
        required: true
      },

      alertType: {
        type: String,
        enum: [
          "Appointment",
          "Billing",
          "Lab",
          "Discharge"
        ],
        required: true
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Sent"
        ],
        default: "Pending"
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "Alert",
  alertSchema
);