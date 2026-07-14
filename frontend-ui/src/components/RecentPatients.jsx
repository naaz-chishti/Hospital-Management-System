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

import PersonIcon from "@mui/icons-material/Person";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";

import API from "../api/axios";

 function RecentPatients() {

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {

      const res = await API.get("/patients");

      const latestPatients = res.data.data
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

      setPatients(latestPatients);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <Paper
      elevation={0}
      sx={{
        p:3,
        borderRadius:4,
        border:"1px solid #E5E7EB",
        boxShadow:"0 8px 25px rgba(15,23,42,.05)",
      }}
    >

      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Recent Patients
      </Typography>

      {patients.map((patient,index)=>(

        <Box key={patient._id}>

          <Box
            sx={{
              display:"grid",
              gridTemplateColumns:"1fr 95px 90px",
              alignItems:"center",
              py:1.5,
              columnGap:2,
            }}
          >

            {/* Patient */}

            <Box
              sx={{
                display:"flex",
                alignItems:"center",
                gap:1.5,
              }}
            >

              <Avatar
                sx={{
                  width:40,
                  height:40,
                  bgcolor:"#14B8A6",
                  fontWeight:700,
                }}
              >
                {patient.firstName?.charAt(0)}
                {patient.lastName?.charAt(0)}
              </Avatar>

              <Box>

                <Typography
                  sx={{
                    fontWeight:700,
                    fontSize:14,
                    color:"#0F172A",
                  }}
                >
                  {patient.firstName} {patient.lastName}
                </Typography>

                <Typography
                  sx={{
                    fontSize:12,
                    color:"#94A3B8",
                    mt:.3,
                  }}
                >
                  {patient.patientId} • {patient.age} yrs
                </Typography>

              </Box>

            </Box>

            {/* Gender */}

            <Box
              sx={{
                display:"flex",
                justifyContent:"center",
              }}
            >

              <Chip
                size="small"
                icon={
                  patient.gender === "Male"
                    ? <MaleIcon />
                    : <FemaleIcon />
                }
                label={patient.gender}
              />

            </Box>

            {/* Status */}

            <Typography
              sx={{
                textAlign:"right",
                fontWeight:600,
                fontSize:13,
                color:"#14B8A6",
              }}
            >
              {patient.status || "Active"}
            </Typography>

          </Box>

          {index !== patients.length - 1 && (
            <Divider />
          )}

        </Box>

      ))}

    </Paper>

  );

}

export default RecentPatients;