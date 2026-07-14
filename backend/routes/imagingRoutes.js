import express from "express";

import {
  createImaging,
  getImagings,
  getImagingById,
  updateImaging,
  deleteImaging
} from "../controllers/imagingController.js";

const router =
  express.Router();

router.post(
  "/",
  createImaging
);

router.get(
  "/",
  getImagings
);

router.get(
  "/:id",
  getImagingById
);

router.put(
  "/:id",
  updateImaging
);

router.delete(
  "/:id",
  deleteImaging
);

export default router;