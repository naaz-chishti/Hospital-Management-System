import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import StatCard from "../components/StatCard";
import RecentPatients from "../components/RecentPatients";
import RecentAppointments from "../components/RecentAppointments";
import QuickActions from "../components/QuickActions";

import API from "../api/axios";

import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HotelIcon from "@mui/icons-material/Hotel";
import PaymentsIcon from "@mui/icons-material/Payments";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
  totalPatients: 0,
  totalDoctors: 0,
  totalVisits: 0,
  totalAdmissions: 0,
  totalMedicines: 0,
  totalRevenue: 0,
});

useEffect(() => {
  fetchDashboard();
}, []);

const fetchDashboard = async () => {
  try {

    const res = await API.get("/dashboard/stats");

    console.log("Dashboard Response:", res.data);

    setDashboard(res.data.data);

  } catch (error) {

    console.log(error);

  }
};

const cards = [

{
title:"Patients",
value:dashboard.totalPatients,
subtitle:"Registered Patients",
color:"#2563EB",
bg:"#EEF4FF",
icon:<PeopleIcon/>
},

{
title:"Doctors",
value:dashboard.totalDoctors,
subtitle:"Available Doctors",
color:"#10B981",
bg:"#ECFDF5",
icon:<LocalHospitalIcon/>
},

{
title:"Today's OPD",
value:dashboard.totalVisits,
subtitle:"OPD Visits",
color:"#F97316",
bg:"#FFF7ED",
icon:<EventNoteIcon/>
},

{
title:"Revenue",
value:`₹${dashboard.totalRevenue}`,
subtitle:"Hospital Revenue",
color:"#8B5CF6",
bg:"#F5F3FF",
icon:<ReceiptLongIcon/>
},

{
title:"Admissions",
value:dashboard.totalAdmissions,
subtitle:"Current Admissions",
color:"#06B6D4",
bg:"#ECFEFF",
icon:<HotelIcon/>
},

{
title:"Medicines",
value:dashboard.totalMedicines,
subtitle:"Available Medicines",
color:"#EF4444",
bg:"#FEF2F2",
icon:<PaymentsIcon/>
},

];

  return (
    <DashboardLayout showSearch={true}>

      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <Box>
          <Typography
  variant="h5"
  fontWeight={700}
>
            Welcome Back 👋
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            Here's today's hospital overview.
          </Typography>
        </Box>

      </Box>

      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(3,1fr)"
          },
          gap: 2
        }}
      >
        {cards.map((card, index) => (
          <StatCard
            key={index}
            {...card}
          />
        ))}
      </Box>

      {/* Middle Section */}
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr"
          },
          gap: 2
        }}
      >
        <RecentPatients />
        <RecentAppointments />
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <QuickActions />
      </Box>

    </DashboardLayout>
  );
}

export default Dashboard;