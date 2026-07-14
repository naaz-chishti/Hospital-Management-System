import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ScienceIcon from "@mui/icons-material/Science";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

function QuickActions() {

  const navigate = useNavigate();

  const actions = [
  {
    title: "Add Patient",
    subtitle: "Register patient",
    icon: <PersonAddIcon />,
    color: "#2563EB",
    bg: "#EFF6FF",
    path: "/patients?add=true",
  },
  {
    title: "Book OPD",
    subtitle: "Schedule visit",
    icon: <EventNoteIcon />,
    color: "#10B981",
    bg: "#ECFDF5",
    path: "/opd?add=true",
  },
  {
    title: "Lab Test",
    subtitle: "Create request",
    icon: <ScienceIcon />,
    color: "#F59E0B",
    bg: "#FFFBEB",
    path: "/lab?add=true",
  },
  {
    title: "Generate Bill",
    subtitle: "Billing",
    icon: <ReceiptLongIcon />,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    path: "/billing?add=true",
  },
  {
    title: "Admission",
    subtitle: "IPD Entry",
    icon: <HotelIcon />,
    color: "#06B6D4",
    bg: "#ECFEFF",
    path: "/admissions?add=true",
  },
  {
    title: "Pharmacy",
    subtitle: "Medicines",
    icon: <LocalPharmacyIcon />,
    color: "#EF4444",
    bg: "#FEF2F2",
    path: "/medicines?add=true",
  },
];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 25px rgba(15,23,42,.05)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Quick Actions
      </Typography>

      <Box
  sx={{
    display: "grid",
   gridTemplateColumns: {
  xs: "1fr",
  sm: "repeat(2,1fr)",
  lg: "repeat(3,1fr)",
},
    gap: 1.5,
    alignItems: "stretch",
  }}
>
        {actions.map((action) => (

          <Box
  key={action.title}
  onClick={() => navigate(action.path)}
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 2,
    height: 82,
    borderRadius: 3,
    border: "1px solid #E5E7EB",
    background: "#fff",
    cursor: "pointer",
    transition: "all .25s",

    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: action.color,
      boxShadow: "0 12px 24px rgba(15,23,42,.08)",
    },

    "&:active": {
      transform: "scale(.98)",
    },
  }}
>

            <Box
  sx={{
    width: 46,
    height: 46,
    borderRadius: "50%",
    bgcolor: action.bg,
    color: action.color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,

    "& svg": {
      fontSize: 22,
    },
  }}
>
  {action.icon}
</Box>

            <Box sx={{ flex: 1 }}>

              <Typography
                fontWeight={600}
                fontSize={15}
              >
                {action.title}
              </Typography>

              <Typography
                fontSize={12}
                color="#64748B"
              >
                {action.subtitle}
              </Typography>

            </Box>

           <ArrowForwardIosIcon
  sx={{
    fontSize: 14,
    color: "#94A3B8",
    ml: "auto",
  }}
/>

          </Box>

        ))}
      </Box>

    </Paper>
  );
}

export default QuickActions;