import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = () => {

    toast.success(
      "Password reset link sent successfully"
    );

    navigate("/");

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

      <Card sx={{ width: 430, borderRadius: 4 }}>

        <CardContent sx={{ p: 5 }}>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Forgot Password
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Enter your registered email.
          </Typography>

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt:3 }}
            onClick={handleSubmit}
          >
            Send Reset Link
          </Button>

          <Button
            fullWidth
            sx={{ mt:2 }}
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>

        </CardContent>

      </Card>

    </Box>

  );

}

export default ForgotPassword;