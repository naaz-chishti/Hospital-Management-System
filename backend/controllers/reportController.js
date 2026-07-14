import Report from "../models/Report.js";

export const createReport =
  async (req, res) => {
    try {

      console.log(req.body);
      
      const count =
        await Report.countDocuments();

      const report =
        await Report.create({
          ...req.body,

          reportId:
            `REP${String(
              count + 1
            ).padStart(4, "0")}`
        });

      res.status(201).json({
        success: true,
        data: report
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getReports =
  async (req, res) => {
    try {

      const reports = await Report.find().populate(
  "patient",
  "firstName lastName patientId"
);

      res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getReportById =
  async (req, res) => {
    try {

      const report = await Report.findById(req.params.id).populate(
  "patient",
  "firstName lastName patientId"
);

      if (!report) {
        return res.status(404).json({
          success: false,
          message:
            "Report not found"
        });
      }

      res.status(200).json({
        success: true,
        data: report
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

  export const updateReport =
  async (req, res) => {
    try {

      const report =
        await Report.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "patient",
          "firstName lastName patientId"
        );

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Report updated successfully",
        data: report,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

export const deleteReport =
  async (req, res) => {
    try {

      const report =
        await Report.findById(
          req.params.id
        );

      if (!report) {
        return res.status(404).json({
          success: false,
          message:
            "Report not found"
        });
      }

      await report.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Report deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };