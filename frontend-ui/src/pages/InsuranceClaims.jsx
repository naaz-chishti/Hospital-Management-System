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

import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import FormDialog from "../components/FormDialog";
import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";


/* =========================
   STYLES
========================= */

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 3,
  bgcolor: "#FFFFFF",
  minHeight: 74,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const viewLabelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "#64748B",
  mb: 0.8,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

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


/* =========================
   INSURANCE CLAIMS
========================= */

function InsuranceClaims() {

  /* =========================
     DATA
  ========================= */

  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState([]);

  const [bills, setBills] = useState([]);


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

  const [selectedClaim, setSelectedClaim] = useState(null);


  /* =========================
     FORM
  ========================= */

  const [formData, setFormData] = useState({
    patient: "",
    bill: "",
    insuranceProvider: "",
    policyNumber: "",
    claimAmount: "",
    approvedAmount: "",
    status: "Pending",
  });


  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchClaims();
    fetchPatients();
    fetchBills();
  }, []);


  /* =========================
     FETCH CLAIMS
  ========================= */

  const fetchClaims = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/insurance-claims");

      setClaims(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load insurance claims"
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

      if (editingId) {

        await API.put(
          `/insurance-claims/${editingId}`,
          formData
        );

        toast.success(
          "Claim updated successfully"
        );

      } else {

        await API.post(
          "/insurance-claims",
          formData
        );

        toast.success(
          "Claim created successfully"
        );

      }

      setOpen(false);

      setEditingId(null);

      setFormData({
        patient: "",
        bill: "",
        insuranceProvider: "",
        policyNumber: "",
        claimAmount: "",
        approvedAmount: "",
        status: "Pending",
      });

      fetchClaims();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to save claim"
      );

    }
  };


  /* =========================
     VIEW
  ========================= */

  const handleView = (claim) => {

    setSelectedClaim(claim);

    setViewOpen(true);

  };


  /* =========================
     EDIT
  ========================= */

  const handleEdit = (claim) => {

    setEditingId(claim._id);

    setFormData({

      patient:
        claim.patient?._id || "",

      bill:
        claim.bill?._id || "",

      insuranceProvider:
        claim.insuranceProvider || "",

      policyNumber:
        claim.policyNumber || "",

      claimAmount:
        claim.claimAmount || "",

      approvedAmount:
        claim.approvedAmount || "",

      status:
        claim.status || "Pending",

    });

    setOpen(true);

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this claim?"
      )
    ) {
      return;
    }

    try {

      await API.delete(
        `/insurance-claims/${id}`
      );

      toast.success(
        "Claim deleted successfully"
      );

      fetchClaims();

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
      label: "Claims",

      value:
        claims.length,

      icon:
        <HealthAndSafetyRoundedIcon />,
    },

    {
      label: "Approved",

      value:
        claims.filter(
          (claim) =>
            claim.status === "Approved"
        ).length,

      icon:
        <CheckCircleRoundedIcon />,
    },

    {
      label: "Pending",

      value:
        claims.filter(
          (claim) =>
            claim.status === "Pending"
        ).length,

      icon:
        <PendingActionsRoundedIcon />,
    },

    {
      label: "Amount",

      value:
        `₹${claims.reduce(
          (sum, claim) =>
            sum +
            Number(
              claim.claimAmount || 0
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

  const filteredClaims =

    [...claims]

      .filter((claim) => {

        const text =
          search
            .toLowerCase()
            .trim();


        const patientName =

          `${claim.patient?.firstName || ""} ${
            claim.patient?.lastName || ""
          }`.toLowerCase();


        const billId =

          (
            claim.bill?.billId ||
            ""
          ).toLowerCase();


        const insuranceProvider =

          (
            claim.insuranceProvider ||
            ""
          ).toLowerCase();


        const policyNumber =

          (
            claim.policyNumber ||
            ""
          ).toLowerCase();


        const claimId =

          (
            claim.claimId ||
            ""
          ).toLowerCase();


        const matchesSearch =

          !text ||

          patientName.includes(text) ||

          billId.includes(text) ||

          insuranceProvider.includes(text) ||

          policyNumber.includes(text) ||

          claimId.includes(text);


        if (!matchesSearch) {
          return false;
        }


        /* FILTER */

        if (filter === "pending") {

          return (
            claim.status ===
            "Pending"
          );

        }


        if (filter === "approved") {

          return (
            claim.status ===
            "Approved"
          );

        }


        if (filter === "rejected") {

          return (
            claim.status ===
            "Rejected"
          );

        }


        return true;

      })


      /* SORT */

      .sort((a, b) => {

        /* NAME A-Z */

        if (sort === "name") {

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

        if (sort === "oldest") {

          return (
            new Date(
              a.createdAt || 0
            ) -
            new Date(
              b.createdAt || 0
            )
          );

        }


        /* HIGHEST CLAIM */

        if (sort === "amount") {

          return (
            Number(
              b.claimAmount || 0
            ) -
            Number(
              a.claimAmount || 0
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


      {/* PAGE HEADER */}

      <PageHeader

        title="Insurance Claims"

        subtitle=
          "Manage insurance claim requests"

        icon={
          <HealthAndSafetyRoundedIcon />
        }

        buttonText="New Claim"

        onButtonClick={() => {

          setEditingId(null);

          setFormData({

            patient: "",

            bill: "",

            insuranceProvider: "",

            policyNumber: "",

            claimAmount: "",

            approvedAmount: "",

            status: "Pending",

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
              "Search patient, bill, insurance or policy..."

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
              All Claims
            </MenuItem>

            <MenuItem value="pending">
              Pending
            </MenuItem>

            <MenuItem value="approved">
              Approved
            </MenuItem>

            <MenuItem value="rejected">
              Rejected
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

                sm: 160,

                md: 160,

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
                    width: "23%",
                  }}
                >
                  PATIENT
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
                  }}
                >
                  BILL
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "20%",
                  }}
                >
                  INSURANCE
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "15%",
                  }}
                >
                  CLAIM AMOUNT
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "13%",
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

              {filteredClaims.length ===
              0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 8,
                    }}
                  >

                    <HealthAndSafetyIcon

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

                      No Claims Found

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

                filteredClaims.map(
                  (claim) => (

                    <TableRow

                      key={
                        claim._id
                      }

                      hover

                      sx={{

                        height: 70,

                        "& td": {

                          py: 1.5,

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

                              fontSize: 13,

                              fontWeight: 700,

                              flexShrink: 0,

                              background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                            }}

                          >

                            {
                              claim.patient
                                ?.firstName
                                ?.charAt(0)
                            }

                            {
                              claim.patient
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

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                              }}

                            >

                              {
                                claim.patient
                                  ?.firstName
                              }{" "}

                              {
                                claim.patient
                                  ?.lastName
                              }

                            </Typography>


                            <Typography

                              sx={{

                                fontSize: 12,

                                color:
                                  "#94A3B8",

                              }}

                            >

                              {
                                claim.claimId ||
                                "-"
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
                              claim.bill
                                ?.billId ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* INSURANCE */}

                      <TableCell
                        align="center"
                      >

                        <Box

                          sx={{

                            display:
                              "inline-flex",

                            maxWidth: 180,

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

                            sx={{

                              fontWeight: 600,

                              fontSize: 12,

                              color:
                                "#334155",

                              whiteSpace:
                                "nowrap",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                            }}

                          >

                            {
                              claim.insuranceProvider ||
                              "-"
                            }

                          </Typography>

                        </Box>

                      </TableCell>


                      {/* CLAIM AMOUNT */}

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
                              claim.claimAmount ||
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
                            claim.status ||
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
                                claim
                              )
                            }

                            onEdit={() =>
                              handleEdit(
                                claim
                              )
                            }

                            onDelete={() =>
                              handleDelete(
                                claim._id
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
          NEW / EDIT CLAIM
      ========================== */}

      <FormDialog

        open={open}

        onClose={() => {

          setOpen(false);

          setEditingId(null);

        }}

        title={
          editingId
            ? "Edit Claim"
            : "New Claim"
        }

        subtitle=
          "Create or update insurance claim information"

        onSubmit={
          handleSubmit
        }

        submitText={
          editingId
            ? "Update Claim"
            : "Save Claim"
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

            label="Insurance Provider"

            name="insuranceProvider"

            value={
              formData.insuranceProvider
            }

            onChange={
              handleChange
            }

            sx={
              textFieldStyle
            }

          />


          <TextField

            label="Policy Number"

            name="policyNumber"

            value={
              formData.policyNumber
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

            label="Claim Amount"

            name="claimAmount"

            value={
              formData.claimAmount
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

            label="Approved Amount"

            name="approvedAmount"

            value={
              formData.approvedAmount
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

            <MenuItem value="Approved">
              Approved
            </MenuItem>

            <MenuItem value="Rejected">
              Rejected
            </MenuItem>

          </TextField>

        </Box>

      </FormDialog>


      {/* =========================
          VIEW CLAIM
      ========================== */}

      <FormDialog

        open={viewOpen}

        onClose={() =>
          setViewOpen(false)
        }

        title="Claim Details"

        submitText="Close"

        onSubmit={() =>
          setViewOpen(false)
        }

        hideCancel

      >

        {selectedClaim && (

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
                fontWeight={700}
              >

                {
                  selectedClaim.patient
                    ?.firstName
                }{" "}

                {
                  selectedClaim.patient
                    ?.lastName
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
                Bill ID
              </Typography>

              <Typography
                fontWeight={700}
              >

                {
                  selectedClaim.bill
                    ?.billId ||
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
                Insurance Provider
              </Typography>

              <Typography
                fontWeight={700}
              >

                {
                  selectedClaim.insuranceProvider ||
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
                Policy Number
              </Typography>

              <Typography
                fontWeight={700}
              >

                {
                  selectedClaim.policyNumber ||
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
                Claim Amount
              </Typography>

              <Typography
                fontWeight={700}
                color="#059669"
              >

                ₹
                {
                  selectedClaim.claimAmount ||
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
                Approved Amount
              </Typography>

              <Typography
                fontWeight={700}
                color="#2563EB"
              >

                ₹
                {
                  selectedClaim.approvedAmount ||
                  0
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

              <Box
                sx={{
                  mt: 0.8,
                }}
              >

                <StatusChip
                  status={
                    selectedClaim.status ||
                    "Pending"
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


export default InsuranceClaims;