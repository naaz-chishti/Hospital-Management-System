import express from "express";
import upload from "../middleware/upload.js";

import {
  uploadReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/reportUploadController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  uploadReport
);

router.get(
  "/",
  getReports
);

router.get(
  "/:id",
  getReportById
);

router.post(
  "/",
  upload.single("file"),
  uploadReport
);

router.put(
  "/:id",
  upload.single("file"),
  updateReport
);

router.delete(
  "/:id",
  deleteReport
);

export default router;