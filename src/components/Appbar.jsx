import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function Appbar({ onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <MuiAppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }} // only show on mobile
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
        >
          Order Management
        </Typography>
        <IconButton edge="start" onClick={handleLogout} sx={{ color: "#fff" }}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}
