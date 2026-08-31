import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import {
  LocalHospital,
  Person,
  Email,
  Lock,
  Badge,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Receptionist",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {

    try {

      await API.post(
        "/auth/register",
        form
      );

      toast.success(
        "Registration Successful"
      );

      navigate("/");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Registration Failed"
      );

    }

  };

 return (
  <Box
    sx={{
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2000')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Overlay */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(rgba(7,28,45,.80),rgba(9,39,61,.80))",
      }}
    />

    {/* Main Container */}
    <Box
  sx={{
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "1400px",
    mx: "auto",

   display: {
  xs: "block",
  lg: "flex",
},

justifyContent: "space-between",

alignItems: "center",

    justifyContent: "space-between",
    alignItems: "center",

    px: {
      xs: 3,
      sm: 5,
      md: 8,
    },

    py: {
      xs: 5,
      lg: 0,
    },

    gap: {
      xs: 4,
      lg: 8,
    },
  }}
>
      {/* Left Section */}
      <Box
      sx={{
  flex: 1,

  display: {
    xs: "none",
    lg: "flex",
  },

  flexDirection: "column",
  justifyContent: "center",

  alignItems: "flex-start",

  textAlign: "left",

  pr: 8,
}}
>

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1.1,
           fontSize:{
 xs:38,
 sm:50,
 md:62,
},
          }}
        >
          Hospital
          <br />
          Management
          <br />
          System
        </Typography>

        <Typography
          sx={{
            color: "#fff",
            mt: 3,
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          Smart, Secure and Modern
          <br />
          Healthcare Management Platform
        </Typography>

        <Box
  sx={{
    mt:4,
    color:"#fff",

    display:{
      xs:"none",
      md:"block",
    },
  }}
>
          <Typography>✔ Patient Management</Typography>
          <Typography>✔ OPD & IPD Management</Typography>
          <Typography>✔ Laboratory & Imaging</Typography>
          <Typography>✔ Billing & Insurance</Typography>
          <Typography>✔ Pharmacy Management</Typography>
          <Typography>✔ Reports & Analytics</Typography>
        </Box>
      </Box>


<Box
  sx={{
    display: {
      xs: "flex",
      lg: "none",
    },
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    mb: 3,
  }}
>
  <LocalHospital
    sx={{
      fontSize: 60,
      color: "#14B8A6",
      mb: 2,
    }}
  />

  <Typography
    sx={{
      color: "#fff",
      fontWeight: 700,
      fontSize: 36,
      lineHeight: 1.2,
    }}
  >
    HMS ERP
  </Typography>

  <Typography
    sx={{
      color: "#CBD5E1",
      mt: 1,
      fontSize: 16,
    }}
  >
    Hospital Management System
  </Typography>
</Box>

      {/* Register Card */}
      <Card
        sx={{
      width: "100%",
maxWidth: 470,

maxWidth:470,

flexShrink:0,
          mx: "auto",
          borderRadius: 6,
          background: "rgba(255,255,255,.96)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 25px 60px rgba(0,0,0,.35)",
        }}
      >
        <CardContent
          sx={{
           p:{
 xs:3,
 sm:4,
 md:5,
},
          }}
        >
          <Box textAlign="center" mb={4}>
            <LocalHospital
              sx={{
                fontSize: 55,
                color: "#14B8A6",
              }}
            />

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Create Account
            </Typography>

            <Typography color="text.secondary">
              Register to HMS ERP
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            margin="normal"
            value={form.name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            label="Role"
            name="role"
            margin="normal"
            value={form.role}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Doctor">Doctor</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
            <MenuItem value="Nurse">Nurse</MenuItem>
            <MenuItem value="LabTechnician">Lab Technician</MenuItem>
            <MenuItem value="Pharmacist">Pharmacist</MenuItem>
          </TextField>

          <Button
            fullWidth
            variant="contained"
            onClick={handleRegister}
            sx={{
              mt: 3,
              height: 54,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 16,
              textTransform: "none",
              background:
                "linear-gradient(135deg,#14B8A6,#0F766E)",
            }}
          >
            Register
          </Button>

          <Box
            sx={{
              mt: 3,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#64748B",
              }}
            >
              Already have an account?{" "}
              <Typography
                component="span"
                onClick={() => navigate("/")}
                sx={{
                  color: "#14B8A6",
                  fontWeight: 700,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Login
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

}

export default Register;