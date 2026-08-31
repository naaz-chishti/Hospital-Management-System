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

import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import FormDialog from "../components/FormDialog";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";


/* =========================
   STYLES
========================= */

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
    height: 52,

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
   MEDICINES
========================= */

function Medicines() {

  const [medicines, setMedicines] =
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

  const [selectedMedicine, setSelectedMedicine] =
    useState(null);

  const [searchParams] =
    useSearchParams();


  /* FORM */

  const [formData, setFormData] =
    useState({

      medicineName: "",
      category: "",
      manufacturer: "",
      stock: 0,
      unitPrice: "",
      expiryDate: "",

    });


  /* =========================
     LOAD
  ========================= */

  useEffect(() => {

    fetchMedicines();

    if (
      searchParams.get("add") === "true"
    ) {

      setEditingId(null);

      setFormData({

        medicineName: "",
        category: "",
        manufacturer: "",
        stock: 0,
        unitPrice: "",
        expiryDate: "",

      });

      setOpen(true);

    }

  }, []);


  /* =========================
     FETCH MEDICINES
  ========================= */

  const fetchMedicines = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/medicines");

      setMedicines(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load medicines"
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================
     STATS
  ========================= */

  const stats = [

    {
      label: "Medicines",

      value:
        medicines.length,

      icon:
        <MedicationRoundedIcon />,
    },

    {
      label: "Available",

      value:
        medicines.filter(
          (m) => Number(m.stock) > 0
        ).length,

      icon:
        <CheckCircleRoundedIcon />,
    },

    {
      label: "Out of Stock",

      value:
        medicines.filter(
          (m) => Number(m.stock) === 0
        ).length,

      icon:
        <WarningAmberRoundedIcon />,
    },

    {
      label: "Categories",

      value:
        new Set(
          medicines.map(
            (m) => m.category
          )
        ).size,

      icon:
        <InventoryRoundedIcon />,
    },

  ];


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
          `/medicines/${editingId}`,
          formData
        );

        toast.success(
          "Medicine updated successfully"
        );

      } else {

        await API.post(
          "/medicines",
          formData
        );

        toast.success(
          "Medicine added successfully"
        );

      }

      setOpen(false);

      setEditingId(null);

      setFormData({

        medicineName: "",
        category: "",
        manufacturer: "",
        stock: 0,
        unitPrice: "",
        expiryDate: "",

      });

      fetchMedicines();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save medicine"
      );

    }

  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (medicine) => {

    setSelectedMedicine(
      medicine
    );

    setViewOpen(true);

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (medicine) => {

    setEditingId(
      medicine._id
    );

    setFormData({

      medicineName:
        medicine.medicineName || "",

      category:
        medicine.category || "",

      manufacturer:
        medicine.manufacturer || "",

      stock:
        medicine.stock ?? 0,

      unitPrice:
        medicine.unitPrice ?? "",

      expiryDate:
        medicine.expiryDate
          ? medicine.expiryDate.slice(
              0,
              10
            )
          : "",

    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this medicine?"
      )
    ) {
      return;
    }

    try {

      await API.delete(
        `/medicines/${id}`
      );

      toast.success(
        "Medicine deleted successfully"
      );

      fetchMedicines();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Delete failed"
      );

    }

  };


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredMedicines =

    [...medicines]

      .filter((medicine) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const medicineName =
          (
            medicine.medicineName ||
            ""
          ).toLowerCase();


        const category =
          (
            medicine.category ||
            ""
          ).toLowerCase();


        const medicineId =
          (
            medicine.medicineId ||
            ""
          ).toLowerCase();


        const manufacturer =
          (
            medicine.manufacturer ||
            ""
          ).toLowerCase();


        const matchesSearch =

          !text ||

          medicineName.includes(text) ||

          category.includes(text) ||

          medicineId.includes(text) ||

          manufacturer.includes(text);


        if (!matchesSearch) {
          return false;
        }


        /* FILTER */

        if (
          filter === "available"
        ) {

          return Number(
            medicine.stock
          ) > 0;

        }


        if (
          filter === "outofstock"
        ) {

          return Number(
            medicine.stock
          ) === 0;

        }


        if (
          filter === "lowstock"
        ) {

          return (
            Number(
              medicine.stock
            ) > 0 &&
            Number(
              medicine.stock
            ) <= 10
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

          return (
            a.medicineName || ""
          ).localeCompare(
            b.medicineName || ""
          );

        }


        /* PRICE LOW TO HIGH */

        if (
          sort === "priceLow"
        ) {

          return (
            Number(
              a.unitPrice ||
              a.price ||
              0
            ) -
            Number(
              b.unitPrice ||
              b.price ||
              0
            )
          );

        }


        /* PRICE HIGH TO LOW */

        if (
          sort === "priceHigh"
        ) {

          return (
            Number(
              b.unitPrice ||
              b.price ||
              0
            ) -
            Number(
              a.unitPrice ||
              a.price ||
              0
            )
          );

        }


        /* STOCK */

        if (
          sort === "stock"
        ) {

          return (
            Number(
              b.stock || 0
            ) -
            Number(
              a.stock || 0
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

        title="Pharmacy"

        subtitle=
          "Manage medicines and pharmacy inventory"

        icon={
          <LocalPharmacyRoundedIcon />
        }

        buttonText="Add Medicine"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            medicineName: "",
            category: "",
            manufacturer: "",
            stock: 0,
            unitPrice: "",
            expiryDate: "",

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
              "Search medicine, category, manufacturer..."

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
              All Medicines
            </MenuItem>

            <MenuItem value="available">
              Available
            </MenuItem>

            <MenuItem value="lowstock">
              Low Stock
            </MenuItem>

            <MenuItem value="outofstock">
              Out of Stock
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

                sm: 170,

                md: 170,

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

            <MenuItem value="priceLow">
              Price: Low to High
            </MenuItem>

            <MenuItem value="priceHigh">
              Price: High to Low
            </MenuItem>

            <MenuItem value="stock">
              Highest Stock
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
                  align="center"
                  sx={{
                    width: "32%",
                  }}
                >
                  MEDICINE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "14%",
                  }}
                >
                  CATEGORY
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "13%",
                  }}
                >
                  PRICE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "13%",
                  }}
                >
                  STOCK
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

              {filteredMedicines.length ===
              0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <LocalPharmacyRoundedIcon

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

                      No Medicines Found

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

                filteredMedicines.map(
                  (medicine) => (

                    <TableRow

                      key={
                        medicine._id
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


                      {/* MEDICINE */}

                      <TableCell
                        align="center"
                      >

                        <Box

                          sx={{

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
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

                            <LocalPharmacyRoundedIcon
                              fontSize="small"
                            />

                          </Avatar>


                          <Box
                            sx={{
                              textAlign:
                                "left",
                              minWidth: 120,
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
                                medicine.medicineName
                              }

                            </Typography>


                            <Typography

                              sx={{

                                fontSize: 12,

                                color:
                                  "#64748B",

                              }}

                            >

                              {
                                medicine.medicineId ||
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

                            justifyContent:
                              "center",

                            alignItems:
                              "center",

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

                            sx={{

                              fontWeight: 600,

                              fontSize: 12,

                            }}

                          >

                            {
                              medicine.category ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* PRICE */}

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

                            px: 1.5,

                            py: .6,

                            borderRadius: 2,

                            bgcolor:
                              "#ECFDF5",

                            border:
                              "1px solid #A7F3D0",

                          }}

                        >

                          <Typography

                            sx={{

                              fontWeight: 700,

                              fontSize: 13,

                              color:
                                "#059669",

                            }}

                          >

                            ₹
                            {
                              medicine.unitPrice ??
                              medicine.price ??
                              medicine.mrp ??
                              medicine.sellingPrice ??
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* STOCK */}

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

                            minWidth: 55,

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
                            fontWeight={700}
                          >

                            {
                              medicine.stock ??
                              0
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

                            Number(
                              medicine.stock
                            ) > 0

                              ? "Available"

                              : "Out of Stock"

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
                              medicine
                            )
                          }

                          onEdit={() =>
                            handleEdit(
                              medicine
                            )
                          }

                          onDelete={() =>
                            handleDelete(
                              medicine._id
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
            ? "Edit Medicine"
            : "Add Medicine"
        }

        subtitle=
          "Create or update medicine information"

        onSubmit={
          handleSubmit
        }

        submitText={
          editingId
            ? "Update Medicine"
            : "Save Medicine"
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

            label="Medicine Name"

            name="medicineName"

            value={
              formData.medicineName
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Category"

            name="category"

            value={
              formData.category
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Manufacturer"

            name="manufacturer"

            value={
              formData.manufacturer
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            type="number"

            label="Stock"

            name="stock"

            value={
              formData.stock
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            type="number"

            label="Unit Price"

            name="unitPrice"

            value={
              formData.unitPrice
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

            type="date"

            label="Expiry Date"

            name="expiryDate"

            value={
              formData.expiryDate
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

            slotProps={{

              inputLabel: {

                shrink: true,

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

        title="Medicine Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }

        hideCancel

      >

        {selectedMedicine && (

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
                Medicine
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedMedicine.medicineName ||
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
                Category
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedMedicine.category ||
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
                Manufacturer
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedMedicine.manufacturer ||
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
                Stock
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedMedicine.stock ??
                  0
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
                Unit Price
              </Typography>

              <Typography

                sx={{

                  ...viewValueStyle,

                  color:
                    "#059669",

                }}

              >

                ₹
                {
                  selectedMedicine.unitPrice ??
                  selectedMedicine.price ??
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
                Expiry Date
              </Typography>

              <Typography
                sx={
                  viewValueStyle
                }
              >

                {
                  selectedMedicine.expiryDate

                    ? new Date(
                        selectedMedicine.expiryDate
                      ).toLocaleDateString(
                        "en-GB"
                      )

                    : "-"
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
                Status
              </Typography>


              <Box sx={{ mt: 1 }}>

                <StatusChip

                  status={

                    Number(
                      selectedMedicine.stock
                    ) > 0

                      ? "Available"

                      : "Out of Stock"

                  }

                />

              </Box>

            </Box>

          </Box>

        )}

      </FormDialog>


    </DashboardLayout>

  );

}


export default Medicines;