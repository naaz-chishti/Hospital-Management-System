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
import PaymentsIcon from "@mui/icons-material/Payments";

import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import FormDialog from "../components/FormDialog";
import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import { toast } from "react-toastify";

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";


/* =========================
   STYLES
========================= */

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

};


const viewBoxStyle = {

  p: 2,

  border: "1px solid #E2E8F0",

  borderRadius: 2,

  bgcolor: "#F8FAFC",

};


const viewLabelStyle = {

  fontSize: 13,

  color: "#64748B",

  fontWeight: 700,

  mb: 0.5,

};


/* =========================
   PAYMENTS
========================= */

function Payments() {


  /* =========================
     DATA
  ========================= */

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [patients, setPatients] =
    useState([]);

  const [bills, setBills] =
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

  const [selectedPayment, setSelectedPayment] =
    useState(null);


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] =
    useState({

      bill: "",

      patient: "",

      amount: "",

      paymentMethod: "Cash",

      transactionId: "",

      paymentStatus: "Success",

    });


  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchPayments();

    fetchPatients();

    fetchBills();

  }, []);


  /* =========================
     FETCH PAYMENTS
  ========================= */

  const fetchPayments = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/payments");

      setPayments(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load payments"
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

      toast.error(
        "Failed to load patients"
      );

    }

  };


  /* =========================
     FETCH BILLS
  ========================= */

  const fetchBills = async () => {

    try {

      const res =
        await API.get("/bills");

      setBills(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load bills"
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
     SUBMIT
  ========================= */

  const handleSubmit =
    async () => {

      try {

        if (editingId) {

          await API.put(
            `/payments/${editingId}`,
            formData
          );

          toast.success(
            "Payment updated successfully"
          );

        } else {

          await API.post(
            "/payments",
            formData
          );

          toast.success(
            "Payment created successfully"
          );

        }


        setOpen(false);

        setEditingId(null);

        setFormData({

          bill: "",

          patient: "",

          amount: "",

          paymentMethod:
            "Cash",

          transactionId: "",

          paymentStatus:
            "Success",

        });


        fetchPayments();

      } catch (err) {

        console.log(err);

        toast.error(

          err.response?.data?.message ||

          "Failed to save payment"

        );

      }

    };


  /* =========================
     VIEW
  ========================= */

  const handleView =
    (payment) => {

      setSelectedPayment(
        payment
      );

      setViewOpen(true);

    };


  /* =========================
     EDIT
  ========================= */

  const handleEdit =
    (payment) => {

      setEditingId(
        payment._id
      );


      setFormData({

        bill:
          payment.bill?._id ||
          "",

        patient:
          payment.patient?._id ||
          "",

        amount:
          payment.amount ||
          "",

        paymentMethod:
          payment.paymentMethod ||
          "Cash",

        transactionId:
          payment.transactionId ||
          "",

        paymentStatus:
          payment.paymentStatus ||
          "Success",

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
          "Delete this payment?"
        )
      ) {

        return;

      }


      try {

        await API.delete(
          `/payments/${id}`
        );

        toast.success(
          "Payment deleted successfully"
        );

        fetchPayments();

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

      label: "Payments",

      value:
        payments.length,

      icon:
        <PaymentsRoundedIcon />,

    },


    {

      label: "Completed",

      value:

        payments.filter(
          (p) =>
            p.paymentStatus ===
            "Success"
        ).length,

      icon:
        <CheckCircleRoundedIcon />,

    },


    {

      label: "Pending",

      value:

        payments.filter(
          (p) =>
            p.paymentStatus !==
            "Success"
        ).length,

      icon:
        <PendingActionsRoundedIcon />,

    },


    {

      label: "Revenue",

      value:

        `₹${payments.reduce(
          (sum, p) =>
            sum +
            Number(
              p.amount || 0
            ),

          0
        )}`,

      icon:
        <CurrencyRupeeRoundedIcon />,

    },

  ];


  /* =========================
     SEARCH + FILTER + SORT
  ========================= */

  const filteredPayments =

    [...payments]

      .filter((payment) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const patientName =

          `${payment.patient?.firstName || ""} ${
            payment.patient?.lastName || ""
          }`.toLowerCase();


        const billId =

          (
            payment.bill?.billId ||
            ""
          ).toLowerCase();


        const method =

          (
            payment.paymentMethod ||
            ""
          ).toLowerCase();


        const status =

          (
            payment.paymentStatus ||
            ""
          ).toLowerCase();


        const transactionId =

          (
            payment.transactionId ||
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

          method.includes(
            text
          ) ||

          status.includes(
            text
          ) ||

          transactionId.includes(
            text
          );


        if (
          !matchesSearch
        ) {

          return false;

        }


        /* FILTER */

        if (
          filter === "success"
        ) {

          return (
            payment.paymentStatus ===
            "Success"
          );

        }


        if (
          filter === "pending"
        ) {

          return (
            payment.paymentStatus ===
            "Pending"
          );

        }


        if (
          filter === "failed"
        ) {

          return (
            payment.paymentStatus ===
            "Failed"
          );

        }


        if (
          filter === "cash"
        ) {

          return (
            payment.paymentMethod ===
            "Cash"
          );

        }


        if (
          filter === "card"
        ) {

          return (
            payment.paymentMethod ===
            "Card"
          );

        }


        if (
          filter === "upi"
        ) {

          return (
            payment.paymentMethod ===
            "UPI"
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


        /* AMOUNT */

        if (
          sort === "amount"
        ) {

          return (

            Number(
              b.amount || 0
            ) -

            Number(
              a.amount || 0
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

        title="Payments"

        subtitle=
          "Manage hospital payment records"

        icon={
          <PaymentsRoundedIcon />
        }

        buttonText="New Payment"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            bill: "",

            patient: "",

            amount: "",

            paymentMethod:
              "Cash",

            transactionId: "",

            paymentStatus:
              "Success",

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
              "Search patient, bill, method or transaction..."

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
              All Payments
            </MenuItem>

            <MenuItem value="success">
              Successful
            </MenuItem>

            <MenuItem value="pending">
              Pending
            </MenuItem>

            <MenuItem value="failed">
              Failed
            </MenuItem>

            <MenuItem value="cash">
              Cash
            </MenuItem>

            <MenuItem value="card">
              Card
            </MenuItem>

            <MenuItem value="upi">
              UPI
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

            <MenuItem value="amount">
              Highest Amount
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
                    width: "22%",
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
                  BILL ID
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
                  }}
                >
                  AMOUNT
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "16%",
                  }}
                >
                  METHOD
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
                    width: "15%",
                  }}
                >
                  ACTIONS
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredPayments.length ===
              0 ? (

                <TableRow>

                  <TableCell

                    colSpan={6}

                    align="center"

                    sx={{
                      py: 8,
                    }}

                  >

                    <PaymentsIcon

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

                      No Payments Found

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

                filteredPayments.map(
                  (payment) => (

                    <TableRow

                      key={
                        payment._id
                      }

                      hover

                      sx={{

                        height: 76,

                        "& td": {

                          py: 1.5,

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

                              fontSize: 14,

                              flexShrink: 0,

                            }}

                          >

                            {
                              payment.patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              payment.patient
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
                                payment.patient
                                  ?.firstName
                              }{" "}

                              {
                                payment.patient
                                  ?.lastName
                              }

                            </Typography>

                          </Box>

                        </Box>

                      </TableCell>


                      {/* BILL */}

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
                              payment.bill
                                ?.billId ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* AMOUNT */}

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

                            bgcolor:
                              "#ECFDF5",

                            border:
                              "1px solid #A7F3D0",

                          }}

                        >

                          <Typography

                            fontWeight={700}

                            fontSize={13}

                            color="#059669"

                          >

                            ₹
                            {
                              payment.amount ||
                              0
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* METHOD */}

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
                              payment.paymentMethod ||
                              "-"
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
                            payment.paymentStatus ||
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

                          }}

                        >

                          <ActionButtons

                            onView={() =>
                              handleView(
                                payment
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                payment
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                payment._id
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
          CREATE / EDIT
      ========================== */}

      <FormDialog

        open={open}

        onClose={() => {

          setOpen(false);

          setEditingId(null);

        }}

        title={
          editingId
            ? "Edit Payment"
            : "New Payment"
        }

        submitText={
          editingId
            ? "Update Payment"
            : "Save Payment"
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

            select

            label="Bill"

            name="bill"

            value={
              formData.bill
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          >

            {bills.map(
              (bill) => (

                <MenuItem

                  key={
                    bill._id
                  }

                  value={
                    bill._id
                  }

                >

                  {
                    bill.billId
                  }

                </MenuItem>

              )
            )}

          </TextField>


          <TextField

            label="Amount"

            name="amount"

            type="number"

            value={
              formData.amount
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

            label="Payment Method"

            name="paymentMethod"

            value={
              formData.paymentMethod
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          >

            <MenuItem value="Cash">
              Cash
            </MenuItem>

            <MenuItem value="Card">
              Card
            </MenuItem>

            <MenuItem value="UPI">
              UPI
            </MenuItem>

            <MenuItem value="Net Banking">
              Net Banking
            </MenuItem>

          </TextField>


          <TextField

            label="Transaction ID"

            name="transactionId"

            value={
              formData.transactionId
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

            <MenuItem value="Success">
              Success
            </MenuItem>

            <MenuItem value="Failed">
              Failed
            </MenuItem>

          </TextField>

        </Box>

      </FormDialog>


      {/* =========================
          VIEW
      ========================== */}

      <FormDialog

        open={viewOpen}

        onClose={() =>
          setViewOpen(false)
        }

        title="Payment Details"

        submitText="Close"

        hideCancel

        onSubmit={() =>
          setViewOpen(false)
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

          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Bill
            </Typography>

            <Typography
              fontWeight={700}
            >

              {
                selectedPayment
                  ?.bill
                  ?.billId ||
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
              Patient
            </Typography>

            <Typography
              fontWeight={700}
            >

              {
                selectedPayment
                  ?.patient
                  ?.firstName
              }{" "}

              {
                selectedPayment
                  ?.patient
                  ?.lastName
              }

            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Amount
            </Typography>

            <Typography

              fontWeight={700}

              color="#059669"

            >

              ₹
              {
                selectedPayment
                  ?.amount ||
                0
              }

            </Typography>

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Payment Method
            </Typography>

            <Typography
              fontWeight={700}
            >

              {
                selectedPayment
                  ?.paymentMethod ||
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
              Payment Status
            </Typography>

            <StatusChip

              status={
                selectedPayment
                  ?.paymentStatus ||
                "Pending"
              }

            />

          </Box>


          <Box
            sx={viewBoxStyle}
          >

            <Typography
              sx={viewLabelStyle}
            >
              Transaction ID
            </Typography>

            <Typography
              fontWeight={700}
            >

              {
                selectedPayment
                  ?.transactionId ||
                "-"
              }

            </Typography>

          </Box>

        </Box>

      </FormDialog>


    </DashboardLayout>

  );

}


export default Payments;