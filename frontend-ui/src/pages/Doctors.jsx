import { useEffect, useState } from "react";
import API from "../api/axios";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  Box,
  Typography,
  TextField,
  TableRow,
  TableCell,
  Avatar,
  MenuItem,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import RoleChip from "../components/RoleChip";
import ActionButtons from "../components/ActionButtons";
import FormDialog from "../components/FormDialog";
import ModuleStats from "../components/ModuleStats";

import TablePagination from "@mui/material/TablePagination";

import { toast } from "react-toastify";


/* =========================
   TEXT FIELD STYLE
========================= */

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    minHeight: 52,
    borderRadius: 3,
    bgcolor: "#fff",

    "& fieldset": {
      borderColor: "#E2E8F0",
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
    color: "#64748B",
    fontWeight: 600,
  },

  "& .MuiInputBase-input": {
    fontSize: 14,
  },
};


/* =========================
   DOCTORS
========================= */

function Doctors() {

  const [doctors, setDoctors] = useState([]);

  const [open, setOpen] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sortField, setSortField] =
    useState("name");

  const [sortDirection, setSortDirection] =
    useState("asc");

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);


  /* =========================
     FORM DATA
  ========================= */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
    phone: "",
    experience: "",
  });


  /* =========================
     FILTER OPTIONS
  ========================= */

  const filterOptions = [
    {
      value: "all",
      label: "All Doctors",
    },
    {
      value: "active",
      label: "Active",
    },
    {
      value: "inactive",
      label: "Inactive",
    },
  ];


  /* =========================
     FETCH DOCTORS
  ========================= */

  useEffect(() => {

    fetchDoctors();

  }, []);


  const fetchDoctors = async () => {

    try {

      const res =
        await API.get("/doctors");

      setDoctors(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch doctors."
      );

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
     RESET FORM
  ========================= */

  const resetForm = () => {

    setFormData({

      name: "",
      email: "",
      password: "",
      department: "",
      specialization: "",
      phone: "",
      experience: "",

    });

  };


  /* =========================
     ADD DOCTOR
  ========================= */

  const handleAddDoctor = () => {

    setEditingId(null);

    resetForm();

    setOpen(true);

  };


  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {

    try {

      if (editingId) {

        const {
          password,
          ...updateData
        } = formData;

        await API.put(
          `/doctors/${editingId}`,
          updateData
        );

        toast.success(
          "Doctor updated successfully."
        );

      } else {

        await API.post(
          "/doctors",
          formData
        );

        toast.success(
          "Doctor added successfully."
        );

      }


      await fetchDoctors();

      setOpen(false);

      setEditingId(null);

      resetForm();

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );

    }

  };


  /* =========================
     VIEW DOCTOR
  ========================= */

  const handleView = (doctor) => {

    setSelectedDoctor(
      doctor
    );

    setViewOpen(true);

  };


  /* =========================
     EDIT DOCTOR
  ========================= */

  const handleEdit = (doctor) => {

    setEditingId(
      doctor._id
    );

    setFormData({

      name:
        doctor.name || "",

      email:
        doctor.email || "",

      password: "",

      department:
        doctor.department || "",

      specialization:
        doctor.specialization || "",

      phone:
        doctor.phone || "",

      experience:
        doctor.experience || "",

    });

    setOpen(true);

  };


  /* =========================
     DELETE DOCTOR
  ========================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete Doctor?"
      )
    ) {

      return;

    }


    try {

      await API.delete(
        `/doctors/${id}`
      );

      toast.success(
        "Doctor deleted successfully."
      );

      fetchDoctors();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to delete doctor."
      );

    }

  };


  /* =========================
     SORT
  ========================= */

  const handleSort = (field) => {

    const isAsc =
      sortField === field &&
      sortDirection === "asc";

    setSortField(field);

    setSortDirection(
      isAsc
        ? "desc"
        : "asc"
    );

  };


  /* =========================
     FILTER + SEARCH + SORT
  ========================= */

  const filteredDoctors =
    [...doctors]

      .filter((doctor) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const searchableText = `

          ${doctor.name || ""}

          ${doctor.email || ""}

          ${doctor.department || ""}

          ${doctor.specialization || ""}

          ${doctor.phone || ""}

          ${doctor.experience || ""}

        `.toLowerCase();


        const matchesSearch =
          !text ||
          searchableText.includes(
            text
          );


        const matchesStatus =
          statusFilter === "all" ||
          (
            doctor.status ||
            "Active"
          )
            .toLowerCase() ===
            statusFilter;


        return (
          matchesSearch &&
          matchesStatus
        );

      })

      .sort((a, b) => {

        const valueA =
          a[sortField] || "";

        const valueB =
          b[sortField] || "";


        const result =
          valueA
            .toString()
            .localeCompare(
              valueB
                .toString()
            );


        return sortDirection ===
          "asc"
          ? result
          : -result;

      });


  /* =========================
     PAGINATION
  ========================= */

  const paginatedDoctors =
    filteredDoctors.slice(

      page * rowsPerPage,

      page * rowsPerPage +
        rowsPerPage

    );


  /* =========================
     RESET PAGE WHEN SEARCH
  ========================= */

  useEffect(() => {

    setPage(0);

  }, [
    search,
    statusFilter,
  ]);


  /* =========================
     STATS
  ========================= */

  const activeDoctors =
    doctors.filter(
      (doctor) =>
        (
          doctor.status ||
          "Active"
        ).toLowerCase() ===
        "active"
    ).length;


  const departments =
    new Set(
      doctors
        .map(
          (doctor) =>
            doctor.department
        )
        .filter(Boolean)
    ).size;


  const experienceValues =
    doctors
      .map(
        (doctor) =>
          Number(
            doctor.experience
          )
      )
      .filter(
        (value) =>
          !Number.isNaN(value)
      );


  const averageExperience =
    experienceValues.length
      ? Math.round(
          experienceValues.reduce(
            (a, b) =>
              a + b,
            0
          ) /
            experienceValues.length
        )
      : 0;


  const stats = [

    {
      label: "Total Doctors",
      value: doctors.length,
      icon:
        <GroupsRoundedIcon />,
    },

    {
      label: "Active",
      value: activeDoctors,
      icon:
        <CheckCircleRoundedIcon />,
    },

    {
      label: "Departments",
      value: departments,
      icon:
        <LocalHospitalIcon />,
    },

    {
      label: "Avg Experience",
      value:
        `${averageExperience}+`,
      icon:
        <WorkspacePremiumIcon />,
    },

  ];


  /* =========================
     RETURN
  ========================= */

  return (

    <DashboardLayout>


      {/* HEADER */}

      <PageHeader

        title="Doctors"

        subtitle=
          "Manage hospital doctors, specialists and consultants"

        icon={
          <MedicalServicesRoundedIcon />
        }

        buttonText="Add Doctor"

        onButtonClick={
          handleAddDoctor
        }

      />


      {/* STATS */}

      <ModuleStats
        stats={stats}
      />


      {/* SEARCH / FILTER */}

      <Paper

        elevation={0}

        sx={{

          mt: 3,

          mb: 3,

          p: 2,

          borderRadius: 4,

          border:
            "1px solid #E2E8F0",

          boxShadow:
            "0 8px 24px rgba(15,23,42,.05)",

        }}

      >

        <Box

          sx={{

            display: "flex",

            gap: 1.5,

            alignItems:
              "center",

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
              "Search doctors, department, specialization..."

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

                md: 320,

              },

              "& .MuiOutlinedInput-root": {

                height: 42,

                borderRadius: 3,

                bgcolor:
                  "#F8FAFC",

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

            value={
              statusFilter
            }

            onChange={(e) =>
              setStatusFilter(
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

            {filterOptions.map(
              (option) => (

                <MenuItem
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >

                  {
                    option.label
                  }

                </MenuItem>

              )
            )}

          </TextField>


          {/* SORT */}

          <TextField

            select

            size="small"

            value={
              `${sortField}-${sortDirection}`
            }

            onChange={(e) => {

              const [
                field,
                direction,
              ] =
                e.target.value
                  .split("-");

              setSortField(field);

              setSortDirection(
                direction
              );

            }}

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

          >

            <MenuItem value="name-asc">
              Name A-Z
            </MenuItem>

            <MenuItem value="name-desc">
              Name Z-A
            </MenuItem>

            <MenuItem value="department-asc">
              Department A-Z
            </MenuItem>

            <MenuItem value="specialization-asc">
              Specialization A-Z
            </MenuItem>

            <MenuItem value="experience-desc">
              Experience High-Low
            </MenuItem>

            <MenuItem value="experience-asc">
              Experience Low-High
            </MenuItem>

          </TextField>


          {/* CLEAR */}

          {(search ||
            statusFilter !==
              "all") && (

            <Button

              onClick={() => {

                setSearch("");

                setStatusFilter(
                  "all"
                );

                setSortField(
                  "name"
                );

                setSortDirection(
                  "asc"
                );

              }}

              sx={{

                height: 42,

                textTransform:
                  "none",

                fontWeight: 700,

                color:
                  "#0F766E",

              }}

            >

              Clear

            </Button>

          )}

        </Box>

      </Paper>


      {/* TABLE */}

      <Paper

        elevation={0}

        sx={{

          borderRadius: 4,

          overflow: "hidden",

          border:
            "1px solid #E2E8F0",

          boxShadow:
            "0 12px 30px rgba(15,23,42,.05)",

        }}

      >

        <TableContainer
          sx={{
            overflowX:
              "auto",
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

                  "& .MuiTableCell-root": {

                    fontWeight:
                      "700 !important",

                    fontSize: 12,

                    color:
                      "#1E293B",

                    textTransform:
                      "uppercase",

                    letterSpacing:
                      ".6px",

                    borderBottom:
                      "1px solid #E2E8F0",

                  },

                }}

              >

                <TableCell
                  align="center"
                  sx={{
                    width: "30%",
                  }}
                >

                  DOCTOR

                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "25%",
                  }}
                >

                  EMAIL

                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
                  }}
                >

                  ROLE

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

                  ACTIONS

                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {paginatedDoctors.length ===
              0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <MedicalServicesRoundedIcon

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

                      No Doctors Found

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

                paginatedDoctors.map(
                  (doctor) => (

                    <TableRow

                      key={
                        doctor._id
                      }

                      hover

                      sx={{

                        minHeight: 76,

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

                              width: 44,

                              height: 44,

                              flexShrink: 0,

                              background:
                                "linear-gradient(135deg,#14B8A6,#0F766E)",

                              fontWeight: 700,

                            }}

                          >

                            {
                              doctor.name
                                ?.split(
                                  " "
                                )
                                .map(
                                  (n) =>
                                    n[0]
                                )
                                .join("")
                                .substring(
                                  0,
                                  2
                                )
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

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                              }}

                            >

                              {
                                doctor.name
                              }

                            </Typography>


                            <Typography

                              sx={{

                                fontSize: 12,

                                color:
                                  "#94A3B8",

                                mt: .3,

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                              }}

                            >

                              {
                                doctor.specialization ||
                                doctor.department ||
                                "General Physician"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* EMAIL */}

                      <TableCell
                        align="center"
                      >

                        <Typography

                          sx={{

                            fontSize: 13,

                            fontWeight: 500,

                            overflow:
                              "hidden",

                            textOverflow:
                              "ellipsis",

                            whiteSpace:
                              "nowrap",

                          }}

                        >

                          {
                            doctor.email
                          }

                        </Typography>

                      </TableCell>


                      {/* ROLE */}

                      <TableCell
                        align="center"
                      >

                        <RoleChip
                          role={
                            doctor.role ||
                            "Doctor"
                          }
                        />

                      </TableCell>


                      {/* STATUS */}

                      <TableCell
                        align="center"
                      >

                        <StatusChip
                          status={
                            doctor.status ||
                            "Active"
                          }
                        />

                      </TableCell>


                      {/* ACTIONS */}

                      <TableCell
                        align="center"
                      >

                        <ActionButtons

                          onView={() =>
                            handleView(
                              doctor
                            )
                          }

                          onEdit={() =>
                            handleEdit(
                              doctor
                            )
                          }

                          onDelete={() =>
                            handleDelete(
                              doctor._id
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


        {/* PAGINATION */}

        <TablePagination

          component="div"

          count={
            filteredDoctors.length
          }

          page={page}

          rowsPerPage={
            rowsPerPage
          }

          rowsPerPageOptions={[
            5,
            10,
            25,
            50,
          ]}

          onPageChange={(
            event,
            newPage
          ) => {

            setPage(
              newPage
            );

          }}

          onRowsPerPageChange={(
            event
          ) => {

            setRowsPerPage(
              parseInt(
                event.target.value,
                10
              )
            );

            setPage(0);

          }}

          sx={{

            borderTop:
              "1px solid #E2E8F0",

            "& .MuiTablePagination-toolbar": {

              minHeight: 64,

              px: 2,

            },

          }}

        />

      </Paper>


      {/* =========================
          ADD / EDIT DOCTOR
      ========================= */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Doctor"
            : "Add Doctor"
        }

        subtitle=
          "Enter doctor professional and contact details"

        submitText={
          editingId
            ? "Update Doctor"
            : "Save Doctor"
        }

        onSubmit={
          handleSubmit
        }

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

          {/* NAME */}

          <TextField

            fullWidth

            label="Doctor Name"

            name="name"

            value={
              formData.name
            }

            onChange={
              handleChange
            }

            placeholder=
              "e.g. Dr. Ahmed Khan"

            sx={
              textFieldStyle
            }

          />


          {/* EMAIL */}

          <TextField

            fullWidth

            label="Email Address"

            name="email"

            value={
              formData.email
            }

            onChange={
              handleChange
            }

            placeholder=
              "doctor@hospital.com"

            sx={
              textFieldStyle
            }

          />


          {/* PASSWORD */}

          {!editingId && (

            <TextField

              fullWidth

              type="password"

              label="Password"

              name="password"

              value={
                formData.password
              }

              onChange={
                handleChange
              }

              placeholder=
                "Enter password"

              sx={
                textFieldStyle
              }

            />

          )}


          {/* DEPARTMENT */}

          <TextField

            fullWidth

            label="Department"

            name="department"

            value={
              formData.department
            }

            onChange={
              handleChange
            }

            placeholder=
              "e.g. Cardiology"

            sx={
              textFieldStyle
            }

          />


          {/* SPECIALIZATION */}

          <TextField

            fullWidth

            label="Specialization"

            name="specialization"

            value={
              formData.specialization
            }

            onChange={
              handleChange
            }

            placeholder=
              "e.g. Interventional Cardiology"

            sx={
              textFieldStyle
            }

          />


          {/* PHONE */}

          <TextField

            fullWidth

            label="Phone Number"

            name="phone"

            value={
              formData.phone
            }

            onChange={
              handleChange
            }

            placeholder=
              "e.g. 9876543210"

            sx={
              textFieldStyle
            }

          />


          {/* EXPERIENCE */}

          <TextField

            fullWidth

            label="Experience (Years)"

            name="experience"

            type="number"

            value={
              formData.experience
            }

            onChange={
              handleChange
            }

            placeholder="e.g. 10"

            inputProps={{
              min: 0,
            }}

            sx={
              textFieldStyle
            }

          />

        </Box>

      </FormDialog>


      {/* =========================
          VIEW DOCTOR
      ========================= */}

      <FormDialog

        open={viewOpen}

        onClose={() =>
          setViewOpen(false)
        }

        title="Doctor Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }

        hideCancel

      >

        {selectedDoctor && (

          <Box

            sx={{

              mt: 2,

              display: "grid",

              gridTemplateColumns: {

                xs: "1fr",

                sm: "1fr 1fr",

              },

              gap: 2,

            }}

          >

            {[
              [
                "Doctor Name",
                selectedDoctor.name,
              ],

              [
                "Email",
                selectedDoctor.email,
              ],

              [
                "Department",
                selectedDoctor.department,
              ],

              [
                "Specialization",
                selectedDoctor.specialization,
              ],

              [
                "Phone",
                selectedDoctor.phone,
              ],

              [
                "Experience",
                selectedDoctor.experience
                  ? `${selectedDoctor.experience} Years`
                  : "-",
              ],

            ].map(
              ([label, value]) => (

                <Box

                  key={label}

                  sx={{

                    p: 2,

                    border:
                      "1px solid #E2E8F0",

                    borderRadius: 3,

                    bgcolor:
                      "#F8FAFC",

                  }}

                >

                  <Typography

                    sx={{

                      fontSize: 11,

                      fontWeight: 700,

                      color:
                        "#64748B",

                      textTransform:
                        "uppercase",

                      mb: .5,

                    }}

                  >

                    {label}

                  </Typography>


                  <Typography

                    sx={{

                      fontSize: 14,

                      fontWeight: 700,

                      color:
                        "#0F172A",

                      wordBreak:
                        "break-word",

                    }}

                  >

                    {value || "-"}

                  </Typography>

                </Box>

              )
            )}


            {/* ROLE */}

            <Box

              sx={{

                p: 2,

                border:
                  "1px solid #E2E8F0",

                borderRadius: 3,

                bgcolor:
                  "#F8FAFC",

              }}

            >

              <Typography

                sx={{

                  fontSize: 11,

                  fontWeight: 700,

                  color:
                    "#64748B",

                  textTransform:
                    "uppercase",

                  mb: 1,

                }}

              >

                Role

              </Typography>


              <RoleChip
                role={
                  selectedDoctor.role ||
                  "Doctor"
                }
              />

            </Box>


            {/* STATUS */}

            <Box

              sx={{

                p: 2,

                border:
                  "1px solid #E2E8F0",

                borderRadius: 3,

                bgcolor:
                  "#F8FAFC",

              }}

            >

              <Typography

                sx={{

                  fontSize: 11,

                  fontWeight: 700,

                  color:
                    "#64748B",

                  textTransform:
                    "uppercase",

                  mb: 1,

                }}

              >

                Status

              </Typography>


              <StatusChip
                status={
                  selectedDoctor.status ||
                  "Active"
                }
              />

            </Box>

          </Box>

        )}

      </FormDialog>

    </DashboardLayout>

  );

}


export default Doctors;