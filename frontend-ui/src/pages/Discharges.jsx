import {
  useEffect,
  useState,
} from "react";

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
  Button,
} from "@mui/material";

import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";

import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";


const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#FFFFFF",

    "& fieldset": {
      borderColor: "#CBD5E1",
    },

    "&:hover fieldset": {
      borderColor: "#14B8A6",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#14B8A6",
      borderWidth: "2px",
    },
  },

  "& .MuiInputLabel-root": {
    fontWeight: 600,
    color: "#475569",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#0F766E",
  },

  "& .MuiInputBase-input": {
    fontSize: 14,
    fontWeight: 500,
  },
};


const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 2,
  bgcolor: "#F8FAFC",
};


function Discharges() {

  /* ================================
     DATA
  ================================= */

  const [discharges, setDischarges] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [patients, setPatients] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);

  const [admissionsList, setAdmissionsList] =
    useState([]);


  /* ================================
     SEARCH / FILTER / SORT
  ================================= */

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("latest");


  /* ================================
     DIALOGS
  ================================= */

  const [open, setOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [selectedDischarge, setSelectedDischarge] =
    useState(null);


  /* ================================
     FORM
  ================================= */

  const [formData, setFormData] = useState({

    admission: "",
    patient: "",
    doctor: "",
    diagnosis: "",
    treatmentGiven: "",
    medications: "",
    followUpDate: "",
    summary: "",

  });


  /* ================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {

    fetchDischarges();
    fetchPatients();
    fetchDoctors();
    fetchAdmissionsList();

  }, []);


  /* ================================
     FETCH PATIENTS
  ================================= */

  const fetchPatients = async () => {

    try {

      const res =
        await API.get("/patients");

      setPatients(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load patients"
      );

    }

  };


  /* ================================
     FETCH DOCTORS
  ================================= */

  const fetchDoctors = async () => {

    try {

      const res =
        await API.get("/doctors");

      setDoctors(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load doctors"
      );

    }

  };


  /* ================================
     FETCH ADMISSIONS
  ================================= */

  const fetchAdmissionsList = async () => {

    try {

      const res =
        await API.get("/admissions");

      setAdmissionsList(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load admissions"
      );

    }

  };


  /* ================================
     FETCH DISCHARGES
  ================================= */

  const fetchDischarges = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/discharges");

      setDischarges(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load discharges"
      );

    } finally {

      setLoading(false);

    }

  };


  /* ================================
     FORM CHANGE
  ================================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };


  /* ================================
     SUBMIT
  ================================= */

  const handleSubmit = async () => {

    try {

      const payload = {

        ...formData,

        medications:
          formData.medications
            .split(",")
            .map(
              (m) => m.trim()
            )
            .filter(Boolean),

      };


      if (editingId) {

        await API.put(
          `/discharges/${editingId}`,
          payload
        );

        toast.success(
          "Discharge updated successfully"
        );

      } else {

        await API.post(
          "/discharges",
          payload
        );

        toast.success(
          "Discharge created successfully"
        );

      }


      setOpen(false);

      setEditingId(null);

      setFormData({

        admission: "",
        patient: "",
        doctor: "",
        diagnosis: "",
        treatmentGiven: "",
        medications: "",
        followUpDate: "",
        summary: "",

      });

      fetchDischarges();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save discharge"
      );

    }

  };


  /* ================================
     VIEW
  ================================= */

  const handleView = (item) => {

    setSelectedDischarge(item);

    setViewOpen(true);

  };


  /* ================================
     EDIT
  ================================= */

  const handleEdit = (item) => {

    setEditingId(
      item._id
    );

    setFormData({

      admission:
        item.admission?._id ||
        "",

      patient:
        item.patient?._id ||
        "",

      doctor:
        item.doctor?._id ||
        "",

      diagnosis:
        item.diagnosis ||
        item.finalDiagnosis ||
        "",

      treatmentGiven:
        item.treatmentGiven ||
        "",

      medications:
        item.medications?.join(", ") ||
        "",

      followUpDate:
        item.followUpDate
          ? item.followUpDate.substring(
              0,
              10
            )
          : "",

      summary:
        item.summary ||
        "",

    });

    setOpen(true);

  };


  /* ================================
     DELETE
  ================================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this discharge?"
      )
    ) {
      return;
    }


    try {

      await API.delete(
        `/discharges/${id}`
      );

      toast.success(
        "Discharge deleted successfully"
      );

      fetchDischarges();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Delete failed"
      );

    }

  };


  /* ================================
     STATS
  ================================= */

  const stats = [

    {
      label: "Discharges",

      value:
        discharges.length,

      icon:
        <ExitToAppRoundedIcon />,
    },


    {
      label: "Completed",

      value:
        discharges.filter(
          (d) =>
            d.status ===
            "Completed"
        ).length,

      icon:
        <CheckCircleRoundedIcon />,
    },


    {
      label: "Doctors",

      value:
        new Set(
          discharges
            .map(
              (d) =>
                d.doctor?.name
            )
            .filter(Boolean)
        ).size,

      icon:
        <LocalHospitalRoundedIcon />,
    },


    {
      label: "Summaries",

      value:
        discharges.filter(
          (d) =>
            d.summary
        ).length,

      icon:
        <AssignmentTurnedInRoundedIcon />,
    },

  ];


  /* ================================
     SEARCH + FILTER + SORT
  ================================= */

  const filteredDischarges =
    discharges

      .filter((item) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const patientName =
          `${item.patient?.firstName || ""} ${
            item.patient?.lastName || ""
          }`.toLowerCase();


        const doctorName =
          (
            item.doctor?.name ||
            ""
          ).toLowerCase();


        const diagnosis =
          (
            item.finalDiagnosis ||
            item.diagnosis ||
            ""
          ).toLowerCase();


        const dischargeId =
          (
            item.dischargeId ||
            ""
          ).toLowerCase();


        const admissionId =
          (
            item.admission?.admissionId ||
            ""
          ).toLowerCase();


        const treatment =
          (
            item.treatmentGiven ||
            ""
          ).toLowerCase();


        const matchesSearch =
          !text ||

          patientName.includes(
            text
          ) ||

          doctorName.includes(
            text
          ) ||

          diagnosis.includes(
            text
          ) ||

          dischargeId.includes(
            text
          ) ||

          admissionId.includes(
            text
          ) ||

          treatment.includes(
            text
          );


        if (!matchesSearch) {
          return false;
        }


        /* STATUS FILTER */

        if (
          filter === "completed"
        ) {

          return (
            item.status ===
            "Completed"
          );

        }


        if (
          filter === "pending"
        ) {

          return (
            item.status !==
            "Completed"
          );

        }


        return true;

      })


      /* SORT */

      .sort((a, b) => {

        if (
          sort === "name"
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
          sort === "oldest"
        ) {

          return (
            new Date(
              a.dischargeDate ||
              a.createdAt ||
              0
            ) -

            new Date(
              b.dischargeDate ||
              b.createdAt ||
              0
            )
          );

        }


        return (

          new Date(
            b.dischargeDate ||
            b.createdAt ||
            0
          ) -

          new Date(
            a.dischargeDate ||
            a.createdAt ||
            0
          )

        );

      });


  /* ================================
     RENDER
  ================================= */

  return (

    <DashboardLayout>

      {/* HEADER */}

      <PageHeader
        title="Discharges"
        subtitle="Manage patient discharge summaries"

        buttonText="New Discharge"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            admission: "",
            patient: "",
            doctor: "",
            diagnosis: "",
            treatmentGiven: "",
            medications: "",
            followUpDate: "",
            summary: "",

          });

          setOpen(true);

        }}
      />


      {/* STATS */}

      <ModuleStats
        stats={stats}
      />


      {/* ==============================
          SEARCH / FILTER / SORT
      =============================== */}

      <Paper
        elevation={0}

        sx={{

          mt: 3,
          mb: 3,
          p: 2,

          borderRadius: 4,

          border:
            "1px solid #E5E7EB",

          boxShadow:
            "0 8px 24px rgba(15,23,42,.05)",

        }}
      >

        <Box
          sx={{

            display: "flex",

            alignItems:
              "center",

            gap: 1.5,

            flexWrap: {
              xs: "wrap",
              md: "nowrap",
            },

          }}
        >

          {/* SEARCH */}

          <TextField

            fullWidth
            size="small"

            placeholder=
              "Search patient, doctor, diagnosis..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            InputProps={{
              startAdornment: (

                <InputAdornment
                  position="start"
                >

                  <SearchRoundedIcon
                    sx={{
                      color:
                        "#94A3B8",
                    }}
                  />

                </InputAdornment>

              ),
            }}

            sx={{

              flex: 1,

              minWidth: {
                xs: "100%",
                md: 300,
              },

              "& .MuiOutlinedInput-root": {

                height: 42,

                borderRadius: 3,

                bgcolor:
                  "#F8FAFC",

                "& fieldset": {
                  borderColor:
                    "#E2E8F0",
                },

                "&:hover fieldset": {
                  borderColor:
                    "#14B8A6",
                },

                "&.Mui-focused fieldset": {
                  borderColor:
                    "#14B8A6",
                },

              },

            }}

          />


          {/* FILTER */}

          <TextField

            select

            size="small"

            value={filter}

            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }

            sx={{

              width: {
                xs: "100%",
                sm: 180,
                md: 180,
              },

              "& .MuiOutlinedInput-root": {

                height: 42,

                borderRadius: 3,

              },

            }}

            InputProps={{
              startAdornment: (

                <InputAdornment
                  position="start"
                >

                  <FilterListRoundedIcon
                    sx={{
                      color:
                        "#64748B",
                    }}
                  />

                </InputAdornment>

              ),
            }}

          >

            <MenuItem value="all">
              All Discharges
            </MenuItem>

            <MenuItem value="completed">
              Completed
            </MenuItem>

            <MenuItem value="pending">
              Pending
            </MenuItem>

          </TextField>


          {/* SORT */}

          <TextField

            select

            size="small"

            value={sort}

            onChange={(e) =>
              setSort(
                e.target.value
              )
            }

            sx={{

              width: {
                xs: "100%",
                sm: 150,
                md: 150,
              },

              "& .MuiOutlinedInput-root": {

                height: 42,

                borderRadius: 3,

              },

            }}

          >

            <MenuItem value="latest">
              Latest
            </MenuItem>

            <MenuItem value="name">
              Name A-Z
            </MenuItem>

            <MenuItem value="oldest">
              Oldest
            </MenuItem>

          </TextField>


          {/* CLEAR */}

          {(search ||
            filter !== "all" ||
            sort !== "latest") && (

            <Button

              variant="text"

              onClick={() => {

                setSearch("");
                setFilter("all");
                setSort("latest");

              }}

              sx={{

                height: 42,

                minWidth: 70,

                textTransform:
                  "none",

                color:
                  "#0F766E",

                fontWeight: 700,

              }}

            >

              Clear

            </Button>

          )}

        </Box>

      </Paper>


      {/* ==============================
          TABLE
      =============================== */}

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

            overflowX:
              "auto",

            boxShadow:
              "0 8px 24px rgba(15,23,42,.05)",

          }}

        >

          <Table

            sx={{

              width: "100%",

              minWidth: 1050,

              tableLayout:
                "fixed",

            }}

          >

            <TableHead>

              <TableRow

                sx={{

                  bgcolor:
                    "#F8FAFC",

                  "& .MuiTableCell-head": {

                    fontWeight:
                      "700 !important",

                    fontSize: 12,

                    color:
                      "#1E293B",

                    textTransform:
                      "uppercase",

                    letterSpacing:
                      ".5px",

                    borderBottom:
                      "1px solid #E2E8F0",

                  },

                }}

              >

                <TableCell
                  sx={{
                    width: "25%",
                  }}
                >
                  PATIENT
                </TableCell>


                <TableCell
                  sx={{
                    width: "21%",
                  }}
                >
                  DOCTOR
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "14%",
                  }}
                >
                  ADMISSION
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "14%",
                  }}
                >
                  DATE
                </TableCell>


                <TableCell
                  sx={{
                    width: "14%",
                  }}
                >
                  DIAGNOSIS
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                  }}
                >
                  STATUS
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredDischarges.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <ExitToAppRoundedIcon
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
                      No Discharges Found
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

                filteredDischarges.map(
                  (item) => (

                    <TableRow

                      key={
                        item._id
                      }

                      hover

                      sx={{

                        height: 78,

                        "& td": {

                          py: 1.5,

                          px: 2,

                          verticalAlign:
                            "middle",

                          borderBottom:
                            "1px solid #EEF2F7",

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

                            gap: 2,

                          }}
                        >

                          <Avatar
                            sx={{

                              width: 40,
                              height: 40,

                              fontSize: 13,

                              fontWeight: 700,

                              color: "#fff",

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                              flexShrink: 0,

                            }}
                          >

                            {
                              item.patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              item.patient
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

                                color:
                                  "#0F172A",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",

                              }}
                            >

                              {
                                item.patient
                                  ?.firstName
                              }{" "}

                              {
                                item.patient
                                  ?.lastName
                              }

                            </Typography>


                            <Typography
                              sx={{

                                fontSize: 12,

                                color:
                                  "#94A3B8",

                                mt: .3,

                              }}
                            >

                              Discharge ID:{" "}

                              {
                                item.dischargeId ||
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

                              width: 36,
                              height: 36,

                              bgcolor:
                                "#ECFDF5",

                              color:
                                "#059669",

                              fontSize: 13,

                              fontWeight: 700,

                              flexShrink: 0,

                            }}
                          >

                            {
                              item.doctor
                                ?.name
                                ?.charAt(0) ||
                              "D"
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

                                fontSize: 13,

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",

                              }}
                            >

                              Dr.{" "}

                              {
                                item.doctor
                                  ?.name ||
                                "-"
                              }

                            </Typography>


                            <Typography
                              sx={{

                                fontSize: 11,

                                color:
                                  "#64748B",

                                mt: .2,

                              }}
                            >
                              Consultant
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* ADMISSION */}

                      <TableCell
                        align="center"
                      >

                        <Box
                          sx={{

                            display:
                              "inline-flex",

                            px: 1.5,

                            py: .6,

                            borderRadius: 2,

                            bgcolor:
                              "#EFF6FF",

                            border:
                              "1px solid #BFDBFE",

                            maxWidth:
                              "100%",

                          }}
                        >

                          <Typography
                            sx={{

                              fontWeight: 600,

                              fontSize: 12,

                              whiteSpace:
                                "nowrap",

                            }}
                          >

                            {
                              item.admission
                                ?.admissionId ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* DATE */}

                      <TableCell
                        align="center"
                      >

                        <Box
                          sx={{

                            display:
                              "inline-flex",

                            px: 1.5,

                            py: .6,

                            borderRadius: 2,

                            bgcolor:
                              "#F8FAFC",

                            border:
                              "1px solid #E2E8F0",

                          }}
                        >

                          <Typography
                            sx={{

                              fontWeight: 600,

                              fontSize: 12,

                              whiteSpace:
                                "nowrap",

                            }}
                          >

                            {
                              item.dischargeDate

                                ? new Date(
                                    item.dischargeDate
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )

                                : "-"

                            }

                          </Typography>

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

                            px: 1.5,

                            py: .6,

                            borderRadius: 2,

                            bgcolor:
                              "#FFFBEB",

                            border:
                              "1px solid #FCD34D",

                            maxWidth:
                              "100%",

                          }}
                        >

                          <Typography
                            sx={{

                              fontWeight: 600,

                              fontSize: 12,

                              color:
                                "#92400E",

                              whiteSpace:
                                "nowrap",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                            }}
                          >

                            {
                              item.finalDiagnosis ||
                              item.diagnosis ||
                              "General Checkup"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* STATUS */}

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

                          <StatusChip
                            status={
                              item.status ||
                              "Completed"
                            }
                          />

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
                                item
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                item
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                item._id
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


      {/* ==============================
          ADD / EDIT DIALOG
      =============================== */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Discharge"
            : "New Discharge"
        }

        submitText={
          editingId
            ? "Update Discharge"
            : "Save Discharge"
        }

        onSubmit={
          handleSubmit
        }

      >

        <Box
          sx={{

            display:
              "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 2.5,

            mt: 3,

          }}
        >

          <TextField
            select
            fullWidth
            label="Admission"
            name="admission"

            value={
              formData.admission
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }
          >

            {admissionsList.map(
              (admission) => (

                <MenuItem
                  key={
                    admission._id
                  }

                  value={
                    admission._id
                  }
                >

                  {
                    admission.admissionId
                  }

                </MenuItem>

              )
            )}

          </TextField>


          <TextField
            select
            fullWidth
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


          <TextField
            select
            fullWidth
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


          <TextField
            fullWidth
            label="Diagnosis"
            name="diagnosis"

            value={
              formData.diagnosis
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }
          />


          <Box>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#475569",
                mb: 1,
              }}
            >
              Treatment Given
            </Typography>

            <TextField
              fullWidth
              label="Enter given Treatment"

              name="treatmentGiven"

              value={
                formData.treatmentGiven
              }

              onChange={
                handleChange
              }

              sx={
                textFieldStyle
              }
            />

          </Box>


          <Box>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#475569",
                mb: 1,
              }}
            >
              Follow Up Date
            </Typography>

            <TextField
              fullWidth
              type="date"

              name="followUpDate"

              value={
                formData.followUpDate
              }

              onChange={
                handleChange
              }

              sx={
                textFieldStyle
              }

            />

          </Box>


          <TextField
            fullWidth

            label="Medications"

            name="medications"

            value={
              formData.medications
            }

            onChange={
              handleChange
            }

            placeholder=
              "Paracetamol, Vitamin C, Antibiotic"

            sx={{

              ...textFieldStyle,

              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },

            }}

          />


          <TextField
            fullWidth

            multiline
            rows={4}

            label="Summary"

            name="summary"

            value={
              formData.summary
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

          />

        </Box>

      </FormDialog>


      {/* ==============================
          VIEW DIALOG
      =============================== */}

      <FormDialog

        open={viewOpen}

        onClose={() =>
          setViewOpen(false)
        }

        title="Discharge Details"

        hideSubmit

      >

        <Box
          sx={{

            display:
              "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 2.5,

            mt: 3,

          }}
        >

          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Discharge ID
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.dischargeId ||
                "-"
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Admission
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.admission
                  ?.admissionId ||
                "-"
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Patient
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.patient
                  ?.firstName
              }{" "}

              {
                selectedDischarge
                  ?.patient
                  ?.lastName
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Doctor
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.doctor
                  ?.name ||
                "-"
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Diagnosis
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.diagnosis ||
                selectedDischarge
                  ?.finalDiagnosis ||
                "-"
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Treatment Given
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.treatmentGiven ||
                "-"
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Medications
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.medications
                  ?.join(", ") ||
                "-"
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Follow Up Date
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedDischarge
                  ?.followUpDate

                  ? new Date(
                      selectedDischarge
                        .followUpDate
                    ).toLocaleDateString(
                      "en-IN"
                    )

                  : "-"
              }

            </Typography>

          </Box>


          <Box
            sx={{

              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },

              ...viewBoxStyle,

            }}
          >

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              Summary
            </Typography>

            <Typography mt={.5}>

              {
                selectedDischarge
                  ?.summary ||
                "-"
              }

            </Typography>

          </Box>


          <Box
            sx={{

              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },

              ...viewBoxStyle,

            }}
          >

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94A3B8",
                mb: 1,
              }}
            >
              Status
            </Typography>

            <StatusChip
              status={
                selectedDischarge
                  ?.status ||
                "Completed"
              }
            />

          </Box>

        </Box>

      </FormDialog>

    </DashboardLayout>

  );

}


export default Discharges;