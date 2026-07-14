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

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import { toast } from "react-toastify";

import FormDialog from "../components/FormDialog";

import {
  TextField,
  MenuItem,
} from "@mui/material";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";

import BedroomParentRoundedIcon from "@mui/icons-material/BedroomParentRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import { useSearchParams } from "react-router-dom";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
  },
};

const viewBoxStyle = {
  p:2,
  border:"1px solid #E2E8F0",
  borderRadius:2,
  bgcolor:"#F8FAFC",
};

const viewLabelStyle = {
  fontSize:13,
  color:"#94A3B8",
  fontWeight:700,
  mb:1,
};

function Admissions() {

  const [admissions, setAdmissions] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [selectedAdmission, setSelectedAdmission] = useState(null);

const [patients, setPatients] = useState([]);
const [doctors, setDoctors] = useState([]);

const [searchParams] = useSearchParams();

const [formData, setFormData] = useState({
  patient: "",
  doctor: "",
  ward: "",
  bedNumber: "",
  reason: "",
  status: "Admitted",
});

 useEffect(() => {
  fetchAdmissions();
  fetchPatients();
  fetchDoctors();

  if (searchParams.get("add") === "true") {
    setEditingId(null);

    setFormData({
      // default form values
    });

    setOpen(true);
  }
}, []);

const fetchPatients = async () => {
  try {

    const res = await API.get("/patients");

    setPatients(res.data.data || []);

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load patients"
    );

  }
};

const fetchDoctors = async () => {
  try {

    const res = await API.get("/doctors");

    setDoctors(res.data.data || []);

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load doctors"
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

      await API.put(`/admissions/${editingId}`, formData);
      toast.success("Admission updated successfully");

    } else {

      await API.post("/admissions", formData);
      toast.success("Admission created successfully");

    }

    setOpen(false);
    setEditingId(null);

    setFormData({
      patient: "",
      doctor: "",
      ward: "",
      bedNumber: "",
      reason: "",
      status: "Admitted",
    });

    fetchAdmissions();

  } catch (err) {

    console.log(err);
    console.log(err.response?.data);

    toast.error(
      err.response?.data?.message || "Failed to save admission"
    );
  }
};

const handleView = (admission) => {
  setSelectedAdmission(admission);
  setViewOpen(true);
};

const handleEdit = (admission) => {

  setEditingId(admission._id);

  setFormData({
    patient: admission.patient?._id || "",
    doctor: admission.doctor?._id || "",
    ward: admission.ward || "",
    bedNumber: admission.bedNumber || "",
    reason: admission.reason || "",
    status: admission.status || "Admitted",
  });

  setOpen(true);
};

const handleDelete = async (id) => {

  if (!window.confirm("Delete this admission?"))
    return;

  try {

    await API.delete(`/admissions/${id}`);

    toast.success(
      "Admission deleted successfully"
    );

    fetchAdmissions();

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to delete admission"
    );

  }

};

  const fetchAdmissions = async () => {
  try {

    const res = await API.get("/admissions");

    setAdmissions(res.data.data || []);

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load admissions"
    );

  } finally {

    setLoading(false);

  }
};

const stats = [
  {
    label: "Admissions",
    value: admissions.length,
    icon: <BedroomParentRoundedIcon />,
  },
  {
    label: "Active",
    value: admissions.filter(
      (a) => a.status === "Admitted"
    ).length,
    icon: <CheckCircleRoundedIcon />,
  },
  {
    label: "Wards",
    value: new Set(
      admissions.map((a) => a.ward)
    ).size,
    icon: <MeetingRoomRoundedIcon />,
  },
  {
    label: "Doctors",
    value: new Set(
      admissions.map((a) => a.doctor?.name)
    ).size,
    icon: <LocalHospitalRoundedIcon />,
  },
];

const filteredAdmissions = admissions.filter((admission) => {
  const text = search.toLowerCase();

  return (
    `${admission.patient?.firstName || ""} ${admission.patient?.lastName || ""}`
      .toLowerCase()
      .includes(text) ||

    (admission.doctor?.name || "")
      .toLowerCase()
      .includes(text) ||

    (admission.ward || "")
      .toLowerCase()
      .includes(text) ||

    (admission.bedNumber || "")
      .toLowerCase()
      .includes(text)
  );
});

  return (
    <DashboardLayout>

    <PageHeader
  title="Admissions"
  subtitle="Manage inpatient admissions"
  icon={<BedroomParentRoundedIcon />}
  buttonText="New Admission"
 onButtonClick={() => {
  setEditingId(null);

  setFormData({
    patient: "",
    doctor: "",
    ward: "",
    bedNumber: "",
    reason: "",
    status: "Admitted",
  });

  setOpen(true);
}}
/>

<ModuleStats stats={stats} />

<SearchBar
  title="Admissions"
  subtitle="Search & Filter Admissions"
  icon={<BedroomParentRoundedIcon />}
  placeholder="Search patient, ward or doctor..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      {loading ? (

<Box
sx={{
height:300,
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>
<CircularProgress
size={45}
thickness={4}
/>
</Box>

) : (

<TableContainer
sx={{
  mt: 3,
  borderRadius: 4,
  border: "1px solid #E2E8F0",
  overflow: "hidden",
  width: "100%",
}}
>

<Table
sx={{
tableLayout:"fixed",
width:"100%",
}}
>

<TableHead>

<TableRow
sx={{
background:"#F8FAFC",

"& .MuiTableCell-head":{
fontWeight:"700 !important",
fontSize:"12px",
color:"#1E293B",
textTransform:"uppercase",
letterSpacing:"0.5px",
borderBottom:"1px solid #E2E8F0",
},
}}
>

<TableCell sx={{width:"30%",pl:5.5, fontWeight:700}}>
PATIENT
</TableCell>

<TableCell sx={{width:"34%",pl:5.5, fontWeight:700}}>
DOCTOR
</TableCell>

<TableCell sx={{width:"35%",pl:5.5, fontWeight:700}}>
WARD / BED
</TableCell>

<TableCell
align="center"
sx={{width:"28%",fontWeight:700}}
>
STATUS
</TableCell>

<TableCell
align="center"
sx={{width:"28%",fontWeight:700}}
>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredAdmissions.length === 0 ? (

<TableRow>

<TableCell
colSpan={5}
align="center"
sx={{ py: 8 }}
>

<BedroomParentRoundedIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography
mt={2}
fontWeight={700}
>
No Admissions Found
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredAdmissions.map((admission) => (

<TableRow
key={admission._id}
hover
sx={{
height:72,

"& td":{
py:1.5,
px:2,
verticalAlign:"middle",
borderBottom:"1px solid #EEF2F7",
},

"&:hover":{
background:"#F8FAFC",
},
}}
>

{/* Patient */}

<TableCell>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:2,
}}
>

<Avatar
sx={{
width:38,
height:38,
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
fontWeight:700,
fontSize:13,
letterSpacing:.7,
}}
>
{admission.patient?.firstName?.charAt(0)}
{admission.patient?.lastName?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:14,
color:"#0F172A",
lineHeight:1.2,
}}
>
{admission.patient?.firstName} {admission.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:0.4,
}}
>
{admission.admissionId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Doctor */}

<TableCell>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:2,
}}
>

<Avatar
sx={{
width:34,
height:34,
fontSize:14,
bgcolor:"#ECFDF5",
color:"#059669",
fontWeight:700,
fontSize:13,
}}
>
{admission.doctor?.name?.charAt(0)}
</Avatar>

<Box>

<Typography
fontWeight={600}
fontSize={13}
>
 {admission.doctor?.name}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:.3,
}}
>
Consultant
</Typography>

</Box>

</Box>

</TableCell>

{/* Ward */}

<TableCell>

<Box
sx={{
display:"inline-flex",
alignItems:"center",
gap:1,
px:1.5,
py:.5,
borderRadius:2,
bgcolor:"#EFF6FF",
border:"1px solid #BFDBFE",
}}
>

<MeetingRoomRoundedIcon
fontSize="small"
/>

<Typography
sx={{
fontWeight:600,
fontSize:12,
whiteSpace:"nowrap",
}}
>
{admission.ward} • {admission.bedNumber}
</Typography>

</Box>

</TableCell>

{/* Status */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>
<StatusChip
status={admission.status}
/>
</Box>

</TableCell>

{/* Actions */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<ActionButtons
  onView={() => handleView(admission)}
  onEdit={() => handleEdit(admission)}
  onDelete={() => handleDelete(admission._id)}
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
  title={editingId ? "Edit Admission" : "New Admission"}
  submitText={editingId ? "Update Admission" : "Save Admission"}
  onSubmit={handleSubmit}
>

<Box
sx={{
display:"grid",
gridTemplateColumns:{
xs:"1fr",
md:"1fr 1fr",
},
gap:2.5,
mt:3,
}}
>

<TextField
select
label="Patient"
name="patient"
value={formData.patient}
onChange={handleChange}
sx={textFieldStyle}
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
sx={textFieldStyle}
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
label="Ward"
name="ward"
value={formData.ward}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Bed Number"
name="bedNumber"
value={formData.bedNumber}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Reason"
name="reason"
multiline
rows={4}
value={formData.reason}
onChange={handleChange}
sx={{
gridColumn:{
xs:"span 1",
md:"span 2",
},
...textFieldStyle,
}}
/>

<TextField
select
label="Status"
name="status"
value={formData.status}
onChange={handleChange}
sx={textFieldStyle}
>

<MenuItem value="Admitted">
Admitted
</MenuItem>

<MenuItem value="Discharged">
Discharged
</MenuItem>

</TextField>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={()=>setViewOpen(false)}
title="Admission Details"
hideSubmit
>

<Box
sx={{
display:"grid",
gridTemplateColumns:{
xs:"1fr",
md:"1fr 1fr",
},
gap:2.5,
mt:3,
}}
>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Admission ID
</Typography>

<Typography fontWeight={700}>
{selectedAdmission?.admissionId}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Patient
</Typography>

<Typography fontWeight={700}>
{selectedAdmission?.patient?.firstName}{" "}
{selectedAdmission?.patient?.lastName}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Doctor
</Typography>

<Typography fontWeight={700}>
{selectedAdmission?.doctor?.name}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Ward
</Typography>

<Typography fontWeight={700}>
{selectedAdmission?.ward}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Bed Number
</Typography>

<Typography fontWeight={700}>
{selectedAdmission?.bedNumber}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Reason
</Typography>

<Typography fontWeight={700}>
{selectedAdmission?.reason}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Status
</Typography>

<StatusChip
status={selectedAdmission?.status}
/>

</Box>

</Box>

</FormDialog>

    </DashboardLayout>
  );
}

export default Admissions;