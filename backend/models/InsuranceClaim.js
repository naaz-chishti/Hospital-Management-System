import mongoose from "mongoose";

const insuranceClaimSchema =
  new mongoose.Schema(
    {
      claimId: {
        type: String,
        unique: true
      },

      patient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
      },

      bill: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        required: true
      },

      insuranceProvider: {
        type: String,
        required: true
      },

      policyNumber: {
        type: String,
        required: true
      },

      claimAmount: {
        type: Number,
        required: true
      },

      approvedAmount: {
        type: Number,
        default: 0
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Approved",
          "Rejected"
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
  "InsuranceClaim",
  insuranceClaimSchema
);