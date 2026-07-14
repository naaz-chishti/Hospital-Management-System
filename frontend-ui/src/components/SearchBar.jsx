import {
  Paper,
  Box,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

function SearchBar({
  placeholder,
  value,
  onChange,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 24px rgba(15,23,42,.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: {
            xs: "wrap",
            md: "nowrap",
          },
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{
                    color: "#94A3B8",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 42,
              borderRadius: 3,
              bgcolor: "#F8FAFC",

              "& fieldset": {
                borderColor: "#E2E8F0",
              },

              "&:hover fieldset": {
                borderColor: "#14B8A6",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#14B8A6",
              },
            },
          }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterListRoundedIcon />}
          sx={{
            height: 42,
            minWidth: 130,
            borderRadius: 3,
            textTransform: "none",
          }}
        >
          Filters
        </Button>

        <TextField
          select
          size="small"
          defaultValue="latest"
          sx={{
            width: 140,

            "& .MuiOutlinedInput-root": {
              height: 42,
              borderRadius: 3,
            },
          }}
        >
          <MenuItem value="latest">
            Latest
          </MenuItem>

          <MenuItem value="name">
            Name
          </MenuItem>

          <MenuItem value="oldest">
            Oldest
          </MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
}

export default SearchBar;