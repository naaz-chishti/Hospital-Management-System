import { Box, Card, Avatar, Typography, Button } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/PageHeader";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { useState } from "react";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import FormDialog from "../components/FormDialog";

function Profile() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [open, setOpen] = useState(false);

const [formData, setFormData] = useState({
  name: user?.name || "",
  email: user?.email || "",
  role: user?.role || "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSave = () => {

  localStorage.setItem(
    "user",
    JSON.stringify(formData)
  );

  toast.success("Profile updated successfully");

  setOpen(false);

  window.location.reload();

};

  return (
    <DashboardLayout>

      <PageHeader
        title="My Profile"
        subtitle="View your account information"
        icon={<PersonRoundedIcon />}
      />

      <Card
        elevation={0}
        sx={{
          mt: 3,
          p: 4,
          borderRadius: 4,
          border: "1px solid #E2E8F0",
        }}
      >

       <Box
  sx={{
    height: 220,
    borderRadius: 4,
    background: "linear-gradient(135deg,#14B8A6,#0F766E)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    mb: 5,
    position: "relative",
  }}
>

  <Avatar
    sx={{
      width: 120,
      height: 120,
      bgcolor: "#fff",
      color: "#14B8A6",
      fontSize: 44,
      fontWeight: 700,
      mb: 2,
      border: "4px solid rgba(255,255,255,.3)",
    }}
  >
    {(user?.name || "A").charAt(0).toUpperCase()}
  </Avatar>

  <Typography
    variant="h5"
    fontWeight={700}
  >
    {user?.name || "Administrator"}
  </Typography>

  <Typography
    sx={{
      opacity: .9,
      mt: .5,
    }}
  >
    {user?.role || "Admin"}
  </Typography>

</Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
          }}
        >

          <Box
            sx={{
              p: 2,
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <Typography fontWeight={700} mb={1}>
              Full Name
            </Typography>

            <Typography>
              {user.name || "-"}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <Typography fontWeight={700} mb={1}>
              Email
            </Typography>

            <Typography>
              {user.email || "-"}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <Typography fontWeight={700} mb={1}>
              Role
            </Typography>

            <Typography>
              {user.role || "-"}
            </Typography>
          </Box>

        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 5,
          }}
        >
          <Button
variant="contained"
startIcon={<EditRoundedIcon />}
onClick={() => setOpen(true)}
sx={{
px:4,
height:48,
borderRadius:3,
textTransform:"none",
fontWeight:700,
background:"linear-gradient(135deg,#14B8A6,#0F766E)",
}}
>
Edit Profile
</Button>
        </Box>

      </Card>

      <FormDialog
open={open}
onClose={() => setOpen(false)}
title="Edit Profile"
subtitle="Update your profile information"
submitText="Save Changes"
onSubmit={handleSave}
>

<Box
sx={{
display:"flex",
flexDirection:"column",
gap:3,
mt:2,
}}
>

<TextField
label="Full Name"
name="name"
value={formData.name}
onChange={handleChange}
/>

<TextField
label="Email"
name="email"
value={formData.email}
onChange={handleChange}
/>

<TextField
label="Role"
name="role"
value={formData.role}
onChange={handleChange}
/>

</Box>

</FormDialog>

    </DashboardLayout>
  );
}

export default Profile;