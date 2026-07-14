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

import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import { TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import FormDialog from "../components/FormDialog";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
  },
};

const viewLabelStyle = {
  fontSize: 12,
  color: "#64748B",
  fontWeight: 700,
  textTransform: "uppercase",
  mb: .5,
};

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 3,
  bgcolor: "#fff",
};

const viewValueStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0F172A",
};

function Notifications() {

const [
notifications,
setNotifications
] = useState([]);

const [
loading,
setLoading
] = useState(true);

const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [selectedNotification, setSelectedNotification] = useState(null);

const [formData, setFormData] = useState({
  title: "",
  message: "",
  role: "Admin",
  isRead: false,
});

useEffect(() => {
fetchNotifications();
}, []);

const handleChange = (e) => {
  const value =
    e.target.name === "isRead"
      ? e.target.value === "true"
      : e.target.value;

  setFormData({
    ...formData,
    [e.target.name]: value,
  });
};

const handleSubmit = async () => {
  try {

    if (editingId) {

      await API.put(
        `/notifications/${editingId}`,
        formData
      );

      toast.success("Notification updated successfully");

    } else {

      await API.post(
        "/notifications",
        formData
      );

      toast.success("Notification created successfully");

    }

    setOpen(false);
    setEditingId(null);

    setFormData({
      title: "",
      message: "",
      role: "Admin",
      isRead: false,
    });

    fetchNotifications();

  } catch (err) {

  console.log(err);
  console.log(err.response?.data);

  toast.error(
    err.response?.data?.message || "Failed to save notification"
  );

}
};

const handleView = (notification) => {
  setSelectedNotification(notification);
  setViewOpen(true);
};

const handleEdit = (notification) => {

  setEditingId(notification._id);

  setFormData({
    title: notification.title,
    message: notification.message,
    role: notification.role,
    isRead: notification.isRead,
  });

  setOpen(true);
};

const handleDelete = async (id) => {

  if (!window.confirm("Delete this notification?"))
    return;

  try {

    await API.delete(`/notifications/${id}`);

    toast.success("Notification deleted successfully");

    fetchNotifications();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );

  }
};

const stats = [
{
label:"Notifications",
value:notifications.length,
icon:<NotificationsActiveRoundedIcon />,
},
{
label:"Unread",
value:notifications.filter(n=>!n.isRead).length,
icon:<MarkEmailUnreadRoundedIcon />,
},
{
label:"Read",
value:notifications.filter(n=>n.isRead).length,
icon:<MarkEmailReadRoundedIcon />,
},
{
label:"Types",
value:new Set(
notifications.map(n=>n.type)
).size,
icon:<CampaignRoundedIcon />,
},
];

const filteredNotifications = notifications.filter((notification)=>{

const text = search.toLowerCase();

return(

(notification.title || "")
.toLowerCase()
.includes(text)

||

(notification.message || "")
.toLowerCase()
.includes(text)

||

(notification.role || "")
.toLowerCase()
.includes(text)

);

});

const fetchNotifications =
async () => {

  try {

    const res =
      await API.get(
        "/notifications"
      );

    setNotifications(
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
title="Notifications"
subtitle="Manage system notifications"
icon={<NotificationsActiveRoundedIcon />}
buttonText="New Notification"
onButtonClick={() => {

  setEditingId(null);

  setFormData({
    title: "",
    message: "",
    role: "Admin",
    isRead: false,
  });

  setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search title, message or role..."
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

<TableCell sx={{width:"30%", align:"center", pl:5.5}}>
NOTIFICATION
</TableCell>

<TableCell sx={{width:"30%", pl:8}}>
MESSAGE
</TableCell>

<TableCell align="center" sx={{width:"16%"}}>
STATUS
</TableCell>

<TableCell align="center" sx={{width:"22%"}}>
DATE
</TableCell>

<TableCell align="center" sx={{width:"18%"}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredNotifications.map((notification)=>(

<TableRow
key={notification._id}
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

{/* Notification */}

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
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
}}
>
<NotificationsActiveRoundedIcon fontSize="small" />
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
{notification.title}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:0.4,
}}
>
{notification.notificationId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Message */}

<TableCell>

<Box
sx={{
display:"inline-flex",
maxWidth:260,
px:2,
py:.7,
borderRadius:2,
bgcolor:"#F8FAFC",
border:"1px solid #E2E8F0",
}}
>

<Typography
sx={{
fontWeight:600,
fontSize:13,
overflow:"hidden",
textOverflow:"ellipsis",
whiteSpace:"nowrap",
}}
>
{notification.message}
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
status={notification.isRead ? "Read" : "Unread"}
/>

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
{notification.createdAt
? new Date(notification.createdAt).toLocaleDateString()
: "-"}
</Typography>

</Box>

</TableCell>

{/* Actions */}

<TableCell align="center">

<ActionButtons
onView={() => handleView(notification)}
onEdit={() => handleEdit(notification)}
onDelete={() => handleDelete(notification._id)}
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
onClose={() => setOpen(false)}
title={editingId ? "Edit Notification" : "New Notification"}
subtitle="Create or update notification"
submitText={editingId ? "Update Notification" : "Save Notification"}
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
label="Role"
name="role"
value={formData.role}
onChange={handleChange}
sx={textFieldStyle}
>

<MenuItem value="Admin">Admin</MenuItem>
<MenuItem value="Doctor">Doctor</MenuItem>
<MenuItem value="Nurse">Nurse</MenuItem>
<MenuItem value="Receptionist">Receptionist</MenuItem>
<MenuItem value="Patient">Patient</MenuItem>

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
  name="isRead"
  value={String(formData.isRead)}
  onChange={handleChange}
>
  <MenuItem value="false">Unread</MenuItem>
  <MenuItem value="true">Read</MenuItem>
</TextField>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={() => setViewOpen(false)}
title="Notification Details"
submitText="Close"
onSubmit={() => setViewOpen(false)}
hideCancel
>

{selectedNotification && (

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
{selectedNotification.title}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Role
</Typography>
<Typography sx={viewValueStyle}>
{selectedNotification.role}
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
{selectedNotification.message}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Status
</Typography>

<StatusChip
status={selectedNotification.isRead ? "Read" : "Unread"}
/>

</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Date
</Typography>
<Typography sx={viewValueStyle}>
{new Date(selectedNotification.createdAt).toLocaleDateString("en-GB")}
</Typography>
</Box>

</Box>

)}

</FormDialog>

</DashboardLayout>

);
}

export default Notifications;
