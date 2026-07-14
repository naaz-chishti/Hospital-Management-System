import mongoose from "mongoose";

const inpatientNoteSchema =
  new mongoose.Schema(
    {
      noteId: {
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

      vitals: {
        bp: String,
        pulse: String,
        temperature: String,
        oxygenLevel: String
      },

      notes: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

export default mongoose.model(
  "InpatientNote",
  inpatientNoteSchema
);