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

import ScienceIcon from "@mui/icons-material/Science";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";

import FormDialog from "../components/FormDialog";
import { toast } from "react-toastify";

import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import { useSearchParams } from "react-router-dom";


/* =========================================
   TEXT FIELD STYLE
========================================= */

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


/* =========================================
   LAB TESTS
========================================= */

function LabTests() {

  /* =========================================
     DATA
  ========================================= */

  const [tests, setTests] = useState([]);

  const [patients, setPatients] = useState([]);

  const [doctors, setDoctors] = useState([]);

  const [consultations, setConsultations] =
    useState([]);


  /* =========================================
     UI
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [open, setOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);


  /* =========================================
     SEARCH / FILTER / SORT
  ========================================= */

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("latest");


  /* =========================================
     EDIT / VIEW
  ========================================= */

  const [editingId, setEditingId] =
    useState(null);

  const [selectedTest, setSelectedTest] =
    useState(null);


  /* =========================================
     FORM
  ========================================= */

  const [formData, setFormData] =
    useState({

      consultation: "",
      patient: "",
      doctor: "",
      testName: "",
      status: "Ordered",
      result: "",

    });


  const [searchParams] =
    useSearchParams();


  /* =========================================
     LOAD DATA
  ========================================= */

  useEffect(() => {

    fetchLabTests();

    fetchPatients();

    fetchDoctors();

    fetchConsultations();


    if (
      searchParams.get("add") === "true"
    ) {

      setEditingId(null);

      setFormData({

        consultation: "",
        patient: "",
        doctor: "",
        testName: "",
        status: "Ordered",
        result: "",

      });

      setOpen(true);

    }

  }, []);


  /* =========================================
     FETCH LAB TESTS
  ========================================= */

  const fetchLabTests = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/lab-tests");

      setTests(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to load Lab Tests"
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================
     FETCH PATIENTS
  ========================================= */

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


  /* =========================================
     FETCH DOCTORS
  ========================================= */

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


  /* =========================================
     FETCH CONSULTATIONS
  ========================================= */

  const fetchConsultations = async () => {

    try {

      const res =
        await API.get("/consultations");

      setConsultations(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    }

  };


  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };


  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async () => {

    try {

      if (editingId) {

        await API.put(
          `/lab-tests/${editingId}`,
          formData
        );

        toast.success(
          "Lab Test updated successfully"
        );

      } else {

        await API.post(
          "/lab-tests",
          formData
        );

        toast.success(
          "Lab Test created successfully"
        );

      }


      setOpen(false);

      setEditingId(null);

      setFormData({

        consultation: "",
        patient: "",
        doctor: "",
        testName: "",
        status: "Ordered",
        result: "",

      });


      fetchLabTests();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );

    }

  };


  /* =========================================
     VIEW
  ========================================= */

  const handleView = (test) => {

    setSelectedTest(test);

    setViewOpen(true);

  };


  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this Lab Test?"
      )
    ) {

      return;

    }


    try {

      await API.delete(
        `/lab-tests/${id}`
      );

      toast.success(
        "Lab Test deleted successfully"
      );

      fetchLabTests();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to delete Lab Test"
      );

    }

  };


  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = (test) => {

    setEditingId(test._id);

    setFormData({

      consultation:
        test.consultation?._id || "",

      patient:
        test.patient?._id || "",

      doctor:
        test.doctor?._id || "",

      testName:
        test.testName || "",

      status:
        test.status || "Ordered",

      result:
        test.result || "",

    });

    setOpen(true);

  };


  /* =========================================
     STATS
  ========================================= */

  const stats = [

    {
      label: "Total Tests",

      value: tests.length,

      icon:
        <BiotechRoundedIcon />,
    },

    {
      label: "Completed",

      value:
        tests.filter(
          (t) =>
            t.status === "Completed"
        ).length,

      icon:
        <CheckCircleRoundedIcon />,
    },

    {
      label: "Pending",

      value:
        tests.filter(
          (t) =>
            t.status !== "Completed"
        ).length,

      icon:
        <PendingActionsRoundedIcon />,
    },

    {
      label: "Reports",

      value:
        tests.filter(
          (t) => t.result
        ).length,

      icon:
        <AssignmentRoundedIcon />,
    },

  ];


  /* =========================================
     SEARCH + FILTER + SORT
  ========================================= */

  const filteredTests = tests
    .filter((test) => {

      const text =
        search
          .toLowerCase()
          .trim();


      const patientName =
        `${test.patient?.firstName || ""} ${
          test.patient?.lastName || ""
        }`.toLowerCase();


      const doctorName =
        (
          test.doctor?.name || ""
        ).toLowerCase();


      const testName =
        (
          test.testName || ""
        ).toLowerCase();


      const testId =
        (
          test.testId || ""
        ).toLowerCase();


      const result =
        (
          test.result || ""
        ).toLowerCase();


      const matchesSearch =
        !text ||
        patientName.includes(text) ||
        doctorName.includes(text) ||
        testName.includes(text) ||
        testId.includes(text) ||
        result.includes(text);


      if (!matchesSearch) {

        return false;

      }


      /* FILTER */

      if (
        filter === "completed"
      ) {

        return (
          test.status ===
          "Completed"
        );

      }


      if (
        filter === "pending"
      ) {

        return (
          test.status !==
          "Completed"
        );

      }


      if (
        filter === "ordered"
      ) {

        return (
          test.status ===
          "Ordered"
        );

      }


      return true;

    })

    .sort((a, b) => {

      /* NAME */

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


      /* OLDEST */

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


  /* =========================================
     RENDER
  ========================================= */

  return (

    <DashboardLayout>

      {/* HEADER */}

      <PageHeader
        title="Laboratory Tests"
        subtitle="Manage laboratory investigations"
        icon={<ScienceIcon />}
        buttonText="New Test"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            consultation: "",
            patient: "",
            doctor: "",
            testName: "",
            status: "Ordered",
            result: "",

          });

          setOpen(true);

        }}
      />


      {/* STATS */}

      <ModuleStats
        stats={stats}
      />


      {/* =====================================
          SEARCH / FILTER / SORT
      ===================================== */}

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

            placeholder="Search patient, doctor, test or result..."

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
                sm: 190,
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
              All Tests
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


      {/* =====================================
          TABLE
      ===================================== */}

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
            borderRadius: 4,

            border:
              "1px solid #E2E8F0",

            overflowX: "auto",

            boxShadow:
              "0 8px 24px rgba(15,23,42,.05)",
          }}
        >

          <Table
            sx={{
              width: "100%",
              minWidth: 950,
              tableLayout: "fixed",
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
                  TEST
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
                    fontWeight: 700,
                  }}
                >
                  RESULT
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "10%",
                    fontWeight: 700,
                  }}
                >
                  STATUS
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "10%",
                    fontWeight: 700,
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredTests.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <ScienceIcon
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
                      No Lab Tests Found
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

                filteredTests.map(
                  (test) => (

                    <TableRow
                      key={
                        test._id
                      }

                      hover

                      sx={{
                        height: 82,

                        "& td": {
                          borderBottom:
                            "1px solid #EEF2F7",

                          padding:
                            "18px 16px",

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

                            <ScienceIcon
                              fontSize="small"
                            />

                          </Avatar>


                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >

                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 15,

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >

                              {
                                test.patient
                                  ?.firstName
                              }{" "}

                              {
                                test.patient
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
                                test.testId ||
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
                              test.doctor
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
                                test.doctor
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
                              Consultant
                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* TEST */}

                      <TableCell>

                        <Box
                          sx={{
                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            gap: 1,

                            px: 1.5,

                            py: 0.8,

                            borderRadius: 2,

                            bgcolor:
                              "#F8FAFC",

                            border:
                              "1px solid #E2E8F0",

                            maxWidth:
                              "100%",
                          }}
                        >

                          <ScienceIcon
                            sx={{
                              fontSize: 18,
                              color:
                                "#2563EB",
                            }}
                          />

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

                            {
                              test.testName ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* RESULT */}

                      <TableCell
                        align="center"
                      >

                        <Box
                          sx={{
                            display:
                              "inline-flex",

                            justifyContent:
                              "center",

                            alignItems:
                              "center",

                            minWidth: 90,

                            px: 1.5,

                            py: 0.8,

                            borderRadius: 2,

                            bgcolor:
                              test.result
                                ? "#ECFDF5"
                                : "#F8FAFC",

                            border:
                              test.result
                                ? "1px solid #A7F3D0"
                                : "1px solid #E2E8F0",
                          }}
                        >

                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 13,

                              color:
                                test.result
                                  ? "#059669"
                                  : "#475569",

                              maxWidth: 120,

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",
                            }}
                          >

                            {
                              test.result ||
                              "Pending"
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
                            test.status ||
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
                                test
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                test
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                test._id
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


      {/* =====================================
          ADD / EDIT DIALOG
      ===================================== */}

      <FormDialog
        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Lab Test"
            : "New Lab Test"
        }

        submitText={
          editingId
            ? "Update Test"
            : "Save Test"
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

          {/* CONSULTATION */}

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

            sx={
              textFieldStyle
            }
          >

            {consultations.map(
              (item) => (

                <MenuItem
                  key={
                    item._id
                  }

                  value={
                    item._id
                  }
                >

                  {
                    item.consultationId ||
                    item._id
                  }

                </MenuItem>

              )
            )}

          </TextField>


          {/* PATIENT */}

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
              (item) => (

                <MenuItem
                  key={
                    item._id
                  }

                  value={
                    item._id
                  }
                >

                  {
                    item.firstName
                  }{" "}

                  {
                    item.lastName
                  }

                </MenuItem>

              )
            )}

          </TextField>


          {/* DOCTOR */}

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
              (item) => (

                <MenuItem
                  key={
                    item._id
                  }

                  value={
                    item._id
                  }
                >

                  {
                    item.name
                  }

                </MenuItem>

              )
            )}

          </TextField>


          {/* TEST NAME */}

          <TextField
            fullWidth

            label="Test Name"

            name="testName"

            value={
              formData.testName
            }

            onChange={
              handleChange
            }

            placeholder="Blood Test, CBC, X-Ray..."

            sx={
              textFieldStyle
            }

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

            sx={
              textFieldStyle
            }
          >

            <MenuItem value="Ordered">
              Ordered
            </MenuItem>

            <MenuItem value="Collected">
              Collected
            </MenuItem>

            <MenuItem value="Processing">
              Processing
            </MenuItem>

            <MenuItem value="Completed">
              Completed
            </MenuItem>

          </TextField>


          {/* RESULT */}

          <TextField
            fullWidth

            label="Result"

            name="result"

            value={
              formData.result
            }

            onChange={
              handleChange
            }

            placeholder="Enter test result"

            sx={
              textFieldStyle
            }

          />

        </Box>

      </FormDialog>


      {/* =====================================
          VIEW DIALOG
      ===================================== */}

      <FormDialog
        open={viewOpen}

        onClose={() =>
          setViewOpen(false)
        }

        title="Lab Test Details"

        hideSubmit
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
            label="Test ID"
            value={
              selectedTest?.testId ||
              "-"
            }
          />


          <DetailBox
            label="Patient"
            value={
              `${selectedTest?.patient?.firstName || ""} ${
                selectedTest?.patient?.lastName || ""
              }`
            }
          />


          <DetailBox
            label="Doctor"
            value={
              selectedTest?.doctor?.name ||
              "-"
            }
          />


          <DetailBox
            label="Consultation"
            value={
              selectedTest?.consultation
                ?.consultationId ||
              "-"
            }
          />


          <DetailBox
            label="Test Name"
            value={
              selectedTest?.testName ||
              "-"
            }
          />


          <DetailBox
            label="Result"
            value={
              selectedTest?.result ||
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
                mb: 1,
              }}
            >
              Status
            </Typography>

            <StatusChip
              status={
                selectedTest?.status ||
                "Pending"
              }
            />

          </Box>

        </Box>

      </FormDialog>

    </DashboardLayout>

  );
}


/* =========================================
   DETAIL BOX
========================================= */

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
        sx={{
          wordBreak:
            "break-word",
        }}
      >
        {value || "-"}
      </Typography>

    </Box>

  );
}


export default LabTests;