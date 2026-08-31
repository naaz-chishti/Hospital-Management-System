import { Box, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(8,24,39,.78)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: {
            xs: 2,
            sm: 4,
            md: 6,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 480px",
            },
            gap: {
              xs: 4,
              lg: 10,
            },
            alignItems: "center",
          }}
        >
          {/* Left Side */}
          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },
              color: "#fff",
            }}
          >
            <LocalHospitalIcon
              sx={{
                fontSize: 65,
                color: "#14B8A6",
                mb: 2,
              }}
            />

            <Typography
              sx={{
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.05,
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
                mt: 3,
                fontSize: 20,
                opacity: .9,
              }}
            >
              Smart, Secure and Modern Healthcare
              Management Platform
            </Typography>

            <Box sx={{ mt: 5 }}>
              <Typography>✔ Patient Management</Typography>
              <Typography>✔ OPD & IPD Management</Typography>
              <Typography>✔ Laboratory & Imaging</Typography>
              <Typography>✔ Billing & Insurance</Typography>
              <Typography>✔ Pharmacy Management</Typography>
              <Typography>✔ Reports & Analytics</Typography>
            </Box>
          </Box>

          {/* Mobile Logo */}
          <Box
            sx={{
              display: {
                xs: "flex",
                lg: "none",
              },
              flexDirection: "column",
              alignItems: "center",
              color: "#fff",
            }}
          >
            <LocalHospitalIcon
              sx={{
                fontSize: 55,
                color: "#14B8A6",
              }}
            />

            <Typography
              fontWeight={700}
              fontSize={34}
            >
              HMS ERP
            </Typography>

            <Typography
              color="#CBD5E1"
            >
              Hospital Management System
            </Typography>
          </Box>

          {children}

        </Box>
      </Box>
    </Box>
  );
}

export default AuthLayout;