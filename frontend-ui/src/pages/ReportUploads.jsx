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

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import ModuleStats from "../components/ModuleStats";
import StatusChip from "../components/StatusChip";

import FormDialog from "../components/FormDialog";
import ActionButtons from "../components/ActionButtons";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

import PageHeader from "../components/PageHeader";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import { toast } from "react-toastify";


/* =========================
   STYLES
========================= */

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
  },
};

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
  fontWeight: 700,
  color: "#64748B",
  textTransform: "uppercase",
  mb: 0.5,
};

const viewValueStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0F172A",
};


/* =========================
   REPORT UPLOADS
========================= */

function ReportUploads() {

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [sort, setSort] = useState("latest");

  const [open, setOpen] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [selectedReport, setSelectedReport] = useState(null);

  const [patients, setPatients] = useState([]);


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] = useState({
    patient: "",
    reportName: "",
    reportType: "Laboratory",
    file: null,
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

      const res = await API.get(
        "/report-uploads"
      );

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

      const res = await API.get(
        "/patients"
      );

      setPatients(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    }

  };


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    const {
      name,
      value,
      files,
    } = e.target;

    setFormData({
      ...formData,
      [name]: files
        ? files[0]
        : value,
    });

  };


  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit = async () => {

    try {

      const data = new FormData();

      data.append(
        "patient",
        formData.patient
      );

      data.append(
        "reportName",
        formData.reportName
      );

      data.append(
        "reportType",
        formData.reportType
      );


      if (formData.file) {

        data.append(
          "file",
          formData.file
        );

      }


      if (editingId) {

        await API.put(
          `/report-uploads/${editingId}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Report updated successfully"
        );

      } else {

        await API.post(
          "/report-uploads",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Report uploaded successfully"
        );

      }


      setOpen(false);

      setEditingId(null);

      setFormData({
        patient: "",
        reportName: "",
        reportType: "Laboratory",
        file: null,
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

    setSelectedReport(report);

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

      reportName:
        report.reportName ||
        "",

      reportType:
        report.reportType === "Lab"
          ? "Laboratory"
          : report.reportType ||
            "Laboratory",

      file: null,

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
        `/report-uploads/${id}`
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
     STATISTICS
  ========================= */

  const stats = [

    {
      label: "Uploads",
      value: reports.length,
      icon:
        <UploadFileRoundedIcon />,
    },

    {
      label: "Patients",
      value:
        new Set(
          reports.map(
            (r) =>
              `${r.patient?.firstName || ""} ${
                r.patient?.lastName || ""
              }`
          )
        ).size,
      icon:
        <PersonRoundedIcon />,
    },

    {
      label: "Report Types",
      value:
        new Set(
          reports.map(
            (r) => r.reportType
          )
        ).size,
      icon:
        <DescriptionRoundedIcon />,
    },

    {
      label: "Files",
      value: reports.length,
      icon:
        <FolderRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER
  ========================= */

  const filteredReports = [...reports]

    .filter((report) => {

      const text =
        search
          .toLowerCase()
          .trim();


      const patientName =
        `${report.patient?.firstName || ""} ${
          report.patient?.lastName || ""
        }`.toLowerCase();


      const reportName =
        (
          report.reportName || ""
        ).toLowerCase();


      const reportType =
        (
          report.reportType || ""
        ).toLowerCase();


      const uploadId =
        (
          report.uploadId || ""
        ).toLowerCase();


      const matchesSearch =
        !text ||
        patientName.includes(text) ||
        reportName.includes(text) ||
        reportType.includes(text) ||
        uploadId.includes(text);


      if (!matchesSearch) {

        return false;

      }


      /* FILTER BY REPORT TYPE */

      if (
        filter === "laboratory"
      ) {

        return (
          report.reportType ===
          "Laboratory" ||
          report.reportType ===
          "Lab"
        );

      }


      if (
        filter === "radiology"
      ) {

        return (
          report.reportType ===
          "Radiology"
        );

      }


      if (
        filter === "prescription"
      ) {

        return (
          report.reportType ===
          "Prescription"
        );

      }


      if (
        filter === "discharge"
      ) {

        return (
          report.reportType ===
          "Discharge"
        );

      }


      return true;

    })


    /* =========================
       SORT
    ========================= */

    .sort((a, b) => {

      if (
        sort === "latest"
      ) {

        return (

          new Date(
            b.createdAt || 0
          ) -

          new Date(
            a.createdAt || 0
          )

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


      if (
        sort === "patient"
      ) {

        const aName =
          `${a.patient?.firstName || ""} ${
            a.patient?.lastName || ""
          }`;

        const bName =
          `${b.patient?.firstName || ""} ${
            b.patient?.lastName || ""
          }`;

        return aName.localeCompare(
          bName
        );

      }


      if (
        sort === "report"
      ) {

        return (
          a.reportName || ""
        ).localeCompare(
          b.reportName || ""
        );

      }


      if (
        sort === "type"
      ) {

        return (
          a.reportType || ""
        ).localeCompare(
          b.reportType || ""
        );

      }


      return 0;

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
     FILE URL
  ========================= */

  const getFileUrl = (filePath) => {

    if (!filePath) {
      return "#";
    }

    return `http://localhost:8000/${filePath.replace(
      /\\/g,
      "/"
    )}`;

  };


  /* =========================
     RENDER
  ========================= */

  return (

    <DashboardLayout>


      {/* =========================
          HEADER
      ========================= */}

      <PageHeader

        title="Report Uploads"

        subtitle=
          "Manage uploaded medical reports"

        buttonText="Upload Report"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({
            patient: "",
            reportName: "",
            reportType:
              "Laboratory",
            file: null,
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

            placeholder=
              "Search patient, report or type..."

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
              All Reports
            </MenuItem>

            <MenuItem value="laboratory">
              Laboratory
            </MenuItem>

            <MenuItem value="radiology">
              Radiology
            </MenuItem>

            <MenuItem value="prescription">
              Prescription
            </MenuItem>

            <MenuItem value="discharge">
              Discharge
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

            <MenuItem value="patient">
              Patient A-Z
            </MenuItem>

            <MenuItem value="report">
              Report A-Z
            </MenuItem>

            <MenuItem value="type">
              Type A-Z
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

                minWidth: 60,

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
                    width: "28%",
                  }}
                >
                  PATIENT
                </TableCell>

                <TableCell
                  sx={{
                    width: "27%",
                  }}
                >
                  REPORT
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "18%",
                  }}
                >
                  TYPE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                  }}
                >
                  FILE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
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

                    <UploadFileRoundedIcon

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

                              flexShrink: 0,

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                              fontWeight: 700,

                              fontSize: 13,

                            }}

                          >

                            {
                              report.patient
                                ?.firstName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                              "P"
                            }

                            {
                              report.patient
                                ?.lastName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                              ""
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

                                lineHeight: 1.3,

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                              }}

                            >

                              {
                                report.patient
                                  ?.firstName ||
                                ""
                              }{" "}

                              {
                                report.patient
                                  ?.lastName ||
                                ""
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
                                report.uploadId ||
                                "-"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* REPORT */}

                      <TableCell>

                        <Box

                          sx={{

                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            maxWidth:
                              "100%",

                            minHeight: 40,

                            px: 1.5,

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
                              report.reportName ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* TYPE */}

                      <TableCell
                        align="center"
                      >

                        <Box

                          sx={{

                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            minWidth: 110,

                            minHeight: 36,

                            px: 1.5,

                            borderRadius: 2,

                            bgcolor:
                              "#EFF6FF",

                            border:
                              "1px solid #BFDBFE",

                          }}

                        >

                          <Typography

                            sx={{

                              fontWeight: 600,

                              fontSize: 13,

                              color:
                                "#1E40AF",

                            }}

                          >

                            {
                              report.reportType ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* FILE */}

                      <TableCell
                        align="center"
                      >

                        <Button

                          size="small"

                          variant="outlined"

                          href={
                            getFileUrl(
                              report.filePath
                            )
                          }

                          target="_blank"

                          rel="noopener noreferrer"

                          disabled={
                            !report.filePath
                          }

                          sx={{

                            textTransform:
                              "none",

                            borderRadius: 2,

                            minWidth: 85,

                            fontWeight: 600,

                          }}

                        >

                          View File

                        </Button>

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
          UPLOAD / EDIT DIALOG
      ========================= */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Report"
            : "Upload Report"
        }

        subtitle=
          "Upload patient medical report"

        submitText={
          editingId
            ? "Update Report"
            : "Upload Report"
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
              (p) => (

                <MenuItem

                  key={p._id}

                  value={p._id}

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


          {/* REPORT NAME */}

          <TextField

            label="Report Name"

            name="reportName"

            value={
              formData.reportName
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          {/* REPORT TYPE */}

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

            sx={
              textFieldStyle
            }

          >

            <MenuItem value="Laboratory">
              Laboratory
            </MenuItem>

            <MenuItem value="Radiology">
              Radiology
            </MenuItem>

            <MenuItem value="Prescription">
              Prescription
            </MenuItem>

            <MenuItem value="Discharge">
              Discharge
            </MenuItem>

          </TextField>


          {/* FILE */}

          <TextField

            fullWidth

            type="file"

            name="file"

            onChange={
              handleChange
            }

            InputLabelProps={{
              shrink: true,
            }}

            inputProps={{
              accept:
                ".pdf,.jpg,.jpeg,.png,.doc,.docx",
            }}

            sx={
              textFieldStyle
            }

          />

        </Box>

      </FormDialog>


      {/* =========================
          VIEW DIALOG
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

            {/* PATIENT */}

            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={viewLabelStyle}
              >

                Patient

              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedReport.patient
                    ?.firstName ||
                  ""
                }{" "}

                {
                  selectedReport.patient
                    ?.lastName ||
                  ""
                }

              </Typography>

            </Box>


            {/* REPORT NAME */}

            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={viewLabelStyle}
              >

                Report Name

              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedReport.reportName ||
                  "-"
                }

              </Typography>

            </Box>


            {/* REPORT TYPE */}

            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={viewLabelStyle}
              >

                Report Type

              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedReport.reportType ||
                  "-"
                }

              </Typography>

            </Box>


            {/* UPLOAD ID */}

            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={viewLabelStyle}
              >

                Upload ID

              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedReport.uploadId ||
                  "-"
                }

              </Typography>

            </Box>


            {/* FILE */}

            <Box
              sx={{

                ...viewBoxStyle,

                gridColumn: {

                  xs: "1",

                  md: "1 / span 2",

                },

              }}

            >

              <Typography
                sx={viewLabelStyle}
              >

                File

              </Typography>

              <Button

                variant="contained"

                disabled={
                  !selectedReport.filePath
                }

                onClick={() => {

                  window.open(
                    getFileUrl(
                      selectedReport.filePath
                    ),
                    "_blank"
                  );

                }}

                sx={{

                  mt: 1,

                  width: {

                    xs: "100%",

                    sm: "fit-content",

                  },

                  borderRadius: 2,

                  textTransform:
                    "none",

                }}

              >

                Open Report

              </Button>

            </Box>

          </Box>

        )}

      </FormDialog>

    </DashboardLayout>

  );

}


export default ReportUploads;