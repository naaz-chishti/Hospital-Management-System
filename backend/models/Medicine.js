import mongoose from "mongoose";

const medicineSchema =
  new mongoose.Schema(
    {
      medicineId: {
        type: String,
        unique: true
      },

      medicineName: {
        type: String,
        required: true
      },

      category: {
        type: String,
        required: true
      },

      manufacturer: {
        type: String
      },

      stock: {
        type: Number,
        default: 0
      },

      unitPrice: {
        type: Number,
        required: true
      },

      expiryDate: {
        type: Date
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "Medicine",
  medicineSchema
);