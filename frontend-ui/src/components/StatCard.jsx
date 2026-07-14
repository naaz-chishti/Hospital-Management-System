import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  bg = "#FFFFFF",
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: 120,
        p: 2.5,
        borderRadius: 4,
        bgcolor: bg,
        border: "1px solid rgba(0,0,0,.05)",
        boxShadow: "0 10px 25px rgba(15,23,42,.06)",
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 35px rgba(15,23,42,.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              color: "#64748B",
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 36,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "#64748B",
              }}
            >
              {subtitle}
            </Typography>

            <Chip
              size="small"
              icon={
                <TrendingUpIcon
                  sx={{ fontSize: 15 }}
                />
              }
              label="+12%"
              sx={{
                height: 24,
                bgcolor: "#DCFCE7",
                color: "#15803D",
                fontWeight: 700,

                "& .MuiChip-icon": {
                  color: "#15803D",
                },
              }}
            />
          </Box>
        </Box>

        <Avatar
          sx={{
            width: 58,
            height: 58,
            bgcolor: color,
            color: "#fff",
            mt: 0.5,
            boxShadow: `0 10px 25px ${color}55`,

            "& svg": {
              fontSize: 30,
            },
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </Paper>
  );
}

export default StatCard;