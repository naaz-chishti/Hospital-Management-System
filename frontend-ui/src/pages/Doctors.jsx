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
  InputAdornment,
} from "@mui/material";

import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableContainer,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

import SearchBar from "../components/SearchBar";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import RoleChip from "../components/RoleChip";
import ActionButtons from "../components/ActionButtons";
import FormDialog from "../components/FormDialog";

import ModuleStats from "../components/ModuleStats";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TableFilters from "../components/TableFilters";
import TablePagination from "@mui/material/TablePagination";

import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

import { toast } from "react-toastify";

import {
  Stack,
} from "@mui/material";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    height: 58,
    borderRadius: "14px",
    bgcolor: "#FFFFFF",
    transition: "all .25s ease",

    "& fieldset": {
      borderColor: "#E2E8F0",
    },

    "&:hover": {
      bgcolor: "#FCFDFE",
    },

    "&:hover fieldset": {
      borderColor: "#14B8A6",
    },

    "&.Mui-focused": {
      bgcolor: "#FFFFFF",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#14B8A6",
      borderWidth: 2,
      boxShadow: "0 0 0 4px rgba(20,184,166,.08)",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#64748B",
    fontWeight: 600,
    fontSize: 14,
  },

  "& .MuiInputBase-input": {
    fontSize: 14,
    fontWeight: 500,
  },
};


function Doctors() {

  const [doctors, setDoctors] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);

const [rowsPerPage, setRowsPerPage] = useState(10);

const handleView = (doctor) => {
  setSelectedDoctor(doctor);
  setViewOpen(true);
};

  const [statusFilter, setStatusFilter] =
  useState("all");

  const [sortField, setSortField] = useState("name");
const [sortDirection, setSortDirection] = useState("asc");

const [viewOpen, setViewOpen] = useState(false);
const [selectedDoctor, setSelectedDoctor] = useState(null);

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

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  department: "",
  specialization: "",
  phone: "",
  experience: "",
});

  useEffect(() => {
    fetchDoctors();
  }, []);

 const fetchDoctors = async () => {

  try {

    const res = await API.get("/doctors");

    setDoctors(res.data.data);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to fetch doctors."
    );

  }

};

const handleChange = (e) => {

  setFormData({

    ...formData,

    [e.target.name]: e.target.value,

  });

};

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

  setFormData({
  name: "",
  email: "",
  password: "",
  department: "",
  specialization: "",
  phone: "",
  experience: "",
});

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Something went wrong."
    );

    console.log(error);

  }

};

const handleDelete = async (id) => {

  if (!window.confirm("Delete Doctor?")) return;

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

const handleEdit = (doctor) => {

  setEditingId(doctor._id);

  setFormData({
  name: doctor.name,
  email: doctor.email,
  password: "",
  department: doctor.department || "",
  specialization: doctor.specialization || "",
  phone: doctor.phone || "",
  experience: doctor.experience || "",
});

  setOpen(true);

};

const handleSort = (field) => {

  const isAsc =
    sortField === field &&
    sortDirection === "asc";

  setSortDirection(
    isAsc ? "desc" : "asc"
  );

  setSortField(field);

};

  const stats = [
  {
    label: "Total Doctors",
    value: doctors.length,
    icon: <GroupsRoundedIcon />,
  },
  {
    label: "Active",
    value: doctors.length,
    icon: <CheckCircleRoundedIcon />,
  },
  {
    label: "Departments",
    value: 8,
    icon: <LocalHospitalIcon />,
  },
  {
    label: "Avg Experience",
    value: "10+",
    icon: <WorkspacePremiumIcon />
  },
];

const filteredDoctors = doctors
  .filter((doctor) => {
    const matchesSearch =
      doctor.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      doctor.email
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      doctor.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";

    if (sortDirection === "asc") {
      return valueA.toString().localeCompare(valueB.toString());
    }

    return valueB.toString().localeCompare(valueA.toString());
  });

const paginatedDoctors = filteredDoctors.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

console.log(doctors);

  return (

    <DashboardLayout>

<PageHeader
  title="Doctors"
  subtitle="Manage hospital doctors, specialists and consultants"
  icon={<MedicalServicesRoundedIcon />}
  buttonText="Add Doctor"
  onButtonClick={() => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setOpen(true);
  }}
/>

<ModuleStats stats={stats} />

<TableFilters
  search={search}
  onSearchChange={(e) =>
    setSearch(e.target.value)
  }
  filter={statusFilter}
  onFilterChange={(e) =>
    setStatusFilter(e.target.value)
  }
  filterOptions={filterOptions}
  placeholder="Search doctors..."
  onReset={() => {
    setSearch("");
    setStatusFilter("all");
  }}
/>

<Paper
  elevation={0}
  sx={{
  mt: 3,
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid #E2E8F0",
  boxShadow: "0 12px 30px rgba(15,23,42,.05)",
}}
>
  <TableContainer>

 <Table
sx={{
width:"100%",
tableLayout:"fixed",
}}
>

     <TableHead>

<TableRow
sx={{
background:"#F8FAFC",

"& .MuiTableCell-root":{
fontWeight:"700 !important",
fontSize:"13px",
color:"#1E293B",
textTransform:"uppercase",
letterSpacing:".6px",
borderBottom:"1px solid #E2E8F0",
},
}}
>

<TableCell align="center" sx={{ pl: 4 }}>
  DOCTOR
</TableCell>

<TableCell align="center">EMAIL</TableCell>

<TableCell align="center">ROLE</TableCell>

<TableCell align="center">STATUS</TableCell>

<TableCell align="center">ACTIONS</TableCell>

</TableRow>

</TableHead>

     <TableBody>

{paginatedDoctors.length === 0 ? (

<TableRow>

<TableCell
colSpan={5}
align="center"
sx={{ py: 8 }}
>

<MedicalServicesRoundedIcon
sx={{
fontSize:60,
color:"#CBD5E1",
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
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

paginatedDoctors.map((doctor)=>(

<TableRow
key={doctor._id}
hover
sx={{
height:74,

"& td":{
py:2,
px:3,
borderBottom:"1px solid #EEF2F7",
verticalAlign:"middle",
},

"&:hover":{
background:"#F8FAFC",
},
}}
>

{/* Doctor */}

<TableCell width="40%">

<Box
sx={{
display: "flex",
alignItems: "center",
gap: 2,
}}
>

<Avatar
sx={{
width: 44,
height: 44,
background: "linear-gradient(135deg,#14B8A6,#0F766E)",
fontWeight: 700,
flexShrink: 0,
}}
>
{doctor.name
?.split(" ")
.map((n) => n[0])
.join("")
.substring(0, 2)}
</Avatar>

<Box
sx={{
display: "flex",
flexDirection: "column",
justifyContent: "center",
}}
>

<Typography
sx={{
fontWeight: 700,
fontSize: 14,
lineHeight: 1.3,
whiteSpace: "nowrap",
}}
>
{doctor.name}
</Typography>

<Typography
  sx={{
    fontSize: 12,
    color: "#94A3B8",
    mt: 0.3,
  }}
>
  {doctor.specialization ||
   doctor.department ||
   "General Physician"}
</Typography>

</Box>

</Box>

</TableCell>

{/* Email */}

<TableCell width="10%" align="center">

<Typography
fontWeight={400}
fontSize={14}
>
{doctor.email}
</Typography>

<Typography
sx={{
fontSize: 12,
color: "#64748B",
lineHeight: 1.3,
fontWeight:500,
letterSpacing:"0.4px",
mt:0.3,
}}
>
Official Email
</Typography>

</TableCell>

{/* Role */}

<TableCell align="center">

<RoleChip
role={doctor.role || "Doctor"}
/>

</TableCell>

{/* Status */}

<TableCell align="center">

<StatusChip
status={doctor.status || "Active"}
/>

</TableCell>

{/* Actions */}

<TableCell align="center">

<ActionButtons
onView={()=>handleView(doctor)}
onEdit={()=>handleEdit(doctor)}
onDelete={()=>handleDelete(doctor._id)}
/>

</TableCell>

</TableRow>

))

)}

</TableBody>

    </Table>

  </TableContainer>

  <TablePagination
component="div"
count={filteredDoctors.length}
page={page}
rowsPerPage={rowsPerPage}
rowsPerPageOptions={[5,10,25,50]}
onPageChange={(event,newPage)=>setPage(newPage)}
onRowsPerPageChange={(event)=>{
setRowsPerPage(parseInt(event.target.value,10));
setPage(0);
}}
sx={{
borderTop:"1px solid #E2E8F0",
background:"#fff",

"& .MuiTablePagination-toolbar":{
minHeight:64,
px:3,
},

"& .MuiTablePagination-selectLabel":{
fontWeight:600,
color:"#475569",
},

"& .MuiTablePagination-displayedRows":{
fontWeight:600,
color:"#475569",
},

"& .MuiTablePagination-actions button":{
borderRadius:2,
},
}}
/>

</Paper>

      <FormDialog
open={open}
onClose={()=>setOpen(false)}
title={
editingId
? "Edit Doctor"
: "Add Doctor"
}
submitText={
editingId
? "Update"
: "Save"
}
onSubmit={handleSubmit}
>

<Box
  sx={{
    mt: 3,
    px: 3,
    pb: 2,
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    columnGap: 2.5,
    rowGap: 2.5,
    alignItems: "start",
  }}
>

  {/* Doctor Name */}

  <Box>
    <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#64748B" }}>
      Doctor Name
    </Typography>

    <TextField
      fullWidth
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Enter Doctor Name"
      sx={textFieldStyle}
    />
  </Box>

  {/* Email */}

  <Box>
    <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#64748B" }}>
      Email Address
    </Typography>

    <TextField
      fullWidth
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Enter Email Address"
      sx={textFieldStyle}
    />
  </Box>

  {/* Password */}

  {!editingId && (

    <Box>
      <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#64748B" }}>
        Password
      </Typography>

      <TextField
        fullWidth
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter Password"
        sx={textFieldStyle}
      />
    </Box>

  )}

  {/* Department */}

  <Box>
    <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#64748B" }}>
      Department
    </Typography>

    <TextField
      fullWidth
      name="department"
      value={formData.department}
      onChange={handleChange}
      placeholder="Enter Department"
      sx={textFieldStyle}
    />
  </Box>

  {/* Specialization */}

  <Box>
    <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#64748B" }}>
      Specialization
    </Typography>

    <TextField
      fullWidth
      name="specialization"
      value={formData.specialization}
      onChange={handleChange}
      placeholder="Enter Specialization"
      sx={textFieldStyle}
    />
  </Box>

  {/* Phone */}

  <Box>
    <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#64748B" }}>
      Phone Number
    </Typography>

    <TextField
      fullWidth
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="Enter Phone Number"
      sx={textFieldStyle}
    />
  </Box>

  {/* Experience */}

  <Box>
    <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#64748B" }}>
      Experience
    </Typography>

    <TextField
      fullWidth
      name="experience"
      value={formData.experience}
      onChange={handleChange}
      placeholder="Enter Experience"
      sx={textFieldStyle}
    />
  </Box>

</Box>
</FormDialog>

<FormDialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  title="Doctor Details"
  submitText="Close"
  onSubmit={() => setViewOpen(false)}
>

 <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    gap: 2.5,
    mt: 3,
  }}
>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
      Doctor Name
    </Typography>

    <Typography sx={{ mt: .5, fontSize: 15, fontWeight: 600 }}>
      {selectedDoctor?.name || "-"}
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
      Email Address
    </Typography>

    <Typography sx={{ mt: .5, fontSize: 15, fontWeight: 600 }}>
      {selectedDoctor?.email || "-"}
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
      Department
    </Typography>

    <Typography sx={{ mt: .5, fontSize: 15, fontWeight: 600 }}>
      {selectedDoctor?.department || "-"}
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
      Specialization
    </Typography>

    <Typography sx={{ mt: .5, fontSize: 15, fontWeight: 600 }}>
      {selectedDoctor?.specialization || "-"}
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
      Phone Number
    </Typography>

    <Typography sx={{ mt: .5, fontSize: 15, fontWeight: 600 }}>
      {selectedDoctor?.phone || "-"}
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
      Experience
    </Typography>

    <Typography sx={{ mt: .5, fontSize: 15, fontWeight: 600 }}>
      {selectedDoctor?.experience
        ? `${selectedDoctor.experience} Years`
        : "-"}
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
      Role
    </Typography>

    <Typography sx={{ mt: .5, fontSize: 15, fontWeight: 600 }}>
      {selectedDoctor?.role || "Doctor"}
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2,
      border: "1px solid #E2E8F0",
      borderRadius: 2,
      bgcolor: "#F8FAFC",
    }}
  >
    <Typography
      sx={{
        fontSize: 13,
        color: "#94A3B8",
        fontWeight: 700,
        mb: 1,
      }}
    >
      Status
    </Typography>

    <StatusChip
      status={selectedDoctor?.status || "Active"}
    />
  </Box>

</Box>

</FormDialog>

    </DashboardLayout>

  );

}

export default Doctors;