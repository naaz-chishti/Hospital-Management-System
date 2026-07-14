import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar
} from "@mui/material";

import { NavLink } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ScienceIcon from "@mui/icons-material/Science";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HotelIcon from "@mui/icons-material/Hotel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HistoryIcon from "@mui/icons-material/History";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SettingsIcon from "@mui/icons-material/Settings";

function Sidebar() {

  const menuSections = [
  {
    title: "MAIN",
    menus: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <DashboardIcon />
      },
      {
        name: "Doctors",
        path: "/doctors",
        icon: <LocalHospitalIcon />
      },
      {
        name: "Patients",
        path: "/patients",
        icon: <PeopleIcon />
      },
      {
        name: "OPD",
        path: "/opd",
        icon: <EventNoteIcon />
      }
    ]
  },

  {
    title: "CLINICAL",
    menus: [
      {
        name: "Consultations",
        path: "/consultations",
        icon: <MedicalServicesIcon />
      },
      {
        name: "Lab Tests",
        path: "/lab",
        icon: <ScienceIcon />
      },
      {
        name: "Imaging",
        path: "/imaging",
        icon: <CameraAltIcon />
      },
      {
        name: "Admissions",
        path: "/admissions",
        icon: <HotelIcon />
      },
      {
        name: "Discharges",
        path: "/discharges",
        icon: <ExitToAppIcon />
      },
      {
        name: "Inpatient Notes",
        path: "/inpatient-notes",
        icon: <NoteAltIcon />
      }
    ]
  },

  {
    title: "FINANCE",
    menus: [
      {
        name: "Billing",
        path: "/billing",
        icon: <ReceiptLongIcon />
      },
      {
        name: "Payments",
        path: "/payments",
        icon: <PaymentsIcon />
      },
      {
        name: "Insurance Claims",
        path: "/insurance-claims",
        icon: <HealthAndSafetyIcon />
      },
      {
        name: "Pharmacy",
        path: "/medicines",
        icon: <LocalPharmacyIcon />
      }
    ]
  },

  {
    title: "SYSTEM",
    menus: [
      {
        name: "Reports",
        path: "/reports",
        icon: <AssessmentIcon />
      },
      {
        name: "Notifications",
        path: "/notifications",
        icon: <NotificationsIcon />
      },
      {
        name: "Alerts",
        path: "/alerts",
        icon: <WarningAmberIcon />
      },
      {
        name: "Audit Logs",
        path: "/audit-logs",
        icon: <HistoryIcon />
      },
      {
        name: "Report Uploads",
        path: "/report-uploads",
        icon: <UploadFileIcon />
      },
      {
        name: "Settings",
        path: "/settings",
        icon: <SettingsIcon />
      }
    ]
  }
];

  return (

   <Box
  sx={{
   width: 270,
minWidth: 270,
minHeight: "100vh",
height: "100%",
alignSelf: "stretch",
flexShrink: 0,
    overflowY: "auto",
    background: "linear-gradient(180deg,#0F766E 0%,#115E59 100%)",
    color: "#fff",
    borderRight: "1px solid rgba(255,255,255,.08)",
    boxShadow: "6px 0 25px rgba(15,23,42,.18)",

    "&::-webkit-scrollbar": {
      width: 6,
    },

    "&::-webkit-scrollbar-thumb": {
      background: "rgba(255,255,255,.15)",
      borderRadius: 10,
    },
  }}
>

 <Box
  sx={{
    p: 3,
    display: "flex",
    alignItems: "center",
    gap: 2,
    borderBottom: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.05)",
  }}
>

  <Avatar
    sx={{
      width: 50,
      height: 50,
      bgcolor: "#fff",
      color: "#0F766E",
      fontWeight: 700,
      fontSize: 22,
      boxShadow: "0 8px 18px rgba(0,0,0,.18)",
    }}
  >
    H
  </Avatar>

  <Box>

    <Typography
      sx={{
        fontSize: 20,
        fontWeight: 700,
        color: "#fff",
        lineHeight: 1.2,
      }}
    >
      HMS ERP
    </Typography>

    <Typography
      sx={{
        fontSize: 12,
        color: "rgba(255,255,255,.70)",
      }}
    >
      Hospital Management
    </Typography>

  </Box>

</Box>

      <List sx={{ p: 2 }}>
  {menuSections.map((section) => (
    <Box key={section.title} sx={{ mb: 2 }}>
      <Typography
        sx={{
          px: 2,
          py: 1,
          color: "rgba(255,255,255,.55)",
          fontWeight: 700,
          fontSize: 11,
fontWeight: 700,
textTransform: "uppercase",
letterSpacing: 2,
opacity: .75,
        }}
      >
        {section.title}
      </Typography>

      {section.menus.map((menu) => (
        <ListItemButton
          key={menu.path}
          component={NavLink}
          to={menu.path}
          sx={{
  height: 42,
  mb: 0.6,
  px: 2,
  borderRadius: "12px",
  color: "#D1FAE5",
  position: "relative",
  transition: "all .25s",

  "& .MuiListItemIcon-root": {
    minWidth: 34,
    color: "#A7F3D0",
  },

  "& .MuiListItemText-primary": {
    fontSize: 13.5,
    fontWeight: 600,
  },

  "&:hover": {
    bgcolor: "rgba(255,255,255,.08)",
    transform: "translateX(5px)",

    "& .MuiListItemIcon-root": {
      color: "#fff",
    },
  },

  "&.active": {
    bgcolor: "#14B8A6",
    color: "#fff",
    boxShadow: "0 8px 18px rgba(20,184,166,.35)",

    "& .MuiListItemIcon-root": {
      color: "#fff",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      left: -10,
      top: 9,
      bottom: 9,
      width: 4,
      borderRadius: 10,
      background: "#fff",
    },
  },
}}
        >
          <ListItemIcon
            sx={{
              color: "inherit",
              minWidth: 40,
            }}
          >
            {menu.icon}
          </ListItemIcon>

          <ListItemText
            primary={menu.name}
           primaryTypographyProps={{
  fontSize: 14,
  fontWeight: 600,
}}
          />
        </ListItemButton>
      ))}
    </Box>
  ))}
</List>

    </Box>
  );

}

export default Sidebar;