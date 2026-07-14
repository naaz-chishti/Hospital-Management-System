import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

function FormDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Save",
  hideSubmit = false,
  subtitle = "Create or update doctor information",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: 900,
          maxWidth: "95%",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(2,6,23,.18)",
        },
      }}
    >
      {/* Header */}

      <DialogTitle
        sx={{
          p: 0,
          background: "linear-gradient(135deg,#0F766E,#14B8A6)",
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MedicalServicesRoundedIcon
                sx={{
                  color: "#fff",
                  fontSize: 26,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,.85)",
                  fontSize: 12,
                  mt: 0.3,
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,.15)",

              "&:hover": {
                bgcolor: "rgba(255,255,255,.25)",
              },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Body */}

      <DialogContent
        sx={{
          bgcolor: "#FCFDFE",
          px: 5,
          py: 4,
        }}
      >
        {children}
      </DialogContent>

      {/* Footer */}

     <DialogActions
  sx={{
    bgcolor: "#F8FAFC",
    justifyContent: "flex-end",
    px: 4,
    py: 3,
    borderTop: "1px solid #E5E7EB",
    gap: 2,
  }}
>

  {hideSubmit ? (

    <Button
      variant="contained"
      onClick={onClose}
      sx={{
        minWidth: 140,
        height: 46,
        borderRadius: 3,
        textTransform: "none",
        fontWeight: 700,
        background:
          "linear-gradient(135deg,#0F766E,#14B8A6)",

        "&:hover": {
          background:
            "linear-gradient(135deg,#115E59,#0D9488)",
        },
      }}
    >
      Close
    </Button>

  ) : (

    <Button
      variant="contained"
      onClick={onSubmit}
      sx={{
        minWidth: 150,
        height: 46,
        borderRadius: 3,
        textTransform: "none",
        fontWeight: 700,
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
      {submitText}
    </Button>

  )}

</DialogActions>
    </Dialog>
  );
}

export default FormDialog;