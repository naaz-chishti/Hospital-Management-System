import Patient from "../models/Patient.js";
import User from "../models/User.js";
import OPDVisit from "../models/OPDVisit.js";
import Admission from "../models/Admission.js";
import Bill from "../models/Bill.js";
import Medicine from "../models/Medicine.js";

export const getDashboardStats =
  async (req, res) => {
    try {

      const totalPatients =
        await Patient.countDocuments();

      const totalDoctors =
        await User.countDocuments({
          role: "Doctor"
        });

      const totalVisits =
        await OPDVisit.countDocuments();

      const totalAdmissions =
        await Admission.countDocuments();

      const totalMedicines =
        await Medicine.countDocuments();

      const paidBills =
        await Bill.find({
          paymentStatus: "Paid"
        });

      const totalRevenue =
        paidBills.reduce(
          (sum, bill) =>
            sum +
            (bill.totalAmount || 0),
          0
        );

      res.status(200).json({
        success: true,
        data: {
          totalPatients,
          totalDoctors,
          totalVisits,
          totalAdmissions,
          totalMedicines,
          totalRevenue
        }
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };