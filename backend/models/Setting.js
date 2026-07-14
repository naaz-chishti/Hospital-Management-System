import mongoose from "mongoose";

const settingSchema =
  new mongoose.Schema(
    {
      hospitalName: {
        type: String,
        required: true
      },

      address: {
        type: String
      },

      phone: {
        type: String
      },

      email: {
        type: String
      },

      website: {
        type: String
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "Setting",
  settingSchema
);