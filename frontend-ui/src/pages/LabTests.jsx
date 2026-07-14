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

import ScienceIcon from "@mui/icons-material/Science";

import FormDialog from "../components/FormDialog";
import { TextField, MenuItem } from "@mui/material";

import { toast } from "react-toastify";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";

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

function LabTests() {

const [tests, setTests] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] = useState("");

const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [selectedTest, setSelectedTest] = useState(null);

const [patients, setPatients] = useState([]);
const [doctors, setDoctors] = useState([]);
const [consultations, setConsultations] = useState([]);

const [searchParams] = useSearchParams();

const [formData, setFormData] = useState({
  consultation: "",
  patient: "",
  doctor: "",
  testName: "",
  status: "Ordered",
  result: "",
});

useEffect(() => {
  fetchLabTests();
  fetchPatients();
  fetchDoctors();
  fetchConsultations();
  
if (searchParams.get("add") === "true") {
    setEditingId(null);

    setFormData({
      // default form values
    });

    setOpen(true);
  }
}, []);

const fetchLabTests = async () => {
  try {

    const res = await API.get("/lab-tests");

    setTests(res.data.data || []);

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load Lab Tests"
    );

  } finally {

    setLoading(false);

  }
};

const fetchPatients = async () => {
  try {

    const res = await API.get("/patients");

    setPatients(res.data.data || []);

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load Patients"
    );

  }
};

const fetchDoctors = async () => {
  try {

    const res = await API.get("/doctors");

    setDoctors(res.data.data || []);

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load Doctors"
    );

  }
};

const fetchConsultations = async () => {
  try {

    const res = await API.get("/consultations");

    setConsultations(res.data.data || []);

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load Consultations"
    );

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
        `/lab-tests/${editingId}`,
        formData
      );

      toast.success(
        "Lab Test updated successfully"
      );

    } else {

      await API.post(
        "/lab-tests",
        formData
      );

      toast.success(
        "Lab Test created successfully"
      );

    }

    setOpen(false);

    setEditingId(null);

    setFormData({
      consultation: "",
      patient: "",
      doctor: "",
      testName: "",
      status: "Ordered",
      result: "",
    });

    fetchLabTests();

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      err.message ||
      "Something went wrong"
    );

  }

};

const handleView = (test) => {

  toast.info("Viewing Lab Test");

  setSelectedTest(test);

  setViewOpen(true);

};

const handleDelete = async (id) => {

  if (!window.confirm("Delete this Lab Test?"))
    return;

  try {

    await API.delete(`/lab-tests/${id}`);

    toast.success(
      "Lab Test deleted successfully"
    );

    fetchLabTests();

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to delete Lab Test"
    );

  }

};

const handleEdit = (test) => {

  toast.info("Editing Lab Test");

  setEditingId(test._id);

  setFormData({
    consultation: test.consultation?._id || "",
    patient: test.patient?._id || "",
    doctor: test.doctor?._id || "",
    testName: test.testName || "",
    status: test.status || "Ordered",
    result: test.result || "",
  });

  setOpen(true);

};

const stats = [
  {
    label: "Total Tests",
    value: tests.length,
    icon: <BiotechRoundedIcon />,
  },
  {
    label: "Completed",
    value: tests.filter(
      (t) => t.status === "Completed"
    ).length,
    icon: <CheckCircleRoundedIcon />,
  },
  {
    label: "Pending",
    value: tests.filter(
      (t) => t.status !== "Completed"
    ).length,
    icon: <PendingActionsRoundedIcon />,
  },
  {
    label: "Reports",
    value: tests.filter(
      (t) => t.result
    ).length,
    icon: <AssignmentRoundedIcon />,
  },
];

const filteredTests = tests.filter((test) => {
  const text = search.toLowerCase();

  return (
    `${test.patient?.firstName || ""} ${test.patient?.lastName || ""}`
      .toLowerCase()
      .includes(text) ||
    (test.doctor?.name || "")
      .toLowerCase()
      .includes(text) ||
    (test.testName || "")
      .toLowerCase()
      .includes(text)
  );
});

return ( <DashboardLayout>

  <PageHeader
  title="Laboratory Tests"
  subtitle="Manage laboratory investigations"
  icon={<ScienceIcon />}
  buttonText="New Test"
  onButtonClick={() => {
  setEditingId(null);

  setFormData({
    consultation: "",
    patient: "",
    doctor: "",
    testName: "",
    status: "Ordered",
    result: "",
  });

  setOpen(true);
}}
/>

<ModuleStats stats={stats} />

<SearchBar
  placeholder="Search lab tests..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

 {loading ? (

<Box
  sx={{
    height: 300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
boxShadow:"0 8px 24px rgba(15,23,42,.05)",
}}
>

<Table
sx={{
width:"100%",
tableLayout:"fixed",
}}
>

<TableHead>

<TableRow sx={{ bgcolor: "#F8FAFC" }}>

<TableCell sx={{ width: "45%", pl:7, fontWeight: 700 }}>
PATIENT
</TableCell>

<TableCell sx={{ width: "35%", pl: 7, fontWeight: 700 }}>
DOCTOR
</TableCell>

<TableCell sx={{ width: "30%", pl: 7, fontWeight: 700 }}>
TEST
</TableCell>

<TableCell
align="center"
sx={{ width: "40%", fontWeight: 700 }}
>
RESULT
</TableCell>

<TableCell
align="center"
sx={{ width: "15%", fontWeight: 700 }}
>
STATUS
</TableCell>

<TableCell
align="center"
sx={{ width: "48%", fontWeight: 700 }}
>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredTests.length === 0 ? (

<TableRow>

<TableCell
colSpan={6}
align="center"
sx={{ py: 8 }}
>

<ScienceIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography
mt={2}
fontWeight={700}
>
No Lab Tests Found
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredTests.map((test)=>(

<TableRow
key={test._id}
hover
sx={{
height:82,

"& td":{
borderBottom:"1px solid #EEF2F7",
padding:"18px 16px",
verticalAlign:"middle",
},

"&:hover":{
bgcolor:"#F8FAFC",
},
}}
>

{/* Patient */}

<TableCell sx={{ width: "28%" }}>

<Box
sx={{
display: "flex",
alignItems: "center",
gap: 2,
}}
>

<Avatar
sx={{
width: 42,
height: 42,
background: "linear-gradient(135deg,#2563EB,#3B82F6)",
fontWeight: 700,
flexShrink: 0,
}}
>
<ScienceIcon fontSize="small" />
</Avatar>

<Box
sx={{
display: "flex",
flexDirection: "column",
justifyContent: "center",
}}
>

<Typography
sx={{
fontWeight: 700,
fontSize: 15,
lineHeight: 1.3,
}}
>
{test.patient?.firstName} {test.patient?.lastName}
</Typography>

<Typography
sx={{
fontSize: 12,
color: "#64748B",
lineHeight: 1.3,
}}
>
{test.testId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Doctor */}

<TableCell sx={{ width: "24%" }}>

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
bgcolor: "#ECFDF5",
color: "#059669",
fontWeight: 700,
flexShrink: 0,
}}
>
{test.doctor?.name?.charAt(0) || "D"}
</Avatar>

<Box>

<Typography
sx={{
fontWeight: 700,
fontSize: 14,
lineHeight: 1.3,
}}
>
 {test.doctor?.name}
</Typography>

<Typography
sx={{
fontSize: 12,
color: "#64748B",
lineHeight: 1.3,
}}
>
Consultant
</Typography>

</Box>

</Box>

</TableCell>

{/* Test */}

<TableCell sx={{ width: "6%" }}>

<Box
sx={{
display:"inline-flex",
alignItems:"center",
gap:1.5,
px:2,
py:.8,
borderRadius:2,
bgcolor:"#F8FAFC",
border:"1px solid #E2E8F0",
}}
>

<ScienceIcon
sx={{
fontSize:18,
color:"#2563EB",
}}
/>

<Box>

<Typography
sx={{
fontWeight:700,
fontSize:13,
lineHeight:1.2,
}}
>
{test.testName}
</Typography>

<Typography
sx={{
fontSize:11,
color:"#64748B",
}}
>
Laboratory
</Typography>

</Box>

</Box>

</TableCell>

{/* Result */}

<TableCell align="center" sx={{ width: "12%" }}>

<Box
sx={{
display:"flex",
justifyContent:"center",
}}
>

<Box
sx={{
display:"inline-flex",
alignItems:"center",
justifyContent:"center",
minWidth:90,
px:2,
py:.8,
borderRadius:2,
bgcolor:
test.result
? "#ECFDF5"
: "#F8FAFC",
border:
test.result
? "1px solid #A7F3D0"
: "1px solid #E2E8F0",
}}
>

<Typography
sx={{
fontWeight:700,
fontSize:13,
color:
test.result
? "#059669"
: "#475569",
}}
>
{test.result || "Pending"}
</Typography>

</Box>

</Box>

</TableCell>

{/* Status */}

<TableCell align="center" sx={{ width: "10%" }}>

<Box
display="flex"
justifyContent="center"
alignItems="center"
>

<StatusChip
status={test.status || "Pending"}
/>

</Box>

</TableCell>

{/* Actions */}

<TableCell align="center" sx={{ width: "8%" }}>

<Box
display="flex"
justifyContent="center"
alignItems="center"
>

<ActionButtons
  onView={() => handleView(test)}
  onEdit={() => handleEdit(test)}
  onDelete={() => handleDelete(test._id)}
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
  title={editingId ? "Edit Lab Test" : "New Lab Test"}
  submitText={editingId ? "Update Test" : "Save Test"}
  onSubmit={handleSubmit}
>

<Box
  sx={{
    mt: 3,
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    gap: 2.5,
  }}
>

<TextField
select
fullWidth
label="Consultation"
name="consultation"
value={formData.consultation}
onChange={handleChange}
sx={textFieldStyle}
>
{consultations.map((item)=>(
<MenuItem
key={item._id}
value={item._id}
>
{item.consultationId}
</MenuItem>
))}
</TextField>

<TextField
select
fullWidth
label="Patient"
name="patient"
value={formData.patient}
onChange={handleChange}
sx={textFieldStyle}
>
{patients.map((item)=>(
<MenuItem
key={item._id}
value={item._id}
>
{item.firstName} {item.lastName}
</MenuItem>
))}
</TextField>

<TextField
select
fullWidth
label="Doctor"
name="doctor"
value={formData.doctor}
onChange={handleChange}
sx={textFieldStyle}
>
{doctors.map((item)=>(
<MenuItem
key={item._id}
value={item._id}
>
{item.name}
</MenuItem>
))}
</TextField>

<TextField
fullWidth
label="Test Name"
name="testName"
value={formData.testName}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
select
fullWidth
label="Status"
name="status"
value={formData.status}
onChange={handleChange}
sx={textFieldStyle}
>

<MenuItem value="Ordered">Ordered</MenuItem>
<MenuItem value="Collected">Collected</MenuItem>
<MenuItem value="Processing">Processing</MenuItem>
<MenuItem value="Completed">Completed</MenuItem>

</TextField>

<TextField
fullWidth
label="Result"
name="result"
value={formData.result}
onChange={handleChange}
sx={textFieldStyle}
/>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={() => setViewOpen(false)}
title="Lab Test Details"
hideSubmit
>

<Box
sx={{
display:"grid",
mt: 3,
gridTemplateColumns:{
xs:"1fr",
md:"1fr 1fr"
},
gap:2.5,
mt:2,
}}
>

{[
["Test ID",selectedTest?.testId],
["Patient",`${selectedTest?.patient?.firstName || ""} ${selectedTest?.patient?.lastName || ""}`],
["Doctor",selectedTest?.doctor?.name || "-"],
["Consultation",selectedTest?.consultation?.consultationId || "-"],
["Test Name",selectedTest?.testName],
["Result",selectedTest?.result || "-"],
].map(([label,value])=>(

<Box
key={label}
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
{label}
</Typography>

<Typography
mt={.5}
fontWeight={700}
>
{value}
</Typography>

</Box>

))}

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
mb:1,
}}
>
Status
</Typography>

<StatusChip
status={selectedTest?.status}
/>

</Box>

</Box>

</FormDialog>

</DashboardLayout>

);
}

export default LabTests;