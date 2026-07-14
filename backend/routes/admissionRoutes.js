import express from "express";

import {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission
} from "../controllers/admissionController.js";

const router =
  express.Router();

router.post("/", createAdmission);

router.get("/", getAdmissions);

router.get("/:id", getAdmissionById);

router.put("/:id", updateAdmission);

router.delete("/:id", deleteAdmission);

export default router;