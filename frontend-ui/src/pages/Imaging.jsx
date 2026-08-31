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

import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CameraIndoorRoundedIcon from "@mui/icons-material/CameraIndoorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
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


function Imaging() {

  /* ================================
     DATA
  ================================= */

  const [imagings, setImagings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [consultations, setConsultations] = useState([]);

  /* ================================
     LOADING
  ================================= */

  const [loading, setLoading] = useState(true);

  /* ================================
     SEARCH / FILTER / SORT
  ================================= */

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");

  /* ================================
     DIALOGS
  ================================= */

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedImaging, setSelectedImaging] = useState(null);

  /* ================================
     FORM
  ================================= */

  const [formData, setFormData] = useState({
    consultation: "",
    patient: "",
    doctor: "",
    imagingType: "",
    findings: "",
    status: "Ordered",
  });


  /* ================================
     LOAD DATA
  ================================= */

  useEffect(() => {

    fetchImagings();
    fetchPatients();
    fetchDoctors();
    fetchConsultations();

  }, []);


  /* ================================
     FETCH IMAGING
  ================================= */

  const fetchImagings = async () => {

    try {

      setLoading(true);

      const res = await API.get("/imaging");

      setImagings(res.data.data || []);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load imaging records"
      );

    } finally {

      setLoading(false);

    }

  };


  /* ================================
     FETCH PATIENTS
  ================================= */

  const fetchPatients = async () => {

    try {

      const res = await API.get("/patients");

      setPatients(res.data.data || []);

    } catch (err) {

      console.log(err);

    }

  };


  /* ================================
     FETCH DOCTORS
  ================================= */

  const fetchDoctors = async () => {

    try {

      const res = await API.get("/doctors");

      setDoctors(res.data.data || []);

    } catch (err) {

      console.log(err);

    }

  };


  /* ================================
     FETCH CONSULTATIONS
  ================================= */

  const fetchConsultations = async () => {

    try {

      const res = await API.get("/consultations");

      setConsultations(res.data.data || []);

    } catch (err) {

      console.log(err);

    }

  };


  /* ================================
     FORM CHANGE
  ================================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  /* ================================
     SUBMIT
  ================================= */

  const handleSubmit = async () => {

    try {

      if (editingId) {

        await API.put(
          `/imaging/${editingId}`,
          formData
        );

        toast.success(
          "Imaging updated successfully"
        );

      } else {

        await API.post(
          "/imaging",
          formData
        );

        toast.success(
          "Imaging created successfully"
        );

      }


      setOpen(false);
      setEditingId(null);

      setFormData({
        consultation: "",
        patient: "",
        doctor: "",
        imagingType: "",
        findings: "",
        status: "Ordered",
      });

      fetchImagings();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );

    }

  };


  /* ================================
     EDIT
  ================================= */

  const handleEdit = (item) => {

    setEditingId(item._id);

    setFormData({
      consultation:
        item.consultation?._id || "",

      patient:
        item.patient?._id || "",

      doctor:
        item.doctor?._id || "",

      imagingType:
        item.imagingType ||
        item.testType ||
        "",

      findings:
        item.findings || "",

      status:
        item.status ||
        item.reportStatus ||
        "Ordered",
    });

    setOpen(true);

  };


  /* ================================
     VIEW
  ================================= */

  const handleView = (item) => {

    setSelectedImaging(item);

    setViewOpen(true);

  };


  /* ================================
     DELETE
  ================================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this imaging record?"
      )
    ) {

      return;

    }


    try {

      await API.delete(
        `/imaging/${id}`
      );

      toast.success(
        "Imaging deleted successfully"
      );

      fetchImagings();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to delete imaging"
      );

    }

  };


  /* ================================
     STATS
  ================================= */

  const stats = [

    {
      label: "Total Scans",

      value: imagings.length,

      icon:
        <CameraIndoorRoundedIcon />,
    },

    {
      label: "Completed",

      value:
        imagings.filter(
          (i) =>
            i.reportStatus === "Completed" ||
            i.status === "Completed"
        ).length,

      icon:
        <CheckCircleRoundedIcon />,
    },

    {
      label: "Pending",

      value:
        imagings.filter(
          (i) =>
            i.reportStatus !== "Completed" &&
            i.status !== "Completed"
        ).length,

      icon:
        <PendingActionsRoundedIcon />,
    },

    {
      label: "Radiologists",

      value:
        new Set(
          imagings
            .map(
              (i) =>
                i.doctor?.name
            )
            .filter(Boolean)
        ).size,

      icon:
        <MedicalServicesRoundedIcon />,
    },

  ];


  /* ================================
     SEARCH + FILTER + SORT
  ================================= */

  const filteredImagings = imagings

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
          item.doctor?.name || ""
        ).toLowerCase();


      const imagingType =
        (
          item.imagingType ||
          item.testType ||
          item.scanType ||
          ""
        ).toLowerCase();


      const imagingId =
        (
          item.imagingId || ""
        ).toLowerCase();


      const findings =
        (
          item.findings || ""
        ).toLowerCase();


      const matchesSearch =
        !text ||
        patientName.includes(text) ||
        doctorName.includes(text) ||
        imagingType.includes(text) ||
        imagingId.includes(text) ||
        findings.includes(text);


      if (!matchesSearch) {

        return false;

      }


      /* FILTER */

      const status =
        item.status ||
        item.reportStatus ||
        "Ordered";


      if (
        filter === "completed"
      ) {

        return status === "Completed";

      }


      if (
        filter === "pending"
      ) {

        return status !== "Completed";

      }


      if (
        filter === "ordered"
      ) {

        return status === "Ordered";

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

    });


  /* ================================
     RENDER
  ================================= */

  return (

    <DashboardLayout>

      {/* HEADER */}

      <PageHeader
        title="Imaging"
        subtitle="Manage radiology and imaging reports"
        icon={<CameraAltRoundedIcon />}
        buttonText="New Imaging"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({
            consultation: "",
            patient: "",
            doctor: "",
            imagingType: "",
            findings: "",
            status: "Ordered",
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

            alignItems: "center",

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

            placeholder="Search patient, doctor, scan or findings..."

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
                md: 280,
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
              All Imaging
            </MenuItem>

            <MenuItem value="completed">
              Completed
            </MenuItem>

            <MenuItem value="pending">
              Pending
            </MenuItem>

            <MenuItem value="ordered">
              Ordered
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

              minWidth: 1000,

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

                    fontSize: 13,

                    color:
                      "#1E293B",

                    textTransform:
                      "uppercase",

                    letterSpacing:
                      "0.5px",

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
                    width: "22%",
                  }}
                >
                  DOCTOR
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "20%",
                  }}
                >
                  SCAN
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "13%",
                  }}
                >
                  REPORT
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "10%",
                  }}
                >
                  STATUS
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "10%",
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredImagings.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <CameraAltRoundedIcon
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
                      No Imaging Records Found
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

                filteredImagings.map(
                  (item) => (

                    <TableRow
                      key={
                        item._id
                      }

                      hover

                      sx={{
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
                              width: 42,
                              height: 42,

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                              fontWeight: 700,

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
                                  "#64748B",

                                mt: 0.3,
                              }}
                            >

                              {
                                item.imagingId ||
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

                            gap: 2,
                          }}
                        >

                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,

                              bgcolor:
                                "#ECFDF5",

                              color:
                                "#059669",

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
                                fontSize: 14,

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >

                              {
                                item.doctor
                                  ?.name ||
                                "-"
                              }

                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,
                                color:
                                  "#64748B",
                              }}
                            >
                              Radiologist
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* SCAN */}

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

                          <Box
                            sx={{
                              display:
                                "inline-flex",

                              alignItems:
                                "center",

                              gap: 1,

                              px: 2,

                              py: 0.8,

                              borderRadius: 2,

                              bgcolor:
                                "#EFF6FF",

                              border:
                                "1px solid #BFDBFE",

                              maxWidth:
                                180,
                            }}
                          >

                            <CameraAltRoundedIcon
                              sx={{
                                color:
                                  "#2563EB",

                                fontSize:
                                  18,

                                flexShrink:
                                  0,
                              }}
                            />

                            <Typography
                              sx={{
                                fontWeight:
                                  600,

                                fontSize:
                                  13,

                                color:
                                  "#1E293B",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >

                              {
                                item.imagingType ||
                                item.testType ||
                                item.scanType ||
                                "X-Ray Chest"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* REPORT */}

                      <TableCell
                        align="center"
                      >

                        <Box
                          sx={{
                            display:
                              "inline-flex",

                            minWidth: 90,

                            justifyContent:
                              "center",

                            px: 1.5,

                            py: 0.7,

                            borderRadius: 2,

                            bgcolor:
                              "#F8FAFC",

                            border:
                              "1px solid #E2E8F0",
                          }}
                        >

                          <Typography
                            fontWeight={600}
                            fontSize={13}
                          >

                            {
                              item.createdAt
                                ? new Date(
                                    item.createdAt
                                  ).toLocaleDateString()
                                : "-"
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
                            item.status ||
                            item.reportStatus ||
                            "Pending"
                          }
                        />

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

                            alignItems:
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
            ? "Edit Imaging"
            : "New Imaging"
        }

        submitText={
          editingId
            ? "Update Imaging"
            : "Save Imaging"
        }

        onSubmit={
          handleSubmit
        }
      >

        <Box
          sx={{
            mt: 3,

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 2.5,
          }}
        >

          <TextField
            select
            fullWidth
            label="Consultation"
            name="consultation"
            value={
              formData.consultation
            }
            onChange={
              handleChange
            }
          >

            {consultations.map(
              (c) => (

                <MenuItem
                  key={c._id}
                  value={c._id}
                >
                  {
                    c.consultationId ||
                    c._id
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
            select
            fullWidth
            label="Imaging Type"
            name="imagingType"
            value={
              formData.imagingType
            }
            onChange={
              handleChange
            }
          >

            <MenuItem value="X-Ray">
              X-Ray
            </MenuItem>

            <MenuItem value="Ultrasound">
              Ultrasound
            </MenuItem>

            <MenuItem value="CT Scan">
              CT Scan
            </MenuItem>

            <MenuItem value="MRI">
              MRI
            </MenuItem>

            <MenuItem value="ECG">
              ECG
            </MenuItem>

          </TextField>


          <TextField
            fullWidth
            multiline
            rows={4}

            label="Findings"

            name="findings"

            value={
              formData.findings
            }

            onChange={
              handleChange
            }

            sx={{
              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },
            }}
          />


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
          >

            <MenuItem value="Ordered">
              Ordered
            </MenuItem>

            <MenuItem value="Completed">
              Completed
            </MenuItem>

          </TextField>

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

        title="Imaging Details"

        hideSubmit
      >

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 2.5,
          }}
        >

          <DetailBox
            label="Imaging ID"
            value={
              selectedImaging
                ?.imagingId
            }
          />


          <DetailBox
            label="Patient"
            value={
              `${selectedImaging?.patient?.firstName || ""} ${
                selectedImaging?.patient?.lastName || ""
              }`
            }
          />


          <DetailBox
            label="Doctor"
            value={
              selectedImaging
                ?.doctor?.name
            }
          />


          <DetailBox
            label="Imaging Type"
            value={
              selectedImaging
                ?.imagingType ||
              selectedImaging
                ?.testType ||
              selectedImaging
                ?.scanType
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

              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },
            }}
          >

            <Typography
              sx={{
                fontSize: 13,

                fontWeight: 700,

                color:
                  "#94A3B8",
              }}
            >
              Findings
            </Typography>


            <Typography
              fontWeight={700}
              mt={0.5}
            >

              {
                selectedImaging
                  ?.findings ||
                "-"
              }

            </Typography>

          </Box>


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

                fontWeight: 700,

                color:
                  "#94A3B8",

                mb: 1,
              }}
            >
              Status
            </Typography>


            <StatusChip
              status={
                selectedImaging
                  ?.status ||
                selectedImaging
                  ?.reportStatus ||
                "Pending"
              }
            />

          </Box>

        </Box>

      </FormDialog>

    </DashboardLayout>

  );
}


/* ================================
   DETAIL BOX
================================ */

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
        mt={0.5}
        fontWeight={700}
      >
        {value || "-"}
      </Typography>

    </Box>

  );
}


export default Imaging;