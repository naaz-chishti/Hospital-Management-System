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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0F766E,#14B8A6)",
      }}
    >

      <Card
        sx={{
          width: 480,
          borderRadius: 5,
        }}
      >

        <CardContent sx={{ p: 5 }}>

          <Box
            textAlign="center"
            mb={4}
          >

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
              Hospital Management System
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
              startAdornment:
              <InputAdornment position="start">
                <Person/>
              </InputAdornment>
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
              startAdornment:
              <InputAdornment position="start">
                <Email/>
              </InputAdornment>
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
              startAdornment:
              <InputAdornment position="start">
                <Lock/>
              </InputAdornment>
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
              startAdornment:
              <InputAdornment position="start">
                <Badge/>
              </InputAdornment>
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
            sx={{
              mt:3,
              py:1.5,
              borderRadius:3,
            }}
            onClick={handleRegister}
          >
            REGISTER
          </Button>

         <Box
  sx={{
    mt: 3,
    textAlign: "center",
  }}
>

  <Typography
    sx={{
      fontSize: 16,
      color: "#64748B",
    }}
  >
    Already have an account?{" "}
    <Typography
      component="span"
      onClick={() => navigate("/")}
      sx={{
        color: "#14B8A6",
        fontWeight: 900,
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

  );

}

export default Register;