import express from "express";

import {
  createLabTest,
  getLabTests,
  getLabTestById,
  updateLabTest,
  deleteLabTest
} from "../controllers/labController.js";

const router =
  express.Router();

router.post(
  "/",
  createLabTest
);

router.get(
  "/",
  getLabTests
);

router.get("/:id", getLabTestById);

router.put("/:id", updateLabTest);

router.delete("/:id", deleteLabTest);

export default router;