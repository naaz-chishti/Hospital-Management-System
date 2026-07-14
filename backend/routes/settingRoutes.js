import express from "express";

import {
  createSetting,
  getSettings,
  getSettingById,
  updateSetting,
  deleteSetting
} from "../controllers/settingController.js";

const router =
  express.Router();

router.post("/", createSetting);

router.get("/", getSettings);

router.get("/:id", getSettingById);

router.put("/:id", updateSetting);

router.delete("/:id", deleteSetting);

export default router;