import { useMemo, useState } from "react";

import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import {
  Avatar,
  Stack,
  Chip,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function HospitalTable({
  title = "",
  subtitle = "",
  columns = [],
  data = [],
  renderRow,

  searchPlaceholder = "Search...",
  columnWidths = [],
  rowsPerPageOptions = [5, 10, 25, 50],

  showAddButton = true,
  showExportButton = true,

  addButtonText = "Add",

  onAdd = () => {},
  onExport = () => {},

  toolbarRight = null,

  loading = false,

  emptyMessage = "No Records Found",
}) {
 const [search, setSearch] = useState("");

const [page, setPage] = useState(0);

const [rowsPerPage, setRowsPerPage] =
  useState(10);

const [sortField, setSortField] =
  useState("");

const [sortOrder, setSortOrder] =
  useState("asc");

const [filterAnchor, setFilterAnchor] =
  useState(null);

 const filteredData = useMemo(() => {

  let rows = [...data];

  if (search) {

    rows = rows.filter((item) =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }

  if (sortField) {

    rows.sort((a, b) => {

      const first = a[sortField];

      const second = b[sortField];

      if (first < second)
        return sortOrder === "asc" ? -1 : 1;

      if (first > second)
        return sortOrder === "asc" ? 1 : -1;

      return 0;

    });

  }

  return rows;

}, [
  data,
  search,
  sortField,
  sortOrder,
]);

const paginated = filteredData.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

  return (

    <Paper
      elevation={0}
      sx={{
        borderRadius:5,

boxShadow:
"0 8px 30px rgba(15,23,42,.06)",
        overflow: "hidden",
        border: "1px solid #E5E7EB",
      }}
    >

      {/* Header */}

    <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    p: 3,
    borderBottom: "1px solid #E5E7EB",
  }}
>

  <Box>

    <Typography
      variant="h5"
      fontWeight={700}
    >
      {title}
    </Typography>

    <Typography
      color="text.secondary"
      mt={0.5}
    >
      {subtitle}
    </Typography>

  </Box>

  <Box
    sx={{
      display: "flex",
      gap: 1.5,
      flexWrap: "wrap",
    }}
  >

    <TextField
      size="small"
      placeholder={searchPlaceholder}
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      sx={{

width:300,

"& .MuiOutlinedInput-root":{

borderRadius:3,

background:"#fff"

}

}}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

    <Tooltip title="Filters">

      <IconButton
        onClick={(e) =>
          setFilterAnchor(
            e.currentTarget
          )
        }
      >
        <FilterListIcon />
      </IconButton>

    </Tooltip>

    <Tooltip title="Refresh">

      <IconButton
  onClick={() => {
    setSearch("");
    setSortField("");
    setSortOrder("asc");
    setPage(0);
  }}
>

        <RefreshIcon />

      </IconButton>

    </Tooltip>

   <Button
    variant="outlined"
    startIcon={<DownloadIcon />}
    sx={{
        borderRadius:3,
        textTransform:"none",
        px:3
    }}
>
Export
</Button>

   {showAddButton && (

<Button
variant="contained"
startIcon={<AddIcon />}
onClick={onAdd}
sx={{
borderRadius:3,
px:3,
textTransform:"none",
boxShadow:"none",

"&:hover":{

boxShadow:"0 8px 20px rgba(20,184,166,.25)"

}

}}
>

{addButtonText}

</Button>

)}
{toolbarRight}

  </Box>

</Box>

      {/* Table */}

      <TableContainer
  sx={{
    overflowX: "auto",
  }}
>

        <Table
  sx={{
    minWidth: 900,
  }}
>

          <TableHead>

            <TableRow
  hover
  sx={{
    transition: "0.25s",

    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  }}
>

             {columns.map((column, index) => (
  <TableCell
    key={column.field}
    onClick={() => {
      if (sortField === column.field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(column.field);
        setSortOrder("asc");
      }
    }}
    sx={{
      width: columnWidths[index],
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}
  >
    <Box display="flex" alignItems="center" gap={1}>
      {column.label}

      {sortField === column.field &&
        (sortOrder === "asc" ? (
          <ArrowUpwardIcon fontSize="small" />
        ) : (
          <ArrowDownwardIcon fontSize="small" />
        ))}
    </Box>
  </TableCell>
))}

            </TableRow>

          </TableHead>

          <TableBody>

            {paginated.length >
            0 ? (

              paginated.map(
                (
                  row,
                  index
                ) =>
                  renderRow(
                    row,
                    index
                  )
              )

            ) : (

              <TableRow>

                <TableCell
                  colSpan={
                    columns.length
                  }
                  align="center"
                  sx={{
                    py: 6,
                  }}
                >

                  <Box
    sx={{
        py: 5,
        textAlign: "center",
    }}
>

    <Typography
        variant="h6"
        fontWeight={600}
    >
        {emptyMessage}
    </Typography>

    <Typography
        color="text.secondary"
    >
        Try changing your search or filters.
    </Typography>

</Box>

                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </TableContainer>

      <Menu
  anchorEl={filterAnchor}
  open={Boolean(filterAnchor)}
  onClose={() => setFilterAnchor(null)}
>
  <MenuItem onClick={() => setFilterAnchor(null)}>
    All
  </MenuItem>

  <MenuItem onClick={() => setFilterAnchor(null)}>
    Active
  </MenuItem>

  <MenuItem onClick={() => setFilterAnchor(null)}>
    Inactive
  </MenuItem>

  <MenuItem onClick={() => setFilterAnchor(null)}>
    Today's
  </MenuItem>
</Menu>

      <TablePagination
      sx={{

borderTop:"1px solid #E5E7EB",

"& .MuiTablePagination-toolbar":{

px:3

}

}}
        component="div"
        count={
          filteredData.length
        }
        page={page}
        rowsPerPage={
          rowsPerPage
        }
        rowsPerPageOptions={
          rowsPerPageOptions
        }
        onPageChange={(
          e,
          newPage
        ) =>
          setPage(
            newPage
          )
        }
        onRowsPerPageChange={(
          e
        ) => {

          setRowsPerPage(
            parseInt(
              e.target.value,
              10
            )
          );

          setPage(0);

        }}
      />

    </Paper>

  );
}

export default HospitalTable;