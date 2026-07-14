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

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormDialog from "../components/FormDialog";
import { toast } from "react-toastify";

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

function Alerts() {

const [alerts,
setAlerts] =
useState([]);

const [loading,
setLoading] =
useState(true);

const [search, setSearch] = useState("");

useEffect(() => {
fetchAlerts();
}, []);

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);

const [editingId, setEditingId] = useState(null);
const [selectedAlert, setSelectedAlert] = useState(null);

const [formData, setFormData] = useState({
  title: "",
  message: "",
  alertType: "Appointment",
  status: "Pending",
});

const stats = [
  {
    label: "Alerts",
    value: alerts.length,
    icon: <WarningAmberRoundedIcon />,
  },
  {
    label: "Active",
    value: alerts.filter(a => a.status === "Active").length,
    icon: <NotificationsActiveRoundedIcon />,
  },
  {
    label: "Resolved",
    value: alerts.filter(a => a.status === "Resolved").length,
    icon: <CheckCircleRoundedIcon />,
  },
];

const handleChange = (e) => {

setFormData({
...formData,
[e.target.name]:e.target.value,
});

};

const handleSubmit = async () => {

try{

if(editingId){

await API.put(
`/alerts/${editingId}`,
formData
);

toast.success("Alert updated successfully");

}else{

await API.post(
"/alerts",
formData
);

toast.success("Alert created successfully");

}

setOpen(false);

setEditingId(null);

setFormData({
title:"",
message:"",
alertType:"Appointment",
status:"Pending",
});

fetchAlerts();

}catch(err){

toast.error(
err.response?.data?.message ||
"Failed to save alert"
);

}

};

const handleView=(alert)=>{

setSelectedAlert(alert);

setViewOpen(true);

};

const handleEdit=(alert)=>{

setEditingId(alert._id);

setFormData({
title:alert.title,
message:alert.message,
alertType:alert.alertType,
status:alert.status,
});

setOpen(true);

};

const handleDelete=async(id)=>{

if(!window.confirm("Delete this alert?"))
return;

try{

await API.delete(`/alerts/${id}`);

toast.success("Alert deleted successfully");

fetchAlerts();

}catch(err){

toast.error(
err.response?.data?.message ||
"Delete failed"
);

}

};

const filteredAlerts = alerts.filter((alert) => {

const text = search.toLowerCase();

return(

(alert.title || "")
.toLowerCase()
.includes(text)

||

(alert.message || "")
.toLowerCase()
.includes(text)

||

(alert.alertType || "")
.toLowerCase()
.includes(text)

||

(alert.status || "")
.toLowerCase()
.includes(text)

);

});

const fetchAlerts = async () => {
  try {
    const res = await API.get("/alerts");

    console.log(res.data.data);

    setAlerts(res.data.data || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

return ( <DashboardLayout>

<PageHeader
title="Alerts"
subtitle="Manage hospital alerts"
icon={<WarningAmberRoundedIcon />}
buttonText="Create Alert"
onButtonClick={()=>{

setEditingId(null);

setFormData({
title:"",
message:"",
alertType:"Appointment",
status:"Pending",
});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search title, type or status..."
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

<TableCell sx={{width:"36%", pl:7, align:"center"}}>
ALERT
</TableCell>

<TableCell sx={{width:"36%", pl:8, align:"center"}}>
TYPE
</TableCell>

<TableCell sx={{width:"14%", pl:5, align:"center"}}>
STATUS
</TableCell>

<TableCell align="center" sx={{width:"26%"}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredAlerts.map((alert)=>(

<TableRow
key={alert._id}
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

{/* Alert */}

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
background:"linear-gradient(135deg,#F59E0B,#D97706)",
}}
>
<WarningAmberRoundedIcon fontSize="small" />
</Avatar>

<Box>

<Typography
fontWeight={700}
fontSize={14}
>
{alert.title}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:400,
color:"#94A3B8",
mt:0.4,
}}
>
{alert.alertId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Type */}

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
background:"linear-gradient(135deg,#F59E0B,#D97706)",
}}
>
<WarningAmberRoundedIcon fontSize="small" />
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
{alert.title}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:0.4,
}}
>
{alert.alertId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Status */}

<TableCell>

<StatusChip
status={alert.status}
/>

</TableCell>

{/* Actions */}

<TableCell>

<ActionButtons
onView={()=>handleView(alert)}
onEdit={()=>handleEdit(alert)}
onDelete={()=>handleDelete(alert._id)}
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
title={editingId ? "Edit Alert" : "Create Alert"}
subtitle="Create or update hospital alert"
submitText={editingId ? "Update Alert" : "Save Alert"}
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
label="Title"
name="title"
value={formData.title}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
select
label="Alert Type"
name="alertType"
value={formData.alertType}
onChange={handleChange}
sx={textFieldStyle}
>

<MenuItem value="Appointment">Appointment</MenuItem>
<MenuItem value="Billing">Billing</MenuItem>
<MenuItem value="Lab">Lab</MenuItem>
<MenuItem value="Discharge">Discharge</MenuItem>

</TextField>

<TextField
label="Message"
name="message"
multiline
rows={4}
value={formData.message}
onChange={handleChange}
sx={{
...textFieldStyle,
gridColumn:{
xs:"1",
md:"1 / span 2",
},
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

<MenuItem value="Pending">Pending</MenuItem>
<MenuItem value="Sent">Sent</MenuItem>

</TextField>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={()=>setViewOpen(false)}
title="Alert Details"
submitText="Close"
onSubmit={()=>setViewOpen(false)}
hideCancel
>

{selectedAlert && (

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
Title
</Typography>
<Typography sx={viewValueStyle}>
{selectedAlert.title}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Alert Type
</Typography>
<Typography sx={viewValueStyle}>
{selectedAlert.alertType}
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
Message
</Typography>
<Typography sx={viewValueStyle}>
{selectedAlert.message}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Status
</Typography>

<StatusChip
status={selectedAlert.status}
/>

</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Created Date
</Typography>
<Typography sx={viewValueStyle}>
{new Date(selectedAlert.createdAt).toLocaleDateString("en-GB")}
</Typography>
</Box>

</Box>

)}

</FormDialog>

</DashboardLayout>

);
}

export default Alerts;
