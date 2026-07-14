import ReportUpload from "../models/ReportUpload.js";

export const uploadReport =
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a file"
        });
      }

      const count =
        await ReportUpload.countDocuments();

      const report =
        await ReportUpload.create({
          uploadId:
            `UPL${String(
              count + 1
            ).padStart(4, "0")}`,

          patient:
            req.body.patient,

          reportType:
            req.body.reportType,

          reportName:
            req.body.reportName,

         filePath: req.file.path.replace(/\\/g, "/")
        });

      res.status(201).json({
        success: true,
        data: report
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getReports =
  async (req, res) => {
    try {

      const reports =
        await ReportUpload.find()
          .populate(
            "patient"
          );

      res.status(200).json({
        success: true,
        count:
          reports.length,
        data:
          reports
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getReportById =
  async (req, res) => {
    try {

      const report =
        await ReportUpload.findById(
          req.params.id
        )
          .populate(
            "patient"
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
        message:
          error.message
      });

    }
  };

  export const updateReport = async (req, res) => {

  try {

    const updateData = {
      patient: req.body.patient,
      reportName: req.body.reportName,
      reportType: req.body.reportType,
    };

    if (req.file) {
      updateData.filePath = req.file.path;
    }

    const report = await ReportUpload.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
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
        await ReportUpload.findById(
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
        message:
          error.message
      });

    }
  };