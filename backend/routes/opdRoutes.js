import express from "express";

import {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit
} from "../controllers/opdController.js";

const router =
  express.Router();

router.post(
  "/",
  createVisit
);

router.get(
  "/",
  getVisits
);

router.get(
  "/:id",
  getVisitById
);

router.put(
  "/:id",
  updateVisit
);

router.delete(
  "/:id",
  deleteVisit
);

export default router;