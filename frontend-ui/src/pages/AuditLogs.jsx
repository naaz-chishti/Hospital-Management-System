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
import ActionButtons from "../components/ActionButtons";
import FormDialog from "../components/FormDialog";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

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
   AUDIT LOGS
========================= */

function AuditLogs() {

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [sort, setSort] = useState("latest");

  const [open, setOpen] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [selectedLog, setSelectedLog] = useState(null);


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] = useState({
    user: "",
    action: "",
    module: "",
  });


  /* =========================
     FETCH ON LOAD
  ========================= */

  useEffect(() => {
    fetchLogs();
  }, []);


  /* =========================
     FETCH LOGS
  ========================= */

  const fetchLogs = async () => {

    try {

      setLoading(true);

      const res = await API.get(
        "/audit-logs"
      );

      setLogs(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load audit logs"
      );

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
          `/audit-logs/${editingId}`,
          formData
        );

        toast.success(
          "Audit Log updated successfully"
        );

      } else {

        await API.post(
          "/audit-logs",
          formData
        );

        toast.success(
          "Audit Log created successfully"
        );

      }


      setOpen(false);

      setEditingId(null);

      setFormData({
        user: "",
        action: "",
        module: "",
      });

      fetchLogs();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save audit log"
      );

    }

  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (log) => {

    setSelectedLog(log);

    setViewOpen(true);

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (log) => {

    setEditingId(log._id);

    setFormData({
      user: log.user || "",
      action: log.action || "",
      module: log.module || "",
    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this audit log?"
      )
    ) {
      return;
    }


    try {

      await API.delete(
        `/audit-logs/${id}`
      );

      toast.success(
        "Audit Log deleted successfully"
      );

      fetchLogs();

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
      label: "Logs",
      value: logs.length,
      icon: <HistoryRoundedIcon />,
    },

    {
      label: "Users",
      value:
        new Set(
          logs.map(
            (log) => log.user
          )
        ).size,
      icon: <PersonRoundedIcon />,
    },

    {
      label: "Modules",
      value:
        new Set(
          logs.map(
            (log) => log.module
          )
        ).size,
      icon:
        <DashboardCustomizeRoundedIcon />,
    },

    {
      label: "Actions",
      value:
        new Set(
          logs.map(
            (log) => log.action
          )
        ).size,
      icon: <UpdateRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredLogs = [...logs]

    .filter((log) => {

      const text =
        search
          .toLowerCase()
          .trim();


      const user =
        (
          log.user || ""
        ).toLowerCase();


      const action =
        (
          log.action || ""
        ).toLowerCase();


      const module =
        (
          log.module || ""
        ).toLowerCase();


      const logId =
        (
          log.logId || ""
        ).toLowerCase();


      /* SEARCH */

      const matchesSearch =
        !text ||
        user.includes(text) ||
        action.includes(text) ||
        module.includes(text) ||
        logId.includes(text);


      if (!matchesSearch) {
        return false;
      }


      /* FILTER */

      if (
        filter === "user"
      ) {

        return Boolean(
          log.user
        );

      }


      if (
        filter === "create"
      ) {

        return (
          actionContains(
            log.action,
            "create"
          )
        );

      }


      if (
        filter === "update"
      ) {

        return (
          actionContains(
            log.action,
            "update"
          )
        );

      }


      if (
        filter === "delete"
      ) {

        return (
          actionContains(
            log.action,
            "delete"
          )
        );

      }


      if (
        filter === "login"
      ) {

        return (
          actionContains(
            log.action,
            "login"
          )
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
        sort === "user"
      ) {

        return (
          a.user || ""
        ).localeCompare(
          b.user || ""
        );

      }


      if (
        sort === "module"
      ) {

        return (
          a.module || ""
        ).localeCompare(
          b.module || ""
        );

      }


      if (
        sort === "action"
      ) {

        return (
          a.action || ""
        ).localeCompare(
          b.action || ""
        );

      }


      return 0;

    });


  /* =========================
     CLEAR SEARCH
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
          PAGE HEADER
      ========================= */}

      <PageHeader

        title="Audit Logs"

        subtitle="View system audit history"

        icon={
          <HistoryRoundedIcon />
        }

        buttonText="Create Log"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({
            user: "",
            action: "",
            module: "",
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
              "Search user, action or module..."

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
              All Logs
            </MenuItem>

            <MenuItem value="create">
              Create
            </MenuItem>

            <MenuItem value="update">
              Update
            </MenuItem>

            <MenuItem value="delete">
              Delete
            </MenuItem>

            <MenuItem value="login">
              Login
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

            <MenuItem value="user">
              User A-Z
            </MenuItem>

            <MenuItem value="module">
              Module A-Z
            </MenuItem>

            <MenuItem value="action">
              Action A-Z
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
                    width: "25%",
                  }}
                >
                  USER
                </TableCell>

                <TableCell
                  sx={{
                    width: "25%",
                  }}
                >
                  LOG ENTRY
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "18%",
                  }}
                >
                  MODULE
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

              {filteredLogs.length ===
              0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <HistoryRoundedIcon

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

                      No Audit Logs Found

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

                filteredLogs.map(
                  (log) => (

                    <TableRow

                      key={
                        log._id
                      }

                      hover

                      sx={{

                        height: 78,

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

                      {/* USER */}

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
                              log.user
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase()
                            }

                          </Avatar>


                          <Box>

                            <Typography

                              sx={{

                                fontWeight: 700,

                                fontSize: 14,

                                lineHeight: 1.3,

                              }}

                            >

                              {
                                log.user ||
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

                              {
                                log.logId ||
                                "-"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* LOG ENTRY */}

                      <TableCell>

                        <Box>

                          <StatusChip
                            status={
                              log.action ||
                              "-"
                            }
                          />

                        </Box>

                      </TableCell>


                      {/* MODULE */}

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

                            px: 2,

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
                              log.module ||
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
                              log.createdAt

                                ? new Date(
                                    log.createdAt
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
                                log
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                log
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                log._id
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
          CREATE / EDIT DIALOG
      ========================= */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Audit Log"
            : "New Audit Log"
        }

        subtitle=
          "Create or update audit log"

        submitText={
          editingId
            ? "Update Log"
            : "Save Log"
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

            label="User"

            name="user"

            value={
              formData.user
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Module"

            name="module"

            value={
              formData.module
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Action"

            name="action"

            value={
              formData.action
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

        title="Audit Log Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }

        hideCancel

      >

        {selectedLog && (

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
                User
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedLog.user ||
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
                Module
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedLog.module ||
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
                Action
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedLog.action ||
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
                Log ID
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedLog.logId ||
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
                Created Date
              </Typography>

              <Typography
                sx={viewValueStyle}
              >

                {
                  selectedLog.createdAt

                    ? new Date(
                        selectedLog.createdAt
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


/* =========================
   HELPER
========================= */

function actionContains(
  action,
  value
) {

  return (
    action || ""
  )
    .toLowerCase()
    .includes(value);

}


export default AuditLogs;