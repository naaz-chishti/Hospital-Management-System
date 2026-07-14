import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function DataTable({
  columns,
  children,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        boxShadow: "0 10px 30px rgba(15,23,42,.06)",
      }}
    >
      <TableContainer>

        <Table
          sx={{
            minWidth: 1200,
            tableLayout: "fixed",

            "& th": {
              py: 2,
              px: 3,
              bgcolor: "#F8FAFC",
              color: "#475569",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              borderBottom: "1px solid #E2E8F0",
            },

            "& td": {
              py: 2.3,
              px: 3,
              borderBottom: "1px solid #F1F5F9",
              verticalAlign: "middle",
            },

            "& tbody tr:hover": {
              bgcolor: "#F8FAFC",
            },
          }}
        >

          <TableHead>

            <TableRow>

              {columns.map((column, index) => (

               <TableCell
  key={column}
  align={
    index >= columns.length - 2
      ? "center"
      : "left"
  }
>
  {column}
</TableCell>

              ))}

            </TableRow>

          </TableHead>

          <TableBody>

            {children}

          </TableBody>

        </Table>

      </TableContainer>

    </Paper>
  );
}

export default DataTable;