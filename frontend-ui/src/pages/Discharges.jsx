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

import FormDialog from "../components/FormDialog";
import { TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";

import {
Table,
TableBody,
TableContainer,
TableHead,
Paper,
} from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#FFFFFF",

    "& fieldset": {
      borderColor: "#CBD5E1",
    },

    "&:hover fieldset": {
      borderColor: "#14B8A6",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#14B8A6",
      borderWidth: "2px",
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

function Discharges() {

const [discharges, setDischarges] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);

const [editingId, setEditingId] = useState(null);

const [selectedDischarge, setSelectedDischarge] = useState(null);

const [patients, setPatients] = useState([]);
const [doctors, setDoctors] = useState([]);
const [admissionsList, setAdmissionsList] = useState([]);

const [formData, setFormData] = useState({
  admission: "",
  patient: "",
  doctor: "",
  diagnosis: "",
  treatmentGiven: "",
  medications: "",
  followUpDate: "",
  summary: "",
});

useEffect(() => {
  fetchDischarges();
  fetchPatients();
  fetchDoctors();
  fetchAdmissionsList();
}, []);

const fetchPatients = async () => {
  try {
    const res = await API.get("/patients");
    setPatients(res.data.data || []);
  } catch (err) {
    toast.error("Failed to load patients");
  }
};

const fetchDoctors = async () => {
  try {
    const res = await API.get("/doctors");
    setDoctors(res.data.data || []);
  } catch (err) {
    toast.error("Failed to load doctors");
  }
};

const fetchAdmissionsList = async () => {
  try {
    const res = await API.get("/admissions");
    setAdmissionsList(res.data.data || []);
  } catch (err) {
    toast.error("Failed to load admissions");
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

    const payload = {
      ...formData,
      medications: formData.medications
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
    };

    if (editingId) {

      await API.put(`/discharges/${editingId}`, payload);

      toast.success("Discharge updated successfully");

    } else {

      await API.post("/discharges", payload);

      toast.success("Discharge created successfully");

    }

    setOpen(false);

    setEditingId(null);

    fetchDischarges();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Failed to save discharge"
    );

  }

};

const handleView = (item) => {

  toast.info("Viewing discharge");

  setSelectedDischarge(item);

  setViewOpen(true);

};

const handleEdit = (item) => {

  toast.info("Editing discharge");

  setEditingId(item._id);

  setFormData({

    admission: item.admission?._id || "",

    patient: item.patient?._id || "",

    doctor: item.doctor?._id || "",

    diagnosis: item.diagnosis || "",

    treatmentGiven: item.treatmentGiven || "",

    medications:
      item.medications?.join(", ") || "",

    followUpDate: item.followUpDate
      ? item.followUpDate.substring(0,10)
      : "",

    summary: item.summary || "",

  });

  setOpen(true);

};

const handleDelete = async (id) => {

  if (!window.confirm("Delete this discharge?"))
    return;

  try {

    await API.delete(`/discharges/${id}`);

    toast.success("Discharge deleted successfully");

    fetchDischarges();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );

  }

};

const stats = [
{
label:"Discharges",
value:discharges.length,
icon:<ExitToAppRoundedIcon />,
},
{
label:"Completed",
value:discharges.filter(
d=>d.status==="Completed"
).length,
icon:<CheckCircleRoundedIcon />,
},
{
label:"Doctors",
value:new Set(
discharges.map(d=>d.doctor?.name)
).size,
icon:<LocalHospitalRoundedIcon />,
},
{
label:"Summaries",
value:discharges.length,
icon:<AssignmentTurnedInRoundedIcon />,
},
];

const filteredDischarges = discharges.filter((item)=>{

const text = search.toLowerCase();

return(

`${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`
.toLowerCase()
.includes(text)

||

(item.doctor?.name || "")
.toLowerCase()
.includes(text)

||

(item.finalDiagnosis || "")
.toLowerCase()
.includes(text)

);

});

const fetchDischarges = async () => {

try {

  const res =
    await API.get("/discharges");

  setDischarges(res.data.data);

} catch (error) {

  console.log(error);

} finally {

  setLoading(false);

}

};

return ( <DashboardLayout>

  <PageHeader
  title="Discharges"
  subtitle="Manage patient discharge summaries"
  buttonText="New Discharge"
  onButtonClick={() => {

setEditingId(null);

setFormData({

admission:"",
patient:"",
doctor:"",
diagnosis:"",
treatmentGiven:"",
medications:"",
followUpDate:"",
summary:"",

});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search patient, doctor or diagnosis..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
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

"& .MuiTableCell-head":{
fontWeight:"700 !important",
fontSize:"12px",
color:"#1E293B",
textTransform:"uppercase",
letterSpacing:".5px",
},
}}
>

<TableCell sx={{width:"28%", pl:6, align:"center"}}>
PATIENT
</TableCell>

<TableCell sx={{width:"36%", pl:6, align:"center"}}>
DOCTOR
</TableCell>

<TableCell align="center" sx={{width:"22%"}}>
ADMISSION
</TableCell>

<TableCell align="center" sx={{width:"42%"}}>
DATE
</TableCell>

<TableCell sx={{width:"30%", pl:6, align:"center"}}>
DIAGNOSIS
</TableCell>

<TableCell align="center" sx={{width:"26%"}}>
STATUS
</TableCell>

<TableCell align="center" sx={{width:"30%"}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredDischarges.map((item) => (

<TableRow
key={item._id}
hover
sx={{
height:78,

"& td":{
py:2,
px:2.5,
verticalAlign:"middle",
borderBottom:"1px solid #EEF2F7",
},

"&:hover":{
background:"#F8FAFC",
},
}}
>

{/*parent*/}
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
width:42,
height:42,
fontSize:14,
fontWeight:700,
color:"#fff",
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
flexShrink:0,
}}
>
{item.patient?.firstName?.charAt(0)}
{item.patient?.lastName?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:15,
color:"#0F172A",
lineHeight:1.2,
}}
>
{item.patient?.firstName} {item.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#94A3B8",
mt:.3,
}}
>
Discharge ID : {item.dischargeId}
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
width:38,
height:38,
bgcolor:"#ECFDF5",
color:"#059669",
fontSize:13,
fontWeight:700,
flexShrink:0,
}}
>
{item.doctor?.name?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:14,
lineHeight:1.3,
}}
>
Dr. {item.doctor?.name}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#64748B",
mt:.3,
}}
>
Consultant
</Typography>

</Box>

</Box>

</TableCell>

{/* Admission */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<Box
sx={{
display:"inline-flex",
px:2,
py:.7,
borderRadius:2,
bgcolor:"#EFF6FF",
border:"1px solid #BFDBFE",
}}
>

<Typography
fontWeight={600}
fontSize={13}
>
{item.admission?.admissionId}
</Typography>

</Box>

</Box>

</TableCell>

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<Box
sx={{
display:"inline-flex",
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
{item.dischargeDate
? new Date(item.dischargeDate).toLocaleDateString()
: "-"}
</Typography>

</Box>

</Box>

</TableCell>

{/* Diagnosis */}

<TableCell>

<Box
sx={{
display:"inline-flex",
alignItems:"center",
gap:1,
px:2,
py:.7,
borderRadius:2,
bgcolor:"#FFFBEB",
border:"1px solid #FCD34D",
minWidth:130,
maxWidth:180,
}}
>

<Typography
sx={{
fontWeight:600,
fontSize:13,
color:"#92400E",
whiteSpace:"nowrap",
overflow:"hidden",
textOverflow:"ellipsis",
}}
>
{item.finalDiagnosis || "General Checkup"}
</Typography>

</Box>

</TableCell>

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<StatusChip
status={item.status || "Completed"}
/>

</Box>

</TableCell>

<TableCell align="center">

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

))}

</TableBody>

</Table>

</TableContainer>

)}

<FormDialog
open={open}
onClose={() => setOpen(false)}
title={editingId ? "Edit Discharge" : "New Discharge"}
submitText={editingId ? "Update Discharge" : "Save Discharge"}
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
label="Admission"
name="admission"
value={formData.admission}
onChange={handleChange}
sx={textFieldStyle}
>

{admissionsList.map((admission)=>(

<MenuItem
key={admission._id}
value={admission._id}
>
{admission.admissionId}
</MenuItem>

))}

</TextField>

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
label="Diagnosis"
name="diagnosis"
value={formData.diagnosis}
onChange={handleChange}
sx={textFieldStyle}
/>

<Box>

  <Typography
    sx={{
      fontSize: 13,
      fontWeight: 600,
      color: "#475569",
      mb: 1,
    }}
  >
    Treatment Given
  </Typography>

  <TextField
    fullWidth
    label="Enter given Treatment"
    name="treatmentGiven"
    value={formData.treatmentGiven}
    onChange={handleChange}
    sx={textFieldStyle}
/>

</Box>

<Box>

  <Typography
    sx={{
      fontSize: 13,
      fontWeight: 600,
      color: "#475569",
      mb: 1,
    }}
  >
    Follow Up Date
  </Typography>

  <TextField
    fullWidth
    type="date"
    name="followUpDate"
    value={formData.followUpDate}
    onChange={handleChange}
    sx={textFieldStyle}
  />

</Box>

<TextField
label="Medications"
name="medications"
value={formData.medications}
onChange={handleChange}
placeholder="Paracetamol, Vitamin C, Antibiotic"
sx={{
...textFieldStyle,
gridColumn:{
xs:"span 1",
md:"span 2",
},
}}
/>

<TextField
multiline
rows={4}
label="Summary"
name="summary"
value={formData.summary}
onChange={handleChange}
sx={{
...textFieldStyle,
gridColumn:{
xs:"span 1",
md:"span 2",
},
}}
/>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={() => setViewOpen(false)}
title="Discharge Details"
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
Discharge ID
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.dischargeId}
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
Admission
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.admission?.admissionId}
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

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.patient?.firstName}{" "}
{selectedDischarge?.patient?.lastName}
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
Doctor
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.doctor?.name}
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
Diagnosis
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.diagnosis}
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
Treatment Given
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.treatmentGiven}
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
Medications
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.medications?.join(", ") || "-"}
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
Follow Up Date
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{selectedDischarge?.followUpDate
? new Date(selectedDischarge.followUpDate).toLocaleDateString()
: "-"}
</Typography>

</Box>

<Box
sx={{
gridColumn:{
xs:"span 1",
md:"span 2",
},
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
Summary
</Typography>

<Typography
mt={.5}
>
{selectedDischarge?.summary || "-"}
</Typography>

</Box>

</Box>

</FormDialog>

</DashboardLayout>

);
}

export default Discharges;
