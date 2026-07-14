import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {

  return (

    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >

      {/* Sidebar */}
      <Box
        sx={{
          width: 270,
          minWidth: 270,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#0F766E",
        }}
      >
        <Sidebar />
      </Box>

      {/* Right Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >

        <Navbar />

        <Box
          sx={{
            flex: 1,
            p: 3,
            background: "#F8FAFC",
          }}
        >
          {children}
        </Box>

      </Box>

    </Box>

  );

}

export default DashboardLayout;