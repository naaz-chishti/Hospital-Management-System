import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {

    const lastNotification = await Notification.findOne().sort({
      createdAt: -1,
    });

    let notificationId = "NOT0001";

    if (lastNotification && lastNotification.notificationId) {

      const lastNumber = parseInt(
        lastNotification.notificationId.replace("NOT", ""),
        10
      );

      notificationId = `NOT${String(lastNumber + 1).padStart(4, "0")}`;
    }

    const notification = await Notification.create({
      ...req.body,
      notificationId,
    });

    res.status(201).json({
      success: true,
      data: notification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getNotifications =
  async (req, res) => {
    try {

      const notifications =
        await Notification.find();

      res.status(200).json({
        success: true,
        count:
          notifications.length,
        data:
          notifications
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getNotificationById =
  async (req, res) => {
    try {

      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found"
        });
      }

      res.status(200).json({
        success: true,
        data: notification
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const updateNotification =
  async (req, res) => {
    try {

      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Notification updated successfully",
        data:
          notification
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const deleteNotification =
  async (req, res) => {
    try {

      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found"
        });
      }

      await notification.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Notification deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };