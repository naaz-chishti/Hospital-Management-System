import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function PageHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  icon,
}) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        bgcolor: "#fff",
        borderRadius: "18px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 6px 20px rgba(15,23,42,.05)",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        flexWrap: {
          xs: "wrap",
          md: "nowrap",
        },

        gap: 3,
      }}
    >

      {/* LEFT */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >

        <Box
          sx={{
            width: 60,
            height: 60,

            borderRadius: "16px",

            bgcolor: "#ECFDF5",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "#0F766E",

            "& svg": {
              fontSize: 32,
            },
          }}
        >
          {icon}
        </Box>

        <Box>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.1,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: .4,
              fontSize: 15,
              color: "#64748B",
            }}
          >
            {subtitle}
          </Typography>

        </Box>

      </Box>

      {/* RIGHT */}

      {buttonText && (

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onButtonClick}
          sx={{
            height: 46,

            px: 3,

            borderRadius: "12px",

            textTransform: "none",

            fontWeight: 700,

            fontSize: 15,

            background:
              "linear-gradient(135deg,#0F766E,#14B8A6)",

            boxShadow:
              "0 8px 18px rgba(20,184,166,.28)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#115E59,#0D9488)",
            },
          }}
        >
          {buttonText}
        </Button>

      )}

    </Box>
  );
}

export default PageHeader;