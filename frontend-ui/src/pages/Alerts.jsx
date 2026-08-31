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

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";

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
   ALERTS
========================= */

function Alerts() {

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [sort, setSort] = useState("latest");

  const [open, setOpen] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [selectedAlert, setSelectedAlert] = useState(null);


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    alertType: "Appointment",
    status: "Pending",
  });


  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    fetchAlerts();
  }, []);


  /* =========================
     FETCH ALERTS
  ========================= */

  const fetchAlerts = async () => {

    try {

      setLoading(true);

      const res = await API.get("/alerts");

      setAlerts(res.data.data || []);

    } catch (error) {

      console.log(error);

      toast.error("Failed to load alerts");

    } finally {

      setLoading(false);

    }

  };


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit = async () => {

    try {

      if (editingId) {

        await API.put(
          `/alerts/${editingId}`,
          formData
        );

        toast.success(
          "Alert updated successfully"
        );

      } else {

        await API.post(
          "/alerts",
          formData
        );

        toast.success(
          "Alert created successfully"
        );

      }


      setOpen(false);

      setEditingId(null);

      setFormData({
        title: "",
        message: "",
        alertType: "Appointment",
        status: "Pending",
      });

      fetchAlerts();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save alert"
      );

    }

  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (alert) => {

    setSelectedAlert(alert);

    setViewOpen(true);

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (alert) => {

    setEditingId(alert._id);

    setFormData({
      title: alert.title || "",
      message: alert.message || "",
      alertType:
        alert.alertType || "Appointment",
      status:
        alert.status || "Pending",
    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this alert?"
      )
    ) {
      return;
    }


    try {

      await API.delete(
        `/alerts/${id}`
      );

      toast.success(
        "Alert deleted successfully"
      );

      fetchAlerts();

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
      label: "Alerts",
      value: alerts.length,
      icon: <WarningAmberRoundedIcon />,
    },

    {
      label: "Active",
      value:
        alerts.filter(
          (a) =>
            a.status === "Active"
        ).length,
      icon:
        <NotificationsActiveRoundedIcon />,
    },

    {
      label: "Resolved",
      value:
        alerts.filter(
          (a) =>
            a.status === "Resolved"
        ).length,
      icon:
        <CheckCircleRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredAlerts = [...alerts]

    .filter((alert) => {

      const text =
        search
          .toLowerCase()
          .trim();


      const title =
        (
          alert.title || ""
        ).toLowerCase();


      const message =
        (
          alert.message || ""
        ).toLowerCase();


      const alertType =
        (
          alert.alertType || ""
        ).toLowerCase();


      const status =
        (
          alert.status || ""
        ).toLowerCase();


      const alertId =
        (
          alert.alertId || ""
        ).toLowerCase();


      const matchesSearch =
        !text ||
        title.includes(text) ||
        message.includes(text) ||
        alertType.includes(text) ||
        status.includes(text) ||
        alertId.includes(text);


      if (!matchesSearch) {
        return false;
      }


      /* FILTER */

      if (
        filter === "appointment"
      ) {

        return (
          alert.alertType ===
          "Appointment"
        );

      }


      if (
        filter === "billing"
      ) {

        return (
          alert.alertType ===
          "Billing"
        );

      }


      if (
        filter === "lab"
      ) {

        return (
          alert.alertType ===
          "Lab"
        );

      }


      if (
        filter === "discharge"
      ) {

        return (
          alert.alertType ===
          "Discharge"
        );

      }


      if (
        filter === "pending"
      ) {

        return (
          alert.status ===
          "Pending"
        );

      }


      if (
        filter === "sent"
      ) {

        return (
          alert.status ===
          "Sent"
        );

      }


      if (
        filter === "active"
      ) {

        return (
          alert.status ===
          "Active"
        );

      }


      if (
        filter === "resolved"
      ) {

        return (
          alert.status ===
          "Resolved"
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
        sort === "title"
      ) {

        return (
          a.title || ""
        ).localeCompare(
          b.title || ""
        );

      }


      if (
        sort === "type"
      ) {

        return (
          a.alertType || ""
        ).localeCompare(
          b.alertType || ""
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
     RENDER
  ========================= */

  return (

    <DashboardLayout>

      {/* =========================
          HEADER
      ========================= */}

      <PageHeader

        title="Alerts"

        subtitle="Manage hospital alerts"

        icon={
          <WarningAmberRoundedIcon />
        }

        buttonText="Create Alert"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({
            title: "",
            message: "",
            alertType: "Appointment",
            status: "Pending",
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
              "Search alert, type, status..."

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
              All Alerts
            </MenuItem>

            <MenuItem value="appointment">
              Appointment
            </MenuItem>

            <MenuItem value="billing">
              Billing
            </MenuItem>

            <MenuItem value="lab">
              Lab
            </MenuItem>

            <MenuItem value="discharge">
              Discharge
            </MenuItem>

            <MenuItem value="pending">
              Pending
            </MenuItem>

            <MenuItem value="sent">
              Sent
            </MenuItem>

            <MenuItem value="active">
              Active
            </MenuItem>

            <MenuItem value="resolved">
              Resolved
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

            <MenuItem value="title">
              Title A-Z
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
                    width: "32%",
                  }}
                >
                  ALERT
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "20%",
                  }}
                >
                  TYPE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "18%",
                  }}
                >
                  STATUS
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "30%",
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredAlerts.length ===
              0 ? (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <WarningAmberRoundedIcon

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

                      No Alerts Found

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

                filteredAlerts.map(
                  (alert) => (

                    <TableRow

                      key={
                        alert._id
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

                      {/* ALERT */}

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
                                "linear-gradient(135deg,#F59E0B,#D97706)",

                            }}

                          >

                            <WarningAmberRoundedIcon
                              fontSize="small"
                            />

                          </Avatar>


                          <Box>

                            <Typography

                              sx={{

                                fontWeight: 700,

                                fontSize: 14,

                                color:
                                  "#0F172A",

                              }}

                            >

                              {
                                alert.title ||
                                "-"
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
                                alert.alertId ||
                                "-"
                              }

                            </Typography>

                          </Box>

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

                            px: 1.5,

                            py: .7,

                            borderRadius: 2,

                            bgcolor:
                              "#FFF7ED",

                            border:
                              "1px solid #FED7AA",

                          }}

                        >

                          <Typography

                            sx={{

                              fontWeight: 700,

                              fontSize: 13,

                              color:
                                "#C2410C",

                            }}

                          >

                            {
                              alert.alertType ||
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
                              alert.status
                            }
                          />

                        </Box>

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell
                        align="center"
                      >

                        <ActionButtons

                          onView={() =>
                            handleView(
                              alert
                            )
                          }

                          onEdit={() =>
                            handleEdit(
                              alert
                            )
                          }

                          onDelete={() =>
                            handleDelete(
                              alert._id
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
          CREATE / EDIT DIALOG
      ========================= */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Alert"
            : "Create Alert"
        }

        subtitle=
          "Create or update hospital alert"

        submitText={
          editingId
            ? "Update Alert"
            : "Save Alert"
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

            label="Title"

            name="title"

            value={
              formData.title
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            select

            label="Alert Type"

            name="alertType"

            value={
              formData.alertType
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          >

            <MenuItem value="Appointment">
              Appointment
            </MenuItem>

            <MenuItem value="Billing">
              Billing
            </MenuItem>

            <MenuItem value="Lab">
              Lab
            </MenuItem>

            <MenuItem value="Discharge">
              Discharge
            </MenuItem>

          </TextField>


          <TextField

            label="Message"

            name="message"

            multiline

            rows={4}

            value={
              formData.message
            }

            onChange={
              handleChange
            }

            sx={{

              ...textFieldStyle,

              gridColumn: {

                xs: "1",

                md: "1 / span 2",

              },

            }}

          />


          <TextField

            select

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

            <MenuItem value="Pending">
              Pending
            </MenuItem>

            <MenuItem value="Sent">
              Sent
            </MenuItem>

            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Resolved">
              Resolved
            </MenuItem>

          </TextField>

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

        title="Alert Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }

        hideCancel

      >

        {selectedAlert && (

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
                Title
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedAlert.title ||
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
                Alert Type
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedAlert.alertType ||
                  "-"
                }

              </Typography>

            </Box>


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
                Message
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedAlert.message ||
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

              <Box sx={{ mt: 1 }}>

                <StatusChip
                  status={
                    selectedAlert.status
                  }
                />

              </Box>

            </Box>


            <Box
              sx={viewBoxStyle}
            >

              <Typography
                sx={viewLabelStyle}
              >
                Created Date
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedAlert.createdAt

                    ? new Date(
                        selectedAlert.createdAt
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


export default Alerts;