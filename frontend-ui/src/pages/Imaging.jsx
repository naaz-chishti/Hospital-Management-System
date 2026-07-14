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

import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import { toast } from "react-toastify";

import FormDialog from "../components/FormDialog";
import {
  TextField,
  MenuItem,
} from "@mui/material";

import CameraIndoorRoundedIcon from "@mui/icons-material/CameraIndoorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function Imaging() {

const [imagings, setImagings] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [selectedImaging, setSelectedImaging] = useState(null);

const [patients, setPatients] = useState([]);
const [doctors, setDoctors] = useState([]);
const [consultations, setConsultations] = useState([]);

const [formData, setFormData] = useState({
  consultation: "",
  patient: "",
  doctor: "",
  imagingType: "",
  findings: "",
  status: "Ordered",
});

useEffect(() => {
  fetchImagings();
  fetchPatients();
  fetchDoctors();
  fetchConsultations();
}, []);

const fetchPatients = async () => {
  const res = await API.get("/patients");
  setPatients(res.data.data || []);
};

const fetchDoctors = async () => {
  const res = await API.get("/doctors");
  setDoctors(res.data.data || []);
};

const fetchConsultations = async () => {
  const res = await API.get("/consultations");
  setConsultations(res.data.data || []);
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

      await API.put(
        `/imaging/${editingId}`,
        formData
      );

      toast.success("Imaging updated");

    } else {

      await API.post(
        "/imaging",
        formData
      );

      toast.success("Imaging created");

    }

    setOpen(false);
    setEditingId(null);

    setFormData({
      consultation: "",
      patient: "",
      doctor: "",
      imagingType: "",
      findings: "",
      status: "Ordered",
    });

    fetchImagings();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Something went wrong"
    );

  }
};

const handleEdit = (item) => {

  setEditingId(item._id);

  setFormData({
    consultation: item.consultation?._id || "",
    patient: item.patient?._id || "",
    doctor: item.doctor?._id || "",
    imagingType: item.imagingType || "",
    findings: item.findings || "",
    status: item.status || "Ordered",
  });

  setOpen(true);

};

const handleView = (item) => {

  setSelectedImaging(item);

  setViewOpen(true);

};

const handleDelete = async (id) => {

  if (!window.confirm("Delete Imaging?"))
    return;

  try {

    await API.delete(`/imaging/${id}`);

    toast.success("Deleted successfully");

    fetchImagings();

  } catch (err) {

    toast.error(
      err.response?.data?.message
    );

  }

};

const stats = [
  {
    label: "Total Scans",
    value: imagings.length,
    icon: <CameraIndoorRoundedIcon />,
  },
  {
    label: "Completed",
    value: imagings.filter(
      (i) => i.reportStatus === "Completed"
    ).length,
    icon: <CheckCircleRoundedIcon />,
  },
  {
    label: "Pending",
    value: imagings.filter(
      (i) => i.reportStatus !== "Completed"
    ).length,
    icon: <PendingActionsRoundedIcon />,
  },
  {
    label: "Radiologists",
    value: new Set(
      imagings.map((i) => i.doctor?.name)
    ).size,
    icon: <MedicalServicesRoundedIcon />,
  },
];

const filteredImagings = imagings.filter((item) => {
  const text = search.toLowerCase();

  return (
    `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`
      .toLowerCase()
      .includes(text) ||
    (item.doctor?.name || "")
      .toLowerCase()
      .includes(text) ||
    (item.testType || "")
      .toLowerCase()
      .includes(text)
  );
});

const fetchImagings = async () => {

try {

  const res =
    await API.get("/imaging");

  setImagings(res.data.data);

} catch (error) {

  console.log(error);

} finally {

  setLoading(false);

}

};

return ( <DashboardLayout>

<PageHeader
title="Imaging"
subtitle="Manage radiology and imaging reports"
icon={<CameraAltRoundedIcon />}
buttonText="New Imaging"
onButtonClick={() => {
  setEditingId(null);

  setFormData({
    consultation: "",
    patient: "",
    doctor: "",
    imagingType: "",
    findings: "",
    status: "Ordered",
  });

  setOpen(true);
}}
/>

<ModuleStats stats={stats} />

<SearchBar
  placeholder="Search imaging..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

 {loading ? (

<Box
textAlign="center"
mt={8}
>
<CircularProgress />
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
boxShadow:"0 8px 24px rgba(15,23,42,.05)",
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
background:"#F8FAFC",

"& .MuiTableCell-head":{
fontWeight:"700 !important",
fontSize:"13px",
color:"#1E293B",
textTransform:"uppercase",
letterSpacing:"0.5px",
borderBottom:"1px solid #E2E8F0",
},
}}
>

<TableCell sx={{width:"38%", pl:5.5}}>
PATIENT
</TableCell>

<TableCell sx={{width:"38%", pl:5.5}}>
DOCTOR
</TableCell>

<TableCell align="center" sx={{width:"38%"}}>
SCAN
</TableCell>

<TableCell align="center" sx={{width:"35%"}}>
REPORT
</TableCell>

<TableCell align="center" sx={{width:"20%"}}>
STATUS
</TableCell>

<TableCell align="center" sx={{width:"32%"}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredImagings.length === 0 ? (

<TableRow>

<TableCell
colSpan={6}
align="center"
sx={{ py: 8 }}
>

<CameraAltRoundedIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography
mt={2}
fontWeight={700}
>
No Imaging Records Found
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredImagings.map((item) => (

<TableRow
key={item._id}
hover
sx={{
"& td":{
py:2.2,
px:2,
borderBottom:"1px solid #EEF2F7",
verticalAlign:"middle",
},
}}
>

  {/* Patient */}

<TableCell sx={{ width: "30%" }}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Avatar
sx={{
width:42,
height:42,
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
fontWeight:700,
fontSize:15,          
letterSpacing:0.3,
flexShrink:0,
}}
>
{item.patient?.firstName?.charAt(0)}
{item.patient?.lastName?.charAt(0)}
</Avatar>

    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1.3,
        }}
      >
        {item.patient?.firstName} {item.patient?.lastName}
      </Typography>

      <Typography
        sx={{
          fontSize: 12,
          color: "#64748B",
          mt: 0.3,
        }}
      >
        {item.imagingId}
      </Typography>
    </Box>
  </Box>
</TableCell>

{/* Doctor */}

<TableCell sx={{ width: "24%" }}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        width: 40,
        height: 40,
        bgcolor: "#ECFDF5",
        color: "#059669",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {item.doctor?.name?.charAt(0)}
    </Avatar>

    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1.3,
        }}
      >
        {item.doctor?.name}
      </Typography>

      <Typography
        sx={{
          fontSize: 12,
          color: "#64748B",
          mt: 0.3,
        }}
      >
        Radiologist
      </Typography>
    </Box>
  </Box>
</TableCell>

{/* Scan */}

<TableCell
  align="center"
  sx={{ width: "16%" }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 0.8,
        borderRadius: 2,
        bgcolor: "#EFF6FF",
        border: "1px solid #BFDBFE",
        minWidth: 170,
      }}
    >
      <CameraAltRoundedIcon
        sx={{
          color: "#2563EB",
          fontSize: 18,
        }}
      />

      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 13,
          color: "#1E293B",
        }}
      >
        {item.testType || item.scanType || "X-Ray Chest"}
      </Typography>

    </Box>
  </Box>
</TableCell>

{/* Report */}

<TableCell
align="center"
sx={{ width: "12%" }}
>

<Box
display="flex"
justifyContent="center"
>

<Box
sx={{
display:"inline-flex",
minWidth:90,
justifyContent:"center",
px:2,
py:.7,
borderRadius:2,
bgcolor:"#F8FAFC",
border:"1px solid #E2E8F0",
}}
>

<Typography
fontWeight={600}
fontSize={13}
>
{item.createdAt
? new Date(item.createdAt).toLocaleDateString()
: "-"}
</Typography>

</Box>

</Box>

</TableCell>

<TableCell
align="center"
sx={{ width: "12%" }}
>

<Box
display="flex"
justifyContent="center"
>

<StatusChip
status={item.reportStatus || "Pending"}
/>

</Box>

</TableCell>

<TableCell
align="center"
sx={{ width: "8%" }}
>

<Box
display="flex"
justifyContent="center"
>

<ActionButtons
onView={() => handleView(item)}
onEdit={() => handleEdit(item)}
onDelete={() => handleDelete(item._id)}
/>

</Box>

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
  title={
    editingId
      ? "Edit Imaging"
      : "New Imaging"
  }
  submitText={
    editingId
      ? "Update Imaging"
      : "Save Imaging"
  }
  onSubmit={handleSubmit}
>

<Box
sx={{
mt:3,
display:"grid",
gridTemplateColumns:{
xs:"1fr",
md:"1fr 1fr",
},
gap:2.5,
}}
>

<TextField
select
label="Consultation"
name="consultation"
value={formData.consultation}
onChange={handleChange}
>

{consultations.map((c)=>(

<MenuItem
key={c._id}
value={c._id}
>
{c.consultationId}
</MenuItem>

))}

</TextField>

<TextField
select
label="Patient"
name="patient"
value={formData.patient}
onChange={handleChange}
>

{patients.map((patient)=>(

<MenuItem
key={patient._id}
value={patient._id}
>
{patient.firstName} {patient.lastName}
</MenuItem>

))}

</TextField>

<TextField
select
label="Doctor"
name="doctor"
value={formData.doctor}
onChange={handleChange}
>

{doctors.map((doctor)=>(

<MenuItem
key={doctor._id}
value={doctor._id}
>
{doctor.name}
</MenuItem>

))}

</TextField>

<TextField
select
label="Imaging Type"
name="imagingType"
value={formData.imagingType}
onChange={handleChange}
>

<MenuItem value="X-Ray">
X-Ray
</MenuItem>

<MenuItem value="Ultrasound">
Ultrasound
</MenuItem>

<MenuItem value="CT Scan">
CT Scan
</MenuItem>

<MenuItem value="MRI">
MRI
</MenuItem>

<MenuItem value="ECG">
ECG
</MenuItem>

</TextField>

<TextField
fullWidth
multiline
rows={4}
label="Findings"
name="findings"
value={formData.findings}
onChange={handleChange}
sx={{
gridColumn:{
xs:"span 1",
md:"span 2",
},
}}
/>

<TextField
select
label="Status"
name="status"
value={formData.status}
onChange={handleChange}
>

<MenuItem value="Ordered">
Ordered
</MenuItem>

<MenuItem value="Completed">
Completed
</MenuItem>

</TextField>

</Box>

</FormDialog>

<FormDialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  title="Imaging Details"
  hideSubmit
>

<Box
sx={{
mt:2,
display:"grid",
gridTemplateColumns:{
xs:"1fr",
md:"1fr 1fr",
},
gap:2.5,
}}
>

<Box
sx={{
p:2,
border:"1px solid #E2E8F0",
borderRadius:2,
bgcolor:"#F8FAFC",
}}
>
<Typography
sx={{
fontSize:13,
fontWeight:700,
color:"#94A3B8",
}}
>
Imaging ID
</Typography>

<Typography fontWeight={700} mt={0.5}>
{selectedImaging?.imagingId}
</Typography>
</Box>

<Box
sx={{
p:2,
border:"1px solid #E2E8F0",
borderRadius:2,
bgcolor:"#F8FAFC",
}}
>
<Typography
sx={{
fontSize:13,
fontWeight:700,
color:"#94A3B8",
}}
>
Patient
</Typography>

<Typography fontWeight={700} mt={0.5}>
{selectedImaging?.patient?.firstName}{" "}
{selectedImaging?.patient?.lastName}
</Typography>
</Box>

<Box
sx={{
p:2,
mt:3,
border:"1px solid #E2E8F0",
borderRadius:2,
bgcolor:"#F8FAFC",
}}
>
<Typography
sx={{
fontSize:13,
fontWeight:700,
color:"#94A3B8",
}}
>
Doctor
</Typography>

<Typography fontWeight={700} mt={0.5}>
{selectedImaging?.doctor?.name}
</Typography>
</Box>

<Box
sx={{
p:2,
border:"1px solid #E2E8F0",
borderRadius:2,
bgcolor:"#F8FAFC",
}}
>
<Typography
sx={{
fontSize:13,
fontWeight:700,
color:"#94A3B8",
}}
>
Imaging Type
</Typography>

<Typography fontWeight={700} mt={0.5}>
{selectedImaging?.imagingType}
</Typography>
</Box>

<Box
sx={{
p:2,
border:"1px solid #E2E8F0",
borderRadius:2,
bgcolor:"#F8FAFC",
gridColumn:{
xs:"span 1",
md:"span 2",
},
}}
>
<Typography
sx={{
fontSize:13,
fontWeight:700,
color:"#94A3B8",
}}
>
Findings
</Typography>

<Typography fontWeight={700} mt={0.5}>
{selectedImaging?.findings || "-"}
</Typography>
</Box>

<Box
sx={{
p:2,
border:"1px solid #E2E8F0",
borderRadius:2,
bgcolor:"#F8FAFC",
}}
>
<Typography
sx={{
fontSize:13,
fontWeight:700,
color:"#94A3B8",
mb:1,
}}
>
Status
</Typography>

<StatusChip
status={selectedImaging?.status || "Ordered"}
/>

</Box>

</Box>

</FormDialog>

</DashboardLayout>

);
}

export default Imaging;
