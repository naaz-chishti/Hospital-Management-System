import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Create Doctor
export const createDoctor = async (req, res) => {
  try {

   const {
  name,
  email,
  password,
  phone,
  department,
  specialization,
  experience,
} = req.body;

    const exists =
      await User.findOne({
        email
      });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const doctor = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "Doctor",

  phone,
  department,
  specialization,
  experience,
});

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Get All Doctors
export const getDoctors =
async (req, res) => {

  try {

    const doctors =
      await User.find({
        role: "Doctor"
      }).select("-password");

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// Get Doctor By ID
export const getDoctorById =
async (req, res) => {

  try {

    const doctor =
      await User.findOne({
        _id: req.params.id,
        role: "Doctor"
      }).select("-password");

    if (!doctor) {

      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });

    }

    res.status(200).json({
      success: true,
      data: doctor
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// Update Doctor
export const updateDoctor = async (req, res) => {
  try {

    const updateData = {
  name: req.body.name,
  email: req.body.email,
  phone: req.body.phone,
  department: req.body.department,
  specialization: req.body.specialization,
  experience: req.body.experience,
};

    // Only update password if user entered one
    if (req.body.password && req.body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateData.password = hashedPassword;
    }

    const doctor = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "Doctor",
      },
      updateData,
      {
        new: true,
        runValidators: false,
      }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Delete Doctor
export const deleteDoctor =
async (req, res) => {

  try {

    const doctor =
      await User.findOne({

        _id: req.params.id,

        role: "Doctor"

      });

    if (!doctor) {

      return res.status(404).json({

        success: false,

        message: "Doctor not found"

      });

    }

    await doctor.deleteOne();

    res.status(200).json({

      success: true,

      message:
        "Doctor deleted successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};