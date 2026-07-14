import mongoose from "mongoose";

const billSchema =
  new mongoose.Schema(
    {
      billId: {
        type: String,
        unique: true
      },

      patient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
      },

      consultationFee: {
        type: Number,
        default: 0
      },

      labFee: {
        type: Number,
        default: 0
      },

      imagingFee: {
        type: Number,
        default: 0
      },

      admissionFee: {
        type: Number,
        default: 0
      },

      medicineFee: {
        type: Number,
        default: 0
      },

      totalAmount: {
        type: Number,
        default: 0
      },

      paymentStatus: {
        type: String,
        enum: [
          "Pending",
          "Paid"
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
  "Bill",
  billSchema
);