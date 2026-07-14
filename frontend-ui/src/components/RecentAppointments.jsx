import {
  useEffect,
  useState
} from "react";

import {
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import ScheduleIcon from "@mui/icons-material/Schedule";

import API from "../api/axios";

function RecentAppointments() {

  const [appointments, setAppointments] =
    useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments =
    async () => {

      try {

        const res =
          await API.get("/opd");

        const latestAppointments =
          res.data.data
            .sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
            .slice(0, 5);

        setAppointments(latestAppointments);

      } catch (error) {

        console.log(error);

      }

    };

  const getStatusColor = (status) => {

    switch (status) {

      case "Completed":
        return "success";

      case "Ongoing":
        return "warning";

      default:
        return "primary";

    }

  };

  const rows = [
    ...appointments,
    ...Array(Math.max(0, 5 - appointments.length)).fill(null),
  ].slice(0, 5);

  return (

    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 410,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 25px rgba(15,23,42,.05)",
      }}
    >

      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Today's Appointments
      </Typography>

      {rows.map((appointment, index) => (

        <Box
          key={appointment?._id || index}
        >

          {appointment ? (

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 95px",
                alignItems: "center",
                py: 1.5,
                columnGap: 2,
              }}
            >

              {/* Patient */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >

                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#EFF6FF",
                    color: "#2563EB",
                    fontWeight: 700,
                  }}
                >
                  {appointment.patient?.firstName?.charAt(0)}
                  {appointment.patient?.lastName?.charAt(0)}
                </Avatar>

                <Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#0F172A",
                    }}
                  >
                    {appointment.patient?.firstName}{" "}
                    {appointment.patient?.lastName}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#94A3B8",
                    }}
                  >
                    {appointment.doctor?.name || "Doctor"}
                  </Typography>

                </Box>

              </Box>

              {/* Time */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: .5,
                }}
              >

                <ScheduleIcon
                  sx={{
                    fontSize: 15,
                    color: "#64748B",
                  }}
                />

                <Typography
                  fontSize={13}
                >
                  {appointment.visitTime ||
                    appointment.time ||
                    "--"}
                </Typography>

              </Box>

              {/* Status */}

              <Box
                display="flex"
                justifyContent="flex-end"
              >

                <Chip
                  size="small"
                  label={
                    appointment.status ||
                    "Scheduled"
                  }
                  color={getStatusColor(
                    appointment.status
                  )}
                />

              </Box>

            </Box>

          ) : (

            <Box
              sx={{
                height: 72,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94A3B8",
                fontSize: 13,
              }}
            >
              No Appointment Scheduled
            </Box>

          )}

          {index !== rows.length - 1 && (
            <Divider />
          )}

        </Box>

      ))}

    </Paper>

  );

}

export default RecentAppointments;