import express from "express";

import {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation
} from "../controllers/consultationController.js";

const router =
  express.Router();

router.post(
  "/",
  createConsultation
);

router.get(
  "/",
  getConsultations
);

router.get(
  "/:id",
  getConsultationById
);

router.put(
  "/:id",
  updateConsultation
);

router.delete(
  "/:id",
  deleteConsultation
);

export default router;