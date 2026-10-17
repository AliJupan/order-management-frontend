import { useState } from "react";
import Appbar from "./Appbar.jsx";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { drawerWidth } from "./layoutConfig";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleDrawerClose = () => setMobileOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Appbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerClose} />
      {/* Main content area */}
      <Box
        component="main"
        flex="1"
        sx={{
          mt: { xs: "56px", sm: "72px" },
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 72px)" },
          p: { xs: 2, sm: 3 }, // gap around the outside of the "card"
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#ecf0f1",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
            p: 3,
            minHeight: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
