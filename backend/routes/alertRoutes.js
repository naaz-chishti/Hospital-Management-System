import express from "express";

import {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert
} from "../controllers/alertController.js";

const router =
  express.Router();

router.post(
  "/",
  createAlert
);

router.get(
  "/",
  getAlerts
);

router.get(
  "/:id",
  getAlertById
);

router.put(
  "/:id",
  updateAlert
);

router.delete(
  "/:id",
  deleteAlert
);

export default router;