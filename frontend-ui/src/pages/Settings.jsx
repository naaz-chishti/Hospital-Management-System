import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/PageHeader";
import API from "../api/axios";

import { toast } from "react-toastify";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    height: 56,
    borderRadius: 3,
    bgcolor: "#FAFBFC",
  },
};

function Settings() {

  const [loading, setLoading] = useState(true);

  const [settingId, setSettingId] = useState("");

  const [form, setForm] = useState({
    hospitalName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
  try {

    const res = await API.get("/settings");

    if (res.data.data.length > 0) {

      const s = res.data.data[0];

      setSettingId(s._id);

      setForm({
        hospitalName: s.hospitalName || "",
        address: s.address || "",
        phone: s.phone || "",
        email: s.email || "",
        website: s.website || "",
      });

    }

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

const handleSave = async () => {
  try {

    if (settingId) {

      await API.put(
        `/settings/${settingId}`,
        form
      );

      toast.success(
        "Settings updated successfully"
      );

    } else {

      const res = await API.post(
        "/settings",
        form
      );

      setSettingId(
        res.data.data._id
      );

      toast.success(
        "Settings saved successfully"
      );

    }

    fetchSettings();

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to save settings"
    );

  }
};

 const handleReset = () => {

  setForm({
    hospitalName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  toast.info("Form cleared");

};



  return (

    <DashboardLayout>

      <PageHeader
        title="Settings"
        subtitle="Manage hospital configuration"
        icon={<SettingsRoundedIcon />}
      />

      {loading ? (

        <Box textAlign="center" mt={8}>
          <CircularProgress />
        </Box>

      ) : (

      <Card
  elevation={0}
  sx={{
    mt: 3,
    width: "100%",
    borderRadius: 4,
    border: "1px solid #E2E8F0",
    p: 4,
  }}
>

<CardContent sx={{ p: 4 }}>

<Box
sx={{
display: "flex",
alignItems: "center",
gap: 2,
mb: 4,
}}
>

<Box
sx={{
width: 56,
height: 56,
borderRadius: 3,
display: "flex",
alignItems: "center",
justifyContent: "center",
background:
  "linear-gradient(135deg,#14B8A6,#0F766E)",
color: "#fff",
}}
>
<SettingsRoundedIcon fontSize="large" />
</Box>

<Box>

<Typography
variant="h4"
fontWeight={700}
>
Hospital Information
</Typography>

<Typography
  sx={{
    color:"#64748B",
    fontSize:16,
    mt:1,
  }}
>
Update your hospital configuration details
</Typography>

</Box>

</Box>

<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    gap: 3,
    mt: 2,
  }}
>
  <TextField
    fullWidth
    label="Hospital Name"
    name="hospitalName"
    value={form.hospitalName}
    onChange={handleChange}
    sx={textFieldStyle}
  />

  <TextField
    fullWidth
    label="Phone Number"
    name="phone"
    value={form.phone}
    onChange={handleChange}
    sx={textFieldStyle}
  />

  <TextField
    fullWidth
    label="Hospital Address"
    name="address"
    value={form.address}
    onChange={handleChange}
    sx={{
      ...textFieldStyle,
      gridColumn: {
        xs: "1",
        md: "1 / span 2",
      },
    }}
  />

  <TextField
    fullWidth
    label="Email Address"
    name="email"
    value={form.email}
    onChange={handleChange}
    sx={textFieldStyle}
  />

  <TextField
    fullWidth
    label="Website"
    name="website"
    value={form.website}
    onChange={handleChange}
    sx={textFieldStyle}
  />
</Box>

<Box
sx={{
display: "flex",
justifyContent: "flex-end",
gap: 2,
mt: 5,
}}
>

<Button
variant="outlined"
startIcon={<RestartAltRoundedIcon />}
onClick={handleReset}
sx={{
height:52,
px:5,
borderRadius:3,
fontWeight:700,
fontSize:15,
textTransform:"none",
}}
>
Reset
</Button>

<Button
variant="contained"
startIcon={<SaveRoundedIcon />}
onClick={handleSave}
sx={{
height:52,
px:5,
borderRadius:3,
fontWeight:700,
fontSize:15,
textTransform:"none",
background:"linear-gradient(135deg,#14B8A6,#0F766E)",
}}
>
Save Changes
</Button>

</Box>

</CardContent>

</Card>

)}

</DashboardLayout>

);

}

export default Settings;