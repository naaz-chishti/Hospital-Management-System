import Admission from "../models/Admission.js";

export const createAdmission = async (req, res) => {
  try {

    const lastAdmission = await Admission.findOne().sort({ createdAt: -1 });

    let admissionId = "ADM0001";

    if (lastAdmission) {

      const lastNumber = parseInt(
        lastAdmission.admissionId.replace("ADM", ""),
        10
      );

      admissionId = `ADM${String(lastNumber + 1).padStart(4, "0")}`;
    }

    console.log("Generated Admission ID:", admissionId);

    const admission = await Admission.create({
      ...req.body,
      admissionId,
    });

    res.status(201).json({
      success: true,
      data: admission,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdmissions =
  async (req, res) => {
    try {

      const admissions =
        await Admission.find()
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          );

      res.status(200).json({
        success: true,
        count:
          admissions.length,
        data:
          admissions
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getAdmissionById =
  async (req, res) => {
    try {

      const admission =
        await Admission.findById(
          req.params.id
        )
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          );

      if (!admission) {
        return res.status(404).json({
          success: false,
          message:
            "Admission not found"
        });
      }

      res.status(200).json({
        success: true,
        data: admission
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const updateAdmission =
  async (req, res) => {
    try {

      const admission =
        await Admission.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!admission) {
        return res.status(404).json({
          success: false,
          message:
            "Admission not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Admission updated successfully",
        data: admission
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const deleteAdmission =
  async (req, res) => {
    try {

      const admission =
        await Admission.findById(
          req.params.id
        );

      if (!admission) {
        return res.status(404).json({
          success: false,
          message:
            "Admission not found"
        });
      }

      await admission.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Admission deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };