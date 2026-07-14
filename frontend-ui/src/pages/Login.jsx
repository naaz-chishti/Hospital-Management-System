import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";

import {
  LocalHospital,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowForwardRounded,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Login Failed"
      );

    }

  };

  return (

<Box
sx={{
minHeight:"100vh",
backgroundImage:
"url('https://www.epcworld.in/wp-content/uploads/2025/12/Vascon-Engineers.png')",
backgroundSize:"cover",
backgroundPosition:"center",
display:"flex",
alignItems:"center",
justifyContent:"center",
position:"relative",
overflow:"hidden",
}}
>

<Box
sx={{
position:"absolute",
inset:0,
background:"rgba(8,24,39,.78)",
}}
/>

<Box
sx={{
position:"relative",
zIndex:2,
display:"flex",
alignItems:"center",
justifyContent:"space-between",
width:"90%",
maxWidth:1250,
}}
>

{/* LEFT */}

<Box
sx={{
color:"#fff",
width:"48%",
pr:6,
}}
>

<Box
display="flex"
alignItems="center"
gap={2}
mb={5}
>

<LocalHospital
sx={{
fontSize:48,
color:"#14B8A6",
}}
/>

<Typography
variant="h3"
fontWeight={700}
>

HMS ERP

</Typography>

</Box>

<Typography
variant="h2"
fontWeight={700}
mb={2}
>

Hospital Management System

</Typography>

<Typography
fontSize={20}
color="rgba(255,255,255,.85)"
mb={5}
>

Smart, Secure and Modern Healthcare Management Platform

</Typography>

<Box
display="flex"
flexDirection="column"
gap={2}
>

<Typography>✔ Patient Management</Typography>

<Typography>✔ OPD & IPD Management</Typography>

<Typography>✔ Laboratory & Imaging</Typography>

<Typography>✔ Billing & Insurance</Typography>

<Typography>✔ Pharmacy Management</Typography>

<Typography>✔ Reports & Analytics</Typography>

</Box>

</Box>

{/* LOGIN */}

<Card
elevation={0}
sx={{
width:460,
borderRadius:6,
backdropFilter:"blur(20px)",
background:"rgba(255,255,255,.92)",
boxShadow:"0 25px 60px rgba(0,0,0,.35)",
}}
>

<CardContent
sx={{
p:5,
}}
>

<Box
textAlign="center"
mb={3}
>

<LocalHospital
sx={{
fontSize:55,
color:"#14B8A6",
}}
/>

<Typography
variant="h4"
fontWeight={700}
mt={1}
>

Welcome Back 👋

</Typography>

<Typography
color="text.secondary"
mt={1}
>

Sign in to continue

</Typography>

</Box>

<TextField
fullWidth
label="Email Address"
margin="normal"
value={email}
onChange={(e)=>setEmail(e.target.value)}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<Email color="action"/>
</InputAdornment>
),
}}
/>

<TextField
fullWidth
margin="normal"
label="Password"
type={showPassword?"text":"password"}
value={password}
onChange={(e)=>setPassword(e.target.value)}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<Lock color="action"/>
</InputAdornment>
),
endAdornment:(
<InputAdornment position="end">
<IconButton
onClick={()=>setShowPassword(!showPassword)}
>
{
showPassword
?
<VisibilityOff/>
:
<Visibility/>
}
</IconButton>
</InputAdornment>
),
}}
/>

<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 1,
  }}
>

  <FormControlLabel
    control={<Checkbox />}
    label="Remember Me"
  />

  <Typography
    sx={{
      cursor: "pointer",
      color: "#0F766E",
      fontWeight: 600,
      "&:hover": {
        textDecoration: "underline",
      },
    }}
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </Typography>

</Box>

<Button
fullWidth
variant="contained"
endIcon={<ArrowForwardRounded/>}
onClick={handleLogin}
sx={{
mt:2,
height:54,
borderRadius:3,
fontWeight:700,
fontSize:16,
textTransform:"none",
background:"linear-gradient(135deg,#14B8A6,#0F766E)",
boxShadow:"0 10px 25px rgba(20,184,166,.35)",

"&:hover":{
background:"linear-gradient(135deg,#0F766E,#115E59)",
},
}}
>

Login

</Button>

<Divider
sx={{
my:3,
}}
>
OR
</Divider>

<Button
  fullWidth
  sx={{ mt:2 }}
  onClick={() => navigate("/register")}
>
  Don't have an account? Register
</Button>

<Box
  sx={{
    mt: 4,
    pt: 3,
    borderTop: "1px solid #E5E7EB",
    textAlign: "center",
  }}
>

<Typography
  sx={{
    fontWeight: 600,
    color: "#475569",
    fontSize: 14,
  }}
>
© 2026 HMS ERP
</Typography>

<Typography
  sx={{
    color: "#94A3B8",
    fontSize: 13,
    mt: .5,
  }}
>
Hospital Management System
</Typography>

<Typography
  sx={{
    color: "#94A3B8",
    fontSize: 12,
    mt: .5,
  }}
>
Version 1.0.0
</Typography>

</Box>

</CardContent>

</Card>

</Box>

</Box>

);

}

export default Login;