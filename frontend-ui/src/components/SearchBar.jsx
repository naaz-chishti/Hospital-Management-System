import {
  Paper,
  Box,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Menu,
  Divider,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import { useState } from "react";

function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,

  sortValue = "latest",
  onSortChange,

  filterValue = "all",
  onFilterChange,

  filterOptions = [],

  sortOptions = [
    {
      value: "latest",
      label: "Latest",
    },
    {
      value: "name",
      label: "Name A-Z",
    },
    {
      value: "oldest",
      label: "Oldest",
    },
  ],
}) {
  const [filterAnchor, setFilterAnchor] =
    useState(null);

  const filterOpen =
    Boolean(filterAnchor);

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: {
          xs: 1.5,
          sm: 2,
        },
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        boxShadow:
          "0 8px 24px rgba(15,23,42,.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          gap: 1.5,
          flexDirection: {
            xs: "column",
            md: "row",
          },
          width: "100%",
        }}
      >

        {/* SEARCH */}

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
            flex: 1,

            "& .MuiOutlinedInput-root": {
              height: 44,
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
                borderWidth: 2,
              },
            },
          }}
        />

        {/* FILTER BUTTON */}

        <Button
          variant="outlined"
          startIcon={
            <FilterListRoundedIcon />
          }
          onClick={
            filterOptions.length > 0
              ? handleFilterClick
              : undefined
          }
          sx={{
            height: 44,

            minWidth: {
              xs: "100%",
              md: 130,
            },

            borderRadius: 3,

            textTransform: "none",

            fontWeight: 600,

            color: "#334155",

            borderColor: "#E2E8F0",

            "&:hover": {
              borderColor: "#14B8A6",
              background: "#ECFDF5",
            },
          }}
        >
          Filters
        </Button>

        {/* FILTER MENU */}

        <Menu
          anchorEl={filterAnchor}
          open={filterOpen}
          onClose={handleFilterClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 3,
              border: "1px solid #E2E8F0",
              boxShadow:
                "0 15px 35px rgba(15,23,42,.12)",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
            }}
          >
            <Typography
              fontSize={12}
              fontWeight={700}
              color="#64748B"
            >
              FILTER BY
            </Typography>
          </Box>

          <Divider />

          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={
                filterValue === option.value
              }
              onClick={() => {
                onFilterChange?.(
                  option.value
                );

                handleFilterClose();
              }}
              sx={{
                py: 1.2,
                fontSize: 14,

                fontWeight:
                  filterValue === option.value
                    ? 700
                    : 500,

                "&.Mui-selected": {
                  background: "#ECFDF5",
                  color: "#0F766E",
                },

                "&.Mui-selected:hover": {
                  background: "#D1FAE5",
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        {/* SORT */}

        <TextField
          select
          size="small"
          value={sortValue}
          onChange={(event) => {
            onSortChange?.(
              event.target.value
            );
          }}
          sx={{
            width: {
              xs: "100%",
              md: 145,
            },

            "& .MuiOutlinedInput-root": {
              height: 44,
              borderRadius: 3,
              bgcolor: "#FFFFFF",

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
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>

      </Box>
    </Paper>
  );
}

export default SearchBar;