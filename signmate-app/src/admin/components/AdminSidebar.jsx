import * as React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ onNavigate }) {
  const { pathname } = useLocation();
  const handleGo = () => onNavigate && onNavigate();

  return (
    <Box sx={{ height: "100%", bgcolor: "#0d1b2a", color: "white" }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 20 }}>
          SignMate Admin
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

      <List sx={{ mt: 1 }}>
        <ListItemButton
          component={Link}
          to="/admin/users"
          onClick={handleGo}
          selected={pathname.startsWith("/admin/users")}
          sx={{ "& .MuiTypography-root": { fontSize: 16 } }}
        >
          <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
            <GroupIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primary="회원 관리" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/admin/contracts"
          onClick={handleGo}
          selected={pathname.startsWith("/admin/contracts")}
          sx={{ "& .MuiTypography-root": { fontSize: 16 } }}
        >
          <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
            <DescriptionIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primary="계약 관리" />
        </ListItemButton>
      </List>
    </Box>
  );
}
