import express from "express";

import {
  createDischarge,
  getDischarges,
  getDischargeById,
  updateDischarge,
  deleteDischarge
} from "../controllers/dischargeController.js";

const router =
  express.Router();

router.post(
  "/",
  createDischarge
);

router.get(
  "/",
  getDischarges
);

router.get(
  "/:id",
  getDischargeById
);

router.put(
  "/:id",
  updateDischarge
);

router.delete(
  "/:id",
  deleteDischarge
);

export default router;