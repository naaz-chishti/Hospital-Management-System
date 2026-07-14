import Medicine from "../models/Medicine.js";

export const createMedicine =
  async (req, res) => {
    try {

      const count =
        await Medicine.countDocuments();

      const medicine =
        await Medicine.create({
          ...req.body,

          medicineId:
            `MED${String(
              count + 1
            ).padStart(4, "0")}`
        });

      res.status(201).json({
        success: true,
        data: medicine
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getMedicines =
  async (req, res) => {
    try {

      const medicines =
        await Medicine.find();

      res.status(200).json({
        success: true,
        count:
          medicines.length,
        data:
          medicines
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getMedicineById =
  async (req, res) => {
    try {

      const medicine =
        await Medicine.findById(
          req.params.id
        );

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine not found"
        });
      }

      res.status(200).json({
        success: true,
        data: medicine
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const updateMedicine =
  async (req, res) => {
    try {

      const medicine =
        await Medicine.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Medicine updated successfully",
        data: medicine
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const deleteMedicine =
  async (req, res) => {
    try {

      const medicine =
        await Medicine.findById(
          req.params.id
        );

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine not found"
        });
      }

      await medicine.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Medicine deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };