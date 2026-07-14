import mongoose from "mongoose";

const consultationSchema =
  new mongoose.Schema(
    {
      consultationId: {
        type: String,
        unique: true
      },

      opdVisit: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "OPDVisit",
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

      notes: {
        type: String
      },

      prescription: [
        {
          medicine: String,
          dosage: String,
          duration: String
        }
      ],

     recommendedTests: [
  String
]
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "Consultation",
  consultationSchema
);