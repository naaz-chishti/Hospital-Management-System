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
  Button,
} from "@mui/material";

import ModuleStats from "../components/ModuleStats";
import StatusChip from "../components/StatusChip";

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

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import ActionButtons from "../components/ActionButtons";

import UploadFileIcon from "@mui/icons-material/UploadFile";

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

function ReportUploads() {

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
  reportName: "",
  reportType: "Laboratory",
  file: null,
});

  useEffect(() => {
  fetchReports();
  fetchPatients();
}, []);

const fetchPatients = async () => {

try{

const res = await API.get("/patients");

setPatients(res.data.data || []);

}catch(err){

console.log(err);

}

};

const handleChange = (e) => {

  const { name, value, files } = e.target;

  setFormData({
    ...formData,
    [name]: files ? files[0] : value,
  });

};

const handleSubmit = async () => {

  try {

    const data = new FormData();

    data.append("patient", formData.patient);
    data.append("reportName", formData.reportName);
    data.append("reportType", formData.reportType);

    if (formData.file) {
      data.append("file", formData.file);
    }

    if (editingId) {

      await API.put(
        `/report-uploads/${editingId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Report updated successfully");

    } else {

      await API.post(
        "/report-uploads",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Report uploaded successfully");

    }

    setOpen(false);
    setEditingId(null);

    setFormData({
      patient: "",
      reportName: "",
      reportType: "Laboratory",
      file: null,
    });

    fetchReports();

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message || "Failed to save report"
    );
  }
};

const handleView = (report) => {
  setSelectedReport(report);
  setViewOpen(true);
};

const handleEdit = (report) => {

  setEditingId(report._id);

setFormData({
  patient: report.patient?._id,
  reportName: report.reportName,
  reportType:
    report.reportType === "Lab"
      ? "Laboratory"
      : report.reportType,
  file: null,
});

  setOpen(true);
};

const handleDelete = async (id) => {

  if (!window.confirm("Delete this report?")) return;

  try {

    await API.delete(`/report-uploads/${id}`);

    toast.success("Report deleted successfully");

    fetchReports();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );

  }
};

  const stats = [
  {
    label: "Uploads",
    value: reports.length,
    icon: <UploadFileRoundedIcon />,
  },
  {
    label: "Patients",
    value: new Set(
      reports.map(
        (r) =>
          `${r.patient?.firstName} ${r.patient?.lastName}`
      )
    ).size,
    icon: <PersonRoundedIcon />,
  },
  {
    label: "Report Types",
    value: new Set(
      reports.map((r) => r.reportType)
    ).size,
    icon: <DescriptionRoundedIcon />,
  },
  {
    label: "Files",
    value: reports.length,
    icon: <FolderRoundedIcon />,
  },
];

const filteredReports = reports.filter((report)=>{

const text = search.toLowerCase();

return(

`${report.patient?.firstName || ""} ${report.patient?.lastName || ""}`
.toLowerCase()
.includes(text)

||

(report.reportName || "")
.toLowerCase()
.includes(text)

||

(report.reportType || "")
.toLowerCase()
.includes(text)

||

(report.uploadId || "")
.toLowerCase()
.includes(text)

);

});

  const fetchReports =
    async () => {

      try {

        const res =
          await API.get(
            "/report-uploads"
          );

        setReports(
          res.data.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const deleteReport =
    async (id) => {

      if (
        !window.confirm(
          "Delete this report?"
        )
      ) return;

      try {

        await API.delete(
          `/report-uploads/${id}`
        );

        fetchReports();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <DashboardLayout>

      <PageHeader
  title="Report Uploads"
  subtitle="Manage uploaded medical reports"
  buttonText="Upload Report"
  onButtonClick={()=>{

setEditingId(null);

setFormData({
patient:"",
reportName:"",
reportType:"Laboratory",
file:null,
});

setOpen(true);

}}
/>

<ModuleStats stats={stats} />

<SearchBar
  placeholder="Search patient, report or type..."
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

<TableCell sx={{width:"38%", align:"center", pl:5}}>
PATIENT
</TableCell>

<TableCell sx={{width:"42%", align:"center", pl:6.8}}>
REPORT
</TableCell>

<TableCell sx={{width:"40%", align:"center", pl:7.5}}>
TYPE
</TableCell>

<TableCell sx={{width:"24%", align:"center", pl:7}}>
FILE
</TableCell>

<TableCell sx={{width:"35%",  pl:9.6}}>
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

{/* Patient */}

<TableCell>

<Box
  sx={{
    display: "flex",
    gap: 2,
  }}
>

<Avatar
  sx={{
    width: 42,
    height: 42,
    background: "linear-gradient(135deg,#2563EB,#3B82F6)",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  }}
>
  {report.patient?.firstName?.charAt(0) || "P"}
  {report.patient?.lastName?.charAt(0) || ""}
</Avatar>

<Box>

<Typography
  sx={{
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1.3,
  }}
>
  {report.patient?.firstName} {report.patient?.lastName}
</Typography>

<Typography
  sx={{
    fontSize: 12,
    color: "#64748B",
    mt: 0.3,
  }}
>
  {report.uploadId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Report */}

<TableCell>

<Box
  sx={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 210,
    height: 42,
    px: 2,
    borderRadius: 2,
    bgcolor: "#F8FAFC",
    border: "1px solid #E2E8F0",
  }}
>

<Typography
  sx={{
    fontWeight: 600,
    fontSize: 13,
  }}
>
  {report.reportName}
</Typography>

</Box>

</TableCell>

{/* Type */}

<TableCell>

<Box
  sx={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 210,
    height: 42,
    px: 2,
    borderRadius: 2,
    bgcolor: "#EFF6FF",
    border: "1px solid #BFDBFE",
  }}
>

<Typography
  sx={{
    fontWeight: 600,
    fontSize: 13,
  }}
>
  {report.reportType}
</Typography>

</Box>

</TableCell>

{/* File */}

<TableCell>

<Button
size="small"
variant="outlined"
href={`http://localhost:8000/${report.filePath.replace(/\\/g, "/")}`}
target="_blank"
sx={{
textTransform:"none",
borderRadius:2,
minWidth:90,
}}
>
View File
</Button>

</TableCell>

{/* Actions */}

<TableCell align="center">

<ActionButtons
onView={() => handleView(report)}
onEdit={() => handleEdit(report)}
onDelete={() => handleDelete(report._id)}
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
title={editingId ? "Edit Report" : "Upload Report"}
subtitle="Upload patient medical report"
submitText={editingId ? "Update Report" : "Upload Report"}
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
label="Report Name"
name="reportName"
value={formData.reportName}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
select
label="Report Type"
name="reportType"
value={formData.reportType}
onChange={handleChange}
sx={textFieldStyle}
>

<MenuItem value="Laboratory">Laboratory</MenuItem>
<MenuItem value="Radiology">Radiology</MenuItem>
<MenuItem value="Prescription">Prescription</MenuItem>
<MenuItem value="Discharge">Discharge</MenuItem>

</TextField>

<TextField
fullWidth
type="file"
name="file"
onChange={handleChange}
InputLabelProps={{
  shrink: true,
}}
inputProps={{
  accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
}}
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

{selectedReport && (

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
Report Name
</Typography>
<Typography sx={viewValueStyle}>
{selectedReport.reportName}
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
File
</Typography>

<Button
variant="contained"
onClick={() =>
 window.open(
  `http://localhost:8000/${selectedReport.filePath.replace(/\\/g, "/")}`,
  "_blank"
)
}
>
Open Report
</Button>

</Box>

</Box>

)}

</FormDialog>

    </DashboardLayout>

  );

}

export default ReportUploads;