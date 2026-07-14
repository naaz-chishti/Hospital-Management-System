import OPDVisit from "../models/OPDVisit.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";

const formatDate = (date) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  ).format(date);
};

export const createVisit = async (req, res) => {
  try {

    const {
      patient,
      doctor,
      symptoms,
      diagnosis,
      status,
    } = req.body;

    const patientExists = await Patient.findById(patient);

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctorExists = await User.findById(doctor);

    if (!doctorExists || doctorExists.role !== "Doctor") {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor selected",
      });
    }

    // Get highest Visit ID
    const lastVisit = await OPDVisit.findOne().sort({ visitId: -1 });

    let visitId = "VISIT0001";

    if (lastVisit?.visitId) {
      const lastNumber = parseInt(
        lastVisit.visitId.replace("VISIT", ""),
        10
      );

      visitId = `VISIT${String(lastNumber + 1).padStart(4, "0")}`;
    }

    console.log("Generated Visit ID:", visitId);

    const visit = await OPDVisit.create({
      visitId,
      patient,
      doctor,
      symptoms,
      diagnosis: diagnosis || "",
      status: status || "Waiting",
    });

    const populatedVisit = await OPDVisit.findById(visit._id)
      .populate("patient")
      .populate("doctor", "-password");

    res.status(201).json({
      success: true,
      message: "Visit created successfully",
      data: populatedVisit,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getVisits = async (
  req,
  res
) => {
  try {

    const visits =
      await OPDVisit.find()
        .populate("patient")
        .populate(
          "doctor",
          "-password"
        )
        .select("-__v");

    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getVisitById =
  async (req, res) => {
    try {

      const visit =
        await OPDVisit.findById(
          req.params.id
        )
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .select("-__v");

      if (!visit) {
        return res.status(404).json({
          success: false,
          message: "Visit not found"
        });
      }

      res.status(200).json({
        success: true,
        data: visit
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const updateVisit =
  async (req, res) => {
    try {

      const visit =
        await OPDVisit.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!visit) {
        return res.status(404).json({
          success: false,
          message: "Visit not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Visit updated successfully",
        data: visit
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const deleteVisit =
  async (req, res) => {
    try {

      const visit =
        await OPDVisit.findById(
          req.params.id
        );

      if (!visit) {
        return res.status(404).json({
          success: false,
          message: "Visit not found"
        });
      }

      await visit.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Visit deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };