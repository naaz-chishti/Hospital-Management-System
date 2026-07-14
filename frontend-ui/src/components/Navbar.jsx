
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = useState(null);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

const [notificationCount, setNotificationCount] = useState(0);

const open = Boolean(anchorEl);

useEffect(() => {
  fetchNotifications();
}, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = async () => {
  try {
    const res = await API.get("/notifications");

    setNotificationCount(
      res.data.data.filter((n) => !n.isRead).length
    );
  } catch (err) {
    console.log(err);
  }
};

const fetchMessages = async () => {
  try {
    // Replace with your real API later
    setMessageCount(2);
  } catch (err) {
    console.log(err);
  }
};

const globalSearch = async () => {

  if (!search.trim()) return;

  try {

    const patient = await API.get(`/patients?search=${search}`);

    if (patient.data.data.length > 0) {
      navigate("/patients");
      return;
    }

    const doctor = await API.get(`/doctors?search=${search}`);

    if (doctor.data.data.length > 0) {
      navigate("/doctors");
      return;
    }

    const medicine = await API.get(`/medicines?search=${search}`);

    if (medicine.data.data.length > 0) {
      navigate("/pharmacy");
      return;
    }

    const bill = await API.get(`/bills?search=${search}`);

    if (bill.data.data.length > 0) {
      navigate("/billing");
      return;
    }

    toast.info("No matching record found.");

  } catch (err) {
    console.log(err);
  }

};

const handleSearch = () => {
  const text = search.trim().toLowerCase();

  if (!text) return;

  if (text.includes("dashboard")) return navigate("/dashboard");

  if (text.includes("doctor")) return navigate("/doctors");

  // Check inpatient BEFORE patient
  if (text.includes("inpatient")) return navigate("/inpatient-notes");

  if (text.includes("patient")) return navigate("/patients");

  if (text.includes("opd")) return navigate("/opd");

  if (text.includes("consult")) return navigate("/consultations");

  if (
    text.includes("lab") ||
    text.includes("laboratory")
  )
    return navigate("/lab");

  if (
    text.includes("imaging") ||
    text.includes("radiology")
  )
    return navigate("/imaging");

  if (text.includes("admission"))
    return navigate("/admissions");

  if (text.includes("discharge"))
    return navigate("/discharges");

  if (
    text.includes("medicine") ||
    text.includes("medicines") ||
    text.includes("pharmacy")
  )
    return navigate("/medicines");

  if (
    text.includes("bill") ||
    text.includes("billing")
  )
    return navigate("/billing");

  if (text.includes("payment"))
    return navigate("/payments");

  if (text.includes("insurance"))
    return navigate("/insurance-claims");

  if (text.includes("report upload"))
    return navigate("/report-uploads");

  if (text.includes("report"))
    return navigate("/reports");

  if (text.includes("notification"))
    return navigate("/notifications");

  if (text.includes("alert"))
    return navigate("/alerts");

  if (text.includes("audit"))
    return navigate("/audit-logs");

  if (text.includes("setting"))
    return navigate("/settings");

  if (text.includes("profile"))
    return navigate("/profile");

  toast.info("No matching page found");
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#fff",
        color: "#111827",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 2px 10px rgba(0,0,0,.05)",
      }}
    >
      <Toolbar sx={{ height: 78 }}>

        {/* Left */}
<Box
  sx={{
    mr: 4,
    minWidth: 170,
  }}
>
  <Typography
    sx={{
      fontSize: 24,
      fontWeight: 700,
      color: "#111827",
      lineHeight: 1.2,
    }}
  >
    Dashboard
  </Typography>

  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mt: .5,
    }}
  >
    <Typography
      sx={{
        fontSize: 13,
        color: "#94A3B8",
      }}
    >
      Home
    </Typography>

    <NavigateNextIcon
      sx={{
        fontSize: 16,
        mx: .5,
        color: "#CBD5E1",
      }}
    />

    <Typography
      sx={{
        fontSize: 13,
        color: "#14B8A6",
        fontWeight: 600,
      }}
    >
      Dashboard
    </Typography>
  </Box>
</Box>

        {/* Search */}
   <TextField
  size="small"
  placeholder="Search modules..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>

        <Box sx={{ flexGrow: 1 }} />

       {/* Date */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 3,
            color: "#6B7280",
          }}
        >
          
          <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography fontSize={14}>
            {today}
          </Typography>
        </Box>

        {/* Notifications */}
        <Tooltip title="Notifications">
  <IconButton
    onClick={() => navigate("/notifications")}
    sx={{
      bgcolor:"#F8FAFC",
      border:"1px solid #E5E7EB",
      mr:3,
      "&:hover":{
        bgcolor:"#ECFDF5"
      }
    }}
  >
    <Badge
      badgeContent={notificationCount}
      color="error"
    >
      <NotificationsIcon/>
    </Badge>
  </IconButton>
</Tooltip>

        {/* User */}
        <Box
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            px: 1,
            py: .5,
            borderRadius: 3,

            "&:hover": {
  background: "#F8FAFC",
},
          }}
        >
          <Avatar
            sx={{
              background:
"linear-gradient(135deg,#14B8A6,#0F766E)",
boxShadow:"0 8px 20px rgba(20,184,166,.35)",
              width: 42,
              height: 42,
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0) || "A"}
          </Avatar>

         <Typography
  fontWeight={700}
  fontSize={15}
>
  {user?.name || "Administrator"}
</Typography>

          <KeyboardArrowDownIcon />
        </Box>

      <Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  PaperProps={{
    sx: {
      mt: 1,
      borderRadius: 3,
      minWidth: 230,
    },
  }}
>
  <Box
    sx={{
      p: 2,
      borderBottom: "1px solid #E5E7EB",
    }}
  >
    <Typography fontWeight={700}>
      {user?.name}
    </Typography>

    <Typography
      fontSize={13}
      color="text.secondary"
    >
      {user?.email}
    </Typography>
  </Box>

  <MenuItem
  onClick={() => {
    handleClose();
    navigate("/profile");
  }}
>
  My Profile
</MenuItem>

  <MenuItem
    onClick={() => {
      handleClose();
      navigate("/settings");
    }}
  >
    Settings
  </MenuItem>

  <MenuItem
    sx={{ color: "red" }}
    onClick={handleLogout}
  >
    Logout
  </MenuItem>
</Menu>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;