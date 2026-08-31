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

  const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
};

const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    setLoading(true);

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
position: "absolute",
top: -120,
left: -120,
width: 320,
height: 320,
borderRadius: "50%",
background: "rgba(20,184,166,.18)",
filter: "blur(90px)",
}}
/>

<Box
sx={{
position: "absolute",
bottom: -120,
right: -120,
width: 360,
height: 360,
borderRadius: "50%",
background: "rgba(59,130,246,.16)",
filter: "blur(110px)",
}}
/>

<Box
sx={{
position:"absolute",
inset:0,
background:"rgba(8,24,39,.78)",
}}
/>

<Box
sx={{
position: "relative",
zIndex: 2,

width: "100%",
height: "100%",

display: "flex",

flexDirection: {
xs: "column",
lg: "row",
},

justifyContent: "center",

alignItems: "center",

gap: {
xs: 4,
md: 6,
lg: 10,
},

px:{
xs:3,
sm:4,
md:6,
lg:8,
},

py: {
xs: 4,
sm: 5,
md: 6,
},

maxWidth: "1400px",

mx: "auto",
}}
>

{/* LEFT */}

<Box
sx={{
display: {
xs: "none",
lg: "flex",
},

flex: 1,

justifyContent: "center",

alignItems: "center",

flexDirection: "column",

textAlign: "center",

maxWidth: 520,
}}
>

<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mb: 2,
  }}
>

  <LocalHospital
    sx={{
      fontSize: 55,
      color: "#14B8A6",
      mb: 2,
    }}
  />

  <Typography
sx={{
fontWeight:800,

lineHeight:1.05,

fontSize:{
lg:68,
xl:74,
},

letterSpacing:"-2px",

color:"#fff",
}}
>
Hospital
<br/>
Management
<br/>
System
</Typography>

</Box>

<Typography
sx={{
mt:3,

fontSize:22,

fontWeight:400,

color:"rgba(255,255,255,.88)",

lineHeight:1.7,

maxWidth:500,
}}
>

Modern Hospital ERP
designed to simplify patient care,
billing, diagnostics,
pharmacy and administration.

</Typography>

<Box
sx={{
mt:6,

display:"grid",

gridTemplateColumns:"1fr 1fr",

gap:2,

maxWidth:560,
}}
>

{[
"Patient Management",
"Doctor Scheduling",
"Laboratory",
"Radiology",
"Billing",
"Pharmacy",
"Insurance",
"Analytics",
].map((item)=>(

<Box
key={item}
sx={{
display:"flex",
alignItems:"center",
gap:1.5,
}}
>

<Box
sx={{
width:12,
height:12,
borderRadius:"50%",
bgcolor:"#14B8A6",

boxShadow:"0 0 15px #14B8A6",
}}
/>

<Typography
sx={{
fontSize:17,
fontWeight:500,
color:"#fff",
}}
>

{item}

</Typography>

</Box>

))}
</Box>

</Box>

<Box
sx={{
display:{
xs:"flex",
lg:"none",
},
flexDirection:"column",
alignItems:"center",
textAlign:"center",
mb:3,
color:"#fff",
}}
>

  <Box
sx={{
display: "inline-flex",
alignItems: "center",
px: 2,
py: 0.6,
mb: 2,
borderRadius: "999px",
background: "rgba(20,184,166,.12)",
border: "1px solid rgba(20,184,166,.35)",
}}
>
<Typography
sx={{
fontSize: 13,
fontWeight: 700,
color: "#0F766E",
letterSpacing: 0.5,
}}
>
SECURE LOGIN
</Typography>
</Box>

<LocalHospital
sx={{
fontSize:60,
color:"#14B8A6",
mb:2,
}}
/>

<Typography
fontWeight={700}
fontSize={34}
>
HMS ERP
</Typography>

<Typography
fontSize={16}
color="#CBD5E1"
>
Hospital Management System
</Typography>

</Box>

{/* LOGIN */}

<Card
elevation={0}
sx={{
width: "100%",
maxWidth:{
xs:"100%",
sm:420,
md:460,
animation: "fadeUp .6s ease",
"@keyframes fadeUp": {
  from: {
    opacity: 0,
    transform: "translateY(25px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
},
transition: "all .35s ease",

"&:hover": {
  transform: "translateY(-5px)",
},
},

mx: "auto",

borderRadius: {
xs: 4,
md: 6,
},

background:
"linear-gradient(180deg,rgba(255,255,255,.96),rgba(248,250,252,.96))",

backdropFilter: "blur(18px)",

boxShadow:
"0 30px 80px rgba(15,23,42,.30)",
border:"1px solid rgba(255,255,255,.35)",

overflow: "hidden",
}}
>

<CardContent
sx={{
p: {
xs: 3,
sm: 4,
md: 5,
},

display: "flex",

flexDirection: "column",

gap: 1,
}}
>

<Box
sx={{
textAlign: "center",
mb: 3,
}}
>

<LocalHospital
sx={{
fontSize:64,
color:"#0F766E",
}}
/>

<Typography
sx={{
fontWeight: 800,
fontSize: {
xs: 28,
sm: 34,
md: 38,
},
color: "#0F172A",
}}
>
Welcome Back
</Typography>

<Typography
sx={{
mt: 1,
fontSize: 16,
color: "#64748B",
}}
>
Sign in to your HMS ERP account
</Typography>

</Box>

<TextField
fullWidth
label="Work Email"
margin="normal"
value={email}
autoComplete="email"
onChange={(e)=>setEmail(e.target.value)}
onKeyDown={handleKeyPress}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<Email color="action"/>
</InputAdornment>
),
}}
sx={{
mt:2,

"& .MuiOutlinedInput-root":{

height:56,

borderRadius:3,

background:"#F8FAFC",

transition:"0.3s",

"&:hover":{

background:"#fff",

},

"&.Mui-focused":{

background:"#fff",

boxShadow:"0 0 0 4px rgba(20,184,166,.12)",

},
},
}}
></TextField>

<TextField
fullWidth
margin="normal"
label="Enter Password"
type={showPassword?"text":"password"}
autoComplete="current-password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
onKeyDown={handleKeyPress}
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
sx={{
mt:2,

"& .MuiOutlinedInput-root":{

height:56,

borderRadius:3,

background:"#F8FAFC",

transition:"0.3s",

"&:hover":{

background:"#fff",

},

"&.Mui-focused":{

background:"#fff",

boxShadow:"0 0 0 4px rgba(20,184,166,.12)",

},
},
}}
/>

<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt:2,

flexWrap:"wrap",

rowGap:1,
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
disabled={loading || !email || !password}
fullWidth
variant="contained"
endIcon={<ArrowForwardRounded/>}
onClick={handleLogin}
sx={{
mt:3,

height:56,

borderRadius:3,

fontSize:17,

fontWeight:700,

textTransform:"none",

transition:"all .3s ease",

background:"linear-gradient(135deg,#14B8A6,#0F766E)",

transition:"0.3s",

boxShadow:"0 12px 30px rgba(20,184,166,.35)",

"&:hover":{

transform:"translateY(-3px)",

boxShadow:"0 18px 45px rgba(20,184,166,.45)",

background:
"linear-gradient(135deg,#0F766E,#115E59)",

},
}}
>
{loading ? "Signing In..." : "Login"}

</Button>

<Divider
sx={{
my:4,
color:"#94A3B8",
fontWeight:600,
}}
>
OR
</Divider>

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
    Don't have an account?{" "}
    <Typography
      component="span"
      onClick={() => navigate("/register")}
      sx={{
        color: "#14B8A6",
        fontWeight: 900,
        cursor: "pointer",
        
        "&:hover": {
          textDecoration: "underline",
        },
      }}
    >
      Register
    </Typography>
  </Typography>

</Box>

<Box
sx={{
mt:4,
pt:3,
borderTop:"1px solid #E2E8F0",
textAlign:"center",
}}
>

<Typography
sx={{
fontWeight:700,
fontSize:15,
color:"#334155",
}}
>
© 2026 HMS ERP
</Typography>

<Typography
sx={{
mt:0.5,
fontSize:13,
color:"#64748B",
}}
>
Hospital Management System
</Typography>

<Typography
sx={{
mt:0.5,
fontSize:12,
color:"#94A3B8",
}}
>
Trusted • Secure • Reliable
</Typography>

</Box>

</CardContent>

</Card>

</Box>

</Box>

);

}

export default Login;