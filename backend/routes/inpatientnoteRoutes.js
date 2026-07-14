import express from "express";

import {
  createInpatientNote,
  getInpatientNotes,
  getInpatientNoteById,
  updateInpatientNote,
  deleteInpatientNote
} from "../controllers/inpatientNoteController.js";

const router =
  express.Router();

router.post(
  "/",
  createInpatientNote
);

router.get(
  "/",
  getInpatientNotes
);

router.get(
  "/:id",
  getInpatientNoteById
);

router.put(
  "/:id",
  updateInpatientNote
);

router.delete(
  "/:id",
  deleteInpatientNote
);

export default router;