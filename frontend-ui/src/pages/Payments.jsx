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

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import FormDialog from "../components/FormDialog";
import { Grid, TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 2,
  bgcolor: "#F8FAFC",
};

const viewLabelStyle = {
  fontSize: 13,
  color: "#64748B",
  fontWeight: 700,
  mb: 0.5,
};

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
  },
};

function Payments() {

const [payments, setPayments] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [open,setOpen]=useState(false);
const [viewOpen,setViewOpen]=useState(false);
const [editingId,setEditingId]=useState(null);
const [selectedPayment,setSelectedPayment]=useState(null);

const [patients,setPatients]=useState([]);
const [bills,setBills]=useState([]);

const [formData,setFormData]=useState({

bill:"",
patient:"",
amount:"",
paymentMethod:"Cash",
transactionId:"",
paymentStatus:"Success",

});

useEffect(()=>{

fetchPayments();
fetchPatients();
fetchBills();

},[]);

const fetchPatients = async () => {

try{

const res=await API.get("/patients");
setPatients(res.data.data || []);

}catch(err){

console.log(err);

}

};

const fetchBills = async () => {

try{

const res=await API.get("/bills");
setBills(res.data.data || []);

}catch(err){

console.log(err);

}

};

const handleChange=(e)=>{

setFormData({

...formData,
[e.target.name]:e.target.value,

});

};

const handleSubmit = async()=>{

try{

if(editingId){

await API.put(`/payments/${editingId}`,formData);

toast.success("Payment updated successfully");

}else{

await API.post("/payments",formData);

toast.success("Payment created successfully");

}

setOpen(false);

setEditingId(null);

setFormData({

bill:"",
patient:"",
amount:"",
paymentMethod:"Cash",
transactionId:"",
paymentStatus:"Success",

});

fetchPayments();

}catch(err){

console.log(err);

toast.error(

err.response?.data?.message ||
"Failed to save payment"

);

}

};

const handleView=(payment)=>{

setSelectedPayment(payment);

setViewOpen(true);

};

const handleEdit=(payment)=>{

setEditingId(payment._id);

setFormData({

bill:payment.bill?._id || "",

patient:payment.patient?._id || "",

amount:payment.amount,

paymentMethod:payment.paymentMethod,

transactionId:payment.transactionId || "",

paymentStatus:payment.paymentStatus,

});

setOpen(true);

};

const handleDelete=async(id)=>{

if(!window.confirm("Delete this payment?"))
return;

try{

await API.delete(`/payments/${id}`);

toast.success("Payment deleted successfully");

fetchPayments();

}catch(err){

toast.error(

err.response?.data?.message ||
"Delete failed"

);

}

};

const stats = [
{
label:"Payments",
value:payments.length,
icon:<PaymentsRoundedIcon />,
},
{
label:"Completed",
value: payments.filter(
  p => p.paymentStatus === "Success"
).length,
icon:<CheckCircleRoundedIcon />,
},
{
label:"Pending",
value: payments.filter(
  p => p.paymentStatus !== "Success"
).length,
icon:<PendingActionsRoundedIcon />,
},
{
label:"Revenue",
value:`₹${payments.reduce(
(sum,p)=>sum+(p.amount||0),0
)}`,
icon:<CurrencyRupeeRoundedIcon />,
},
];

const filteredPayments = payments.filter((payment)=>{

const text=search.toLowerCase();

return(

`${payment.patient?.firstName || ""} ${payment.patient?.lastName || ""}`
.toLowerCase()
.includes(text)

||

(payment.bill?.billId || "")
.toLowerCase()
.includes(text)

||

(payment.paymentMethod || "")
.toLowerCase()
.includes(text)

);

});

const fetchPayments = async () => {

try {

  const res =
    await API.get("/payments");

  setPayments(res.data.data);

} catch (error) {

  console.log(error);

} finally {

  setLoading(false);

}

};

return (

<DashboardLayout>

 <PageHeader
  title="Payments"
  subtitle="Manage hospital payment records"
  icon={<PaymentsRoundedIcon />}
  buttonText="New Payment"
  onButtonClick={() => {

    setEditingId(null);

    setFormData({
      bill: "",
      patient: "",
      amount: "",
      paymentMethod: "Cash",
      transactionId: "",
      paymentStatus: "Success",
    });

    setOpen(true);

  }}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search patient, bill or payment..."
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

<TableCell sx={{width:"25%", pl:6, align:"center"}}>
PATIENT
</TableCell>

<TableCell align="center" sx={{width:"34%"}}>
BILL ID
</TableCell>

<TableCell align="center" sx={{width:"24%"}}>
AMOUNT
</TableCell>

<TableCell align="center" sx={{width:"28%"}}>
METHOD
</TableCell>

<TableCell align="center" sx={{width:"24%"}}>
STATUS
</TableCell>

<TableCell align="center" sx={{width:"32%"}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredPayments.length === 0 ? (

<TableRow>
<TableCell
colSpan={6}
align="center"
sx={{ py: 8 }}
>

<PaymentsIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography
mt={2}
fontWeight={700}
>
No Payments Found
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>
</TableRow>

) : (

filteredPayments.map((payment)=>(


<TableRow
  key={payment._id}
  hover
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
width:40,
height:40,
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
fontWeight:700,
fontSize:13,
}}
>
{payment.patient?.firstName?.charAt(0)}
{payment.patient?.lastName?.charAt(0)}
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
{payment.patient?.firstName} {payment.patient?.lastName}
</Typography>

</Box>

</Box>

</TableCell>

{/* Bill ID */}

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
{payment.bill?.billId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Amount */}

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
bgcolor:"#ECFDF5",
border:"1px solid #A7F3D0",
}}
>

<Typography
fontWeight={700}
fontSize={13}
color="#059669"
>
₹{payment.amount}
</Typography>

</Box>

</Box>

</TableCell>

{/* Method */}

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
{payment.paymentMethod}
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
  status={payment.paymentStatus}
/>

</Box>

</TableCell>

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<ActionButtons
onView={()=>handleView(payment)}
onEdit={()=>handleEdit(payment)}
onDelete={()=>handleDelete(payment._id)}
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
  onClose={() => {

    setOpen(false);
    setEditingId(null);

    setFormData({
      bill: "",
      patient: "",
      amount: "",
      paymentMethod: "Cash",
      transactionId: "",
      paymentStatus: "Success",
    });

  }}
  title={editingId ? "Edit Payment" : "New Payment"}
  submitText={editingId ? "Update Payment" : "Save Payment"}
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
label="Bill"
name="bill"
value={formData.bill}
onChange={handleChange}
sx={textFieldStyle}
>
{bills.map((bill)=>(
<MenuItem
key={bill._id}
value={bill._id}
>
{bill.billId}
</MenuItem>
))}
</TextField>

<TextField
label="Amount"
name="amount"
type="number"
value={formData.amount}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
select
label="Payment Method"
name="paymentMethod"
value={formData.paymentMethod}
onChange={handleChange}
sx={textFieldStyle}
>
<MenuItem value="Cash">Cash</MenuItem>
<MenuItem value="Card">Card</MenuItem>
<MenuItem value="UPI">UPI</MenuItem>
<MenuItem value="Net Banking">Net Banking</MenuItem>
</TextField>

<TextField
label="Transaction ID"
name="transactionId"
value={formData.transactionId}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
select
label="Payment Status"
name="paymentStatus"
value={formData.paymentStatus}
onChange={handleChange}
sx={textFieldStyle}
>
<MenuItem value="Pending">Pending</MenuItem>
<MenuItem value="Success">Success</MenuItem>
<MenuItem value="Failed">Failed</MenuItem>
</TextField>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={()=>setViewOpen(false)}
title="Payment Details"
submitText="Close"
hideCancel
onSubmit={()=>setViewOpen(false)}
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
Bill
</Typography>
<Typography fontWeight={700}>
{selectedPayment?.bill?.billId}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Patient
</Typography>
<Typography fontWeight={700}>
{selectedPayment?.patient?.firstName}{" "}
{selectedPayment?.patient?.lastName}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Amount
</Typography>
<Typography
fontWeight={700}
color="#059669"
>
₹{selectedPayment?.amount}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Payment Method
</Typography>
<Typography fontWeight={700}>
{selectedPayment?.paymentMethod}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Payment Status
</Typography>

<StatusChip
  status={selectedPayment?.paymentStatus}
/>

</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Transaction ID
</Typography>
<Typography fontWeight={700}>
{selectedPayment?.transactionId || "-"}
</Typography>
</Box>

</Box>

</FormDialog>

</DashboardLayout>

);
}

export default Payments;
