import { useEffect, useState } from "react";

import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

import CircularProgress from "@mui/material/CircularProgress";

import {
  Box,
  TextField,
  Avatar,
  Typography,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  MenuItem,
} from "@mui/material";

import { toast } from "react-toastify";

import PersonIcon from "@mui/icons-material/Person";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";
import ActionButtons from "../components/ActionButtons";

import ModuleStats from "../components/ModuleStats";
import FormDialog from "../components/FormDialog";

import MedicalInformationRoundedIcon from "@mui/icons-material/MedicalInformationRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import HealingRoundedIcon from "@mui/icons-material/HealingRounded";

import { useSearchParams } from "react-router-dom";


const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    height: 58,
    borderRadius: 3,
    bgcolor: "#fff",

    "& fieldset": {
      borderColor: "#D1D5DB",
    },

    "&:hover fieldset": {
      borderColor: "#14B8A6",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#14B8A6",
      borderWidth: 2,
    },
  },

  "& .MuiInputLabel-root": {
    fontWeight: 600,
    color: "#64748B",
  },
};


function OPD() {

  /* =========================
     DATA
  ========================= */

  const [visits, setVisits] =
    useState([]);

  const [patients, setPatients] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);


  /* =========================
     UI
  ========================= */

  const [open, setOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);


  /* =========================
     SEARCH / FILTER / SORT
  ========================= */

  const [search, setSearch] =
    useState("");

  const [filterValue, setFilterValue] =
    useState("all");

  const [sortValue, setSortValue] =
    useState("latest");


  /* =========================
     EDIT / VIEW
  ========================= */

  const [editingId, setEditingId] =
    useState(null);

  const [selectedVisit, setSelectedVisit] =
    useState(null);


  const [searchParams] =
    useSearchParams();


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] =
    useState({

      patient: "",
      doctor: "",
      symptoms: "",
      diagnosis: "",
      status: "Waiting",

    });


  /* =========================
     FETCH VISITS
  ========================= */

  const fetchVisits = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/opd");

      setVisits(
        res.data.data || []
      );

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to fetch OPD visits"
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================
     FETCH PATIENTS
  ========================= */

  const fetchPatients = async () => {

    try {

      const res =
        await API.get("/patients");

      setPatients(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    }

  };


  /* =========================
     FETCH DOCTORS
  ========================= */

  const fetchDoctors = async () => {

    try {

      const res =
        await API.get("/doctors");

      setDoctors(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    }

  };


  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchVisits();
    fetchPatients();
    fetchDoctors();

    if (
      searchParams.get("add") === "true"
    ) {

      setEditingId(null);

      setFormData({
        patient: "",
        doctor: "",
        symptoms: "",
        diagnosis: "",
        status: "Waiting",
      });

      setOpen(true);

    }

  }, []);


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };


  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {

    try {

      if (editingId) {

        await API.put(
          `/opd/${editingId}`,
          formData
        );

        toast.success(
          "Visit updated successfully"
        );

      } else {

        await API.post(
          "/opd",
          formData
        );

        toast.success(
          "Visit added successfully"
        );

      }

      await fetchVisits();

      setOpen(false);

      setEditingId(null);

      setFormData({
        patient: "",
        doctor: "",
        symptoms: "",
        diagnosis: "",
        status: "Waiting",
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );

    }

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (visit) => {

    setEditingId(
      visit._id
    );

    setFormData({

      patient:
        visit.patient?._id || "",

      doctor:
        visit.doctor?._id || "",

      symptoms:
        visit.symptoms || "",

      diagnosis:
        visit.diagnosis || "",

      status:
        visit.status === "Pending"
          ? "Waiting"
          : visit.status ||
            "Waiting",

    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const deleteVisit = async (id) => {

    if (
      !window.confirm(
        "Delete OPD Visit?"
      )
    ) {
      return;
    }

    try {

      await API.delete(
        `/opd/${id}`
      );

      toast.success(
        "Visit deleted successfully"
      );

      fetchVisits();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Delete failed"
      );

    }

  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (visit) => {

    setSelectedVisit(visit);

    setViewOpen(true);

  };


  /* =========================
     STATS
  ========================= */

  const stats = [

    {
      label: "Total Visits",
      value: visits.length,
      icon:
        <MedicalInformationRoundedIcon />,
    },

    {
      label: "Completed",
      value:
        visits.filter(
          (v) =>
            v.status ===
            "Completed"
        ).length,

      icon:
        <AssignmentTurnedInRoundedIcon />,
    },

    {
      label: "Pending",
      value:
        visits.filter(
          (v) =>
            v.status !==
            "Completed"
        ).length,

      icon:
        <PendingActionsRoundedIcon />,
    },

    {
      label: "Consultants",
      value:
        new Set(
          visits
            .map(
              (v) =>
                v.doctor?.name
            )
            .filter(Boolean)
        ).size,

      icon:
        <LocalHospitalRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredVisits =
    visits

      .filter((visit) => {

        const text =
          search
            .toLowerCase()
            .trim();


        /* SEARCH */

        const patientName =
          `${visit.patient?.firstName || ""} ${
            visit.patient?.lastName || ""
          }`.toLowerCase();

        const doctorName =
          (
            visit.doctor?.name ||
            ""
          ).toLowerCase();

        const symptoms =
          (
            visit.symptoms ||
            ""
          ).toLowerCase();

        const visitId =
          (
            visit.visitId ||
            ""
          ).toLowerCase();


        const matchesSearch =
          !text ||
          patientName.includes(text) ||
          doctorName.includes(text) ||
          symptoms.includes(text) ||
          visitId.includes(text);


        if (!matchesSearch) {
          return false;
        }


        /* FILTER */

        if (
          filterValue ===
          "waiting"
        ) {

          return (
            visit.status ===
              "Waiting" ||
            visit.status ===
              "Pending"
          );

        }


        if (
          filterValue ===
          "completed"
        ) {

          return (
            visit.status ===
            "Completed"
          );

        }


        if (
          filterValue ===
          "cancelled"
        ) {

          return (
            visit.status ===
            "Cancelled"
          );

        }


        return true;

      })


      /* SORT */

      .sort((a, b) => {

        /* NAME A-Z */

        if (
          sortValue ===
          "name"
        ) {

          const nameA =
            `${a.patient?.firstName || ""} ${
              a.patient?.lastName || ""
            }`.toLowerCase();

          const nameB =
            `${b.patient?.firstName || ""} ${
              b.patient?.lastName || ""
            }`.toLowerCase();

          return nameA.localeCompare(
            nameB
          );

        }


        /* OLDEST */

        if (
          sortValue ===
          "oldest"
        ) {

          return (
            new Date(
              a.createdAt || 0
            ) -
            new Date(
              b.createdAt || 0
            )
          );

        }


        /* LATEST */

        return (
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
        );

      });


  return (

    <DashboardLayout>

      {/* =========================
          HEADER
      ========================= */}

      <PageHeader
        title="OPD Visits"
        subtitle="Track and manage outpatient consultations"
        icon={
          <HealingRoundedIcon />
        }
        buttonText="New Visit"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            patient: "",
            doctor: "",
            symptoms: "",
            diagnosis: "",
            status: "Waiting",

          });

          setOpen(true);

        }}
      />


      {/* =========================
          STATS
      ========================= */}

      <ModuleStats
        stats={stats}
      />


      {/* =========================
          SEARCH BAR
      ========================= */}

      <SearchBar

        placeholder="Search patient, doctor, symptoms or visit ID..."

        value={search}

        onChange={(e) => {

          setSearch(
            e.target.value
          );

        }}


        filterValue={
          filterValue
        }

        onFilterChange={(
          value
        ) => {

          setFilterValue(
            value
          );

        }}


        filterOptions={[

          {
            value: "all",
            label: "All Visits",
          },

          {
            value: "waiting",
            label: "Waiting / Pending",
          },

          {
            value: "completed",
            label: "Completed",
          },

          {
            value: "cancelled",
            label: "Cancelled",
          },

        ]}


        sortValue={
          sortValue
        }

        onSortChange={(
          value
        ) => {

          setSortValue(
            value
          );

        }}

      />


      {/* =========================
          TABLE
      ========================= */}

      {loading ? (

        <Box
          sx={{
            height: 300,
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >

          <CircularProgress
            size={45}
            thickness={4}
          />

        </Box>

      ) : (

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 4,
            border:
              "1px solid #E2E8F0",
            overflow: "auto",
          }}
        >

          <Table
            sx={{
              width: "100%",
              minWidth: 950,
              tableLayout:
                "fixed",
            }}
          >

            <TableHead>

              <TableRow
                sx={{
                  bgcolor:
                    "#F8FAFC",
                }}
              >

                <TableCell
                  sx={{
                    width: "29%",
                    fontWeight: 700,
                  }}
                >
                  PATIENT
                </TableCell>

                <TableCell
                  sx={{
                    width: "27%",
                    fontWeight: 700,
                  }}
                >
                  DOCTOR
                </TableCell>

                <TableCell
                  sx={{
                    width: "20%",
                    fontWeight: 700,
                  }}
                >
                  SYMPTOMS
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                    fontWeight: 700,
                  }}
                >
                  STATUS
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                    fontWeight: 700,
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredVisits.length ===
              0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <PersonIcon
                      sx={{
                        fontSize: 60,
                        color:
                          "#CBD5E1",
                      }}
                    />

                    <Typography
                      mt={2}
                      fontWeight={700}
                    >
                      No OPD Visits Found
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Try another
                      search or
                      filter.
                    </Typography>

                  </TableCell>

                </TableRow>

              ) : (

                filteredVisits.map(
                  (visit) => (

                    <TableRow
                      key={
                        visit._id
                      }
                      hover
                      sx={{

                        transition:
                          ".25s",

                        "& td": {
                          py: 2.2,
                          px: 2,
                          borderBottom:
                            "1px solid #EEF2F7",
                          verticalAlign:
                            "middle",
                        },

                        "&:hover": {
                          bgcolor:
                            "#F0FDFA",
                        },

                      }}
                    >

                      {/* PATIENT */}

                      <TableCell>

                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 1.5,
                          }}
                        >

                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              fontWeight: 700,
                              fontSize: 16,

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",
                            }}
                          >

                            {
                              visit
                                .patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              visit
                                .patient
                                ?.lastName
                                ?.charAt(0)
                            }

                          </Avatar>


                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >

                            <Typography
                              sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                color:
                                  "#0F172A",
                                whiteSpace:
                                  "nowrap",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                              }}
                            >

                              {
                                visit.patient
                                  ?.firstName
                              }{" "}

                              {
                                visit.patient
                                  ?.lastName
                              }

                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,
                                color:
                                  "#64748B",
                                mt: 0.3,
                              }}
                            >

                              Visit ID :{" "}

                              {
                                visit.visitId ||
                                "-"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* DOCTOR */}

                      <TableCell>

                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 1.5,
                          }}
                        >

                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,

                              background:
                                "linear-gradient(135deg,#14B8A6,#0F766E)",

                              color: "#fff",

                              fontWeight: 700,

                              fontSize: 16,

                              boxShadow:
                                "0 6px 14px rgba(20,184,166,.25)",
                            }}
                          >

                            {
                              visit.doctor
                                ?.name
                                ?.charAt(0)
                            }

                          </Avatar>


                          <Box>

                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 15,
                                color:
                                  "#0F172A",
                              }}
                            >

                              {
                                visit.doctor
                                  ?.name ||
                                "-"
                              }

                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,
                                color:
                                  "#64748B",
                                mt: 0.3,
                              }}
                            >
                              Consultant
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* SYMPTOMS */}

                      <TableCell>

                        <Box
                          sx={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            px: 1.5,
                            py: 0.6,
                            borderRadius:
                              "10px",
                            bgcolor:
                              "#F8FAFC",
                            border:
                              "1px solid #E2E8F0",
                            maxWidth: 180,
                          }}
                        >

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 500,
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace:
                                "nowrap",
                            }}
                          >

                            {
                              visit.symptoms ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* STATUS */}

                      <TableCell
                        align="center"
                      >

                        <StatusChip
                          status={
                            visit.status ||
                            "Waiting"
                          }
                        />

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell
                        align="center"
                      >

                        <ActionButtons

                          onView={() =>
                            handleView(
                              visit
                            )
                          }

                          onEdit={() =>
                            handleEdit(
                              visit
                            )
                          }

                          onDelete={() =>
                            deleteVisit(
                              visit._id
                            )
                          }

                        />

                      </TableCell>

                    </TableRow>

                  )
                )

              )}

            </TableBody>

          </Table>

        </TableContainer>

      )}


      {/* =========================
          ADD / EDIT OPD
      ========================= */}

      <FormDialog
        open={open}
        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit OPD Visit"
            : "New OPD Visit"
        }

        submitText={
          editingId
            ? "Update Visit"
            : "Save Visit"
        }

        onSubmit={
          handleSubmit
        }
      >

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },

            columnGap: 3,
            rowGap: 2.5,

            mt: 3,
          }}
        >

          {/* PATIENT */}

          <TextField
            select
            name="patient"
            value={
              formData.patient
            }
            onChange={
              handleChange
            }
            label="Patient"
            sx={
              textFieldStyle
            }
          >

            {patients.map(
              (patient) => (

                <MenuItem
                  key={
                    patient._id
                  }
                  value={
                    patient._id
                  }
                >

                  {
                    patient.firstName
                  }{" "}

                  {
                    patient.lastName
                  }

                </MenuItem>

              )
            )}

          </TextField>


          {/* DOCTOR */}

          <TextField
            select
            name="doctor"
            value={
              formData.doctor
            }
            onChange={
              handleChange
            }
            label="Doctor"
            sx={
              textFieldStyle
            }
          >

            {doctors.map(
              (doctor) => (

                <MenuItem
                  key={
                    doctor._id
                  }
                  value={
                    doctor._id
                  }
                >

                  {
                    doctor.name
                  }

                </MenuItem>

              )
            )}

          </TextField>


          {/* SYMPTOMS */}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Symptoms"
            name="symptoms"
            value={
              formData.symptoms
            }
            onChange={
              handleChange
            }
            placeholder="Enter patient symptoms..."
            sx={{
              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },

              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 3,
                },

              "& .MuiInputLabel-root":
                {
                  fontWeight: 600,
                },
            }}
          />


          {/* DIAGNOSIS */}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Diagnosis"
            name="diagnosis"
            value={
              formData.diagnosis
            }
            onChange={
              handleChange
            }
            placeholder="Enter diagnosis..."
            sx={{
              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },

              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 3,
                },

              "& .MuiInputLabel-root":
                {
                  fontWeight: 600,
                },
            }}
          />


          {/* STATUS */}

          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={
              formData.status
            }
            onChange={
              handleChange
            }
            sx={{
              ...textFieldStyle,

              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },
            }}
          >

            <MenuItem value="Waiting">
              Waiting
            </MenuItem>

            <MenuItem value="Completed">
              Completed
            </MenuItem>

            <MenuItem value="Cancelled">
              Cancelled
            </MenuItem>

          </TextField>

        </Box>

      </FormDialog>


      {/* =========================
          VIEW OPD
      ========================= */}

      <FormDialog
        open={viewOpen}
        onClose={() =>
          setViewOpen(false)
        }

        title="OPD Visit Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }
      >

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 2.5,

            mt: 3,
          }}
        >

          <DetailBox
            label="Visit ID"
            value={
              selectedVisit?.visitId ||
              "-"
            }
          />


          <DetailBox
            label="Patient"
            value={`${selectedVisit?.patient?.firstName || ""} ${
              selectedVisit?.patient?.lastName || ""
            }`}
          />


          <DetailBox
            label="Doctor"
            value={
              selectedVisit?.doctor?.name ||
              "-"
            }
          />


          <DetailBox
            label="Symptoms"
            value={
              selectedVisit?.symptoms ||
              "-"
            }
          />


          <DetailBox
            label="Diagnosis"
            value={
              selectedVisit?.diagnosis ||
              "-"
            }
          />


          <Box
            sx={{
              p: 2,
              border:
                "1px solid #E2E8F0",
              borderRadius: 2,
              bgcolor:
                "#F8FAFC",
            }}
          >

            <Typography
              sx={{
                fontSize: 13,
                color:
                  "#94A3B8",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Status
            </Typography>

            <StatusChip
              status={
                selectedVisit?.status ||
                "Waiting"
              }
            />

          </Box>

        </Box>

      </FormDialog>

    </DashboardLayout>

  );
}


/* =========================
   DETAIL BOX
========================= */

function DetailBox({
  label,
  value,
}) {

  return (

    <Box
      sx={{
        p: 2,

        border:
          "1px solid #E2E8F0",

        borderRadius: 2,

        bgcolor:
          "#F8FAFC",
      }}
    >

      <Typography
        sx={{
          fontSize: 13,
          color: "#94A3B8",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 15,
          fontWeight: 600,
          color: "#0F172A",
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </Typography>

    </Box>

  );
}


export default OPD;