import { Paper, Box, Typography } from "@mui/material";

function ModuleStats({ stats }) {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        py:1.7,
px:2,
        borderRadius: "18px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 20px rgba(15,23,42,.05)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          alignItems: "center",
        }}
      >
        {stats.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              px: 3,

              borderRight:
                index !== stats.length - 1
                  ? "1px solid #E5E7EB"
                  : "none",
            }}
          >
            {/* Icon */}

            <Box
              sx={{
                width: 48,
                height: 48,

                borderRadius: "18px",

                background:
                  "linear-gradient(180deg,#ECFDF5,#E6FFFB)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                color: "#0F766E",

                "& svg": {
                  fontSize: 26,
                },
              }}
            >
              {item.icon}
            </Box>

            {/* Text */}

            <Box>

              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {item.value}
              </Typography>

              <Typography
                sx={{
                  mt: .4,
                  fontSize: 15,
                  color: "#64748B",
                }}
              >
                {item.label}
              </Typography>

            </Box>

          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default ModuleStats;