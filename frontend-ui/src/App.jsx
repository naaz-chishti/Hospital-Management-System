import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import OPD from "./pages/OPD";
import Lab from "./pages/LabTests";
// import Radiology from "./pages/Radiology";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Admissions from "./pages/Admissions";
import Alerts from "./pages/Alerts";
import AuditLogs from "./pages/AuditLogs";
import Consultations from "./pages/Consultations";
import Discharges from "./pages/Discharges";
import Imaging from "./pages/Imaging";
import InpatientNotes from "./pages/InpatientNotes";
import InsuranceClaims from "./pages/InsuranceClaims";
import Notifications from "./pages/Notifications";
import Payments from "./pages/Payments";
import Medicines from "./pages/Medicines";
import ReportUploads from "./pages/ReportUploads";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
  <BrowserRouter>

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/patients"
        element={<Patients />}
      />

      <Route
        path="/doctors"
        element={<Doctors />}
      />

      <Route
        path="/opd"
        element={<OPD />}
      />

     <Route
  path="/lab"
  element={<Lab />}
/>

      {/* <Route
        path="/radiology"
        element={<Radiology />}
      /> */}

      <Route
        path="/billing"
        element={<Billing />}
      />

      <Route
        path="/reports"
        element={<Reports />}
      />

      <Route
        path="/admissions"
        element={<Admissions />}
      />

      <Route
        path="/alerts"
        element={<Alerts />}
      />

      <Route
        path="/audit-logs"
        element={<AuditLogs />}
      />

      <Route
        path="/consultations"
        element={<Consultations />}
      />

      <Route
        path="/discharges"
        element={<Discharges />}
      />

      <Route
        path="/imaging"
        element={<Imaging />}
      />

      <Route
        path="/inpatient-notes"
        element={<InpatientNotes />}
      />

      <Route
        path="/insurance-claims"
        element={<InsuranceClaims />}
      />

      <Route
        path="/notifications"
        element={<Notifications />}
      />

      <Route
        path="/payments"
        element={<Payments />}
      />

      <Route
        path="/medicines"
        element={<Medicines />}
      />

      <Route
        path="/report-uploads"
        element={<ReportUploads />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
  path="/profile"
  element={<Profile />}
/>

<Route
path="/register"
element={<Register />}
/>

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

    </Routes>

   <ToastContainer
  position="top-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="colored"
/>

  </BrowserRouter>
);
}

export default App;