import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      notificationId: {
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

      role: {
        type: String,
        enum: [
          "Admin",
          "Doctor",
          "Nurse",
          "Receptionist",
          "Patient"
        ],
        required: true
      },

      isRead: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "Notification",
  notificationSchema
);