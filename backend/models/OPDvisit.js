import mongoose from "mongoose";

const opdVisitSchema = new mongoose.Schema(
  {
    visitId: {
      type: String,
      unique: true
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    symptoms: {
      type: String,
      required: true
    },


    visitDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: [
        "Waiting",
        "In Consultation",
        "Completed"
      ],
      default: "Waiting"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model(
  "OPDVisit",
  opdVisitSchema
);