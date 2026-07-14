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
  TextField,
  MenuItem,
} from "@mui/material";

import FormDialog from "../components/FormDialog";
import { toast } from "react-toastify";

import {
Table,
TableBody,
TableContainer,
TableHead,
Paper,
} from "@mui/material";

import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";

import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const viewBoxStyle = {
  p: 2,
  border: "1px solid #E2E8F0",
  borderRadius: 3,
  bgcolor: "#FFFFFF",
  minHeight: 74,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const viewLabelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "#64748B",
  mb: 0.8,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const viewValueStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0F172A",
  lineHeight: 1.4,
};

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
  },
};

function InsuranceClaims() {

const [claims, setClaims] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [selectedClaim, setSelectedClaim] = useState(null);

const [patients, setPatients] = useState([]);
const [bills, setBills] = useState([]);

const [formData, setFormData] = useState({
  patient: "",
  bill: "",
  insuranceProvider: "",
  policyNumber: "",
  claimAmount: "",
  approvedAmount: "",
  status: "Pending",
});

useEffect(() => {
  fetchClaims();
  fetchPatients();
  fetchBills();
}, []);

const fetchPatients = async () => {
  try {
    const res = await API.get("/patients");
    setPatients(res.data.data || []);
  } catch (err) {
    console.log(err);
  }
};

const fetchBills = async () => {
  try {
    const res = await API.get("/bills");
    setBills(res.data.data || []);
  } catch (err) {
    console.log(err);
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

    if (editingId) {

      await API.put(
        `/insurance-claims/${editingId}`,
        formData
      );

      toast.success("Claim updated successfully");

    } else {

      await API.post(
        "/insurance-claims",
        formData
      );

      toast.success("Claim created successfully");

    }

    setOpen(false);
    setEditingId(null);

    setFormData({
      patient: "",
      bill: "",
      insuranceProvider: "",
      policyNumber: "",
      claimAmount: "",
      approvedAmount: "",
      status: "Pending",
    });

    fetchClaims();

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to save claim"
    );

  }

};

const handleView = (claim) => {

  setSelectedClaim(claim);

  setViewOpen(true);

};

const handleEdit = (claim) => {

  setEditingId(claim._id);

  setFormData({

    patient: claim.patient?._id || "",

    bill: claim.bill?._id || "",

    insuranceProvider:
      claim.insuranceProvider || "",

    policyNumber:
      claim.policyNumber || "",

    claimAmount:
      claim.claimAmount || "",

    approvedAmount:
      claim.approvedAmount || "",

    status:
      claim.status || "Pending",

  });

  setOpen(true);

};

const handleDelete = async (id) => {

  if (!window.confirm("Delete this claim?"))
    return;

  try {

    await API.delete(
      `/insurance-claims/${id}`
    );

    toast.success(
      "Claim deleted successfully"
    );

    fetchClaims();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );

  }

};

const stats = [
{
label:"Claims",
value:claims.length,
icon:<HealthAndSafetyRoundedIcon />,
},
{
label:"Approved",
value:claims.filter(
c=>c.status==="Approved"
).length,
icon:<CheckCircleRoundedIcon />,
},
{
label:"Pending",
value:claims.filter(
c=>c.status!=="Approved"
).length,
icon:<PendingActionsRoundedIcon />,
},
{
label:"Amount",
value:`₹${claims.reduce(
(sum,c)=>sum+(c.claimAmount||0),0
)}`,
icon:<CurrencyRupeeRoundedIcon />,
},
];

const filteredClaims = claims.filter((claim)=>{

const text=search.toLowerCase();

return(

`${claim.patient?.firstName || ""} ${claim.patient?.lastName || ""}`
.toLowerCase()
.includes(text)

||

(claim.bill?.billId || "")
.toLowerCase()
.includes(text)

||

(claim.insuranceProvider || "")
.toLowerCase()
.includes(text)

);

});

const fetchClaims = async () => {
  try {
    const res = await API.get("/insurance-claims");

    console.log(res.data.data);

    setClaims(res.data.data || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

return ( <DashboardLayout>

 <PageHeader
title="Insurance Claims"
subtitle="Manage insurance claim requests"
icon={<HealthAndSafetyRoundedIcon />}
buttonText="New Claim"
onButtonClick={() => {

setEditingId(null);

setFormData({

patient:"",
bill:"",
insuranceProvider:"",
policyNumber:"",
claimAmount:"",
approvedAmount:"",
status:"Pending",

});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search patient, bill or insurance..."
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

<TableCell sx={{width:"15%", pl:7}}>
PATIENT
</TableCell>

<TableCell align="center" sx={{width:"32%"}}>
BILL
</TableCell>

<TableCell sx={{width:"25%", align:"center", pl:6.5}}>
INSURANCE
</TableCell>

<TableCell align="center" sx={{width:"14%"}}>
CLAIM AMOUNT
</TableCell>

<TableCell align="center" sx={{width:"24%"}}>
STATUS
</TableCell>

<TableCell align="center" sx={{width:"25%"}}>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredClaims.map((claim) => (

<TableRow
key={claim._id}
hover
sx={{
height:70,

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
fontSize:13,
fontWeight:700,
background:"linear-gradient(135deg,#2563EB,#3B82F6)",
}}
>
{claim.patient?.firstName?.charAt(0)}
{claim.patient?.lastName?.charAt(0)}
</Avatar>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:14,
}}
>
{claim.patient?.firstName} {claim.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#94A3B8",
}}
>
{claim.claimId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Bill Cell */}

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
{claim.bill?.billId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Insurance Cell */}

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
minWidth:180,
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
color:"#334155",
}}
>
{claim.insuranceProvider}
</Typography>

</Box>

</Box>

</TableCell>

{/* Claim Amount Cell */}

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
sx={{
fontWeight:700,
fontSize:13,
color:"#059669",
}}
>
₹{claim.claimAmount}
</Typography>

</Box>

</Box>

</TableCell>

{/* Status Cell */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<StatusChip
status={claim.status || "Pending"}
/>

</Box>

</TableCell>

{/* Actions Cell */}

<TableCell align="center">

<Box
display="flex"
justifyContent="center"
>

<ActionButtons
onView={() => handleView(claim)}
onEdit={() => handleEdit(claim)}
onDelete={() => handleDelete(claim._id)}
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
  title={editingId ? "Edit Claim" : "New Claim"}
  subtitle="Create or update insurance claim information"
  onSubmit={handleSubmit}
  submitText={editingId ? "Update Claim" : "Save Claim"}
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
label="Insurance Provider"
name="insuranceProvider"
value={formData.insuranceProvider}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Policy Number"
name="policyNumber"
value={formData.policyNumber}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
type="number"
label="Claim Amount"
name="claimAmount"
value={formData.claimAmount}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
type="number"
label="Approved Amount"
name="approvedAmount"
value={formData.approvedAmount}
onChange={handleChange}
sx={textFieldStyle}
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
<MenuItem value="Approved">Approved</MenuItem>
<MenuItem value="Rejected">Rejected</MenuItem>
</TextField>

</Box>
</FormDialog>


<FormDialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  title="Claim Details"
  submitText="Close"
  onSubmit={() => setViewOpen(false)}
  hideCancel
>
  {selectedClaim && (

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
<Typography fontWeight={700}>
{selectedClaim.patient?.firstName} {selectedClaim.patient?.lastName}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Bill ID
</Typography>
<Typography fontWeight={700}>
{selectedClaim.bill?.billId}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Insurance Provider
</Typography>
<Typography fontWeight={700}>
{selectedClaim.insuranceProvider}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Policy Number
</Typography>
<Typography fontWeight={700}>
{selectedClaim.policyNumber}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Claim Amount
</Typography>
<Typography
fontWeight={700}
color="#059669"
>
₹{selectedClaim.claimAmount}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>
Approved Amount
</Typography>
<Typography
fontWeight={700}
color="#2563EB"
>
₹{selectedClaim.approvedAmount}
</Typography>
</Box>

<Box
sx={{
  ...viewBoxStyle,
  gridColumn: {
    xs: "1",
    md: "1 / span 2",
  },
}}
>
  <Typography sx={viewLabelStyle}>
    Status
  </Typography>

  <Box
    sx={{
      mt: 0.8,
      display: "flex",
      alignItems: "center",
    }}
  >
    <StatusChip status={selectedClaim.status} />
  </Box>

</Box>

</Box>

)}
  
</FormDialog>

</DashboardLayout>

);
}

export default InsuranceClaims;
