import Alert from "../models/Alert.js";

export const createAlert = async (req, res) => {
  try {

    const lastAlert = await Alert.findOne().sort({ createdAt: -1 });

    let alertId = "ALT0001";

    if (lastAlert && lastAlert.alertId) {
      const lastNumber = parseInt(
        lastAlert.alertId.replace("ALT", ""),
        10
      );

      alertId = `ALT${String(lastNumber + 1).padStart(4, "0")}`;
    }

    const alert = await Alert.create({
      ...req.body,
      alertId,
    });

    res.status(201).json({
      success: true,
      data: alert,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getAlerts =
  async (req, res) => {
    try {

      const alerts =
        await Alert.find();

      res.status(200).json({
        success: true,
        count:
          alerts.length,
        data:
          alerts
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getAlertById =
  async (req, res) => {
    try {

      const alert =
        await Alert.findById(
          req.params.id
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message:
            "Alert not found"
        });
      }

      res.status(200).json({
        success: true,
        data: alert
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const updateAlert =
  async (req, res) => {
    try {

      const alert =
        await Alert.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message:
            "Alert not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Alert updated successfully",
        data: alert
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const deleteAlert =
  async (req, res) => {
    try {

      const alert =
        await Alert.findById(
          req.params.id
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message:
            "Alert not found"
        });
      }

      await alert.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Alert deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };