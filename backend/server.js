import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import opdRoutes from "./routes/opdRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import imagingRoutes from "./routes/imagingRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import dischargeRoutes from "./routes/dischargeRoutes.js";
import inpatientnoteRoutes from "./routes/inpatientnoteRoutes.js";
import insuranceClaimRoutes from "./routes/insuranceClaimRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import reportUploadRoutes from "./routes/reportUploadRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/patients", patientRoutes);
app.use("/api/opd", opdRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/lab-tests", labRoutes);
app.use("/api/imaging", imagingRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/medicines", pharmacyRoutes);
app.use("/api/bills", billingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/discharges", dischargeRoutes);
app.use("/api/inpatient-notes", inpatientnoteRoutes);
app.use("/api/insurance-claims", insuranceClaimRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/report-uploads", reportUploadRoutes);
app.use("/api/doctors", doctorRoutes);

app.get("/", (req, res) => {
  res.send("HMS API Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
