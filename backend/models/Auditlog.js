import mongoose from "mongoose";

const auditLogSchema =
  new mongoose.Schema(
    {
      logId: {
        type: String,
        unique: true
      },

      user: {
        type: String,
        required: true
      },

      action: {
        type: String,
        required: true
      },

      module: {
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
  "AuditLog",
  auditLogSchema
);