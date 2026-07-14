import Consultation from "../models/Consultation.js";
import OPDVisit from "../models/OPDVisit.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import formatDate from "../utils/formatDate.js";

export const createConsultation = async (
  req,
  res
) => {
  try {

    const {
      opdVisit,
      patient,
      doctor,
      diagnosis,
      notes,
      prescription,
      recommendedTests
    } = req.body;

    console.log("Doctor ID:", doctor);

    const visit =
      await OPDVisit.findById(
        opdVisit
      );

    if (!visit) {
      return res.status(404).json({
        success: false,
        message:
          "OPD Visit not found"
      });
    }

    const patientExists =
      await Patient.findById(
        patient
      );

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message:
          "Patient not found"
      });
    }

    const doctorExists =
      await User.findById(
        doctor
      );

    if (
      !doctorExists ||
      doctorExists.role !==
        "Doctor"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid doctor selected"
      });
    }

    const count =
      await Consultation.countDocuments();

    const consultation =
      await Consultation.create({
        consultationId:
          `CONS${String(
            count + 1
          ).padStart(4, "0")}`,

        opdVisit,
        patient,
        doctor,
        diagnosis,
        notes,
        prescription,
        recommendedTests
      });

      console.log("Saved Consultation:", consultation);

    await OPDVisit.findByIdAndUpdate(
      opdVisit,
      {
        status:
          "Completed"
      }
    );

   console.log(
  "Doctor saved in consultation:",
  consultation.doctor
);

    res.status(201).json({
      success: true,
      data: {
        consultationId:
          consultation.consultationId,
        diagnosis:
          consultation.diagnosis,
        notes:
          consultation.notes,
        prescription:
          consultation.prescription,
        recommendedTests:
          consultation.recommendedTests,
        createdAt:
          formatDate(
            consultation.createdAt
          ),
        updatedAt:
          formatDate(
            consultation.updatedAt
          )
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }
};

  export const getConsultations =
  async (req, res) => {
    try {

      const consultations =
        await Consultation.find()
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .populate(
            "opdVisit"
          );

      res.status(200).json({
        success: true,
        count:
          consultations.length,
        data:
          consultations
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

  export const getConsultationById = async (
  req,
  res
) => {
  try {

    const consultation =
      await Consultation.findById(
        req.params.id
      )
        .populate("patient")
        .populate(
          "doctor",
          "-password"
        )
        .populate("opdVisit");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message:
          "Consultation not found"
      });
    }

    res.status(200).json({
      success: true,
      data: consultation
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const updateConsultation =
  async (req, res) => {
    try {

      const consultation =
        await Consultation.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message:
            "Consultation not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Consultation updated successfully",
        data: consultation
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

  export const deleteConsultation =
  async (req, res) => {
    try {

      const consultation =
        await Consultation.findById(
          req.params.id
        );

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message:
            "Consultation not found"
        });
      }

      await consultation.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Consultation deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };