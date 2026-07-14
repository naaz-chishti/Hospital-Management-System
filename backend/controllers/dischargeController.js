import Discharge from "../models/Discharge.js";

export const createDischarge =
  async (req, res) => {
    try {

      const count =
        await Discharge.countDocuments();

      const discharge =
        await Discharge.create({
          ...req.body,

          dischargeId:
            `DIS${String(
              count + 1
            ).padStart(4, "0")}`
        });

      res.status(201).json({
        success: true,
        data: discharge
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getDischarges =
  async (req, res) => {
    try {

      const discharges =
        await Discharge.find()
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .populate("admission");

      res.status(200).json({
        success: true,
        count:
          discharges.length,
        data:
          discharges
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getDischargeById =
  async (req, res) => {
    try {

      const discharge =
        await Discharge.findById(
          req.params.id
        )
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .populate("admission");

      if (!discharge) {
        return res.status(404).json({
          success: false,
          message:
            "Discharge not found"
        });
      }

      res.status(200).json({
        success: true,
        data: discharge
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const updateDischarge =
  async (req, res) => {
    try {

      const discharge =
        await Discharge.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!discharge) {
        return res.status(404).json({
          success: false,
          message:
            "Discharge not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Discharge updated successfully",
        data: discharge
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const deleteDischarge =
  async (req, res) => {
    try {

      const discharge =
        await Discharge.findById(
          req.params.id
        );

      if (!discharge) {
        return res.status(404).json({
          success: false,
          message:
            "Discharge not found"
        });
      }

      await discharge.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Discharge deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };