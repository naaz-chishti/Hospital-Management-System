import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
      bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      required: true
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "Card",
        "UPI",
        "Net Banking"
      ],
      required: true
    },

    transactionId: {
      type: String
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Success",
        "Failed"
      ],
      default: "Success"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model(
  "Payment",
  paymentSchema
);