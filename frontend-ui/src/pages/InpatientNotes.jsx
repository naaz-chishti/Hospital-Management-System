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
  Button,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";

import ModuleStats from "../components/ModuleStats";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import ActionButtons from "../components/ActionButtons";

import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";


const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",

    "& fieldset": {
      borderColor: "#CBD5E1",
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


function InpatientNotes() {

  /* =========================
     DATA
  ========================= */

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admissionsList, setAdmissionsList] = useState([]);


  /* =========================
     SEARCH / FILTER / SORT
  ========================= */

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");


  /* =========================
     DIALOGS
  ========================= */

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] = useState({
    admission: "",
    patient: "",
    doctor: "",
    bp: "",
    pulse: "",
    temperature: "",
    oxygenLevel: "",
    notes: "",
  });


  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchNotes();
    fetchPatients();
    fetchDoctors();
    fetchAdmissionsList();
  }, []);


  /* =========================
     FETCH PATIENTS
  ========================= */

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load patients");
    }
  };


  /* =========================
     FETCH DOCTORS
  ========================= */

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load doctors");
    }
  };


  /* =========================
     FETCH ADMISSIONS
  ========================= */

  const fetchAdmissionsList = async () => {
    try {
      const res = await API.get("/admissions");
      setAdmissionsList(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load admissions");
    }
  };


  /* =========================
     FETCH NOTES
  ========================= */

  const fetchNotes = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/inpatient-notes");

      setNotes(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load inpatient notes"
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
     SUBMIT
  ========================= */

  const handleSubmit = async () => {

    try {

      const payload = {

        admission: formData.admission,
        patient: formData.patient,
        doctor: formData.doctor,

        vitals: {
          bp: formData.bp,
          pulse: formData.pulse,
          temperature: formData.temperature,
          oxygenLevel: formData.oxygenLevel,
        },

        notes: formData.notes,

      };


      if (editingId) {

        await API.put(
          `/inpatient-notes/${editingId}`,
          payload
        );

        toast.success(
          "Note updated successfully"
        );

      } else {

        await API.post(
          "/inpatient-notes",
          payload
        );

        toast.success(
          "Note added successfully"
        );

      }


      setOpen(false);
      setEditingId(null);

      setFormData({
        admission: "",
        patient: "",
        doctor: "",
        bp: "",
        pulse: "",
        temperature: "",
        oxygenLevel: "",
        notes: "",
      });

      fetchNotes();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save note"
      );

    }
  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (note) => {

    setSelectedNote(note);
    setViewOpen(true);

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (note) => {

    setEditingId(note._id);

    setFormData({

      admission:
        note.admission?._id || "",

      patient:
        note.patient?._id || "",

      doctor:
        note.doctor?._id || "",

      bp:
        note.vitals?.bp || "",

      pulse:
        note.vitals?.pulse || "",

      temperature:
        note.vitals?.temperature || "",

      oxygenLevel:
        note.vitals?.oxygenLevel || "",

      notes:
        note.notes ||
        note.progressNote ||
        "",

    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this note?"
      )
    ) {
      return;
    }


    try {

      await API.delete(
        `/inpatient-notes/${id}`
      );

      toast.success(
        "Note deleted successfully"
      );

      fetchNotes();

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
      label: "Notes",
      value: notes.length,
      icon: <AssignmentRoundedIcon />,
    },

    {
      label: "Patients",

      value:
        new Set(
          notes
            .map(
              (n) => n.patient?._id
            )
            .filter(Boolean)
        ).size,

      icon:
        <PersonRoundedIcon />,
    },

    {
      label: "Admissions",

      value:
        new Set(
          notes
            .map(
              (n) =>
                n.admission?.admissionId
            )
            .filter(Boolean)
        ).size,

      icon:
        <AssignmentRoundedIcon />,
    },

    {
      label: "Today's Notes",

      value:
        notes.filter((note) => {

          if (!note.createdAt) {
            return false;
          }

          const today =
            new Date();

          const noteDate =
            new Date(
              note.createdAt
            );

          return (
            today.toDateString() ===
            noteDate.toDateString()
          );

        }).length,

      icon:
        <EventNoteRoundedIcon />,
    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredNotes = [...notes]

    .filter((note) => {

      const text =
        search
          .toLowerCase()
          .trim();


      const patientName =
        `${note.patient?.firstName || ""} ${
          note.patient?.lastName || ""
        }`.toLowerCase();


      const doctorName =
        (
          note.doctor?.name ||
          ""
        ).toLowerCase();


      const admissionId =
        (
          note.admission?.admissionId ||
          ""
        ).toLowerCase();


      const noteId =
        (
          note.noteId ||
          ""
        ).toLowerCase();


      const progressNote =
        (
          note.progressNote ||
          note.note ||
          note.notes ||
          ""
        ).toLowerCase();


      const matchesSearch =
        !text ||
        patientName.includes(text) ||
        doctorName.includes(text) ||
        admissionId.includes(text) ||
        noteId.includes(text) ||
        progressNote.includes(text);


      if (!matchesSearch) {
        return false;
      }


      /* FILTER */

      if (
        filter === "today"
      ) {

        if (!note.createdAt) {
          return false;
        }

        const today =
          new Date();

        const noteDate =
          new Date(
            note.createdAt
          );

        return (
          today.toDateString() ===
          noteDate.toDateString()
        );

      }


      if (
        filter === "withVitals"
      ) {

        return Boolean(
          note.vitals?.bp ||
          note.vitals?.pulse ||
          note.vitals?.temperature ||
          note.vitals?.oxygenLevel
        );

      }


      if (
        filter === "withoutVitals"
      ) {

        return !(
          note.vitals?.bp ||
          note.vitals?.pulse ||
          note.vitals?.temperature ||
          note.vitals?.oxygenLevel
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


  /* =========================
     RESET SEARCH
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

      <PageHeader
        title="Inpatient Notes"
        subtitle="Manage inpatient progress notes"
        icon={<NoteAltRoundedIcon />}

        buttonText="Add Note"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            admission: "",
            patient: "",
            doctor: "",
            bp: "",
            pulse: "",
            temperature: "",
            oxygenLevel: "",
            notes: "",

          });

          setOpen(true);

        }}

      />


      <ModuleStats
        stats={stats}
      />


      {/* =========================
          SEARCH / FILTER / SORT
      ========================== */}

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
              "Search patient, doctor, admission, notes..."

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
              All Notes
            </MenuItem>

            <MenuItem value="today">
              Today's Notes
            </MenuItem>

            <MenuItem value="withVitals">
              With Vitals
            </MenuItem>

            <MenuItem value="withoutVitals">
              Without Vitals
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

              onClick={
                clearSearch
              }

              sx={{

                height: 42,

                minWidth: 65,

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
      ========================== */}

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

                    borderBottom:
                      "1px solid #E2E8F0",

                  },

                }}

              >

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
                  ADMISSION
                </TableCell>

                <TableCell
                  sx={{
                    width: "24%",
                  }}
                >
                  PROGRESS NOTE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "16%",
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

              {filteredNotes.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <NoteAltRoundedIcon
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
                      No Notes Found
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

                filteredNotes.map(
                  (note) => (

                    <TableRow

                      key={
                        note._id
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

                            gap: 1.5,

                          }}
                        >

                          <Avatar

                            sx={{

                              width: 42,
                              height: 42,

                              fontSize: 14,

                              fontWeight: 700,

                              color: "#fff",

                              background:
                                "linear-gradient(135deg,#8B5CF6,#A855F7)",

                              flexShrink: 0,

                            }}

                          >

                            {
                              note.patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              note.patient
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
                                note.patient
                                  ?.firstName
                              }{" "}

                              {
                                note.patient
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

                              {
                                note.noteId ||
                                "-"
                              }

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

                            justifyContent:
                              "center",

                            minWidth: 90,

                            px: 1.5,

                            py: .6,

                            borderRadius: 2,

                            bgcolor:
                              "#EFF6FF",

                            border:
                              "1px solid #BFDBFE",

                          }}
                        >

                          <Typography

                            fontWeight={600}

                            fontSize={12}

                          >

                            {
                              note.admission
                                ?.admissionId ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* PROGRESS NOTE */}

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

                            maxWidth: 260,

                          }}
                        >

                          <Typography

                            sx={{

                              fontSize: 12,

                              fontWeight: 600,

                              color:
                                "#92400E",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",

                            }}

                          >

                            {
                              note.progressNote ||
                              note.note ||
                              note.notes ||
                              "No progress note"
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

                            justifyContent:
                              "center",

                            minWidth: 90,

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

                            fontWeight={600}

                            fontSize={12}

                          >

                            {
                              note.createdAt

                                ? new Date(
                                    note.createdAt
                                  ).toLocaleDateString(
                                    "en-IN"
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

                          }}
                        >

                          <ActionButtons

                            onView={() =>
                              handleView(
                                note
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                note
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                note._id
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
          ADD / EDIT DIALOG
      ========================== */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Inpatient Note"
            : "New Inpatient Note"
        }

        submitText={
          editingId
            ? "Update Note"
            : "Save Note"
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
                    item.admissionId
                  }

                </MenuItem>

              )
            )}

          </TextField>


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


          <TextField

            label="Blood Pressure"

            name="bp"

            value={
              formData.bp
            }

            onChange={
              handleChange
            }

            placeholder="120/80"

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Pulse"

            name="pulse"

            value={
              formData.pulse
            }

            onChange={
              handleChange
            }

            placeholder="72 bpm"

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Temperature"

            name="temperature"

            value={
              formData.temperature
            }

            onChange={
              handleChange
            }

            placeholder="98.6 °F"

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Oxygen Level"

            name="oxygenLevel"

            value={
              formData.oxygenLevel
            }

            onChange={
              handleChange
            }

            placeholder="98%"

            sx={
              textFieldStyle
            }

          />


          <TextField

            multiline

            rows={5}

            label="Progress Notes"

            name="notes"

            value={
              formData.notes
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


      {/* =========================
          VIEW DIALOG
      ========================== */}

      <FormDialog

        open={viewOpen}

        onClose={() =>
          setViewOpen(false)
        }

        title="Inpatient Note Details"

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
              Note ID
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedNote
                  ?.noteId ||
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
                selectedNote
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
                selectedNote
                  ?.patient
                  ?.firstName
              }{" "}

              {
                selectedNote
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
                selectedNote
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
              Blood Pressure
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedNote
                  ?.vitals
                  ?.bp ||
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
              Pulse
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedNote
                  ?.vitals
                  ?.pulse ||
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
              Temperature
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedNote
                  ?.vitals
                  ?.temperature ||
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
              Oxygen Level
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedNote
                  ?.vitals
                  ?.oxygenLevel ||
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
              }}
            >
              Progress Notes
            </Typography>

            <Typography mt={.5}>

              {
                selectedNote
                  ?.notes ||
                selectedNote
                  ?.progressNote ||
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
              }}
            >
              Date
            </Typography>

            <Typography
              mt={.5}
              fontWeight={700}
            >

              {
                selectedNote
                  ?.createdAt

                  ? new Date(
                      selectedNote.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )

                  : "-"
              }

            </Typography>

          </Box>

        </Box>

      </FormDialog>

    </DashboardLayout>

  );
}


export default InpatientNotes;