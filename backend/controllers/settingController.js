import Setting from "../models/Setting.js";

export const createSetting =
  async (req, res) => {
    try {

      const setting =
        await Setting.create(
          req.body
        );

      res.status(201).json({
        success: true,
        data: setting
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getSettings =
  async (req, res) => {
    try {

      const settings =
        await Setting.find();

      res.status(200).json({
        success: true,
        count:
          settings.length,
        data: settings
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getSettingById =
  async (req, res) => {
    try {

      const setting =
        await Setting.findById(
          req.params.id
        );

      if (!setting) {
        return res.status(404).json({
          success: false,
          message:
            "Setting not found"
        });
      }

      res.status(200).json({
        success: true,
        data: setting
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const updateSetting =
  async (req, res) => {
    try {

      const setting =
        await Setting.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!setting) {
        return res.status(404).json({
          success: false,
          message:
            "Setting not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Setting updated successfully",
        data: setting
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const deleteSetting =
  async (req, res) => {
    try {

      const setting =
        await Setting.findById(
          req.params.id
        );

      if (!setting) {
        return res.status(404).json({
          success: false,
          message:
            "Setting not found"
        });
      }

      await setting.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Setting deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };