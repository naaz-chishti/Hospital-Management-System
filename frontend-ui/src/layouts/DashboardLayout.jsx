import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { useTheme } from "@mui/material/styles";

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


function DashboardLayout({
  children,
  showSearch = false,
}) {

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [open, setOpen] = useState(false);


  return (

    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#F8FAFC",
      }}
    >

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}

      {!isMobile && (

        <Box
          sx={{
            width: 290,
            minWidth: 290,
            height: "100vh",
            position: "sticky",
            top: 0,
            flexShrink: 0,
          }}
        >

          <Sidebar />

        </Box>

      )}


      {/* =========================
          MOBILE SIDEBAR
      ========================== */}

      {isMobile && (

        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}

          PaperProps={{
            sx: {
              width: {
                xs: 270,
                sm: 290,
              },

              background: "#0F766E",
            },
          }}
        >

          <Sidebar />

        </Drawer>

      )}


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",

          display: "flex",
          flexDirection: "column",

          overflow: "hidden",
        }}
      >

        {/* =========================
            NAVBAR
        ========================== */}

        <Box
          sx={{
            width: "100%",
            flexShrink: 0,

            display: "flex",
            alignItems: "center",

            background: "#FFFFFF",
          }}
        >

          {/* MOBILE MENU BUTTON */}

          {isMobile && (

            <IconButton
              onClick={() => setOpen(true)}

              sx={{
                ml: {
                  xs: 1,
                  sm: 2,
                },

                mr: 0.5,

                width: 42,
                height: 42,

                color: "#0F766E",

                borderRadius: 2,

                "&:hover": {
                  background: "#ECFDF5",
                },
              }}
            >

              <MenuIcon />

            </IconButton>

          )}


          {/* NAVBAR */}

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >

            <Navbar
              showSearch={showSearch}
            />

          </Box>

        </Box>


        {/* =========================
            PAGE CONTENT
        ========================== */}

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,

            p: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
              lg: 4,
            },

            background: "#F8FAFC",

            overflowX: "hidden",
          }}
        >

          {children}

        </Box>

      </Box>

    </Box>

  );

}


export default DashboardLayout;