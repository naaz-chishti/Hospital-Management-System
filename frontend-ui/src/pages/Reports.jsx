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

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import ModuleStats from "../components/ModuleStats";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import { toast } from "react-toastify";

import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import ActionButtons from "../components/ActionButtons";


/* =========================
   VIEW STYLES
========================= */

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 3,
  bgcolor: "#fff",
  minHeight: 74,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const viewLabelStyle = {
  fontSize: 12,
  color: "#64748B",
  fontWeight: 700,
  textTransform: "uppercase",
  mb: 0.5,
};

const viewValueStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0F172A",
};


/* =========================
   REPORTS
========================= */

function Reports() {

  const [reports, setReports] =
    useState([]);

  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* SEARCH */

  const [search, setSearch] =
    useState("");


  /* FILTER */

  const [filter, setFilter] =
    useState("all");


  /* SORT */

  const [sort, setSort] =
    useState("latest");


  /* DIALOGS */

  const [open, setOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);


  const [editingId, setEditingId] =
    useState(null);


  const [selectedReport, setSelectedReport] =
    useState(null);


  /* FORM */

  const [formData, setFormData] =
    useState({

      patient: "",
      reportType: "Patient",
      generatedBy: "Admin",

    });


  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {

    fetchReports();

    fetchPatients();

  }, []);


  /* =========================
     FETCH REPORTS
  ========================= */

  const fetchReports = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/reports");

      setReports(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load reports"
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

    } catch (error) {

      console.log(error);

    }

  };


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
     SAVE / UPDATE
  ========================= */

  const handleSubmit = async () => {

    try {

      if (editingId) {

        await API.put(
          `/reports/${editingId}`,
          formData
        );

        toast.success(
          "Report updated successfully"
        );

      } else {

        await API.post(
          "/reports",
          formData
        );

        toast.success(
          "Report created successfully"
        );

      }


      setOpen(false);

      setEditingId(null);

      setFormData({

        patient: "",
        reportType: "Patient",
        generatedBy: "Admin",

      });

      fetchReports();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save report"
      );

    }

  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (report) => {

    setSelectedReport(
      report
    );

    setViewOpen(true);

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (report) => {

    setEditingId(
      report._id
    );

    setFormData({

      patient:
        report.patient?._id ||
        "",

      reportType:
        report.reportType ||
        "Patient",

      generatedBy:
        report.generatedBy ||
        "Admin",

    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this report?"
      )
    ) {

      return;

    }


    try {

      await API.delete(
        `/reports/${id}`
      );

      toast.success(
        "Report deleted successfully"
      );

      fetchReports();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Delete failed"
      );

    }

  };


  /* =========================
     STATS
  ========================= */

  const stats = [

    {
      label: "Reports",

      value:
        reports.length,

      icon:
        <DescriptionRoundedIcon />,
    },


    {
      label: "Categories",

      value:
        new Set(
          reports.map(
            (r) => r.reportType
          )
        ).size,

      icon:
        <FolderRoundedIcon />,
    },


    {
      label: "Patients",

      value:
        new Set(
          reports
            .map(
              (r) =>
                r.patient?._id
            )
            .filter(Boolean)
        ).size,

      icon:
        <PersonRoundedIcon />,
    },


    {
      label: "Today's Reports",

      value:
        reports.filter(
          (report) => {

            if (!report.createdAt)
              return false;

            const today =
              new Date();

            const reportDate =
              new Date(
                report.createdAt
              );

            return (

              today.getDate() ===
                reportDate.getDate() &&

              today.getMonth() ===
                reportDate.getMonth() &&

              today.getFullYear() ===
                reportDate.getFullYear()

            );

          }
        ).length,

      icon:
        <CalendarMonthRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredReports =

    [...reports]

      .filter((report) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const reportType =
          (
            report.reportType ||
            ""
          ).toLowerCase();


        const generatedBy =
          (
            report.generatedBy ||
            ""
          ).toLowerCase();


        const patientName =

          `${report.patient?.firstName || ""} ${
            report.patient?.lastName || ""
          }`.toLowerCase();


        const patientId =
          (
            report.patient?.patientId ||
            ""
          ).toLowerCase();


        const reportId =
          (
            report.reportId ||
            ""
          ).toLowerCase();


        const matchesSearch =

          !text ||

          reportType.includes(text) ||

          generatedBy.includes(text) ||

          patientName.includes(text) ||

          patientId.includes(text) ||

          reportId.includes(text);


        if (!matchesSearch) {

          return false;

        }


        /* FILTER */

        if (
          filter === "patient"
        ) {

          return (
            report.reportType ===
            "Patient"
          );

        }


        if (
          filter === "revenue"
        ) {

          return (
            report.reportType ===
            "Revenue"
          );

        }


        if (
          filter === "admission"
        ) {

          return (
            report.reportType ===
            "Admission"
          );

        }


        if (
          filter === "laboratory"
        ) {

          return (
            report.reportType ===
            "Laboratory"
          );

        }


        return true;

      })


      /* SORT */

      .sort((a, b) => {

        /* NAME A-Z */

        if (
          sort === "name"
        ) {

          const nameA =
            `${a.patient?.firstName || ""} ${
              a.patient?.lastName || ""
            }`;

          const nameB =
            `${b.patient?.firstName || ""} ${
              b.patient?.lastName || ""
            }`;

          return nameA.localeCompare(
            nameB
          );

        }


        /* REPORT TYPE */

        if (
          sort === "category"
        ) {

          return (
            a.reportType || ""
          ).localeCompare(
            b.reportType || ""
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


  /* =========================
     CLEAR
  ========================= */

  const clearSearch = () => {

    setSearch("");

    setFilter("all");

    setSort("latest");

  };


  /* =========================
     RENDER
  ========================= */

  return (

    <DashboardLayout>


      {/* HEADER */}

      <PageHeader

        title="Medical Reports"

        subtitle=
          "Manage patient medical reports"

        icon={
          <DescriptionRoundedIcon />
        }

        buttonText="Add Report"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            patient: "",
            reportType: "Patient",
            generatedBy: "Admin",

          });

          setOpen(true);

        }}

      />


      {/* STATS */}

      <ModuleStats
        stats={stats}
      />


      {/* =========================
          SEARCH / FILTER / SORT
      ========================= */}

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
              "Search report, patient, category..."

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

                sm: 175,

                md: 175,

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
              All Reports
            </MenuItem>

            <MenuItem value="patient">
              Patient Reports
            </MenuItem>

            <MenuItem value="revenue">
              Revenue Reports
            </MenuItem>

            <MenuItem value="admission">
              Admission Reports
            </MenuItem>

            <MenuItem value="laboratory">
              Laboratory Reports
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

                sm: 165,

                md: 165,

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

            <MenuItem value="oldest">
              Oldest
            </MenuItem>

            <MenuItem value="name">
              Patient A-Z
            </MenuItem>

            <MenuItem value="category">
              Category A-Z
            </MenuItem>

          </TextField>


          {/* CLEAR */}

          {(search ||
            filter !== "all" ||
            sort !== "latest") && (

            <Button

              onClick={
                clearSearch
              }

              sx={{

                height: 42,

                textTransform:
                  "none",

                color:
                  "#0F766E",

                fontWeight: 700,

                minWidth: 60,

              }}

            >

              Clear

            </Button>

          )}

        </Box>

      </Paper>


      {/* =========================
          TABLE
      ========================= */}

      {loading ? (

        <Box

          sx={{

            height: 300,

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

          }}

        >

          <CircularProgress
            size={45}
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
                      ".5px",

                  },

                }}

              >

                <TableCell
                  sx={{
                    width: "20%",
                  }}
                >
                  REPORT
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "20%",
                  }}
                >
                  CATEGORY
                </TableCell>


                <TableCell
                  sx={{
                    width: "24%",
                  }}
                >
                  PATIENT
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "18%",
                  }}
                >
                  DATE
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "18%",
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredReports.length ===
              0 ? (

                <TableRow>

                  <TableCell

                    colSpan={5}

                    align="center"

                    sx={{
                      py: 8,
                    }}

                  >

                    <DescriptionRoundedIcon

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

                      No Reports Found

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

                filteredReports.map(
                  (report) => (

                    <TableRow

                      key={
                        report._id
                      }

                      hover

                      sx={{

                        height: 78,

                        "& td": {

                          py: 2,

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


                      {/* REPORT */}

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

                              flexShrink: 0,

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                            }}

                          >

                            <DescriptionRoundedIcon
                              fontSize="small"
                            />

                          </Avatar>


                          <Box>

                            <Typography

                              sx={{

                                fontWeight: 700,

                                fontSize: 14,

                                whiteSpace:
                                  "nowrap",

                              }}

                            >

                              {
                                report.reportType
                              }{" "}

                              Report

                            </Typography>


                            <Typography

                              sx={{

                                fontSize: 12,

                                color:
                                  "#94A3B8",

                                mt: .3,

                              }}

                            >

                              {
                                report.reportId ||
                                "-"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* CATEGORY */}

                      <TableCell
                        align="center"
                      >

                        <Box

                          sx={{

                            display:
                              "inline-flex",

                            px: 1.5,

                            py: .7,

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

                          >

                            {
                              report.generatedBy ||
                              "Admin"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


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

                              width: 40,

                              height: 40,

                              bgcolor:
                                "#ECFDF5",

                              color:
                                "#059669",

                              fontWeight:
                                700,

                              fontSize: 13,

                            }}

                          >

                            {
                              report.patient?.firstName?.charAt(0) ||
                              "P"
                            }

                            {
                              report.patient?.lastName?.charAt(0) ||
                              ""
                            }

                          </Avatar>


                          <Box>

                            <Typography

                              sx={{

                                fontWeight: 700,

                                fontSize: 14,

                                color:
                                  "#0F172A",

                                lineHeight:
                                  1.2,

                              }}

                            >

                              {
                                report.patient?.firstName ||
                                "-"
                              }{" "}

                              {
                                report.patient?.lastName ||
                                ""
                              }

                            </Typography>


                            <Typography

                              sx={{

                                fontSize: 12,

                                fontWeight: 500,

                                color:
                                  "#94A3B8",

                                mt: .4,

                              }}

                            >

                              {
                                report.patient?.patientId ||
                                "-"
                              }

                            </Typography>

                          </Box>

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

                            py: .7,

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
                              report.createdAt

                                ? new Date(
                                    report.createdAt
                                  ).toLocaleDateString(
                                    "en-GB"
                                  )

                                : "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell
                        align="center"
                      >

                        <ActionButtons

                          onView={() =>
                            handleView(
                              report
                            )
                          }

                          onEdit={() =>
                            handleEdit(
                              report
                            )
                          }

                          onDelete={() =>
                            handleDelete(
                              report._id
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
          ADD / EDIT
      ========================= */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Report"
            : "Add Report"
        }

        subtitle=
          "Create or update report information"

        submitText={
          editingId
            ? "Update Report"
            : "Save Report"
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
              (p) => (

                <MenuItem

                  key={
                    p._id
                  }

                  value={
                    p._id
                  }

                >

                  {
                    p.firstName
                  }{" "}

                  {
                    p.lastName
                  }

                </MenuItem>

              )
            )}

          </TextField>


          <TextField

            select

            label="Report Type"

            name="reportType"

            value={
              formData.reportType
            }

            onChange={
              handleChange
            }

          >

            <MenuItem value="Patient">
              Patient
            </MenuItem>

            <MenuItem value="Revenue">
              Revenue
            </MenuItem>

            <MenuItem value="Admission">
              Admission
            </MenuItem>

            <MenuItem value="Laboratory">
              Laboratory
            </MenuItem>

          </TextField>


          <TextField

            label="Generated By"

            name="generatedBy"

            value={
              formData.generatedBy
            }

            onChange={
              handleChange
            }

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

        title="Report Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }

        hideCancel

      >

        {selectedReport && (

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
                sx={
                  viewLabelStyle
                }
              >
                Patient
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedReport.patient?.firstName ||
                  "-"
                }{" "}

                {
                  selectedReport.patient?.lastName ||
                  ""
                }

              </Typography>

            </Box>


            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={
                  viewLabelStyle
                }
              >
                Report Type
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedReport.reportType ||
                  "-"
                }

              </Typography>

            </Box>


            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={
                  viewLabelStyle
                }
              >
                Generated By
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedReport.generatedBy ||
                  "-"
                }

              </Typography>

            </Box>


            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={
                  viewLabelStyle
                }
              >
                Date
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedReport.createdAt

                    ? new Date(
                        selectedReport.createdAt
                      ).toLocaleDateString(
                        "en-GB"
                      )

                    : "-"
                }

              </Typography>

            </Box>

          </Box>

        )}

      </FormDialog>


    </DashboardLayout>

  );

}


export default Reports;