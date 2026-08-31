import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#14B8A6",
    },
    secondary: {
      main: "#0F766E",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    success: {
      main: "#22C55E",
    },
    warning: {
      main: "#F59E0B",
    },
    error: {
      main: "#EF4444",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default theme;