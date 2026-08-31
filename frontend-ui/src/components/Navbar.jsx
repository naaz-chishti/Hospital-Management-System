import { useEffect, useState } from "react";

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
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useLocation, useNavigate } from "react-router-dom";

import API from "../api/axios";
import { toast } from "react-toastify";


function Navbar({ showSearch = false }) {

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const isSmall = useMediaQuery(
    theme.breakpoints.down("sm")
  );


  /* USER */

  let user = {};

  try {

    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  } catch (error) {

    user = {};

  }


  /* MENU */

  const [anchorEl, setAnchorEl] =
    useState(null);


  /* SEARCH */

  const [search, setSearch] =
    useState("");


  /* NOTIFICATIONS */

  const [notificationCount, setNotificationCount] =
    useState(0);


  const menuOpen =
    Boolean(anchorEl);


  /* FETCH NOTIFICATIONS */

  useEffect(() => {

    fetchNotifications();

  }, []);


  const fetchNotifications = async () => {

    try {

      const res =
        await API.get("/notifications");

      const notifications =
        res.data?.data || [];

      const unread =
        notifications.filter(
          (notification) =>
            !notification.isRead
        ).length;

      setNotificationCount(unread);

    } catch (error) {

      console.log(
        "Notification error:",
        error
      );

      /*
        Don't show an error toast here.
        Notification failure should not
        disturb the dashboard.
      */

    }

  };


  /* USER MENU */

  const handleUserClick = (event) => {

    setAnchorEl(
      event.currentTarget
    );

  };


  const handleClose = () => {

    setAnchorEl(null);

  };


  /* LOGOUT */

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    handleClose();

    navigate("/");

  };


  /* GLOBAL SEARCH */

  const handleSearch = () => {

    const text =
      search.trim().toLowerCase();


    if (!text) {

      return;

    }


    /*
      Dashboard
    */

    if (
      text.includes("dashboard") ||
      text.includes("home")
    ) {

      navigate("/dashboard");

      return;

    }


    /*
      Doctors
    */

    if (
      text.includes("doctor") ||
      text.includes("doctors")
    ) {

      navigate("/doctors");

      setSearch("");

      return;

    }


    /*
      Inpatient Notes
      MUST come before patient
    */

    if (
      text.includes("inpatient") ||
      text.includes("inpatient note")
    ) {

      navigate("/inpatient-notes");

      setSearch("");

      return;

    }


    /*
      Patients
    */

    if (
      text.includes("patient") ||
      text.includes("patients")
    ) {

      navigate("/patients");

      setSearch("");

      return;

    }


    /*
      OPD
    */

    if (
      text.includes("opd") ||
      text.includes("outpatient")
    ) {

      navigate("/opd");

      setSearch("");

      return;

    }


    /*
      Consultations
    */

    if (
      text.includes("consult") ||
      text.includes("consultation")
    ) {

      navigate("/consultations");

      setSearch("");

      return;

    }


    /*
      Laboratory
    */

    if (
      text.includes("lab") ||
      text.includes("laboratory")
    ) {

      navigate("/lab");

      setSearch("");

      return;

    }


    /*
      Imaging
    */

    if (
      text.includes("imaging") ||
      text.includes("radiology")
    ) {

      navigate("/imaging");

      setSearch("");

      return;

    }


    /*
      Admissions
    */

    if (
      text.includes("admission") ||
      text.includes("admissions")
    ) {

      navigate("/admissions");

      setSearch("");

      return;

    }


    /*
      Discharges
    */

    if (
      text.includes("discharge") ||
      text.includes("discharges")
    ) {

      navigate("/discharges");

      setSearch("");

      return;

    }


    /*
      Pharmacy
    */

    if (
      text.includes("medicine") ||
      text.includes("medicines") ||
      text.includes("pharmacy")
    ) {

      navigate("/medicines");

      setSearch("");

      return;

    }


    /*
      Billing
    */

    if (
      text.includes("bill") ||
      text.includes("billing")
    ) {

      navigate("/billing");

      setSearch("");

      return;

    }


    /*
      Payments
    */

    if (
      text.includes("payment") ||
      text.includes("payments")
    ) {

      navigate("/payments");

      setSearch("");

      return;

    }


    /*
      Insurance
    */

    if (
      text.includes("insurance") ||
      text.includes("claim")
    ) {

      navigate("/insurance-claims");

      setSearch("");

      return;

    }


    /*
      Report Uploads
    */

    if (
      text.includes("report upload") ||
      text.includes("upload")
    ) {

      navigate("/report-uploads");

      setSearch("");

      return;

    }


    /*
      Reports
    */

    if (
      text.includes("report") ||
      text.includes("reports")
    ) {

      navigate("/reports");

      setSearch("");

      return;

    }


    /*
      Notifications
    */

    if (
      text.includes("notification") ||
      text.includes("notifications")
    ) {

      navigate("/notifications");

      setSearch("");

      return;

    }


    /*
      Alerts
    */

    if (
      text.includes("alert") ||
      text.includes("alerts")
    ) {

      navigate("/alerts");

      setSearch("");

      return;

    }


    /*
      Audit Logs
    */

    if (
      text.includes("audit") ||
      text.includes("audit log")
    ) {

      navigate("/audit-logs");

      setSearch("");

      return;

    }


    /*
      Settings
    */

    if (
      text.includes("setting") ||
      text.includes("settings")
    ) {

      navigate("/settings");

      setSearch("");

      return;

    }


    /*
      Profile
    */

    if (
      text.includes("profile") ||
      text.includes("my profile")
    ) {

      navigate("/profile");

      setSearch("");

      return;

    }


    toast.info(
      "No matching page found"
    );

  };


  /* ENTER KEY */

  const handleSearchKeyDown = (event) => {

    if (event.key === "Enter") {

      handleSearch();

    }

  };


  /* CURRENT PAGE */

  const pageNames = {

    "/dashboard": "Dashboard",

    "/patients": "Patients",

    "/doctors": "Doctors",

    "/opd": "OPD",

    "/consultations":
      "Consultations",

    "/lab":
      "Lab Tests",

    "/imaging":
      "Imaging",

    "/admissions":
      "Admissions",

    "/discharges":
      "Discharges",

    "/inpatient-notes":
      "Inpatient Notes",

    "/billing":
      "Billing",

    "/payments":
      "Payments",

    "/insurance-claims":
      "Insurance Claims",

    "/medicines":
      "Pharmacy",

    "/reports":
      "Reports",

    "/notifications":
      "Notifications",

    "/alerts":
      "Alerts",

    "/audit-logs":
      "Audit Logs",

    "/report-uploads":
      "Report Uploads",

    "/settings":
      "Settings",

    "/profile":
      "My Profile",

  };


  const currentPage =
    pageNames[location.pathname] ||
    "Dashboard";


  /* DATE */

  const today =
    new Date().toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );


  return (

    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#FFFFFF",
        color: "#111827",

        borderBottom:
          "1px solid #E5E7EB",

        boxShadow:
          "0 2px 12px rgba(15,23,42,.05)",

        zIndex: 1100,
      }}
    >

      <Toolbar
        sx={{
          minHeight: {
            xs: 68,
            sm: 72,
          },

          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
            lg: 4,
          },

          gap: {
            xs: 1,
            sm: 2,
          },
        }}
      >


        {/* PAGE TITLE */}

        <Box
          sx={{
            minWidth: {
              xs: "auto",
              md: 170,
            },

            flexShrink: 0,
          }}
        >

          <Typography
            sx={{
              fontSize: {
                xs: 18,
                sm: 21,
                md: 23,
              },

              fontWeight: 700,

              color: "#111827",

              lineHeight: 1.2,
            }}
          >

            {currentPage}

          </Typography>


          {!isSmall && (

            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                mt: 0.4,
              }}
            >

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#94A3B8",
                }}
              >
                Home
              </Typography>


              <NavigateNextIcon
                sx={{
                  fontSize: 16,
                  mx: 0.3,
                  color: "#CBD5E1",
                }}
              />


              <Typography
                sx={{
                  fontSize: 12,
                  color: "#14B8A6",
                  fontWeight: 600,
                }}
              >

                {currentPage}

              </Typography>

            </Box>

          )}

        </Box>


        {/* GLOBAL SEARCH */}

        {showSearch && (

          <TextField
            value={search}

            onChange={(event) =>
              setSearch(event.target.value)
            }

            onKeyDown={
              handleSearchKeyDown
            }

            placeholder={
              isMobile
                ? "Search..."
                : "Search patients, doctors, reports..."
            }

            size="small"

            InputProps={{
              startAdornment: (

                <InputAdornment
                  position="start"
                >

                  <SearchIcon
                    sx={{
                      color: "#64748B",
                      fontSize: 21,
                    }}
                  />

                </InputAdornment>

              ),
            }}

            sx={{
              flex: 1,

              maxWidth: {
                xs: 180,
                sm: 280,
                md: 360,
                lg: 420,
              },

              minWidth: {
                xs: 120,
                sm: 200,
              },

              "& .MuiOutlinedInput-root": {

                height: {
                  xs: 42,
                  sm: 46,
                },

                borderRadius: 3,

                background: "#F8FAFC",

                "& fieldset": {

                  borderColor:
                    "#E5E7EB",

                },

                "&:hover fieldset": {

                  borderColor:
                    "#14B8A6",

                },

                "&.Mui-focused fieldset": {

                  borderColor:
                    "#14B8A6",

                  borderWidth: 2,

                },

              },

              "& .MuiInputBase-input": {

                fontSize: {
                  xs: 12,
                  sm: 14,
                },

              },

            }}

          />

        )}


        {/* SPACE */}

        <Box
          sx={{
            flexGrow: 1,
          }}
        />


        {/* DATE */}

        {!isSmall && (

          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              color: "#64748B",

              mr: {
                sm: 1,
                md: 2,
              },

              flexShrink: 0,
            }}
          >

            <CalendarTodayIcon
              sx={{
                fontSize: 17,
                mr: 0.8,
              }}
            />

            <Typography
              fontSize={13}
            >
              {today}
            </Typography>

          </Box>

        )}


        {/* NOTIFICATIONS */}

        <Tooltip title="Notifications">

          <IconButton
            onClick={() =>
              navigate("/notifications")
            }

            sx={{
              width: {
                xs: 40,
                sm: 44,
              },

              height: {
                xs: 40,
                sm: 44,
              },

              background:
                "#F8FAFC",

              border:
                "1px solid #E5E7EB",

              mr: {
                xs: 0,
                sm: 1,
              },

              "&:hover": {

                background:
                  "#ECFDF5",

                borderColor:
                  "#14B8A6",

              },
            }}
          >

            <Badge
              badgeContent={
                notificationCount
              }

              color="error"

              max={99}
            >

              <NotificationsIcon
                sx={{
                  fontSize: {
                    xs: 20,
                    sm: 22,
                  },
                }}
              />

            </Badge>

          </IconButton>

        </Tooltip>


        {/* USER */}

        <Box
          onClick={handleUserClick}

          sx={{
            display: "flex",
            alignItems: "center",

            gap: 1,

            cursor: "pointer",

            px: {
              xs: 0.5,
              sm: 1,
            },

            py: 0.5,

            borderRadius: 3,

            "&:hover": {

              background:
                "#F8FAFC",

            },
          }}
        >

          <Avatar
            sx={{
              width: {
                xs: 38,
                sm: 42,
              },

              height: {
                xs: 38,
                sm: 42,
              },

              background:
                "linear-gradient(135deg,#14B8A6,#0F766E)",

              boxShadow:
                "0 6px 16px rgba(20,184,166,.25)",

              fontWeight: 700,

              fontSize: 16,
            }}
          >

            {(
              user?.name ||
              "A"
            )
              .charAt(0)
              .toUpperCase()}

          </Avatar>


          {!isSmall && (

            <Box>

              <Typography
                fontWeight={700}
                fontSize={14}
                sx={{
                  lineHeight: 1.2,
                }}
              >

                {user?.name ||
                  "Administrator"}

              </Typography>


              <Typography
                fontSize={11}
                color="#64748B"
              >

                {user?.role ||
                  "Administrator"}

              </Typography>

            </Box>

          )}


          {!isSmall && (

            <KeyboardArrowDownIcon
              sx={{
                fontSize: 20,
                color: "#64748B",
              }}
            />

          )}

        </Box>


        {/* USER MENU */}

        <Menu
          anchorEl={anchorEl}

          open={menuOpen}

          onClose={handleClose}

          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}

          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}

          PaperProps={{
            sx: {

              mt: 1,

              width: 240,

              borderRadius: 3,

              border:
                "1px solid #E5E7EB",

              boxShadow:
                "0 15px 40px rgba(15,23,42,.12)",

            },
          }}
        >

          {/* USER INFO */}

          <Box
            sx={{
              p: 2,

              borderBottom:
                "1px solid #E5E7EB",
            }}
          >

            <Typography
              fontWeight={700}
              fontSize={15}
            >

              {user?.name ||
                "Administrator"}

            </Typography>


            <Typography
              fontSize={12}
              color="text.secondary"
              sx={{
                mt: 0.3,
                wordBreak: "break-word",
              }}
            >

              {user?.email ||
                "admin@hospital.com"}

            </Typography>


            <Typography
              sx={{
                display: "inline-block",

                mt: 1,

                px: 1.2,

                py: 0.4,

                borderRadius: 2,

                background:
                  "#ECFDF5",

                color:
                  "#0F766E",

                fontSize: 11,

                fontWeight: 700,
              }}
            >

              {user?.role ||
                "Administrator"}

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
            onClick={handleLogout}

            sx={{
              color: "#EF4444",

              "&:hover": {
                background:
                  "#FEF2F2",
              },
            }}
          >

            Logout

          </MenuItem>

        </Menu>

      </Toolbar>

    </AppBar>

  );

}

export default Navbar;