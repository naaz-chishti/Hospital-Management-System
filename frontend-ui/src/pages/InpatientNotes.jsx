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

import FormDialog from "../components/FormDialog";
import { TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

import {
Table,
TableBody,
TableContainer,
TableHead,
Paper,
} from "@mui/material";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import ActionButtons from "../components/ActionButtons";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

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

  "& .MuiInputBase-input": {
    fontSize: 14,
    fontWeight: 500,
  },
};

function InpatientNotes() {

const [notes, setNotes] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);

const [editingId, setEditingId] = useState(null);

const [selectedNote, setSelectedNote] = useState(null);

const [patients, setPatients] = useState([]);
const [doctors, setDoctors] = useState([]);
const [admissionsList, setAdmissionsList] = useState([]);

const [formData, setFormData] = useState({
  admission: "",
  patient: "",
  doctor: "",
  bp: "",
  pulse: "",
  temperature: "",
  oxygenLevel: "",
  notes: "",
});

useEffect(() => {
  fetchNotes();
  fetchPatients();
  fetchDoctors();
  fetchAdmissionsList();
}, []);

const fetchPatients = async () => {
  try {
    const res = await API.get("/patients");
    setPatients(res.data.data || []);
  } catch {
    toast.error("Failed to load patients");
  }
};

const fetchDoctors = async () => {
  try {
    const res = await API.get("/doctors");
    setDoctors(res.data.data || []);
  } catch {
    toast.error("Failed to load doctors");
  }
};

const fetchAdmissionsList = async () => {
  try {
    const res = await API.get("/admissions");
    setAdmissionsList(res.data.data || []);
  } catch {
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

      admission: formData.admission,
      patient: formData.patient,
      doctor: formData.doctor,

      vitals: {
        bp: formData.bp,
        pulse: formData.pulse,
        temperature: formData.temperature,
        oxygenLevel: formData.oxygenLevel,
      },

      notes: formData.notes,

    };

    if (editingId) {

      await API.put(`/inpatient-notes/${editingId}`, payload);

      toast.success("Note updated successfully");

    } else {

      await API.post("/inpatient-notes", payload);

      toast.success("Note added successfully");

    }

    setOpen(false);

    setEditingId(null);

    setFormData({
      admission:"",
      patient:"",
      doctor:"",
      bp:"",
      pulse:"",
      temperature:"",
      oxygenLevel:"",
      notes:"",
    });

    fetchNotes();

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to save note"
    );

  }

};

const handleView = (note) => {

  setSelectedNote(note);

  setViewOpen(true);

  toast.info("Viewing note");

};

const handleEdit = (note) => {

  setEditingId(note._id);

  setFormData({

    admission: note.admission?._id || "",

    patient: note.patient?._id || "",

    doctor: note.doctor?._id || "",

    bp: note.vitals?.bp || "",

    pulse: note.vitals?.pulse || "",

    temperature: note.vitals?.temperature || "",

    oxygenLevel: note.vitals?.oxygenLevel || "",

    notes: note.notes || "",

  });

  setOpen(true);

  toast.info("Editing note");

};

const handleDelete = async (id) => {

  if (!window.confirm("Delete this note?"))
    return;

  try {

    await API.delete(`/inpatient-notes/${id}`);

    toast.success("Note deleted successfully");

    fetchNotes();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );

  }

};

const stats = [

{
label:"Notes",
value:notes.length,
icon:<AssignmentRoundedIcon />,
},

{
  label: "Patients",
  value: new Set(notes.map(n => n.patient?._id)).size,
  icon: <PersonRoundedIcon />,
},

{
label:"Admissions",
value:new Set(
notes.map(n=>n.admission?.admissionId)
).size,
icon:<PersonRoundedIcon />,
},

{
label:"Today's Notes",
value:notes.length,
icon:<EventNoteRoundedIcon />,
},

];

const filteredNotes = notes.filter((note)=>{

const text=search.toLowerCase();

return(

`${note.patient?.firstName || ""} ${note.patient?.lastName || ""}`
.toLowerCase()
.includes(text)

||

(note.doctor?.name || "")
.toLowerCase()
.includes(text)

||

(note.progressNote || "")
.toLowerCase()
.includes(text)

);

});

const fetchNotes = async () => {

try {

  const res =
    await API.get("/inpatient-notes");

  setNotes(res.data.data);

} catch (error) {

  console.log(error);

} finally {

  setLoading(false);

}

};

return ( <DashboardLayout>

<PageHeader
title="Inpatient Notes"
subtitle="Manage inpatient progress notes"
icon={<NoteAltRoundedIcon />}
buttonText="Add Note"
onButtonClick={() => {

setEditingId(null);

setFormData({

admission:"",
patient:"",
doctor:"",
bp:"",
pulse:"",
temperature:"",
oxygenLevel:"",
notes:"",

});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
  placeholder="Search notes..."
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

<TableCell sx={{width:"13%", pl:6}}>
PATIENT
</TableCell>

<TableCell align="center" sx={{width:"24%"}}>
ADMISSION
</TableCell>

<TableCell sx={{width:"24%", pl:7, align:"center"}}>
PROGRESS NOTE
</TableCell>

<TableCell align="center" sx={{width:"14%"}}>
DATE
</TableCell>

<TableCell
align="center"
sx={{width:"24%"}}
>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredNotes.length === 0 ? (

<TableRow>

<TableCell
colSpan={5}
align="center"
sx={{ py: 8 }}
>

<NoteAltRoundedIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography
mt={2}
fontWeight={700}
>
No Notes Found
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredNotes.map((note)=>(


<TableRow
  key={note._id}
  hover
>

{/* Patient Cell */}

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
background:"linear-gradient(135deg,#8B5CF6,#A855F7)",
}}
>
{note.patient?.firstName?.charAt(0)}
{note.patient?.lastName?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:15,
color:"#0F172A",
}}
>
{note.patient?.firstName} {note.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#94A3B8",
mt:.3,
}}
>
{note.noteId}
</Typography>

</Box>

</Box>

</TableCell>


{/* Admission Cell */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<Box
sx={{
display:"inline-flex",
justifyContent:"center",
minWidth:90,
px:2,
py:.6,
borderRadius:2,
bgcolor:"#EFF6FF",
border:"1px solid #BFDBFE",
}}
>

<Typography
fontWeight={600}
fontSize={13}
>
{note.admission?.admissionId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Progress Note Cell */}

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
maxWidth:260,
minWidth:180,
}}
>

<Typography
sx={{
fontSize:13,
fontWeight:600,
color:"#92400E",
overflow:"hidden",
textOverflow:"ellipsis",
whiteSpace:"nowrap",
}}
>
{note.progressNote ||
note.note ||
note.notes ||
"No progress note"}
</Typography>

</Box>

</TableCell>

{/* Date Cell */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<Box
sx={{
display:"inline-flex",
justifyContent:"center",
minWidth:90,
px:2,
py:.6,
borderRadius:2,
bgcolor:"#F8FAFC",
border:"1px solid #E2E8F0",
}}
>

<Typography
fontWeight={600}
fontSize={13}
>
{note.createdAt
? new Date(note.createdAt).toLocaleDateString()
: "-"}
</Typography>

</Box>

</Box>

</TableCell>

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<ActionButtons
onView={() => handleView(note)}
onEdit={() => handleEdit(note)}
onDelete={() => handleDelete(note._id)}
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
title={editingId ? "Edit Inpatient Note" : "New Inpatient Note"}
submitText={editingId ? "Update Note" : "Save Note"}
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

{admissionsList.map((item)=>(

<MenuItem
key={item._id}
value={item._id}
>

{item.admissionId}

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
label="Blood Pressure"
name="bp"
value={formData.bp}
onChange={handleChange}
placeholder="120/80"
sx={textFieldStyle}
/>

<TextField
label="Pulse"
name="pulse"
value={formData.pulse}
onChange={handleChange}
placeholder="72 bpm"
sx={textFieldStyle}
/>

<TextField
label="Temperature"
name="temperature"
value={formData.temperature}
onChange={handleChange}
placeholder="98.6 °F"
sx={textFieldStyle}
/>

<TextField
label="Oxygen Level"
name="oxygenLevel"
value={formData.oxygenLevel}
onChange={handleChange}
placeholder="98%"
sx={textFieldStyle}
/>

<TextField
multiline
rows={5}
label="Progress Notes"
name="notes"
value={formData.notes}
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
title="Inpatient Note Details"
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
Note ID
</Typography>

<Typography mt={.5} fontWeight={700}>
{selectedNote?.noteId}
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

<Typography mt={.5} fontWeight={700}>
{selectedNote?.admission?.admissionId}
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

<Typography mt={.5} fontWeight={700}>
{selectedNote?.patient?.firstName}{" "}
{selectedNote?.patient?.lastName}
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

<Typography mt={.5} fontWeight={700}>
{selectedNote?.doctor?.name}
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
Blood Pressure
</Typography>

<Typography mt={.5} fontWeight={700}>
{selectedNote?.vitals?.bp || "-"}
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
Pulse
</Typography>

<Typography mt={.5} fontWeight={700}>
{selectedNote?.vitals?.pulse || "-"}
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
Temperature
</Typography>

<Typography mt={.5} fontWeight={700}>
{selectedNote?.vitals?.temperature || "-"}
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
Oxygen Level
</Typography>

<Typography mt={.5} fontWeight={700}>
{selectedNote?.vitals?.oxygenLevel || "-"}
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
Progress Notes
</Typography>

<Typography mt={.5}>
{selectedNote?.notes || "-"}
</Typography>

</Box>

</Box>

</FormDialog>

</DashboardLayout>

);
}

export default InpatientNotes;
