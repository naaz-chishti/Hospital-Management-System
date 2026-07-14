import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

import CircularProgress from "@mui/material/CircularProgress";

import {
  Box,
  TextField,
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

import { toast } from "react-toastify";

import {
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";
import ActionButtons from "../components/ActionButtons";

import ModuleStats from "../components/ModuleStats";
import FormDialog from "../components/FormDialog";

import MedicalInformationRoundedIcon from "@mui/icons-material/MedicalInformationRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import HealingRoundedIcon from "@mui/icons-material/HealingRounded";

import { useSearchParams } from "react-router-dom";

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

function OPD() {

  const [visits, setVisits] = useState([]);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

 const [formData, setFormData] = useState({
  patient: "",
  doctor: "",
  symptoms: "",
  diagnosis: "",
  status: "Waiting",
});

const [patients, setPatients] = useState([]);

const [doctors, setDoctors] = useState([]);

const [editingId, setEditingId] = useState(null);

const [viewOpen, setViewOpen] = useState(false);

const [selectedVisit, setSelectedVisit] = useState(null);

const [searchParams] = useSearchParams();

const [loading, setLoading] = useState(true);

  useEffect(() => {

fetchVisits();

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

try{

const res = await API.get("/patients");

setPatients(res.data.data);

}catch(err){

console.log(err);

}

};

const fetchDoctors = async () => {

try{

const res = await API.get("/doctors");

setDoctors(res.data.data);

}catch(err){

console.log(err);

}

};

  const fetchVisits = async () => {

try{

setLoading(true);

const res = await API.get("/opd");

setVisits(res.data.data);

}catch(err){

console.log(err);

}finally{

setLoading(false);

}

};

  const handleSubmit = async () => {

try{

  console.log("Submitting:", formData);

if(editingId){

await API.put(

`/opd/${editingId}`,

formData

);

toast.success("Visit Updated");

}else{

await API.post(

"/opd",

formData

);

toast.success("Visit Added");

}

fetchVisits();

setOpen(false);

setEditingId(null);

setFormData({

patient:"",

doctor:"",

symptoms:"",

diagnosis:"",

status:"Waiting",

});

}catch(err){

toast.error(

err.response?.data?.message ||

"Something went wrong"

);

}

};

const handleEdit = (visit) => {

setEditingId(visit._id);

setFormData({

patient: visit.patient?._id,

doctor: visit.doctor?._id,

symptoms: visit.symptoms,

diagnosis: visit.diagnosis || "",

status:
  visit.status === "Pending"
    ? "Waiting"
    : visit.status || "Waiting",

});

setOpen(true);

};

 const deleteVisit = async (id) => {

  if (!window.confirm("Delete OPD Visit?")) return;

  try {

    await API.delete(`/opd/${id}`);

    toast.success("Visit Deleted");

    fetchVisits();

  } catch (err) {

    toast.error("Delete Failed");

  }

};

  const handleChange = (e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value,

});

};

const handleView = (visit) => {

setSelectedVisit(visit);

setViewOpen(true);

};

  const stats = [
  {
    label: "Total Visits",
    value: visits.length,
    icon: <MedicalInformationRoundedIcon />,
  },
  {
    label: "Completed",
    value: visits.filter(
      (v) => v.status === "Completed"
    ).length,
    icon: <AssignmentTurnedInRoundedIcon />,
  },
  {
    label: "Pending",
    value: visits.filter(
      (v) => v.status !== "Completed"
    ).length,
    icon: <PendingActionsRoundedIcon />,
  },
  {
    label:"Consultants",
    value: new Set(
      visits.map((v) => v.doctor?.name)
    ).size,
    icon: <LocalHospitalRoundedIcon />,
  },
];

return (

<DashboardLayout>

<PageHeader
  title="OPD Visits"
  subtitle="Track and manage outpatient consultations"
  icon={<HealingRoundedIcon />}
  buttonText="New Visit"
  onButtonClick={() => {

setEditingId(null);

setFormData({

patient: "",

doctor: "",

symptoms: "",

diagnosis: "",

status: "Waiting",

});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
  title="OPD Visits"
  subtitle="Search & Filter Visits"
  icon={<HealingRoundedIcon />}
  placeholder="Search patient, doctor..."
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
}}
>

<TableCell sx={{width:"40%",pl:5.5, fontWeight:700}}>
PATIENT
</TableCell>

<TableCell sx={{width:"35%", pl:3.5, fontWeight:700}}>
DOCTOR
</TableCell>

<TableCell

sx={{width:"25%", pl:3.5, fontWeight:700}}
>
SYMPTOMS
</TableCell>

<TableCell
align="center"
sx={{width:"33%",fontWeight:700}}
>
STATUS
</TableCell>

<TableCell
align="center"
sx={{width:"30%",fontWeight:700}}
>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{visits.length === 0 ? (

  <TableRow>

    <TableCell
      colSpan={5}
      align="center"
      sx={{ py: 8 }}
    >

      <PersonIcon
        sx={{
          fontSize: 60,
          color: "#CBD5E1",
        }}
      />

      <Typography
        mt={2}
        fontWeight={700}
      >
        No OPD Visits Found
      </Typography>

    </TableCell>

  </TableRow>

) :

visits
.filter((visit) => {

const text = search.toLowerCase();

return (

`${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`
.toLowerCase()
.includes(text)

||

(visit.doctor?.name || "")
.toLowerCase()
.includes(text)

||

(visit.symptoms || "")
.toLowerCase()
.includes(text)

);

})

.map((visit)=>(

<TableRow
  key={visit._id}
  hover
  sx={{
    transition: ".25s",

    "& td": {
      py: 2.2,
      px: 2.5,
      borderBottom: "1px solid #EEF2F7",
      verticalAlign: "middle",
    },

    "&:hover": {
      bgcolor: "#F0FDFA",
    },
  }}
>

{/* Patient */}

<TableCell
  sx={{
    width: "29%",
    pr: 2,
    align: "center",
  }}
>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:2.2,
maxWidth:"260px",
}}
>

<Avatar
sx={{
width:42,
height:42,
fontWeight:700,
fontSize:16,
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
}}
>
{visit.patient?.firstName?.charAt(0)}
{visit.patient?.lastName?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontSize:15,
fontWeight:700,
color:"#0F172A",
}}
>
{visit.patient?.firstName} {visit.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#64748B",
mt:.3,
}}
>
Visit ID : {visit.visitId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Doctor */}

<TableCell
  sx={{
    width: "30%",
    pl: 2.5,
    align: "center",
  }}
>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:1.5,
}}
>

<Avatar
sx={{
width:42,
height:42,
background:"linear-gradient(135deg,#14B8A6,#0F766E)",
color:"#fff",
fontWeight:700,
fontSize:16,
boxShadow:"0 6px 14px rgba(20,184,166,.25)",
}}
>
{visit.doctor?.name?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:15,
color:"#0F172A",
}}
>
{visit.doctor?.name}
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

{/* Symptoms */}

<TableCell
  sx={{
    width: "28%",
     align: "center",
  }}
>

<Box
sx={{
display:"inline-flex",
alignItems:"center",
px:1.5,
py:.6,
borderRadius:"10px",
bgcolor:"#F8FAFC",
border:"1px solid #E2E8F0",
maxWidth:160,
}}
>

<Typography
sx={{
fontSize:13,
fontWeight:500,
overflow:"hidden",
textOverflow:"ellipsis",
whiteSpace:"nowrap",
}}
>
{visit.symptoms}
</Typography>

</Box>


</TableCell>

{/* Status */}

<TableCell
  align="center"
  sx={{ width: "31%" }}
>

<Box
display="flex"
justifyContent="center"
>

<StatusChip
status={visit.status || "Waiting"}
/>

</Box>

</TableCell>

{/* Actions */}

<TableCell
  align="center"
  sx={{ width: "12%" }}
>

<ActionButtons
  onView={() => handleView(visit)}
  onEdit={() => handleEdit(visit)}
  onDelete={() => deleteVisit(visit._id)}
/>

</TableCell>

</TableRow>

))

}

</TableBody>

</Table>

</TableContainer>

)}

     <FormDialog
  open={open}
  onClose={() => setOpen(false)}
  title={editingId ? "Edit OPD Visit" : "New OPD Visit"}
  submitText={editingId ? "Update Visit" : "Save Visit"}
  onSubmit={handleSubmit}
>

<Box
sx={{
display:"grid",
gridTemplateColumns:{
xs:"1fr",
md:"repeat(2,1fr)",
},
columnGap:3,
rowGap:2.5,
mt: 3,
}}
>

<TextField
select
name="patient"
value={formData.patient}
onChange={handleChange}
label="Patient"
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
name="doctor"
value={formData.doctor}
onChange={handleChange}
label="Doctor"
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
fullWidth
multiline
rows={5}
label="Symptoms"
name="symptoms"
value={formData.symptoms}
onChange={handleChange}
placeholder="Enter patient symptoms..."
sx={{
gridColumn:{
xs:"span 1",
md:"span 2",
},

"& .MuiOutlinedInput-root":{
borderRadius:3,
},

"& .MuiInputLabel-root":{
fontWeight:600,
},
}}
/>

</Box>

</FormDialog>

<FormDialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  title="OPD Visit Details"
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
color:"#94A3B8",
fontWeight:700,
}}
>
Visit ID
</Typography>

<Typography
fontWeight={700}
mt={.5}
>
{selectedVisit?.visitId}
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
color:"#94A3B8",
fontWeight:700,
}}
>
Patient
</Typography>

<Typography
fontWeight={700}
mt={.5}
>
{selectedVisit?.patient?.firstName}{" "}
{selectedVisit?.patient?.lastName}
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
color:"#94A3B8",
fontWeight:700,
}}
>
Doctor
</Typography>

<Typography
  fontWeight={700}
  mt={0.5}
>
  {selectedVisit?.doctor?.name || "-"}
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
color:"#94A3B8",
fontWeight:700,
}}
>
Symptoms
</Typography>

<Typography
fontWeight={700}
mt={0.5}
>
{selectedVisit?.symptoms || "-"}
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
color:"#94A3B8",
fontWeight:700,
mb:1,
}}
>
Status
</Typography>

<StatusChip
status={selectedVisit?.status || "Waiting"}
/>

</Box>

</Box>

</FormDialog>

    </DashboardLayout>

  );

}

export default OPD;