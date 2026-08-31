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

import BedroomParentRoundedIcon from "@mui/icons-material/BedroomParentRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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

import { useSearchParams } from "react-router-dom";


const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
  },
};


const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 2,
  bgcolor: "#F8FAFC",
};


const viewLabelStyle = {
  fontSize: 13,
  color: "#94A3B8",
  fontWeight: 700,
  mb: 1,
};


function Admissions() {

  /* ================================
     DATA
  ================================= */

  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

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
  const [selectedAdmission, setSelectedAdmission] = useState(null);


  const [searchParams] = useSearchParams();


  /* ================================
     FORM
  ================================= */

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    ward: "",
    bedNumber: "",
    reason: "",
    status: "Admitted",
  });


  /* ================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {

    fetchAdmissions();
    fetchPatients();
    fetchDoctors();

    if (searchParams.get("add") === "true") {

      setEditingId(null);

      setFormData({
        patient: "",
        doctor: "",
        ward: "",
        bedNumber: "",
        reason: "",
        status: "Admitted",
      });

      setOpen(true);
    }

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
        err.response?.data?.message ||
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
        err.response?.data?.message ||
        "Failed to load doctors"
      );

    }

  };


  /* ================================
     FETCH ADMISSIONS
  ================================= */

  const fetchAdmissions = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/admissions");

      setAdmissions(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to load admissions"
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
          `/admissions/${editingId}`,
          formData
        );

        toast.success(
          "Admission updated successfully"
        );

      } else {

        await API.post(
          "/admissions",
          formData
        );

        toast.success(
          "Admission created successfully"
        );

      }


      setOpen(false);
      setEditingId(null);

      setFormData({
        patient: "",
        doctor: "",
        ward: "",
        bedNumber: "",
        reason: "",
        status: "Admitted",
      });

      fetchAdmissions();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save admission"
      );

    }

  };


  /* ================================
     VIEW
  ================================= */

  const handleView = (admission) => {

    setSelectedAdmission(admission);

    setViewOpen(true);

  };


  /* ================================
     EDIT
  ================================= */

  const handleEdit = (admission) => {

    setEditingId(
      admission._id
    );

    setFormData({

      patient:
        admission.patient?._id || "",

      doctor:
        admission.doctor?._id || "",

      ward:
        admission.ward || "",

      bedNumber:
        admission.bedNumber || "",

      reason:
        admission.reason || "",

      status:
        admission.status || "Admitted",

    });

    setOpen(true);

  };


  /* ================================
     DELETE
  ================================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this admission?"
      )
    ) {
      return;
    }


    try {

      await API.delete(
        `/admissions/${id}`
      );

      toast.success(
        "Admission deleted successfully"
      );

      fetchAdmissions();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to delete admission"
      );

    }

  };


  /* ================================
     STATS
  ================================= */

  const stats = [

    {
      label: "Admissions",

      value:
        admissions.length,

      icon:
        <BedroomParentRoundedIcon />,
    },


    {
      label: "Active",

      value:
        admissions.filter(
          (a) =>
            a.status === "Admitted"
        ).length,

      icon:
        <CheckCircleRoundedIcon />,
    },


    {
      label: "Wards",

      value:
        new Set(
          admissions
            .map(
              (a) => a.ward
            )
            .filter(Boolean)
        ).size,

      icon:
        <MeetingRoomRoundedIcon />,
    },


    {
      label: "Doctors",

      value:
        new Set(
          admissions
            .map(
              (a) =>
                a.doctor?.name
            )
            .filter(Boolean)
        ).size,

      icon:
        <LocalHospitalRoundedIcon />,
    },

  ];


  /* ================================
     SEARCH + FILTER + SORT
  ================================= */

  const filteredAdmissions =
    admissions

      .filter((admission) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const patientName =
          `${admission.patient?.firstName || ""} ${
            admission.patient?.lastName || ""
          }`.toLowerCase();


        const doctorName =
          (
            admission.doctor?.name ||
            ""
          ).toLowerCase();


        const ward =
          (
            admission.ward ||
            ""
          ).toLowerCase();


        const bed =
          (
            admission.bedNumber ||
            ""
          ).toLowerCase();


        const admissionId =
          (
            admission.admissionId ||
            ""
          ).toLowerCase();


        const reason =
          (
            admission.reason ||
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

          ward.includes(
            text
          ) ||

          bed.includes(
            text
          ) ||

          admissionId.includes(
            text
          ) ||

          reason.includes(
            text
          );


        if (!matchesSearch) {
          return false;
        }


        /* STATUS FILTER */

        if (
          filter === "active"
        ) {

          return (
            admission.status ===
            "Admitted"
          );

        }


        if (
          filter === "discharged"
        ) {

          return (
            admission.status ===
            "Discharged"
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
        title="Admissions"
        subtitle="Manage inpatient admissions"
        icon={
          <BedroomParentRoundedIcon />
        }
        buttonText="New Admission"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({
            patient: "",
            doctor: "",
            ward: "",
            bedNumber: "",
            reason: "",
            status: "Admitted",
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

            placeholder="Search patient, doctor, ward, bed..."

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
              All Admissions
            </MenuItem>

            <MenuItem value="active">
              Active
            </MenuItem>

            <MenuItem value="discharged">
              Discharged
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

              minWidth: 900,

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
                      "0.5px",

                    borderBottom:
                      "1px solid #E2E8F0",
                  },
                }}
              >

                <TableCell
                  sx={{
                    width: "27%",
                  }}
                >
                  PATIENT
                </TableCell>


                <TableCell
                  sx={{
                    width: "25%",
                  }}
                >
                  DOCTOR
                </TableCell>


                <TableCell
                  sx={{
                    width: "20%",
                  }}
                >
                  WARD / BED
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "14%",
                  }}
                >
                  STATUS
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "14%",
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredAdmissions.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <BedroomParentRoundedIcon
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
                      No Admissions Found
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

                filteredAdmissions.map(
                  (admission) => (

                    <TableRow
                      key={
                        admission._id
                      }

                      hover

                      sx={{
                        height: 72,

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
                              width: 38,
                              height: 38,

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                              fontWeight: 700,

                              fontSize: 13,

                              flexShrink: 0,
                            }}
                          >

                            {
                              admission.patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              admission.patient
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

                                lineHeight: 1.2,

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >

                              {
                                admission.patient
                                  ?.firstName
                              }{" "}

                              {
                                admission.patient
                                  ?.lastName
                              }

                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,

                                fontWeight: 500,

                                color:
                                  "#94A3B8",

                                mt: 0.4,
                              }}
                            >

                              {
                                admission.admissionId ||
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
                              width: 34,
                              height: 34,

                              fontSize: 13,

                              bgcolor:
                                "#ECFDF5",

                              color:
                                "#059669",

                              fontWeight: 700,

                              flexShrink: 0,
                            }}
                          >

                            {
                              admission.doctor
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
                                admission.doctor
                                  ?.name ||
                                "-"
                              }

                            </Typography>


                            <Typography
                              sx={{
                                fontSize: 12,

                                fontWeight: 500,

                                color:
                                  "#94A3B8",

                                mt: 0.3,
                              }}
                            >
                              Consultant
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* WARD */}

                      <TableCell>

                        <Box
                          sx={{
                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            gap: 1,

                            px: 1.5,

                            py: 0.5,

                            borderRadius: 2,

                            bgcolor:
                              "#EFF6FF",

                            border:
                              "1px solid #BFDBFE",

                            maxWidth:
                              "100%",
                          }}
                        >

                          <MeetingRoomRoundedIcon
                            fontSize="small"
                            sx={{
                              flexShrink: 0,
                            }}
                          />

                          <Typography
                            sx={{
                              fontWeight: 600,

                              fontSize: 12,

                              whiteSpace:
                                "nowrap",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",
                            }}
                          >

                            {
                              admission.ward ||
                              "-"
                            }

                            {" • "}

                            {
                              admission.bedNumber ||
                              "-"
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
                              admission.status ||
                              "Admitted"
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
                                admission
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                admission
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                admission._id
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
            ? "Edit Admission"
            : "New Admission"
        }

        submitText={
          editingId
            ? "Update Admission"
            : "Save Admission"
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
            label="Ward"
            name="ward"

            value={
              formData.ward
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }
          />


          <TextField
            fullWidth
            label="Bed Number"
            name="bedNumber"

            value={
              formData.bedNumber
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }
          />


          <TextField
            fullWidth
            label="Reason"
            name="reason"

            multiline
            rows={4}

            value={
              formData.reason
            }

            onChange={
              handleChange
            }

            sx={{
              gridColumn: {
                xs: "span 1",
                md: "span 2",
              },

              ...textFieldStyle,
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

            sx={
              textFieldStyle
            }
          >

            <MenuItem value="Admitted">
              Admitted
            </MenuItem>

            <MenuItem value="Discharged">
              Discharged
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

        title="Admission Details"

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

          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Admission ID
            </Typography>

            <Typography fontWeight={700}>
              {
                selectedAdmission
                  ?.admissionId ||
                "-"
              }
            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Patient
            </Typography>

            <Typography fontWeight={700}>

              {
                selectedAdmission
                  ?.patient
                  ?.firstName
              }{" "}

              {
                selectedAdmission
                  ?.patient
                  ?.lastName
              }

            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Doctor
            </Typography>

            <Typography fontWeight={700}>

              {
                selectedAdmission
                  ?.doctor
                  ?.name ||
                "-"
              }

            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Ward
            </Typography>

            <Typography fontWeight={700}>

              {
                selectedAdmission
                  ?.ward ||
                "-"
              }

            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Bed Number
            </Typography>

            <Typography fontWeight={700}>

              {
                selectedAdmission
                  ?.bedNumber ||
                "-"
              }

            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Reason
            </Typography>

            <Typography fontWeight={700}>

              {
                selectedAdmission
                  ?.reason ||
                "-"
              }

            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Status
            </Typography>

            <StatusChip
              status={
                selectedAdmission
                  ?.status ||
                "Admitted"
              }
            />

          </Box>

        </Box>

      </FormDialog>

    </DashboardLayout>

  );

}


export default Admissions;