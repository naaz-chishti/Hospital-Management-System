import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import PageHeader from "../components/PageHeader";
import ModuleStats from "../components/ModuleStats";
import StatusChip from "../components/StatusChip";
import ActionButtons from "../components/ActionButtons";
import FormDialog from "../components/FormDialog";

import { toast } from "react-toastify";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import { useSearchParams } from "react-router-dom";


/* =========================
   STYLES
========================= */

const textFieldStyle = {

  "& .MuiOutlinedInput-root": {

    borderRadius: 3,

    background: "#fff",

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

  borderRadius: 2,

  bgcolor: "#F8FAFC",

};


const viewLabelStyle = {

  fontSize: 13,

  color: "#94A3B8",

  fontWeight: 700,

  mb: 1,

};


/* =========================
   BILLING
========================= */

function Billing() {


  /* =========================
     DATA
  ========================= */

  const [bills, setBills] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [patients, setPatients] =
    useState([]);


  /* =========================
     SEARCH / FILTER / SORT
  ========================= */

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("latest");


  /* =========================
     DIALOGS
  ========================= */

  const [open, setOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [selectedBill, setSelectedBill] =
    useState(null);


  /* =========================
     URL PARAM
  ========================= */

  const [searchParams] =
    useSearchParams();


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] =
    useState({

      patient: "",

      consultationFee: 0,

      labFee: 0,

      imagingFee: 0,

      admissionFee: 0,

      medicineFee: 0,

      paymentStatus: "Pending",

      totalAmount: 0,

    });


  /* =========================
     LOAD
  ========================= */

  useEffect(() => {

    fetchBills();

    fetchPatients();

    if (
      searchParams.get("add") ===
      "true"
    ) {

      setEditingId(null);

      setFormData({

        patient: "",

        consultationFee: 0,

        labFee: 0,

        imagingFee: 0,

        admissionFee: 0,

        medicineFee: 0,

        paymentStatus:
          "Pending",

        totalAmount: 0,

      });

      setOpen(true);

    }

  }, []);


  /* =========================
     FETCH BILLS
  ========================= */

  const fetchBills = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/bills");

      setBills(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load bills"
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

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load patients"
      );

    }

  };


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    const updated = {

      ...formData,

      [name]: value,

    };


    updated.totalAmount =

      Number(
        updated.consultationFee || 0
      )

      +

      Number(
        updated.labFee || 0
      )

      +

      Number(
        updated.imagingFee || 0
      )

      +

      Number(
        updated.admissionFee || 0
      )

      +

      Number(
        updated.medicineFee || 0
      );


    setFormData(updated);

  };


  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit =
    async () => {

      try {

        if (editingId) {

          await API.put(
            `/bills/${editingId}`,
            formData
          );

          toast.success(
            "Bill updated successfully"
          );

        } else {

          await API.post(
            "/bills",
            formData
          );

          toast.success(
            "Bill created successfully"
          );

        }


        setOpen(false);

        setEditingId(null);

        fetchBills();

      } catch (err) {

        console.log(err);

        toast.error(

          err.response?.data?.message ||

          "Failed to save bill"

        );

      }

    };


  /* =========================
     VIEW
  ========================= */

  const handleView =
    (bill) => {

      setSelectedBill(bill);

      setViewOpen(true);

    };


  /* =========================
     EDIT
  ========================= */

  const handleEdit =
    (bill) => {

      setEditingId(
        bill._id
      );


      setFormData({

        patient:
          bill.patient?._id || "",

        consultationFee:
          bill.consultationFee || 0,

        labFee:
          bill.labFee || 0,

        imagingFee:
          bill.imagingFee || 0,

        admissionFee:
          bill.admissionFee || 0,

        medicineFee:
          bill.medicineFee || 0,

        paymentStatus:
          bill.paymentStatus ||
          "Pending",

        totalAmount:
          bill.totalAmount || 0,

      });


      setOpen(true);

    };


  /* =========================
     DELETE
  ========================= */

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this bill?"
        )
      ) {

        return;

      }


      try {

        await API.delete(
          `/bills/${id}`
        );

        toast.success(
          "Bill deleted successfully"
        );

        fetchBills();

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

      label: "Total Bills",

      value:
        bills.length,

      icon:
        <ReceiptLongRoundedIcon />,

    },


    {

      label: "Paid",

      value:

        bills.filter(
          (b) =>
            b.paymentStatus ===
            "Paid"
        ).length,

      icon:
        <PaymentsRoundedIcon />,

    },


    {

      label: "Pending",

      value:

        bills.filter(
          (b) =>
            b.paymentStatus !==
            "Paid"
        ).length,

      icon:
        <PendingActionsRoundedIcon />,

    },


    {

      label: "Revenue",

      value:

        "₹" +

        bills.reduce(
          (sum, b) =>
            sum +
            Number(
              b.totalAmount || 0
            ),

          0
        ),

      icon:
        <AccountBalanceWalletRoundedIcon />,

    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredBills =
    [...bills]

      .filter((bill) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const patientName =

          `${bill.patient?.firstName || ""} ${
            bill.patient?.lastName || ""
          }`.toLowerCase();


        const billId =

          (
            bill.billId ||
            ""
          ).toLowerCase();


        const status =

          (
            bill.paymentStatus ||
            ""
          ).toLowerCase();


        const matchesSearch =

          !text ||

          patientName.includes(
            text
          ) ||

          billId.includes(
            text
          ) ||

          status.includes(
            text
          );


        if (
          !matchesSearch
        ) {

          return false;

        }


        /* FILTER */

        if (
          filter === "paid"
        ) {

          return (
            bill.paymentStatus ===
            "Paid"
          );

        }


        if (
          filter === "pending"
        ) {

          return (
            bill.paymentStatus !==
            "Paid"
          );

        }


        if (
          filter === "high"
        ) {

          return (
            Number(
              bill.totalAmount || 0
            ) >= 10000
          );

        }


        if (
          filter === "low"
        ) {

          return (
            Number(
              bill.totalAmount || 0
            ) < 10000
          );

        }


        return true;

      })


      .sort((a, b) => {

        /* NAME A-Z */

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
            )

            -

            new Date(
              b.createdAt || 0
            )

          );

        }


        /* LATEST */

        return (

          new Date(
            b.createdAt || 0
          )

          -

          new Date(
            a.createdAt || 0
          )

        );

      });


  /* =========================
     CLEAR
  ========================= */

  const clearSearch =
    () => {

      setSearch("");

      setFilter("all");

      setSort("latest");

    };


  /* =========================
     RENDER
  ========================= */

  return (

    <DashboardLayout>


      {/* PAGE HEADER */}

      <PageHeader

        title="Billing"

        subtitle=
          "Manage hospital invoices and payments"

        icon={
          <ReceiptLongRoundedIcon />
        }

        buttonText="Create Bill"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            patient: "",

            consultationFee: 0,

            labFee: 0,

            imagingFee: 0,

            admissionFee: 0,

            medicineFee: 0,

            paymentStatus:
              "Pending",

            totalAmount: 0,

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
              "Search patient, invoice or payment..."

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
              All Bills
            </MenuItem>

            <MenuItem value="paid">
              Paid
            </MenuItem>

            <MenuItem value="pending">
              Pending
            </MenuItem>

            <MenuItem value="high">
              ₹10,000+
            </MenuItem>

            <MenuItem value="low">
              Below ₹10,000
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

              minWidth: 1050,

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
                    width: "18%",
                  }}
                >
                  PATIENT
                </TableCell>

                <TableCell
                  align="center"
                >
                  CONSULT
                </TableCell>

                <TableCell
                  align="center"
                >
                  LAB
                </TableCell>

                <TableCell
                  align="center"
                >
                  IMAGE
                </TableCell>

                <TableCell
                  align="center"
                >
                  ADMISSION
                </TableCell>

                <TableCell
                  align="center"
                >
                  MEDICINE
                </TableCell>

                <TableCell
                  align="center"
                >
                  TOTAL
                </TableCell>

                <TableCell
                  align="center"
                >
                  STATUS
                </TableCell>

                <TableCell
                  align="center"
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredBills.length ===
              0 ? (

                <TableRow>

                  <TableCell

                    colSpan={9}

                    align="center"

                    sx={{
                      py: 8,
                    }}

                  >

                    <ReceiptLongRoundedIcon

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

                      No Bills Found

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

                filteredBills.map(
                  (bill) => (

                    <TableRow

                      key={
                        bill._id
                      }

                      hover

                      sx={{

                        "& td": {

                          py: 2,

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

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                              fontWeight: 700,

                              fontSize: 15,

                            }}

                          >

                            {
                              bill.patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              bill.patient
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

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                              }}

                            >

                              {
                                bill.patient
                                  ?.firstName
                              }{" "}

                              {
                                bill.patient
                                  ?.lastName
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
                                bill.billId ||
                                "-"
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      <TableCell
                        align="center"
                      >

                        ₹
                        {
                          bill.consultationFee ||
                          0
                        }

                      </TableCell>


                      <TableCell
                        align="center"
                      >

                        ₹
                        {
                          bill.labFee ||
                          0
                        }

                      </TableCell>


                      <TableCell
                        align="center"
                      >

                        ₹
                        {
                          bill.imagingFee ||
                          0
                        }

                      </TableCell>


                      <TableCell
                        align="center"
                      >

                        ₹
                        {
                          bill.admissionFee ||
                          0
                        }

                      </TableCell>


                      <TableCell
                        align="center"
                      >

                        ₹
                        {
                          bill.medicineFee ||
                          0
                        }

                      </TableCell>


                      {/* TOTAL */}

                      <TableCell
                        align="center"
                      >

                        <Box

                          sx={{

                            display:
                              "inline-flex",

                            px: 1.5,

                            py: .6,

                            borderRadius: 2,

                            background:
                              "#ECFDF5",

                            border:
                              "1px solid #A7F3D0",

                          }}

                        >

                          <Typography

                            fontWeight={700}

                            color="#059669"

                          >

                            ₹
                            {
                              bill.totalAmount ||
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
                            bill.paymentStatus ||
                            "Pending"
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
                              bill
                            )
                          }

                          onEdit={() =>
                            handleEdit(
                              bill
                            )
                          }

                          onDelete={() =>
                            handleDelete(
                              bill._id
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
      ========================== */}

      <FormDialog

        open={open}

        onClose={() =>
          setOpen(false)
        }

        title={
          editingId
            ? "Edit Bill"
            : "Create Bill"
        }

        submitText={
          editingId
            ? "Update Bill"
            : "Save Bill"
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

            label="Consultation Fee"

            name="consultationFee"

            type="number"

            value={
              formData.consultationFee
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Lab Fee"

            name="labFee"

            type="number"

            value={
              formData.labFee
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Imaging Fee"

            name="imagingFee"

            type="number"

            value={
              formData.imagingFee
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Admission Fee"

            name="admissionFee"

            type="number"

            value={
              formData.admissionFee
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Medicine Fee"

            name="medicineFee"

            type="number"

            value={
              formData.medicineFee
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          {/* TOTAL */}

          <TextField

            fullWidth

            label="Total Amount"

            name="totalAmount"

            value={
              formData.totalAmount ||
              0
            }

            InputProps={{

              readOnly: true,

            }}

            InputLabelProps={{
              shrink: true,
            }}

            sx={{

              ...textFieldStyle,

              "& .MuiOutlinedInput-root": {

                borderRadius: 3,

                backgroundColor:
                  "#fff",

              },

              "& .MuiInputBase-input": {

                WebkitTextFillColor:
                  "#0F172A",

                color:
                  "#0F172A",

                fontWeight: 600,

              },

            }}

          />


          <TextField

            select

            label="Payment Status"

            name="paymentStatus"

            value={
              formData.paymentStatus
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

            <MenuItem value="Paid">
              Paid
            </MenuItem>

          </TextField>

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

        title="Bill Details"

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
              sx={viewLabelStyle}
            >
              Bill ID
            </Typography>

            <Typography
              fontWeight={700}
            >

              {
                selectedBill
                  ?.billId ||
                "-"
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={viewLabelStyle}
            >
              Patient
            </Typography>

            <Typography
              fontWeight={700}
            >

              {
                selectedBill
                  ?.patient
                  ?.firstName
              }{" "}

              {
                selectedBill
                  ?.patient
                  ?.lastName
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={viewLabelStyle}
            >
              Consultation Fee
            </Typography>

            <Typography
              fontWeight={700}
            >

              ₹
              {
                selectedBill
                  ?.consultationFee ||
                0
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={viewLabelStyle}
            >
              Lab Fee
            </Typography>

            <Typography
              fontWeight={700}
            >

              ₹
              {
                selectedBill
                  ?.labFee ||
                0
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={viewLabelStyle}
            >
              Imaging Fee
            </Typography>

            <Typography
              fontWeight={700}
            >

              ₹
              {
                selectedBill
                  ?.imagingFee ||
                0
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={viewLabelStyle}
            >
              Admission Fee
            </Typography>

            <Typography
              fontWeight={700}
            >

              ₹
              {
                selectedBill
                  ?.admissionFee ||
                0
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={viewLabelStyle}
            >
              Medicine Fee
            </Typography>

            <Typography
              fontWeight={700}
            >

              ₹
              {
                selectedBill
                  ?.medicineFee ||
                0
              }

            </Typography>

          </Box>


          <Box sx={viewBoxStyle}>

            <Typography
              sx={viewLabelStyle}
            >
              Total Amount
            </Typography>

            <Typography
              fontWeight={700}
              color="#059669"
            >

              ₹
              {
                selectedBill
                  ?.totalAmount ||
                0
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
              sx={viewLabelStyle}
            >
              Payment Status
            </Typography>

            <StatusChip

              status={
                selectedBill
                  ?.paymentStatus ||
                "Pending"
              }

            />

          </Box>

        </Box>

      </FormDialog>


    </DashboardLayout>

  );

}


export default Billing;