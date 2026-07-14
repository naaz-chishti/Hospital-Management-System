import express from "express";

import {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine
} from "../controllers/pharmacyController.js";

const router =
  express.Router();

router.post(
  "/",
  createMedicine
);

router.get(
  "/",
  getMedicines
);

router.get(
  "/:id",
  getMedicineById
);

router.put(
  "/:id",
  updateMedicine
);

router.delete(
  "/:id",
  deleteMedicine
);

export default router;