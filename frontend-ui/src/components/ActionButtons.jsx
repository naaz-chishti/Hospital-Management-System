import { Box, IconButton, Tooltip } from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function ActionButtons({
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1.5,
      }}
    >

      <Tooltip title="View">
  <IconButton
    onClick={onView}
    sx={{
      width: 40,
      height: 40,
      borderRadius: "12px",
      border: "1px solid #BFDBFE",
      bgcolor: "#FFFFFF",
      color: "#2563EB",
      transition: ".25s",
      "&:hover": {
        bgcolor: "#EFF6FF",
        transform: "translateY(-2px)",
      },
    }}
  >
    <VisibilityOutlinedIcon fontSize="small" />
  </IconButton>
</Tooltip>

      <Tooltip title="Edit">
        <IconButton
          onClick={onEdit}
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",

            border: "1px solid #D6E4FF",

            background: "#FFFFFF",

            color: "#3B82F6",

            transition: ".25s",

            "&:hover": {
              bgcolor: "#EFF6FF",
              transform: "translateY(-2px)",
            },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          onClick={onDelete}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",

            border: "1px solid #FECACA",

            background: "#FFFFFF",

            color: "#EF4444",

            transition: ".25s",

            "&:hover": {
              bgcolor: "#FEF2F2",
              transform: "translateY(-2px)",
            },
          }}
        >
          <DeleteOutlineOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default ActionButtons;