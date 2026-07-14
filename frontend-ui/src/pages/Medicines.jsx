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
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";

import {
Table,
TableBody,
TableContainer,
TableHead,
Paper,
} from "@mui/material";

import ModuleStats from "../components/ModuleStats";
import ActionButtons from "../components/ActionButtons";

import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusChip from "../components/StatusChip";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import { useSearchParams } from "react-router-dom";

import FormDialog from "../components/FormDialog";
import { TextField } from "@mui/material";
import { MenuItem } from "@mui/material";
import { toast } from "react-toastify";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "#fff",
    height: 52,
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

function Medicines() {

  const [medicines, setMedicines] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);
const [viewOpen, setViewOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [searchParams] = useSearchParams();
const [selectedMedicine, setSelectedMedicine] = useState(null);

const [formData, setFormData] = useState({
  medicineName: "",
  category: "",
  manufacturer: "",
  stock: 0,
  unitPrice: "",
  expiryDate: "",
});

  useEffect(() => {
    fetchMedicines();
    
    if (searchParams.get("add") === "true") {
    setEditingId(null);

    setFormData({
      // default form values
    });

    setOpen(true);
  }
}, []);

  const stats = [
  {
    label: "Medicines",
    value: medicines.length,
    icon: <MedicationRoundedIcon />,
  },
  {
    label: "Available",
    value: medicines.filter(
      (m) => m.stock > 0
    ).length,
    icon: <CheckCircleRoundedIcon />,
  },
  {
    label: "Out of Stock",
    value: medicines.filter(
      (m) => m.stock === 0
    ).length,
    icon: <WarningAmberRoundedIcon />,
  },
  {
    label: "Categories",
    value: new Set(
      medicines.map((m) => m.category)
    ).size,
    icon: <InventoryRoundedIcon />,
  },
];

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
        `/medicines/${editingId}`,
        formData
      );

      toast.success("Medicine updated successfully");

    } else {

      await API.post(
        "/medicines",
        formData
      );

      toast.success("Medicine added successfully");

    }

    setOpen(false);

    setEditingId(null);

    setFormData({
      medicineName:"",
      category:"",
      manufacturer:"",
      stock:0,
      unitPrice:"",
      expiryDate:"",
    });

    fetchMedicines();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Failed to save medicine"
    );

  }

};

const handleView = (medicine) => {
  setSelectedMedicine(medicine);
  setViewOpen(true);
};

const handleEdit = (medicine) => {

  setEditingId(medicine._id);

  setFormData({
    medicineName: medicine.medicineName,
    category: medicine.category,
    manufacturer: medicine.manufacturer,
    stock: medicine.stock,
    unitPrice: medicine.unitPrice,
    expiryDate: medicine.expiryDate?.slice(0,10) || "",
  });

  setOpen(true);

};

const handleDelete = async (id) => {

  if(!window.confirm("Delete this medicine?"))
    return;

  try{

    await API.delete(`/medicines/${id}`);

    toast.success("Medicine deleted successfully");

    fetchMedicines();

  }catch(err){

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );

  }

};

const filteredMedicines = medicines.filter((medicine) => {
  const text = search.toLowerCase();

  return (
    (medicine.medicineName || "")
      .toLowerCase()
      .includes(text) ||
    (medicine.category || "")
      .toLowerCase()
      .includes(text) ||
    (medicine.medicineId || "")
      .toLowerCase()
      .includes(text)
  );
});

  const fetchMedicines = async () => {

    try {

      const res =
        await API.get("/medicines");

      setMedicines(res.data.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (

    <DashboardLayout>
<PageHeader
title="Pharmacy"
subtitle="Manage medicines and pharmacy inventory"
icon={<LocalPharmacyRoundedIcon />}
buttonText="Add Medicine"
onButtonClick={()=>{
setEditingId(null);

setFormData({
medicineName:"",
category:"",
manufacturer:"",
stock:0,
unitPrice:"",
expiryDate:"",
});

setOpen(true);
}}
/>

<ModuleStats stats={stats} />

<SearchBar
placeholder="Search medicine, category..."
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
}}
>

<TableCell
sx={{
  align:"center",
width:"12%",
pl:9,
fontWeight:700,
fontSize:12,
}}
>
MEDICINE
</TableCell>

<TableCell
align="center"
sx={{
width:"8%",
fontWeight:700,
fontSize:12,
}}
>
CATEGORY
</TableCell>

<TableCell
align="center"
sx={{
width:"10%",
fontWeight:700,
fontSize:12,
}}
>
PRICE
</TableCell>

<TableCell
align="center"
sx={{
width:"12%",
fontWeight:700,
fontSize:12,
}}
>
STOCK
</TableCell>

<TableCell
align="center"
sx={{
width:"12%",
fontWeight:700,
fontSize:12,
}}
>
STATUS
</TableCell>

<TableCell
align="center"
sx={{
width:"12%",
fontWeight:700,
fontSize:12,
}}
>
ACTIONS
</TableCell>

</TableRow>

</TableHead>

<TableBody>

{filteredMedicines.length === 0 ? (

<TableRow>

<TableCell
colSpan={6}
align="center"
sx={{ py: 8 }}
>

<LocalPharmacyRoundedIcon
sx={{
fontSize:60,
color:"#CBD5E1",
}}
/>

<Typography
mt={2}
fontWeight={700}
>
No Medicines Found
</Typography>

<Typography color="text.secondary">
Try another search.
</Typography>

</TableCell>

</TableRow>

) : (

filteredMedicines.map((medicine) => (

<TableRow
  key={medicine._id}
  hover
  sx={{
    height: 78,

    "& td": {
      py: 2,
      px: 3,
      verticalAlign: "middle",
      borderBottom: "1px solid #EEF2F7",
    },

    "&:hover": {
      bgcolor: "#F8FAFC",
    },
  }}
>

{/* Medicine */}

<TableCell
align="center"
sx={{
width:"34%",
}}
>

<Box
sx={{
display:"flex",
alignItems:"center",
justifyContent:"center",
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
<LocalPharmacyRoundedIcon fontSize="small"/>
</Avatar>

<Box
sx={{
textAlign:"left",
minWidth:120,
}}
>

<Typography
sx={{
fontWeight:700,
fontSize:14,
}}
>
{medicine.medicineName}
</Typography>

<Typography
sx={{
fontSize:12,
color:"#64748B",
}}
>
{medicine.medicineId}
</Typography>

</Box>

</Box>

</TableCell>

{/* Category */}

<TableCell align="center">

<Box
sx={{
display:"inline-flex",
justifyContent:"center",
alignItems:"center",
minWidth:80,
px:2,
py:.7,
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
{medicine.category}
</Typography>

</Box>

</TableCell>

{/* Price */}

<TableCell align="center">

<Box
sx={{
display:"inline-flex",
justifyContent:"center",
alignItems:"center",
minWidth:70,
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
fontSize:15,
color:"#059669",
}}
>
₹{medicine.price ?? medicine.mrp ?? medicine.unitPrice ?? medicine.sellingPrice ?? "-"}
</Typography>

</Box>

</TableCell>

{/* Stock */}

<TableCell align="center">

<Box
sx={{
display:"inline-flex",
justifyContent:"center",
alignItems:"center",
minWidth:60,
px:2,
py:.7,
borderRadius:2,
bgcolor:"#F8FAFC",
border:"1px solid #E2E8F0",
}}
>

<Typography
sx={{
fontWeight:700,
}}
>
{medicine.stock}
</Typography>

</Box>

</TableCell>

{/* Status */}

<TableCell align="center">

<StatusChip
status={
medicine.stock > 0
? "Available"
: "Out of Stock"
}
/>

</TableCell>

{/* Actions */}

<TableCell align="center">

<ActionButtons
onView={()=>handleView(medicine)}
onEdit={()=>handleEdit(medicine)}
onDelete={()=>handleDelete(medicine._id)}
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
onClose={()=>setOpen(false)}
title={editingId ? "Edit Medicine" : "Add Medicine"}
subtitle="Create or update medicine information"
onSubmit={handleSubmit}
submitText={editingId ? "Update Medicine" : "Save Medicine"}
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
label="Medicine Name"
name="medicineName"
value={formData.medicineName}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Category"
name="category"
value={formData.category}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
label="Manufacturer"
name="manufacturer"
value={formData.manufacturer}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
type="number"
label="Stock"
name="stock"
value={formData.stock}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
type="number"
label="Unit Price"
name="unitPrice"
value={formData.unitPrice}
onChange={handleChange}
sx={textFieldStyle}
/>

<TextField
  fullWidth
  type="date"
  label="Expiry Date"
  name="expiryDate"
  value={formData.expiryDate}
  onChange={handleChange}
  sx={textFieldStyle}
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
/>

</Box>

</FormDialog>

<FormDialog
open={viewOpen}
onClose={()=>setViewOpen(false)}
title="Medicine Details"
submitText="Close"
onSubmit={()=>setViewOpen(false)}
hideCancel
>

{selectedMedicine && (

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
<Typography sx={viewLabelStyle}>Medicine</Typography>
<Typography sx={viewValueStyle}>
{selectedMedicine.medicineName}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>Category</Typography>
<Typography sx={viewValueStyle}>
{selectedMedicine.category}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>Manufacturer</Typography>
<Typography sx={viewValueStyle}>
{selectedMedicine.manufacturer}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>Stock</Typography>
<Typography sx={viewValueStyle}>
{selectedMedicine.stock}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>Unit Price</Typography>
<Typography
sx={{
...viewValueStyle,
color:"#059669",
}}
>
₹{selectedMedicine.unitPrice}
</Typography>
</Box>

<Box sx={viewBoxStyle}>
<Typography sx={viewLabelStyle}>Expiry Date</Typography>
<Typography sx={viewValueStyle}>
{selectedMedicine.expiryDate
? new Date(selectedMedicine.expiryDate).toLocaleDateString("en-GB")
: "-"}
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
<Typography sx={viewLabelStyle}>Status</Typography>

<StatusChip
status={
selectedMedicine.stock > 0
? "Available"
: "Out of Stock"
}
/>

</Box>

</Box>

)}

</FormDialog>

    </DashboardLayout>

  );
}

export default Medicines;