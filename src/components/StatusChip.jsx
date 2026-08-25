import { useState } from "react";
import { Chip, Menu, MenuItem, ListItemIcon } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

function StatusChip({ status, onChange, disabled, options }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSelect = (value) => {
    setAnchorEl(null);
    if (value !== status) onChange(value);
  };

  return (
    <>
      <Chip
        label={options[status]?.label}
        color={options[status]?.color}
        size="small"
        disabled={disabled}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ cursor: "pointer" }}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {Object.entries(options).map(([value, { label }]) => (
          <MenuItem
            key={value}
            onClick={() => handleSelect(Number(value))}
            selected={Number(value) === status}
          >
            {Number(value) === status && (
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default StatusChip;
