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

import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import { toast } from "react-toastify";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import FormDialog from "../components/FormDialog";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";


/* =========================
   STYLES
========================= */

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
  },
};

const viewLabelStyle = {
  fontSize: 12,
  color: "#64748B",
  fontWeight: 700,
  textTransform: "uppercase",
  mb: 0.5,
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

const viewValueStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0F172A",
};


/* =========================
   NOTIFICATIONS
========================= */

function Notifications() {

  const [notifications, setNotifications] =
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

  const [selectedNotification, setSelectedNotification] =
    useState(null);


  /* FORM */

  const [formData, setFormData] =
    useState({

      title: "",
      message: "",
      role: "Admin",
      isRead: false,

    });


  /* =========================
     LOAD
  ========================= */

  useEffect(() => {

    fetchNotifications();

  }, []);


  /* =========================
     FETCH
  ========================= */

  const fetchNotifications = async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          "/notifications"
        );

      setNotifications(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load notifications"
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    const value =
      e.target.name === "isRead"
        ? e.target.value === "true"
        : e.target.value;

    setFormData({

      ...formData,

      [e.target.name]:
        value,

    });

  };


  /* =========================
     SAVE / UPDATE
  ========================= */

  const handleSubmit = async () => {

    try {

      if (editingId) {

        await API.put(
          `/notifications/${editingId}`,
          formData
        );

        toast.success(
          "Notification updated successfully"
        );

      } else {

        await API.post(
          "/notifications",
          formData
        );

        toast.success(
          "Notification created successfully"
        );

      }


      setOpen(false);

      setEditingId(null);

      setFormData({

        title: "",
        message: "",
        role: "Admin",
        isRead: false,

      });

      fetchNotifications();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save notification"
      );

    }

  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (
    notification
  ) => {

    setSelectedNotification(
      notification
    );

    setViewOpen(true);

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (
    notification
  ) => {

    setEditingId(
      notification._id
    );

    setFormData({

      title:
        notification.title || "",

      message:
        notification.message || "",

      role:
        notification.role || "Admin",

      isRead:
        notification.isRead || false,

    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete this notification?"
      )
    ) {

      return;

    }


    try {

      await API.delete(
        `/notifications/${id}`
      );

      toast.success(
        "Notification deleted successfully"
      );

      fetchNotifications();

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
      label: "Notifications",

      value:
        notifications.length,

      icon:
        <NotificationsActiveRoundedIcon />,
    },


    {
      label: "Unread",

      value:
        notifications.filter(
          (n) => !n.isRead
        ).length,

      icon:
        <MarkEmailUnreadRoundedIcon />,
    },


    {
      label: "Read",

      value:
        notifications.filter(
          (n) => n.isRead
        ).length,

      icon:
        <MarkEmailReadRoundedIcon />,
    },


    {
      label: "Types",

      value:
        new Set(
          notifications
            .map(
              (n) => n.role
            )
            .filter(Boolean)
        ).size,

      icon:
        <CampaignRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredNotifications =

    [...notifications]

      .filter(
        (notification) => {

          const text =
            search
              .toLowerCase()
              .trim();


          const title =
            (
              notification.title ||
              ""
            ).toLowerCase();


          const message =
            (
              notification.message ||
              ""
            ).toLowerCase();


          const role =
            (
              notification.role ||
              ""
            ).toLowerCase();


          const notificationId =
            (
              notification.notificationId ||
              ""
            ).toLowerCase();


          /* SEARCH */

          const matchesSearch =

            !text ||

            title.includes(text) ||

            message.includes(text) ||

            role.includes(text) ||

            notificationId.includes(text);


          if (!matchesSearch) {

            return false;

          }


          /* FILTER */

          if (
            filter === "unread"
          ) {

            return (
              notification.isRead ===
              false
            );

          }


          if (
            filter === "read"
          ) {

            return (
              notification.isRead ===
              true
            );

          }


          if (
            filter === "admin"
          ) {

            return (
              notification.role ===
              "Admin"
            );

          }


          if (
            filter === "doctor"
          ) {

            return (
              notification.role ===
              "Doctor"
            );

          }


          if (
            filter === "nurse"
          ) {

            return (
              notification.role ===
              "Nurse"
            );

          }


          if (
            filter === "receptionist"
          ) {

            return (
              notification.role ===
              "Receptionist"
            );

          }


          if (
            filter === "patient"
          ) {

            return (
              notification.role ===
              "Patient"
            );

          }


          return true;

        }
      )


      /* =========================
         SORT
      ========================= */

      .sort(
        (a, b) => {

          /* LATEST */

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


          /* TITLE */

          if (
            sort === "title"
          ) {

            return (
              a.title || ""
            ).localeCompare(
              b.title || ""
            );

          }


          /* ROLE */

          if (
            sort === "role"
          ) {

            return (
              a.role || ""
            ).localeCompare(
              b.role || ""
            );

          }


          return 0;

        }
      );


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

        title="Notifications"

        subtitle=
          "Manage system notifications"

        icon={
          <NotificationsActiveRoundedIcon />
        }

        buttonText="New Notification"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            title: "",
            message: "",
            role: "Admin",
            isRead: false,

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
              "Search title, message, role..."

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
              All Notifications
            </MenuItem>

            <MenuItem value="unread">
              Unread
            </MenuItem>

            <MenuItem value="read">
              Read
            </MenuItem>

            <MenuItem value="admin">
              Admin
            </MenuItem>

            <MenuItem value="doctor">
              Doctor
            </MenuItem>

            <MenuItem value="nurse">
              Nurse
            </MenuItem>

            <MenuItem value="receptionist">
              Receptionist
            </MenuItem>

            <MenuItem value="patient">
              Patient
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

            <MenuItem value="role">
              Role A-Z
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
                    width: "25%",
                  }}
                >
                  NOTIFICATION
                </TableCell>

                <TableCell
                  sx={{
                    width: "29%",
                  }}
                >
                  MESSAGE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
                  }}
                >
                  STATUS
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
                  }}
                >
                  DATE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "16%",
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredNotifications.length ===
              0 ? (

                <TableRow>

                  <TableCell

                    colSpan={5}

                    align="center"

                    sx={{
                      py: 8,
                    }}

                  >

                    <NotificationsActiveRoundedIcon

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

                      No Notifications Found

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

                filteredNotifications.map(
                  (notification) => (

                    <TableRow

                      key={
                        notification._id
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


                      {/* NOTIFICATION */}

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

                            <NotificationsActiveRoundedIcon
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

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                              }}

                            >

                              {
                                notification.title ||
                                "Notification"
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
                                notification.notificationId ||
                                "-"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* MESSAGE */}

                      <TableCell>

                        <Box

                          sx={{

                            display:
                              "inline-flex",

                            maxWidth: "100%",

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
                              notification.message ||
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
                              notification.isRead
                                ? "Read"
                                : "Unread"
                            }

                          />

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
                              notification.createdAt

                                ? new Date(
                                    notification.createdAt
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
                              notification
                            )
                          }

                          onEdit={() =>
                            handleEdit(
                              notification
                            )
                          }

                          onDelete={() =>
                            handleDelete(
                              notification._id
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
          ADD / EDIT DIALOG
      ========================= */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Notification"
            : "New Notification"
        }

        subtitle=
          "Create or update notification"

        submitText={
          editingId
            ? "Update Notification"
            : "Save Notification"
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

            label="Role"

            name="role"

            value={
              formData.role
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          >

            <MenuItem value="Admin">
              Admin
            </MenuItem>

            <MenuItem value="Doctor">
              Doctor
            </MenuItem>

            <MenuItem value="Nurse">
              Nurse
            </MenuItem>

            <MenuItem value="Receptionist">
              Receptionist
            </MenuItem>

            <MenuItem value="Patient">
              Patient
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

            name="isRead"

            value={
              String(
                formData.isRead
              )
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          >

            <MenuItem value="false">
              Unread
            </MenuItem>

            <MenuItem value="true">
              Read
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

        title="Notification Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }

        hideCancel

      >

        {selectedNotification && (

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
                Title
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedNotification.title ||
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
                Role
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedNotification.role ||
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
                sx={
                  viewLabelStyle
                }
              >
                Message
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedNotification.message ||
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
                Status
              </Typography>

              <Box sx={{ mt: 1 }}>

                <StatusChip

                  status={
                    selectedNotification.isRead
                      ? "Read"
                      : "Unread"
                  }

                />

              </Box>

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
                  selectedNotification.createdAt

                    ? new Date(
                        selectedNotification.createdAt
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


export default Notifications;