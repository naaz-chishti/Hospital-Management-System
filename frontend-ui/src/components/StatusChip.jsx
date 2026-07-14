import Chip from "@mui/material/Chip";

function StatusChip({ status }) {
  let bg = "#FEF3C7";
  let color = "#92400E";

  switch (status) {
    case "Success":
    case "Completed":
    case "Paid":
    case "Active":
    case "Admitted":
    case "Ordered":
      bg = "#DCFCE7";
      color = "#15803D";
      break;

    case "Pending":
    case "Processing":
    case "Collected":
    case "Waiting":
      bg = "#FEF3C7";
      color = "#B45309";
      break;

    case "Failed":
    case "Cancelled":
    case "Rejected":
    case "Inactive":
      bg = "#FEE2E2";
      color = "#DC2626";
      break;

    default:
      bg = "#E2E8F0";
      color = "#475569";
  }

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: bg,
        color: color,
        fontWeight: 700,
        borderRadius: "8px",
        minWidth: 90,
        border: `1px solid ${color}30`,
      }}
    />
  );
}

export default StatusChip;