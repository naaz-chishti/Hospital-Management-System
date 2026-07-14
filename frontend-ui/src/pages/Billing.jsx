import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import ModuleStats from "../components/ModuleStats";
import StatusChip from "../components/StatusChip";
import ActionButtons from "../components/ActionButtons";

import FormDialog from "../components/FormDialog";
import { TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import { useSearchParams } from "react-router-dom";

const textFieldStyle = {

"& .MuiOutlinedInput-root":{

borderRadius:3,
background:"#fff",

"& fieldset":{
borderColor:"#CBD5E1",
},

"&:hover fieldset":{
borderColor:"#14B8A6",
},

"&.Mui-focused fieldset":{
borderColor:"#14B8A6",
borderWidth:2,
},

},

"& .MuiInputLabel-root":{

fontWeight:600,
color:"#475569",

},

"& .MuiInputLabel-root.Mui-focused":{

color:"#0F766E",

},

};

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 2,
  bgcolor: "#F8FAFC",
};

const viewLabelStyle = {
  fontSize: 13,
  color: "#94A3B8",
  fontWeight: 700,
  mb: 1,
};

function Billing() {

const [bills,setBills]=useState([]);
const [loading,setLoading]=useState(true);
const [search,setSearch]=useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);

const [editingId, setEditingId] = useState(null);

const [selectedBill, setSelectedBill] = useState(null);

const [patients, setPatients] = useState([]);

const [searchParams] = useSearchParams();

const [formData, setFormData] = useState({

patient:"",
consultationFee:0,
labFee:0,
imagingFee:0,
admissionFee:0,
medicineFee:0,
paymentStatus:"Pending",

});

useEffect(() => {

fetchBills();

fetchPatients();

if (searchParams.get("add") === "true") {
    setEditingId(null);

    setFormData({
      // default form values
    });

    setOpen(true);
  }
}, []);

const fetchBills=async()=>{

try{

const res=await API.get("/bills");
setBills(res.data.data || []);

}catch(err){

console.log(err);

}finally{

setLoading(false);

}

};

const fetchPatients = async () => {

try{

const res = await API.get("/patients");

setPatients(res.data.data || []);

}catch{

toast.error("Failed to load patients");

}

};

const handleChange = (e) => {

const { name, value } = e.target;

const updated = {

...formData,

[name]: value,

};

updated.totalAmount =

Number(updated.consultationFee || 0)+
Number(updated.labFee || 0)+
Number(updated.imagingFee || 0)+
Number(updated.admissionFee || 0)+
Number(updated.medicineFee || 0);

setFormData(updated);

};

const handleSubmit = async () => {

try{

if(editingId){

await API.put(`/bills/${editingId}`,formData);

toast.success("Bill updated successfully");

}else{

await API.post("/bills",formData);

toast.success("Bill created successfully");

}

setOpen(false);

setEditingId(null);

fetchBills();

}catch(err){

toast.error(

err.response?.data?.message ||

"Failed to save bill"

);

}

};

const handleView=(bill)=>{

setSelectedBill(bill);

setViewOpen(true);

toast.info("Viewing bill");

};

const handleEdit=(bill)=>{

setEditingId(bill._id);

setFormData({

patient:bill.patient?._id,

consultationFee:bill.consultationFee,

labFee:bill.labFee,

imagingFee:bill.imagingFee,

admissionFee:bill.admissionFee,

medicineFee:bill.medicineFee,

paymentStatus:bill.paymentStatus,

totalAmount:bill.totalAmount,

});

setOpen(true);

toast.info("Editing bill");

};

const handleDelete=async(id)=>{

if(!window.confirm("Delete this bill?"))

return;

try{

await API.delete(`/bills/${id}`);

toast.success("Bill deleted");

fetchBills();

}catch(err){

toast.error(

err.response?.data?.message ||

"Delete failed"

);

}

};

const stats=[

{
label:"Total Bills",
value:bills.length,
icon:<ReceiptLongRoundedIcon/>
},

{
label:"Paid",
value:bills.filter(b=>b.status==="Paid").length,
icon:<PaymentsRoundedIcon/>
},

{
label:"Pending",
value:bills.filter(b=>b.status!=="Paid").length,
icon:<PendingActionsRoundedIcon/>
},

{
label:"Revenue",
value:"₹"+bills.reduce((sum,b)=>sum+(b.totalAmount||0),0),
icon:<AccountBalanceWalletRoundedIcon/>
},

];

const filteredBills = bills.filter((bill) => {

  const text = search.toLowerCase();

  return (

    `${bill.patient?.firstName || ""} ${bill.patient?.lastName || ""}`
      .toLowerCase()
      .includes(text)

    ||

    (bill.billId || "")
      .toLowerCase()
      .includes(text)

    ||

    (bill.paymentStatus || "")
      .toLowerCase()
      .includes(text)

  );

});

return (
<DashboardLayout>

<PageHeader
title="Billing"
subtitle="Manage hospital invoices and payments"
icon={<ReceiptLongRoundedIcon />}
buttonText="Create Bill"
onButtonClick={()=>{

setEditingId(null);

setFormData({

patient:"",
consultationFee:0,
labFee:0,
imagingFee:0,
admissionFee:0,
medicineFee:0,
paymentStatus:"Pending",

});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search patient, invoice or payment..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
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
<CircularProgress size={45} thickness={4}/>
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

<TableCell sx={{ width: "10%", fontWeight: 700, pl:5}}>
PATIENT
</TableCell>

<TableCell align="center" sx={{ width: "15%", fontWeight: 700 }}>
CONSULT
</TableCell>

<TableCell align="center" sx={{ width: "6%", fontWeight: 700 }}>
LAB
</TableCell>

<TableCell align="center" sx={{ width: "8%", fontWeight: 700 }}>
IMAGE
</TableCell>

<TableCell align="center" sx={{ width: "10%", fontWeight: 700 }}>
ADMISSION
</TableCell>

<TableCell align="center" sx={{ width: "8%", fontWeight: 700 }}>
MEDICINE
</TableCell>

<TableCell align="center" sx={{ width: "8%", fontWeight: 700 }}>
TOTAL
</TableCell>

<TableCell align="center" sx={{ width: "12%", fontWeight: 700 }}>
STATUS
</TableCell>

<TableCell align="center" sx={{ width: "12%", fontWeight: 700 }}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredBills.length===0 ? (

<TableRow>

<TableCell
colSpan={9}
align="center"
sx={{py:8}}
>

<ReceiptLongRoundedIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography mt={2} fontWeight={700}>
No Bills Found
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredBills.map((bill)=>(

<TableRow
key={bill._id}
hover
sx={{
"& td":{
py:2.3,
borderBottom:"1px solid #EEF2F7",
verticalAlign:"middle",
},
"&:hover":{
bgcolor:"#F8FAFC",
},
}}
>

<TableCell>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:2,
minHeight:48,
}}
>

<Avatar
sx={{
width:42,
height:42,
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
fontWeight:700,
fontSize:15,
}}
>
{bill.patient?.firstName?.charAt(0)}
{bill.patient?.lastName?.charAt(0)}
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
{bill.patient?.firstName} {bill.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
fontWeight:500,
color:"#94A3B8",
mt:0.4,
}}
>
{bill.billId}
</Typography>

</Box>

</Box>

</TableCell>

<TableCell
align="center"
sx={{
fontWeight:600,
fontSize:14,
}}
>
₹{bill.consultationFee || 0}
</TableCell>

<TableCell align="center">
₹{bill.labFee || 0}
</TableCell>

<TableCell align="center">
₹{bill.imagingFee || 0}
</TableCell>

<TableCell align="center">
₹{bill.admissionFee || 0}
</TableCell>

<TableCell align="center">
₹{bill.medicineFee || 0}
</TableCell>

<TableCell align="center">

<Box
sx={{
display:"inline-flex",
px:2,
py:.6,
borderRadius:2,
background:"#ECFDF5",
border:"1px solid #A7F3D0",
}}
>

<Typography
fontWeight={700}
color="#059669"
>
₹{bill.totalAmount || 0}
</Typography>

</Box>

</TableCell>

<TableCell align="center">

<StatusChip
status={bill.paymentStatus || "Pending"}
/>

</TableCell>

<TableCell align="center">

<ActionButtons
onView={()=>handleView(bill)}
onEdit={()=>handleEdit(bill)}
onDelete={()=>handleDelete(bill._id)}
/>

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
title={editingId ? "Edit Bill" : "Create Bill"}
submitText={editingId ? "Update Bill" : "Save Bill"}
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
label="Consultation Fee"
name="consultationFee"
type="number"
value={formData.consultationFee}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Lab Fee"
name="labFee"
type="number"
value={formData.labFee}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Imaging Fee"
name="imagingFee"
type="number"
value={formData.imagingFee}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Admission Fee"
name="admissionFee"
type="number"
value={formData.admissionFee}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Medicine Fee"
name="medicineFee"
type="number"
value={formData.medicineFee}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
  fullWidth
  label="Total Amount"
  name="totalAmount"
  value={formData.totalAmount || 0}
  InputProps={{
    readOnly: true,
  }}
  InputLabelProps={{
    shrink: true,
  }}
  sx={{
  ...textFieldStyle,

  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",   // same as other fields
    backgroundColor: "#fff",
  },

  "& .MuiInputBase-input": {
    WebkitTextFillColor: "#0F172A",
    color: "#0F172A",
    fontWeight: 600,
  },
}}
/>

<TextField
select
label="Payment Status"
name="paymentStatus"
value={formData.paymentStatus}
onChange={handleChange}
sx={textFieldStyle}
>

<MenuItem value="Pending">
Pending
</MenuItem>

<MenuItem value="Paid">
Paid
</MenuItem>

</TextField>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={() => setViewOpen(false)}
title="Bill Details"
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
Bill ID
</Typography>

<Typography fontWeight={700}>
{selectedBill?.billId}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Patient
</Typography>

<Typography fontWeight={700}>
{selectedBill?.patient?.firstName}{" "}
{selectedBill?.patient?.lastName}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Consultation Fee
</Typography>

<Typography fontWeight={700}>
₹{selectedBill?.consultationFee || 0}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Lab Fee
</Typography>

<Typography fontWeight={700}>
₹{selectedBill?.labFee || 0}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Imaging Fee
</Typography>

<Typography fontWeight={700}>
₹{selectedBill?.imagingFee || 0}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Admission Fee
</Typography>

<Typography fontWeight={700}>
₹{selectedBill?.admissionFee || 0}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Medicine Fee
</Typography>

<Typography fontWeight={700}>
₹{selectedBill?.medicineFee || 0}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Total Amount
</Typography>

<Typography
fontWeight={700}
color="#059669"
>
₹{selectedBill?.totalAmount || 0}
</Typography>
</Box>

<Box
sx={{
gridColumn:{
xs:"span 1",
md:"span 2",
},
...viewBoxStyle,
}}
>

<Typography sx={viewLabelStyle}>
Payment Status
</Typography>

<StatusChip
status={selectedBill?.paymentStatus || "Pending"}
/>

</Box>

</Box>

</FormDialog>

</DashboardLayout>
);

}

export default Billing;
