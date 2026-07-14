import { useEffect, useState } from "react";
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

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import ModuleStats from "../components/ModuleStats";
import StatusChip from "../components/StatusChip";
import ActionButtons from "../components/ActionButtons";

import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";

import {
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import FormDialog from "../components/FormDialog";

import { toast } from "react-toastify";

import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    height: 58,
    borderRadius: 3,
    bgcolor: "#fff",

    "& fieldset": {
      borderColor: "#D1D5DB",
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
    color: "#64748B",
  },
};

function Consultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);

const [editingId, setEditingId] = useState(null);

const [selectedConsultation, setSelectedConsultation] = useState(null);

const [patients, setPatients] = useState([]);
const [doctors, setDoctors] = useState([]);

const [opdVisits, setOpdVisits] = useState([]);

const [formData,setFormData]=useState({

opdVisit:"",
patient:"",
doctor:"",
diagnosis:"",
notes:"",
medicine:"",
dosage:"",
duration:"",
recommendedTests:"",

});

 useEffect(() => {
 fetchConsultations();
fetchPatients();
fetchDoctors();
fetchOPDVisits();
}, []);

const fetchOPDVisits = async () => {

  try{

    const res = await API.get("/opd");

    setOpdVisits(res.data.data);

  }catch(err){

    console.log(err);

  }

};

const fetchPatients = async () => {
  const res = await API.get("/patients");
  setPatients(res.data.data);
};

const fetchDoctors = async () => {
  try {

    const res = await API.get("/doctors");

    console.log("Doctors API Response:", res.data);

    setDoctors(res.data.data || []);

  } catch (err) {

    console.error("Doctor Error:", err);

  }
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleEdit = (consultation) => {

  setEditingId(consultation._id);

  setFormData({
    opdVisit: consultation.opdVisit?._id || "",
    patient: consultation.patient?._id || "",
    doctor: consultation.doctor?._id || "",
    diagnosis: consultation.diagnosis || "",
    notes: consultation.notes || "",
    medicine: consultation.prescription?.[0]?.medicine || "",
    dosage: consultation.prescription?.[0]?.dosage || "",
    duration: consultation.prescription?.[0]?.duration || "",
    recommendedTests:
      consultation.recommendedTests?.join(", ") || "",
  });

  setOpen(true);

};

const handleSubmit = async () => {
  try {

    const payload = {

      opdVisit: formData.opdVisit,

      patient: formData.patient,

      doctor: formData.doctor,

      diagnosis: formData.diagnosis,

      notes: formData.notes,

      prescription: [
        {
          medicine: formData.medicine,
          dosage: formData.dosage,
          duration: formData.duration,
        },
      ],

      recommendedTests:
        formData.recommendedTests
          ? formData.recommendedTests
              .split(",")
              .map((t) => t.trim())
          : [],

    };

    if (editingId) {

      await API.put(
        `/consultations/${editingId}`,
        payload
      );

      toast.success(
        "Consultation Updated Successfully"
      );

    } else {

      await API.post(
        "/consultations",
        payload
      );

      toast.success(
        "Consultation Added Successfully"
      );

    }

    fetchConsultations();

    setOpen(false);

    setEditingId(null);

    setFormData({

      opdVisit:"",
      patient:"",
      doctor:"",
      diagnosis:"",
      notes:"",
      medicine:"",
      dosage:"",
      duration:"",
      recommendedTests:"",

    });

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Something went wrong"
    );

  }

};


const handleView = (consultation) => {

  setSelectedConsultation(consultation);

  setViewOpen(true);

};

const handleDelete = async(id)=>{

if(!window.confirm(
"Delete Consultation?"
)) return;

try{

await API.delete(
`/consultations/${id}`
);

toast.success(
"Consultation Deleted"
);

fetchConsultations();

}catch(err){

toast.error(
"Delete Failed"
);

}

};

  const stats = [
  {
    label: "Consultations",
    value: consultations.length,
    icon: <MedicalServicesRoundedIcon />,
  },
  {
    label: "Completed",
    value: consultations.filter(
      (c) => c.status === "Completed"
    ).length,
    icon: <CheckCircleRoundedIcon />,
  },
  {
    label: "Pending",
    value: consultations.filter(
      (c) => c.status !== "Completed"
    ).length,
    icon: <PendingActionsRoundedIcon />,
  },
  {
    label: "Tests",
    value: consultations.filter(
      (c) => c.recommendedTests?.length
    ).length,
    icon: <BiotechRoundedIcon />,
  },
];

const filteredConsultations = consultations.filter((c) => {
  const text = search.toLowerCase();

  return (
    `${c.patient?.firstName || ""} ${c.patient?.lastName || ""}`
      .toLowerCase()
      .includes(text) ||
    (c.doctor?.name || "")
      .toLowerCase()
      .includes(text) ||
    (c.diagnosis || "")
      .toLowerCase()
      .includes(text)
  );
});

  const fetchConsultations = async () => {
    try {
      const res = await API.get("/consultations");

      console.log("Consultations API:", res.data);

      // Supports multiple response formats
      if (Array.isArray(res.data)) {
        setConsultations(res.data);
      } else if (Array.isArray(res.data.data)) {
        setConsultations(res.data.data);
      } else {
        setConsultations([]);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("Doctors State:", doctors);

  return (
    <DashboardLayout>
    <PageHeader
title="Consultations"
subtitle="Manage patient consultations"
icon={<MedicalServicesRoundedIcon />}
buttonText="New Consultation"
onButtonClick={()=>{

setEditingId(null);

setFormData({

opdVisit:"",
patient:"",
doctor:"",
diagnosis:"",
notes:"",
medicine:"",
dosage:"",
duration:"",
recommendedTests:"",

});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search patient, doctor or diagnosis..."
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

<TableCell sx={{ width: "15%", pl:5, fontWeight: 700 }}>
PATIENT
</TableCell>

<TableCell sx={{ width: "14%", pl:4.5, fontWeight: 700 }}>
DOCTOR
</TableCell>

<TableCell sx={{ width: "15%", pl:3.5, fontWeight: 700 }}>
DIAGNOSIS
</TableCell>

<TableCell align="center" sx={{ width: "13%", fontWeight: 700 }}>
MEDICINES
</TableCell>

<TableCell align="center" sx={{ width: "10%", fontWeight: 700 }}>
TESTS
</TableCell>

<TableCell align="center" sx={{ width: "14%", fontWeight: 700 }}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredConsultations.length === 0 ? (

<TableRow>

<TableCell
colSpan={7}
align="center"
sx={{ py: 8 }}
>

<MedicalServicesRoundedIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography mt={2} fontWeight={700}>
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
No Consultations Found
</Typography>

<Typography
color="text.secondary"
>
Try another search.
</Typography>
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredConsultations.map((consultation) => (

<TableRow
key={consultation._id}
hover
sx={{
height:78,

"& td":{
py:2,
borderBottom:"1px solid #EEF2F7",
verticalAlign:"middle",
transition:"0.2s",
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
width:42,
height:42,
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
fontWeight:700,
}}
>
{consultation.patient?.firstName?.charAt(0)}
{consultation.patient?.lastName?.charAt(0)}
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
{consultation.patient?.firstName} {consultation.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:0.4,
}}
>
{consultation.consultationId}
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
fontWeight:700,
}}
>
{consultation.doctor?.name?.charAt(0)}
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
{consultation.doctor?.name}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:0.4,
}}
>
Consultant
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
justifyContent:"center",
minWidth:110,
px:2,
py:.8,
borderRadius:2,
bgcolor:"#EFF6FF",
border:"1px solid #BFDBFE",
}}
>

<Typography
fontWeight={600}
fontSize={13}
>
{consultation.diagnosis}
</Typography>

</Box>

</TableCell>

{/* Prescription */}

<TableCell align="center">

<Box
sx={{
display:"inline-flex",
alignItems:"center",
gap:.8,
px:2,
py:.7,
borderRadius:2,
background:"#ECFDF5",
border:"1px solid #A7F3D0",
}}
>

<MedicalServicesRoundedIcon
sx={{
fontSize:16,
color:"#059669",
}}
/>

<Typography
sx={{
fontWeight:600,
fontSize:13,
}}
>
{Array.isArray(consultation.prescription)
? consultation.prescription.length
:0} Medicines
</Typography>

</Box>

</TableCell>

{/* Tests */}

<TableCell align="center">

<Box
sx={{
display:"inline-flex",
alignItems:"center",
gap:.8,
px:2,
py:.7,
borderRadius:2,
background:"#F8FAFC",
border:"1px solid #CBD5E1",
}}
>

<BiotechRoundedIcon
sx={{
fontSize:16,
color:"#64748B",
}}
/>

<Typography
sx={{
fontWeight:600,
fontSize:13,
}}
>
{Array.isArray(consultation.recommendedTests)
? consultation.recommendedTests.length
:0} Tests
</Typography>

</Box>

</TableCell>


{/* Actions */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<ActionButtons
onView={() => handleView(consultation)}
onEdit={() => handleEdit(consultation)}
onDelete={() => handleDelete(consultation._id)}
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
? "Edit Consultation"
: "New Consultation"
}
submitText={
editingId
? "Update Consultation"
: "Save Consultation"
}
onSubmit={handleSubmit}
>

<Box
sx={{
display:"grid",
mt: 3,
gridTemplateColumns:{
xs:"1fr",
md:"repeat(2,1fr)",
},
columnGap:3,
rowGap:2.5,
gap: 3,
}}
>

{/* OPD Visit */}

<TextField
select
label="OPD Visit"
name="opdVisit"
value={formData.opdVisit}
onChange={handleChange}
sx={textFieldStyle}
>

{opdVisits.map((visit)=>(

<MenuItem
key={visit._id}
value={visit._id}
>

{visit.visitId}

</MenuItem>

))}

</TextField>

{/* Patient */}

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

{/* Doctor */}

<TextField
  select
  fullWidth
  label="Doctor"
  name="doctor"
  value={formData.doctor}
  onChange={handleChange}
  sx={textFieldStyle}
>
  {doctors.map((doctor) => (
    <MenuItem
      key={doctor._id}
      value={doctor._id}
    >
      {doctor.name}
    </MenuItem>
  ))}
</TextField>

{/* Diagnosis */}

<TextField
label="Diagnosis"
name="diagnosis"
value={formData.diagnosis}
onChange={handleChange}
placeholder="Enter Diagnosis"
sx={textFieldStyle}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<DescriptionRoundedIcon color="primary"/>
</InputAdornment>
),
}}
/>

{/* Notes */}

<TextField
label="Notes"
name="notes"
value={formData.notes}
onChange={handleChange}
placeholder="Enter Notes"
sx={textFieldStyle}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<NotesRoundedIcon color="primary"/>
</InputAdornment>
),
}}
/>

{/* Medicine */}

<TextField
label="Medicine"
name="medicine"
value={formData.medicine}
onChange={handleChange}
placeholder="Paracetamol"
sx={textFieldStyle}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<MedicationRoundedIcon color="primary"/>
</InputAdornment>
),
}}
/>

{/* Dosage */}

<TextField
label="Dosage"
name="dosage"
value={formData.dosage}
onChange={handleChange}
placeholder="500 mg"
sx={textFieldStyle}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<MedicationRoundedIcon color="primary"/>
</InputAdornment>
),
}}
/>

{/* Duration */}

<TextField
label="Duration"
name="duration"
value={formData.duration}
onChange={handleChange}
placeholder="5 Days"
sx={textFieldStyle}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<AccessTimeRoundedIcon color="primary"/>
</InputAdornment>
),
}}
/>

{/* Recommended Tests */}

<TextField
label="Recommended Tests"
name="recommendedTests"
value={formData.recommendedTests}
onChange={handleChange}
placeholder="Blood Test, X-Ray"
sx={textFieldStyle}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<BiotechRoundedIcon color="primary"/>
</InputAdornment>
),
}}
/>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={() => setViewOpen(false)}
title="Consultation Details"
submitText="Close"
onSubmit={() => setViewOpen(false)}
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

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Consultation ID
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.consultationId}
</Typography>
</Box>

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Patient
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.patient?.firstName}{" "}
{selectedConsultation?.patient?.lastName}
</Typography>
</Box>

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Doctor
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.doctor?.name}
</Typography>
</Box>

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Diagnosis
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.diagnosis}
</Typography>
</Box>

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Notes
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.notes || "-"}
</Typography>
</Box>

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Medicine
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.prescription?.[0]?.medicine || "-"}
</Typography>
</Box>

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Dosage
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.prescription?.[0]?.dosage || "-"}
</Typography>
</Box>

<Box sx={{p:2,border:"1px solid #E2E8F0",borderRadius:2,bgcolor:"#F8FAFC"}}>
<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Duration
</Typography>
<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.prescription?.[0]?.duration || "-"}
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

<Typography fontSize={13} color="#94A3B8" fontWeight={700}>
Recommended Tests
</Typography>

<Typography fontWeight={700} mt={0.5}>
{selectedConsultation?.recommendedTests?.join(", ") || "-"}
</Typography>

</Box>

</Box>

</FormDialog>

    </DashboardLayout>
  );
}

export default Consultations;