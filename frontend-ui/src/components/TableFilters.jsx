import {
  Box,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

function TableFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions = [],
  placeholder = "Search...",
  onReset,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <TextField
        size="small"
        value={search}
        onChange={onSearchChange}
        placeholder={placeholder}
        sx={{
          width: {
            xs: "100%",
            md: 320,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          select
          size="small"
          value={filter}
          onChange={onFilterChange}
          sx={{
            minWidth: 180,
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          startIcon={<RestartAltRoundedIcon />}
          onClick={onReset}
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}

export default TableFilters;