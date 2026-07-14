import AuditLog from "../models/AuditLog.js";

export const createAuditLog =
  async (req, res) => {
    try {

      const count =
        await AuditLog.countDocuments();

      const auditLog =
        await AuditLog.create({
          ...req.body,

          logId:
            `LOG${String(
              count + 1
            ).padStart(4, "0")}`
        });

      res.status(201).json({
        success: true,
        data: auditLog
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getAuditLogs =
  async (req, res) => {
    try {

      const logs =
        await AuditLog.find();

      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getAuditLogById =
  async (req, res) => {
    try {

      const log =
        await AuditLog.findById(
          req.params.id
        );

      if (!log) {
        return res.status(404).json({
          success: false,
          message:
            "Audit Log not found"
        });
      }

      res.status(200).json({
        success: true,
        data: log
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const updateAuditLog =
  async (req, res) => {
    try {

      const log =
        await AuditLog.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after",
            runValidators: true
          }
        );

      if (!log) {
        return res.status(404).json({
          success: false,
          message:
            "Audit Log not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Audit Log updated successfully",
        data: log
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const deleteAuditLog =
  async (req, res) => {
    try {

      const log =
        await AuditLog.findById(
          req.params.id
        );

      if (!log) {
        return res.status(404).json({
          success: false,
          message:
            "Audit Log not found"
        });
      }

      await log.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Audit Log deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };