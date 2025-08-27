import * as React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ onNavigate }) {
  const { pathname } = useLocation();
  const handleGo = () => onNavigate && onNavigate();

  return (
    <Box sx={{ height: "100%" }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>SignMate Admin</Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

      <List dense>
        <ListItemButton component={Link} to="/admin/users" onClick={handleGo} selected={pathname.startsWith("/admin/users")}>
          <ListItemIcon sx={{ color: "white" }}><GroupIcon /></ListItemIcon>
          <ListItemText primary="회원 관리" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/contracts" onClick={handleGo} selected={pathname.startsWith("/admin/contracts")}>
          <ListItemIcon sx={{ color: "white" }}><DescriptionIcon /></ListItemIcon>
          <ListItemText primary="계약 관리" />
        </ListItemButton>
      </List>
    </Box>
  );
}
