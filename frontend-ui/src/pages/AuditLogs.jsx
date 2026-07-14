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

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";

import {
  TextField,
  MenuItem,
} from "@mui/material";

import FormDialog from "../components/FormDialog";
import { toast } from "react-toastify";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
  },
};

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 3,
  bgcolor: "#fff",
};

const viewLabelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#64748B",
  textTransform: "uppercase",
  mb: .5,
};

const viewValueStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0F172A",
};

function AuditLogs() {

const [logs,
setLogs] =
useState([]);

const [loading,
setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);

const [editingId, setEditingId] = useState(null);
const [selectedLog, setSelectedLog] = useState(null);

const [formData, setFormData] = useState({
  user: "",
  action: "",
  module: "",
});

useEffect(() => {
fetchLogs();
}, []);

const filteredLogs = logs.filter((log) => {

const text = search.toLowerCase();

return (

(log.user || "").toLowerCase().includes(text) ||

(log.action || "").toLowerCase().includes(text) ||

(log.module || "").toLowerCase().includes(text) ||

(log.logId || "").toLowerCase().includes(text)

);

});

const handleChange = (e) => {

setFormData({
...formData,
[e.target.name]: e.target.value,
});

};

const handleSubmit = async () => {

try{

if(editingId){

await API.put(
`/audit-logs/${editingId}`,
formData
);

toast.success("Audit Log updated successfully");

}else{

await API.post(
"/audit-logs",
formData
);

toast.success("Audit Log created successfully");

}

setOpen(false);

setEditingId(null);

setFormData({
user:"",
action:"",
module:"",
});

fetchLogs();

}catch(err){

toast.error(
err.response?.data?.message ||
"Failed to save audit log"
);

}

};

const handleView = (log) => {

setSelectedLog(log);

setViewOpen(true);

};

const handleEdit = (log) => {

setEditingId(log._id);

setFormData({
user:log.user,
action:log.action,
module:log.module,
});

setOpen(true);

};

const handleDelete = async(id)=>{

if(!window.confirm("Delete this audit log?"))
return;

try{

await API.delete(`/audit-logs/${id}`);

toast.success("Audit Log deleted successfully");

fetchLogs();

}catch(err){

toast.error(
err.response?.data?.message ||
"Delete failed"
);

}

};

const stats = [
{
label:"Logs",
value:logs.length,
icon:<HistoryRoundedIcon />,
},
{
label:"Users",
value:new Set(
logs.map(l=>l.user)
).size,
icon:<PersonRoundedIcon />,
},
{
label:"Modules",
value:new Set(
logs.map(l=>l.module)
).size,
icon:<DashboardCustomizeRoundedIcon />,
},
{
label:"Actions",
value:new Set(
logs.map(l=>l.action)
).size,
icon:<UpdateRoundedIcon />,
},
];

const fetchLogs =
async () => {

  try {

    const res =
      await API.get(
        "/audit-logs"
      );

    setLogs(
      res.data.data
    );

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }
};

return ( <DashboardLayout>

 <PageHeader
title="Audit Logs"
subtitle="View system audit history"
icon={<HistoryRoundedIcon />}
buttonText="Export Logs"
onButtonClick={()=>{

setEditingId(null);

setFormData({
user:"",
action:"",
module:"",
});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search user, action or module..."
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

<TableCell sx={{width:"32%", pl:5.5}}>
USER
</TableCell>

<TableCell sx={{width:"38%", pl:6, align:"center"}}>
LOG ENTRY
</TableCell>

<TableCell sx={{width:"30%", pl:6}}>
MODULE
</TableCell>

<TableCell sx={{width:"28%", pl:5.5}}>
DATE
</TableCell>

<TableCell sx={{width:"32%", pl:9.5}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredLogs.map((log)=>(

<TableRow
key={log._id}
hover
sx={{
height:78,

"& td":{
py:2,
px:2.5,
borderBottom:"1px solid #EEF2F7",
verticalAlign:"middle",
},

"&:hover":{
background:"#F8FAFC",
},
}}
>

{/* User */}

<TableCell>

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
background: "linear-gradient(135deg,#2563EB,#3B82F6)",
fontWeight: 700,
fontSize: 13,
flexShrink: 0,
}}
>
{log.user?.charAt(0)?.toUpperCase()}
</Avatar>

<Box>

<Typography
sx={{
fontWeight: 700,
fontSize: 14,
lineHeight: 1.3,
}}
>
{log.user}
</Typography>

<Typography
sx={{
fontSize: 12,
color: "#64748B",
mt: 0.3,
}}
>
{log.logId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Log entry */}

<TableCell>

<Box
display="flex"
>

<Box
sx={{
minWidth:120,
display:"flex",
}}
>

<StatusChip
status={log.action}
/>

</Box>

</Box>

</TableCell>

{/* Module */}

<TableCell>

<Box
display="flex"
justifyContent="center"
>

<Box
sx={{
display:"inline-flex",
alignItems:"center",
justifyContent:"center",
minWidth:120,
height:36,
px:2,
borderRadius:2,
bgcolor:"#EFF6FF",
border:"1px solid #BFDBFE",
}}
>

<Typography
sx={{
fontWeight:600,
fontSize:13,
}}
>
{log.module}
</Typography>

</Box>

</Box>

</TableCell>

{/* Date */}

<TableCell>

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
{new Date(log.createdAt).toLocaleDateString()}
</Typography>

</Box>

</TableCell>

{/* Actions */}

<TableCell
sx={{
width: "16%",
textAlign: "center",
}}
>

<Box
display="flex"
justifyContent="center"
alignItems="center"
gap={1}
>

<ActionButtons
onView={()=>handleView(log)}
onEdit={()=>handleEdit(log)}
onDelete={()=>handleDelete(log._id)}
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
onClose={()=>setOpen(false)}
title={editingId ? "Edit Audit Log" : "New Audit Log"}
subtitle="Create or update audit log"
submitText={editingId ? "Update Log" : "Save Log"}
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
label="User"
name="user"
value={formData.user}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Module"
name="module"
value={formData.module}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Action"
name="action"
value={formData.action}
onChange={handleChange}
sx={{
...textFieldStyle,
gridColumn:{
xs:"1",
md:"1 / span 2",
},
}}
/>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={()=>setViewOpen(false)}
title="Audit Log Details"
submitText="Close"
onSubmit={()=>setViewOpen(false)}
hideCancel
>

{selectedLog && (

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
User
</Typography>
<Typography sx={viewValueStyle}>
{selectedLog.user}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Module
</Typography>
<Typography sx={viewValueStyle}>
{selectedLog.module}
</Typography>
</Box>

<Box
sx={{
...viewBoxStyle,
gridColumn:{
xs:"1",
md:"1 / span 2",
},
}}
>
<Typography sx={viewLabelStyle}>
Action
</Typography>
<Typography sx={viewValueStyle}>
{selectedLog.action}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Log ID
</Typography>
<Typography sx={viewValueStyle}>
{selectedLog.logId}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Created Date
</Typography>
<Typography sx={viewValueStyle}>
{new Date(selectedLog.createdAt).toLocaleDateString("en-GB")}
</Typography>
</Box>

</Box>

)}

</FormDialog>

</DashboardLayout>

);
}

export default AuditLogs;
