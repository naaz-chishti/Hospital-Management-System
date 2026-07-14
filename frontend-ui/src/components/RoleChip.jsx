import { Chip } from "@mui/material";

function RoleChip({ role }) {
  return (
    <Chip
      label={role}
      sx={{
        height: 34,
        px: 1,

        bgcolor: "#ECFDF5",

        color: "#047857",

        border: "1px solid #A7F3D0",

        borderRadius: "10px",

        fontWeight: 700,

        fontSize: 13,
      }}
    />
  );
}

export default RoleChip;