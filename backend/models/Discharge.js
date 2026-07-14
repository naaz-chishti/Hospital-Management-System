import mongoose from "mongoose";

const dischargeSchema =
  new mongoose.Schema(
    {
      dischargeId: {
        type: String,
        unique: true
      },

      admission: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Admission",
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

      diagnosis: {
        type: String,
        required: true
      },

      treatmentGiven: {
        type: String,
        required: true
      },

      medications: [
        {
          type: String
        }
      ],

      followUpDate: {
        type: Date
      },

      dischargeDate: {
        type: Date,
        default: Date.now
      },

      summary: {
        type: String
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "Discharge",
  dischargeSchema
);