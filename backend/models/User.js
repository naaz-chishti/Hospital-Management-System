import mongoose from "mongoose";

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },

      email: {
        type: String,
        required: true,
        unique: true
      },

      password: {
        type: String,
        required: true
      },

      role: {
        type: String,
        enum: [
          "Admin",
          "Receptionist",
          "Doctor",
          "Nurse",
          "LabTechnician",
          "Pharmacist",
          "FinanceStaff",
          "Patient"
        ],
        required: true
      },

      phone: {
  type: String,
},

department: {
  type: String,
},

specialization: {
  type: String,
},

experience: {
  type: Number,
},
    },
    {
      timestamps: true
    }
  );

const User =
  mongoose.model(
    "User",
    userSchema
  );

export default User;