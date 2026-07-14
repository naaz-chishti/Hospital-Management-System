import {
useEffect,
useState
} from "react";

import {
  Box,
  CircularProgress,
  Avatar,
  Typography,
  TableRow,
  TableCell,
} from "@mui/material";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import BloodtypeRoundedIcon from "@mui/icons-material/BloodtypeRounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";

import { toast } from "react-toastify";

import FormDialog from "../components/FormDialog";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useSearchParams } from "react-router-dom";

import {
  TextField,
  InputAdornment,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    height: 50,
    borderRadius: "10px",
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
};

function Patients() {

const [patients, setPatients] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [searchParams] = useSearchParams();

const [open, setOpen] = useState(false);
const [editingId, setEditingId] = useState(null);

const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  bloodGroup: "",
  address: "",
  dob: "",
});


const [page, setPage] = useState(0);

const [rowsPerPage, setRowsPerPage] = useState(10);

const [selectedPatient, setSelectedPatient] = useState(null);

const [viewOpen, setViewOpen] = useState(false);

const fetchPatients = async () => {
  try {
    const res = await API.get("/patients");
    setPatients(res.data.data);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to fetch patients."
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchPatients();

  if (searchParams.get("add") === "true") {
    setEditingId(null);

    setFormData({
      // default form values
    });

    setOpen(true);
  }
}, []);

const handleEdit = (patient) => {

  setEditingId(patient._id);

  setFormData({
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: patient.email,
    phone: patient.phone,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    address: patient.address || "",
    dob: patient.dob?.substring(0,10) || "",
  });

  setOpen(true);
};

const handleChange = (e) => {

setFormData({

...formData,

[e.target.name]:e.target.value,

});

};

const handleView = (patient) => {

setSelectedPatient(patient);

setViewOpen(true);

};

const handleSubmit = async () => {

try{

if(editingId){

await API.put(
`/patients/${editingId}`,
formData
);

toast.success("Patient updated successfully");

}else{

await API.post(
"/patients",
formData
);

toast.success("Patient added successfully");

}

fetchPatients();

setOpen(false);

setEditingId(null);

setFormData({
firstName:"",
lastName:"",
email:"",
phone:"",
gender:"",
bloodGroup:"",
address:"",
dob:"",
});

}catch(error){

toast.error(
error.response?.data?.message ||
"Something went wrong."
);

}

};

const handleDelete = async(id)=>{

if(!window.confirm("Delete Patient?")) return;

try{

await API.delete(`/patients/${id}`);

toast.success("Patient deleted successfully");

fetchPatients();

}catch(error){

toast.error(
error.response?.data?.message ||
"Delete failed"
);

}

};

const stats = [
  {
    label: "Total Patients",
    value: patients.length,
    icon: <GroupsRoundedIcon />,
  },
  {
    label: "Male",
    value: patients.filter(
      (p) => p.gender === "Male"
    ).length,
    icon: <MaleRoundedIcon />,
  },
  {
    label: "Female",
    value: patients.filter(
      (p) => p.gender === "Female"
    ).length,
    icon: <FemaleRoundedIcon />,
  },
  {
    label: "Blood Groups",
    value: 8,
    icon: <BloodtypeRoundedIcon />,
  },
];

const filteredPatients = patients.filter((patient) => {
  const text = search.toLowerCase();

  return (
    `${patient.firstName || ""} ${patient.lastName || ""}`
      .toLowerCase()
      .includes(text) ||
    (patient.email || "")
      .toLowerCase()
      .includes(text) ||
    (patient.patientId || "")
      .toLowerCase()
      .includes(text) ||
    (patient.phone || "")
      .toLowerCase()
      .includes(text)
  );
});


return ( <DashboardLayout>

 <PageHeader
  title="Patients"
  subtitle="Manage patient records and medical information"
  icon={<PersonRoundedIcon />}
  buttonText="Add Patient"
  onButtonClick={() => {
    setEditingId(null);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      bloodGroup: "",
    });

    setOpen(true);
  }}
/>

<ModuleStats stats={stats} />

<SearchBar
  title="Patients"
  subtitle="Search & Filter Patients"
  icon={<PersonRoundedIcon />}
  placeholder="Search by patient name, ID or phone..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

 {loading ? (

<Box
  sx={{
    height: 300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
mt:3,
borderRadius:4,
border:"1px solid #E2E8F0",
overflow:"hidden",
}}
>

<Table
sx={{
width:"100%",
tableLayout:"fixed",
}}
>

<TableHead>

<TableRow
sx={{
bgcolor:"#F8FAFC",
}}
>

<TableCell align="center" sx={{width:"15%",pl:1.2, fontWeight:700}}>
PATIENT
</TableCell>

<TableCell align="center" sx={{width:"6%",fontWeight:700}}>
EMAIL
</TableCell>

<TableCell
align="center"
sx={{width:"12%",fontWeight:700}}
>
GENDER
</TableCell>

<TableCell
align="center"
sx={{width:"6%",fontWeight:700}}
>
BLOOD GROUP
</TableCell>

<TableCell
align="center"
sx={{width:"6%",fontWeight:700}}
>
STATUS
</TableCell>

<TableCell
align="center"
sx={{width:"12%",fontWeight:700}}
>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredPatients.length === 0 ? (

<TableRow>

<TableCell
colSpan={6}
align="center"
sx={{
py:8
}}
>

<PersonIcon
sx={{
fontSize:60,
color:"#CBD5E1"
}}
/>

<Typography
mt={2}
fontWeight={700}
>
No Patients Found
</Typography>

<Typography
color="text.secondary"
>
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredPatients.map((patient)=>(

<TableRow
  key={patient._id}
  hover
  sx={{
    "& td": {
  py: 2,
  px: 3,
  ml:0,
      borderBottom: "1px solid #EEF2F7",
      verticalAlign: "middle",
    },
"&:hover":{

bgcolor:"#F8FAFC",

transform:"scale(1.002)",

transition:".25s"

},
  }}
>

<TableCell
  sx={{
    width: "22%",
    pl: 2,
  }}
>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:1.5,
ml:2,
}}
>

<Avatar
sx={{
width:42,
height:42,
fontSize:16,
fontWeight:700,
color:"#fff",
background:
"linear-gradient(135deg,#0F766E,#14B8A6)",

boxShadow:
"0 8px 20px rgba(20,184,166,.25)",
}}
>
{patient.firstName?.charAt(0)}
{patient.lastName?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontSize:15,
fontWeight:700,
color:"#0F172A",
}}
>
{patient.firstName} {patient.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#64748B",
mt:.3,
}}
>
Patient ID : {patient.patientId}
</Typography>

</Box>

</Box>

</TableCell>

<TableCell
sx={{
width:"24%",
}}
>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:14,
color:"#0F172A",
}}
>
{patient.email}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#94A3B8",
mt:.2,
}}
>
Primary Email
</Typography>

</Box>

</TableCell>

<TableCell
align="center"
sx={{
width:"12%",
}}
>

<Box
sx={{
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:.7,
}}
>

{patient.gender==="Male"
?
<MaleRoundedIcon
sx={{
fontSize:18,
color:"#2563EB",
}}
/>
:
<FemaleRoundedIcon
sx={{
fontSize:18,
color:"#EC4899",
}}
/>
}

<Typography
sx={{
fontWeight:600,
fontSize:13,
}}
>
{patient.gender}
</Typography>

</Box>

</TableCell>

<TableCell
align="center"
sx={{
width:"12%",
}}
>

<Box
sx={{
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:.7,
}}
>

<BloodtypeRoundedIcon
sx={{
fontSize:18,
color:"#DC2626",
}}
/>

<Typography
sx={{
fontWeight:700,
}}
>
{patient.bloodGroup}
</Typography>

</Box>

</TableCell>

<TableCell
align="center"
sx={{
width:"10%",
}}
>

<StatusChip
status={
patient.status || "Active"
}
/>

</TableCell>

<TableCell
align="center"
sx={{
width:"12%",
}}
>

<ActionButtons
onView={()=>handleView(patient)}
onEdit={()=>handleEdit(patient)}
onDelete={()=>handleDelete(patient._id)}
/>

</TableCell>

</TableRow>

))

)}

</TableBody>

</Table>

</TableContainer>

)}

<FormDialog
  open={open}
  onClose={() => setOpen(false)}
  title={editingId ? "Edit Patient" : "Add Patient"}
  submitText={editingId ? "Update" : "Save"}
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
   <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
    First Name
  </Typography>

  <TextField
  fullWidth
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
  placeholder="Enter First Name"
  sx={textFieldStyle}
/>
</Box>

    <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
    Last Name
  </Typography>

  <TextField
    fullWidth
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
    placeholder="Enter Last Name"
    sx={textFieldStyle}
  />
</Box>

   <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
    Email Address
  </Typography>

  <TextField
    fullWidth
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Enter Email"
    sx={textFieldStyle}
  />
</Box>

   <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
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

    <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
    Gender
  </Typography>

  <ToggleButtonGroup
    exclusive
    fullWidth
    value={formData.gender}
    onChange={(e, value) => {
      if (value !== null) {
        setFormData({
          ...formData,
          gender: value,
        });
      }
    }}
    sx={{
      "& .MuiToggleButton-root": {
        textTransform: "none",
        fontWeight: 600,
        height: 50,
        borderColor: "#E2E8F0",
      },

      "& .Mui-selected": {
        background:
          "linear-gradient(135deg,#14B8A6,#0F766E) !important",
        color: "#fff !important",
      },
    }}
  >
    <ToggleButton value="Male">
      Male
    </ToggleButton>

    <ToggleButton value="Female">
      Female
    </ToggleButton>

    <ToggleButton value="Other">
      Other
    </ToggleButton>
  </ToggleButtonGroup>
</Box>

    <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
    Blood Group
  </Typography>

  <TextField
    fullWidth
    name="bloodGroup"
    value={formData.bloodGroup}
    onChange={handleChange}
    placeholder="Enter Blood Group"
    sx={textFieldStyle}
  />
</Box>

  <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
    Date of Birth
  </Typography>

  <TextField
    fullWidth
    type="date"
    name="dob"
    value={formData.dob || ""}
    onChange={handleChange}
    sx={textFieldStyle}
  />
</Box>

   <Box>
  <Typography
    sx={{
      mb: 1,
      fontSize: 13,
      fontWeight: 600,
      color: "#64748B",
    }}
  >
    Address
  </Typography>

  <TextField
    fullWidth
    name="address"
    value={formData.address}
    onChange={handleChange}
    placeholder="Enter Address"
    sx={textFieldStyle}
  />
</Box>
  </Box>
</FormDialog>

<FormDialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  title="Patient Details"
  submitText="Close"
  onSubmit={() => setViewOpen(false)}
  maxWidth="sm"
>
 <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    gap: 3,
    mt: 2,
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
    <Typography
      sx={{
        fontSize: 13,
        color: "#94A3B8",
        fontWeight: 700,
      }}
    >
      Patient ID
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
        color: "#0F172A",
      }}
    >
      {selectedPatient?.patientId || "-"}
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
      }}
    >
      Name
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {selectedPatient?.firstName} {selectedPatient?.lastName}
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
      }}
    >
      Email Address
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {selectedPatient?.email || "-"}
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
      }}
    >
      Phone Number
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {selectedPatient?.phone || "-"}
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
      }}
    >
      Gender
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {selectedPatient?.gender || "-"}
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
      }}
    >
      Blood Group
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {selectedPatient?.bloodGroup || "-"}
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
      }}
    >
      Address
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {selectedPatient?.address || "-"}
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
      }}
    >
      Date of Birth
    </Typography>

    <Typography
      sx={{
        mt: 0.5,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {selectedPatient?.dob
        ? new Date(selectedPatient.dob).toLocaleDateString("en-GB")
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
      status={selectedPatient?.status || "Active"}
    />
  </Box>

</Box>
</FormDialog>

</DashboardLayout>

);
}

export default Patients;
