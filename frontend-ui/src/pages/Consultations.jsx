import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Avatar,
  Typography,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api/axios";

import ModuleStats from "../components/ModuleStats";
import StatusChip from "../components/StatusChip";
import ActionButtons from "../components/ActionButtons";
import FormDialog from "../components/FormDialog";

import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { toast } from "react-toastify";

import { useSearchParams } from "react-router-dom";


/* =========================
   FORM STYLE
========================= */

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    minHeight: 58,
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


/* =========================
   COMPONENT
========================= */

function Consultations() {

  /* =========================
     DATA
  ========================= */

  const [consultations, setConsultations] =
    useState([]);

  const [patients, setPatients] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);

  const [opdVisits, setOpdVisits] =
    useState([]);


  /* =========================
     UI
  ========================= */

  const [loading, setLoading] =
    useState(true);

  const [open, setOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);


  /* =========================
     SEARCH
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

  const [selectedConsultation, setSelectedConsultation] =
    useState(null);


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] =
    useState({

      opdVisit: "",
      patient: "",
      doctor: "",
      diagnosis: "",
      notes: "",
      medicine: "",
      dosage: "",
      duration: "",
      recommendedTests: "",

    });


  const [searchParams] =
    useSearchParams();


  /* =========================
     FETCH CONSULTATIONS
  ========================= */

  const fetchConsultations =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/consultations"
          );

        if (
          Array.isArray(
            res.data
          )
        ) {

          setConsultations(
            res.data
          );

        } else if (
          Array.isArray(
            res.data.data
          )
        ) {

          setConsultations(
            res.data.data
          );

        } else {

          setConsultations([]);

        }

      } catch (error) {

        console.error(
          "Error fetching consultations:",
          error
        );

        setConsultations([]);

        toast.error(
          "Failed to fetch consultations"
        );

      } finally {

        setLoading(false);

      }

    };


  /* =========================
     FETCH PATIENTS
  ========================= */

  const fetchPatients =
    async () => {

      try {

        const res =
          await API.get(
            "/patients"
          );

        setPatients(
          res.data.data || []
        );

      } catch (error) {

        console.error(
          "Patient Error:",
          error
        );

      }

    };


  /* =========================
     FETCH DOCTORS
  ========================= */

  const fetchDoctors =
    async () => {

      try {

        const res =
          await API.get(
            "/doctors"
          );

        setDoctors(
          res.data.data || []
        );

      } catch (error) {

        console.error(
          "Doctor Error:",
          error
        );

      }

    };


  /* =========================
     FETCH OPD
  ========================= */

  const fetchOPDVisits =
    async () => {

      try {

        const res =
          await API.get(
            "/opd"
          );

        setOpdVisits(
          res.data.data || []
        );

      } catch (error) {

        console.error(
          "OPD Error:",
          error
        );

      }

    };


  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchConsultations();
    fetchPatients();
    fetchDoctors();
    fetchOPDVisits();

    if (
      searchParams.get("add") ===
      "true"
    ) {

      setEditingId(null);

      setFormData({
        opdVisit: "",
        patient: "",
        doctor: "",
        diagnosis: "",
        notes: "",
        medicine: "",
        dosage: "",
        duration: "",
        recommendedTests: "",
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
     EDIT
  ========================= */

  const handleEdit = (
    consultation
  ) => {

    setEditingId(
      consultation._id
    );

    setFormData({

      opdVisit:
        consultation.opdVisit?._id ||
        "",

      patient:
        consultation.patient?._id ||
        "",

      doctor:
        consultation.doctor?._id ||
        "",

      diagnosis:
        consultation.diagnosis ||
        "",

      notes:
        consultation.notes ||
        "",

      medicine:
        consultation.prescription?.[0]
          ?.medicine ||
        "",

      dosage:
        consultation.prescription?.[0]
          ?.dosage ||
        "",

      duration:
        consultation.prescription?.[0]
          ?.duration ||
        "",

      recommendedTests:
        consultation.recommendedTests?.join(
          ", "
        ) || "",

    });

    setOpen(true);

  };


  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit =
    async () => {

      try {

        const payload = {

          opdVisit:
            formData.opdVisit,

          patient:
            formData.patient,

          doctor:
            formData.doctor,

          diagnosis:
            formData.diagnosis,

          notes:
            formData.notes,

          prescription: [
            {
              medicine:
                formData.medicine,

              dosage:
                formData.dosage,

              duration:
                formData.duration,
            },
          ],

          recommendedTests:
            formData.recommendedTests
              ? formData.recommendedTests
                  .split(",")
                  .map(
                    (test) =>
                      test.trim()
                  )
                  .filter(Boolean)
              : [],

        };


        if (editingId) {

          await API.put(
            `/consultations/${editingId}`,
            payload
          );

          toast.success(
            "Consultation Updated Successfully"
          );

        } else {

          await API.post(
            "/consultations",
            payload
          );

          toast.success(
            "Consultation Added Successfully"
          );

        }


        await fetchConsultations();

        setOpen(false);

        setEditingId(null);

        setFormData({

          opdVisit: "",
          patient: "",
          doctor: "",
          diagnosis: "",
          notes: "",
          medicine: "",
          dosage: "",
          duration: "",
          recommendedTests: "",

        });

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
          "Something went wrong"
        );

      }

    };


  /* =========================
     VIEW
  ========================= */

  const handleView = (
    consultation
  ) => {

    setSelectedConsultation(
      consultation
    );

    setViewOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete Consultation?"
        )
      ) {

        return;

      }

      try {

        await API.delete(
          `/consultations/${id}`
        );

        toast.success(
          "Consultation Deleted"
        );

        fetchConsultations();

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
          "Delete Failed"
        );

      }

    };


  /* =========================
     STATS
  ========================= */

  const stats = [

    {
      label: "Consultations",

      value:
        consultations.length,

      icon:
        <MedicalServicesRoundedIcon />,
    },

    {
      label: "Completed",

      value:
        consultations.filter(
          (consultation) =>
            consultation.status ===
            "Completed"
        ).length,

      icon:
        <CheckCircleRoundedIcon />,
    },

    {
      label: "Pending",

      value:
        consultations.filter(
          (consultation) =>
            consultation.status !==
            "Completed"
        ).length,

      icon:
        <PendingActionsRoundedIcon />,
    },

    {
      label: "Tests",

      value:
        consultations.filter(
          (consultation) =>
            consultation
              .recommendedTests
              ?.length
        ).length,

      icon:
        <BiotechRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredConsultations =
    consultations

      .filter((consultation) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const patientName =
          `${consultation.patient?.firstName || ""} ${
            consultation.patient?.lastName || ""
          }`.toLowerCase();


        const doctorName =
          (
            consultation.doctor?.name ||
            ""
          ).toLowerCase();


        const diagnosis =
          (
            consultation.diagnosis ||
            ""
          ).toLowerCase();


        const consultationId =
          (
            consultation.consultationId ||
            ""
          ).toLowerCase();


        const notes =
          (
            consultation.notes ||
            ""
          ).toLowerCase();


        const matchesSearch =
          !text ||
          patientName.includes(text) ||
          doctorName.includes(text) ||
          diagnosis.includes(text) ||
          consultationId.includes(text) ||
          notes.includes(text);


        if (
          !matchesSearch
        ) {

          return false;

        }


        /* FILTER */

        if (
          filterValue ===
          "completed"
        ) {

          return (
            consultation.status ===
            "Completed"
          );

        }


        if (
          filterValue ===
          "pending"
        ) {

          return (
            consultation.status !==
            "Completed"
          );

        }


        return true;

      })


      /* SORT */

      .sort(
        (a, b) => {

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


          return (
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
          );

        }
      );


  /* =========================
     RENDER
  ========================= */

  return (

    <DashboardLayout>

      {/* HEADER */}

      <PageHeader
        title="Consultations"
        subtitle="Manage patient consultations"
        icon={
          <MedicalServicesRoundedIcon />
        }
        buttonText="New Consultation"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            opdVisit: "",
            patient: "",
            doctor: "",
            diagnosis: "",
            notes: "",
            medicine: "",
            dosage: "",
            duration: "",
            recommendedTests: "",

          });

          setOpen(true);

        }}
      />


      {/* STATS */}

      <ModuleStats
        stats={stats}
      />


      {/* SEARCH */}

      <SearchBar

        placeholder="Search patient, doctor, diagnosis or consultation ID..."

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }


        filterValue={
          filterValue
        }

        onFilterChange={(
          value
        ) =>
          setFilterValue(
            value
          )
        }


        filterOptions={[

          {
            value: "all",
            label: "All Consultations",
          },

          {
            value: "completed",
            label: "Completed",
          },

          {
            value: "pending",
            label: "Pending",
          },

        ]}


        sortValue={
          sortValue
        }

        onSortChange={(
          value
        ) =>
          setSortValue(
            value
          )
        }

      />


      {/* TABLE */}

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
                    width: "25%",
                    fontWeight: 700,
                  }}
                >
                  PATIENT
                </TableCell>


                <TableCell
                  sx={{
                    width: "22%",
                    fontWeight: 700,
                  }}
                >
                  DOCTOR
                </TableCell>


                <TableCell
                  sx={{
                    width: "18%",
                    fontWeight: 700,
                  }}
                >
                  DIAGNOSIS
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "13%",
                    fontWeight: 700,
                  }}
                >
                  MEDICINES
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "10%",
                    fontWeight: 700,
                  }}
                >
                  TESTS
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

              {filteredConsultations.length ===
              0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <MedicalServicesRoundedIcon
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
                      No Consultations Found
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Try another search
                      or filter.
                    </Typography>

                  </TableCell>

                </TableRow>

              ) : (

                filteredConsultations.map(
                  (consultation) => (

                    <TableRow
                      key={
                        consultation._id
                      }

                      hover

                      sx={{

                        "& td": {
                          py: 2,
                          px: 2,
                          borderBottom:
                            "1px solid #EEF2F7",
                          verticalAlign:
                            "middle",
                        },

                        "&:hover": {
                          bgcolor:
                            "#F8FAFC",
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

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                              fontWeight: 700,
                            }}
                          >

                            {
                              consultation
                                .patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              consultation
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
                                fontWeight: 700,
                                fontSize: 14,

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",
                              }}
                            >

                              {
                                consultation
                                  .patient
                                  ?.firstName
                              }{" "}

                              {
                                consultation
                                  .patient
                                  ?.lastName
                              }

                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,
                                color:
                                  "#94A3B8",
                                mt: 0.4,
                              }}
                            >

                              {
                                consultation
                                  .consultationId ||
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
                              width: 38,
                              height: 38,

                              background:
                                "linear-gradient(135deg,#14B8A6,#0F766E)",

                              fontWeight: 700,
                            }}
                          >

                            {
                              consultation
                                .doctor
                                ?.name
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
                                fontWeight: 700,
                                fontSize: 14,

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",
                              }}
                            >

                              {
                                consultation
                                  .doctor
                                  ?.name ||
                                "-"
                              }

                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,
                                color:
                                  "#94A3B8",
                                mt: 0.4,
                              }}
                            >
                              Consultant
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* DIAGNOSIS */}

                      <TableCell>

                        <Box
                          sx={{
                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            maxWidth:
                              "100%",

                            px: 1.5,

                            py: 0.8,

                            borderRadius: 2,

                            bgcolor:
                              "#EFF6FF",

                            border:
                              "1px solid #BFDBFE",
                          }}
                        >

                          <Typography
                            fontWeight={600}
                            fontSize={13}

                            sx={{
                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",
                            }}
                          >

                            {
                              consultation
                                .diagnosis ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* MEDICINES */}

                      <TableCell
                        align="center"
                      >

                        <Box
                          sx={{
                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            gap: 0.8,

                            px: 1.5,

                            py: 0.7,

                            borderRadius: 2,

                            bgcolor:
                              "#ECFDF5",

                            border:
                              "1px solid #A7F3D0",
                          }}
                        >

                          <MedicalServicesRoundedIcon
                            sx={{
                              fontSize: 16,
                              color:
                                "#059669",
                            }}
                          />

                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >

                            {
                              Array.isArray(
                                consultation.prescription
                              )
                                ? consultation
                                    .prescription
                                    .length
                                : 0
                            }{" "}
                            Medicines

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* TESTS */}

                      <TableCell
                        align="center"
                      >

                        <Box
                          sx={{
                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            gap: 0.8,

                            px: 1.5,

                            py: 0.7,

                            borderRadius: 2,

                            bgcolor:
                              "#F8FAFC",

                            border:
                              "1px solid #CBD5E1",
                          }}
                        >

                          <BiotechRoundedIcon
                            sx={{
                              fontSize: 16,
                              color:
                                "#64748B",
                            }}
                          />

                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >

                            {
                              Array.isArray(
                                consultation
                                  .recommendedTests
                              )
                                ? consultation
                                    .recommendedTests
                                    .length
                                : 0
                            }{" "}
                            Tests

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell
                        align="center"
                      >

                        <Box
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "center",
                          }}
                        >

                          <ActionButtons

                            onView={() =>
                              handleView(
                                consultation
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                consultation
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                consultation._id
                              )
                            }

                          />

                        </Box>

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
          ADD / EDIT
      ========================= */}

      <FormDialog
        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Consultation"
            : "New Consultation"
        }

        submitText={
          editingId
            ? "Update Consultation"
            : "Save Consultation"
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
              md: "repeat(2,1fr)",
            },

            gap: 3,

            mt: 3,
          }}
        >

          {/* OPD */}

          <TextField
            select
            label="OPD Visit"
            name="opdVisit"
            value={
              formData.opdVisit
            }
            onChange={
              handleChange
            }
            sx={
              textFieldStyle
            }
          >

            {opdVisits.map(
              (visit) => (

                <MenuItem
                  key={
                    visit._id
                  }
                  value={
                    visit._id
                  }
                >

                  {
                    visit.visitId
                  }

                </MenuItem>

              )
            )}

          </TextField>


          {/* PATIENT */}

          <TextField
            select
            label="Patient"
            name="patient"
            value={
              formData.patient
            }
            onChange={
              handleChange
            }
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
            label="Doctor"
            name="doctor"
            value={
              formData.doctor
            }
            onChange={
              handleChange
            }
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


          {/* DIAGNOSIS */}

          <TextField
            label="Diagnosis"
            name="diagnosis"
            value={
              formData.diagnosis
            }
            onChange={
              handleChange
            }
            placeholder="Enter Diagnosis"
            sx={
              textFieldStyle
            }

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <DescriptionRoundedIcon
                    color="primary"
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* NOTES */}

          <TextField
            label="Notes"
            name="notes"
            value={
              formData.notes
            }
            onChange={
              handleChange
            }
            placeholder="Enter Notes"
            sx={
              textFieldStyle
            }

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <NotesRoundedIcon
                    color="primary"
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* MEDICINE */}

          <TextField
            label="Medicine"
            name="medicine"
            value={
              formData.medicine
            }
            onChange={
              handleChange
            }
            placeholder="Paracetamol"
            sx={
              textFieldStyle
            }

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <MedicationRoundedIcon
                    color="primary"
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* DOSAGE */}

          <TextField
            label="Dosage"
            name="dosage"
            value={
              formData.dosage
            }
            onChange={
              handleChange
            }
            placeholder="500 mg"
            sx={
              textFieldStyle
            }

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <MedicationRoundedIcon
                    color="primary"
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* DURATION */}

          <TextField
            label="Duration"
            name="duration"
            value={
              formData.duration
            }
            onChange={
              handleChange
            }
            placeholder="5 Days"
            sx={
              textFieldStyle
            }

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <AccessTimeRoundedIcon
                    color="primary"
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* TESTS */}

          <TextField
            label="Recommended Tests"
            name="recommendedTests"
            value={
              formData.recommendedTests
            }
            onChange={
              handleChange
            }
            placeholder="Blood Test, X-Ray"
            sx={
              textFieldStyle
            }

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <BiotechRoundedIcon
                    color="primary"
                  />
                </InputAdornment>
              ),
            }}
          />

        </Box>

      </FormDialog>


      {/* =========================
          VIEW
      ========================= */}

      <FormDialog
        open={viewOpen}

        onClose={() =>
          setViewOpen(false)
        }

        title="Consultation Details"

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
            label="Consultation ID"
            value={
              selectedConsultation
                ?.consultationId ||
              "-"
            }
          />


          <DetailBox
            label="Patient"
            value={`${selectedConsultation?.patient?.firstName || ""} ${
              selectedConsultation?.patient?.lastName || ""
            }`}
          />


          <DetailBox
            label="Doctor"
            value={
              selectedConsultation
                ?.doctor?.name ||
              "-"
            }
          />


          <DetailBox
            label="Diagnosis"
            value={
              selectedConsultation
                ?.diagnosis ||
              "-"
            }
          />


          <DetailBox
            label="Notes"
            value={
              selectedConsultation
                ?.notes ||
              "-"
            }
          />


          <DetailBox
            label="Medicine"
            value={
              selectedConsultation
                ?.prescription?.[0]
                ?.medicine ||
              "-"
            }
          />


          <DetailBox
            label="Dosage"
            value={
              selectedConsultation
                ?.prescription?.[0]
                ?.dosage ||
              "-"
            }
          />


          <DetailBox
            label="Duration"
            value={
              selectedConsultation
                ?.prescription?.[0]
                ?.duration ||
              "-"
            }
          />


          <Box
            sx={{
              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },

              p: 2,

              border:
                "1px solid #E2E8F0",

              borderRadius: 2,

              bgcolor:
                "#F8FAFC",
            }}
          >

            <Typography
              fontSize={13}
              color="#94A3B8"
              fontWeight={700}
            >
              Recommended Tests
            </Typography>

            <Typography
              fontWeight={700}
              mt={0.5}
            >

              {
                selectedConsultation
                  ?.recommendedTests
                  ?.join(", ") ||
                "-"
              }

            </Typography>

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
        fontSize={13}
        color="#94A3B8"
        fontWeight={700}
      >
        {label}
      </Typography>

      <Typography
        fontWeight={700}
        mt={0.5}
        sx={{
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </Typography>

    </Box>

  );
}


export default Consultations;