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

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import DescriptionIcon from "@mui/icons-material/Description";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import { TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import FormDialog from "../components/FormDialog";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import ActionButtons from "../components/ActionButtons";

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 3,
  bgcolor: "#fff",
};

const viewLabelStyle = {
  fontSize: 12,
  color: "#64748B",
  fontWeight: 700,
  textTransform: "uppercase",
  mb: .5,
};

const viewValueStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0F172A",
};

function Reports() {

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [selectedReport, setSelectedReport] = useState(null);

const [patients, setPatients] = useState([]);

const [formData, setFormData] = useState({
  patient: "",
  reportType: "Patient",
  generatedBy: "Admin",
});

  useEffect(() => {
  fetchReports();
  fetchPatients();
}, []);

const fetchPatients = async () => {
  try {
    const res = await API.get("/patients");
    setPatients(res.data.data || []);
  } catch (err) {
    console.log(err);
  }
};

const handleChange = (e)=>{
setFormData({
...formData,
[e.target.name]:e.target.value,
});
};

const handleSubmit=async()=>{

try{

if(editingId){

await API.put(
`/reports/${editingId}`,
formData
);

toast.success("Report updated successfully");

}else{

await API.post(
"/reports",
formData
);

toast.success("Report created successfully");

}

setOpen(false);

setEditingId(null);

setFormData({
patient:"",
reportType:"Patient",
generatedBy:"Admin",
});

fetchReports();

}catch(err){

toast.error(
err.response?.data?.message ||
"Failed to save report"
);

}

};

const handleView=(report)=>{
setSelectedReport(report);
setViewOpen(true);
};

const handleEdit = (report) => {
  setEditingId(report._id);

  setFormData({
    patient: report.patient?._id || "",
    reportType: report.reportType || "Patient",
    generatedBy: report.generatedBy || "Admin",
  });

  setOpen(true);
};

const handleDelete=async(id)=>{

if(!window.confirm("Delete this report?"))
return;

try{

await API.delete(`/reports/${id}`);

toast.success("Report deleted successfully");

fetchReports();

}catch(err){

toast.error(
err.response?.data?.message ||
"Delete failed"
);

}

};

  const stats = [
{
label:"Reports",
value:reports.length,
icon:<DescriptionRoundedIcon />,
},
{
label:"Categories",
value:new Set(
reports.map(r => r.reportType)
).size,
icon:<FolderRoundedIcon />,
},

{
label:"Patients",
value:new Set(
reports.map(r => r.patient?._id)
).size,
icon:<PersonRoundedIcon />,
},
{
label:"Today's Reports",
value:reports.length,
icon:<CalendarMonthRoundedIcon />,
},
];

const filteredReports = reports.filter((report)=>{

const text=search.toLowerCase();

return(

(report.reportType||"")
.toLowerCase()
.includes(text)

||

(report.generatedBy||"")
.toLowerCase()
.includes(text)

||

`${report.patient?.firstName||""} ${report.patient?.lastName||""}`
.toLowerCase()
.includes(text)

);

});

  const fetchReports = async () => {
  try {
    const res = await API.get("/reports");

    console.log(res.data.data); // Check browser console once

    setReports(res.data.data || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

    const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
  },
};

  return (

    <DashboardLayout>

      <PageHeader
title="Medical Reports"
subtitle="Manage patient medical reports"
icon={<DescriptionRoundedIcon />}
buttonText="Add Report"
onButtonClick={()=>{
setEditingId(null);

setFormData({
patient:"",
reportType:"Patient",
generatedBy:"Admin",
});

setOpen(true);
}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search report, category or patient..."
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

<TableCell sx={{width:"12%", pl:7}}>
REPORT
</TableCell>

<TableCell align="center" sx={{width:"28%"}}>
CATEGORY
</TableCell>

<TableCell sx={{width:"18%", align:"center", pl:7}}>
PATIENT
</TableCell>

<TableCell align="center" sx={{width:"18%"}}>
DATE
</TableCell>

<TableCell align="center" sx={{width:"22%"}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredReports.map((report)=>(

<TableRow
key={report._id}
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

{/* Report */}
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
}}
>
<DescriptionRoundedIcon fontSize="small"/>
</Avatar>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:14,
color:"#0F172A",
whiteSpace:"nowrap",
}}
>
{report.reportType} Report
</Typography>

<Typography
sx={{
fontSize:12,
color:"#94A3B8",
mt:0.3,
}}
>
{report.reportId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Category */}

<TableCell align="center">

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
  {report.generatedBy} Report
</Typography>

</Box>

</TableCell>

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
width:40,
height:40,
bgcolor:"#ECFDF5",
color:"#059669",
fontWeight:700,
fontSize:13,
}}
>
{report.patient?.firstName?.charAt(0)}
{report.patient?.lastName?.charAt(0)}
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
{report.patient?.firstName} {report.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:0.4,
}}
>
{report.patient?.patientId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Date */}

<TableCell align="center">

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
{new Date(report.createdAt).toLocaleDateString()}
</Typography>

</Box>

</TableCell>

{/* Actions */}

<TableCell align="center">

<ActionButtons
onView={()=>handleView(report)}
onEdit={()=>handleEdit(report)}
onDelete={()=>handleDelete(report._id)}
/>

</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</TableContainer>

)}

<FormDialog
open={open}
onClose={()=>setOpen(false)}
title={editingId?"Edit Report":"Add Report"}
subtitle="Create or update report information"
submitText={editingId?"Update Report":"Save Report"}
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

{patients.map((p)=>(
<MenuItem
key={p._id}
value={p._id}
>
{p.firstName} {p.lastName}
</MenuItem>
))}

</TextField>

<TextField
select
label="Report Type"
name="reportType"
value={formData.reportType}
onChange={handleChange}
sx={textFieldStyle}
>

<MenuItem value="Patient">Patient</MenuItem>
<MenuItem value="Revenue">Revenue</MenuItem>
<MenuItem value="Admission">Admission</MenuItem>
<MenuItem value="Laboratory">Laboratory</MenuItem>

</TextField>

<TextField
label="Generated By"
name="generatedBy"
value={formData.generatedBy}
onChange={handleChange}
sx={textFieldStyle}
/>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={()=>setViewOpen(false)}
title="Report Details"
submitText="Close"
onSubmit={()=>setViewOpen(false)}
hideCancel
>

{selectedReport&&(

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
Patient
</Typography>
<Typography sx={viewValueStyle}>
{selectedReport.patient?.firstName} {selectedReport.patient?.lastName}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Report Type
</Typography>
<Typography sx={viewValueStyle}>
{selectedReport.reportType}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Generated By
</Typography>
<Typography sx={viewValueStyle}>
{selectedReport.generatedBy}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Date
</Typography>
<Typography sx={viewValueStyle}>
{new Date(selectedReport.createdAt).toLocaleDateString("en-GB")}
</Typography>
</Box>

</Box>

)}

</FormDialog>

    </DashboardLayout>

  );

}

export default Reports;