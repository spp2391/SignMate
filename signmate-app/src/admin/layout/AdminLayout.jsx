import * as React from "react";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  GlobalStyles,
} from "@mui/material";
import AdminSidebar from "../components/AdminSidebar.jsx";

const drawerWidth = 220;
const FALLBACK_HEADER_H = 64;
const BORDER_COLOR = "#e5e8eb";
const LINE_OFFSET = 0;

export default function AdminLayout({ children }) {
  const [topY, setTopY] = React.useState(FALLBACK_HEADER_H);

  React.useLayoutEffect(() => {
    const measure = () => {
      const el = document.getElementById("site-header") || document.querySelector("header");
      const rect = el?.getBoundingClientRect();
      if (rect) {
        const dpr = window.devicePixelRatio || 1;
        const snapped = Math.round((rect.bottom + LINE_OFFSET) * dpr) / dpr;
        setTopY(snapped);
      } else {
        setTopY(FALLBACK_HEADER_H);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  const drawer = <AdminSidebar />;

  return (
    <Box sx={{ display: "block", bgcolor: "#f5f7fb", minHeight: "100vh" }}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { fontSize: "17px", lineHeight: 1.65 },
          ".admin-main": { fontSize: "17px" },
          ".admin-main > *:first-child": { marginTop: 0 },
          ".admin-table, .admin-main table, .admin-main .MuiTable-root": { fontSize: "16px" },
          ".admin-main th, .admin-main td, .admin-main .MuiTableCell-root": {
            paddingTop: "12px", paddingBottom: "12px",
          },
          ".admin-main input, .admin-main button, .admin-main select, .admin-main textarea": {
            fontSize: "16px",
          },
        }}
      />

      {/* 전역 구분선 */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          top: `${topY}px`,
          height: 0,
          borderTop: `1px solid ${BORDER_COLOR}`,
          zIndex: 1200,
          pointerEvents: "none",
        }}
      />

      {/* 데스크탑: 고정 Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#0d2440",
            color: "white",
            position: "fixed",
            left: 0,
            top: `${topY}px`,
            height: `calc(100% - ${topY}px)`,
            zIndex: 1100,
            borderTop: "none",
            borderRight: `1px solid ${BORDER_COLOR}`,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* 메인 영역 */}
      <Box
        component="main"
        className="admin-main"
        sx={{
          mt: 0,
          pt: 0,
          ml: `${drawerWidth}px`,
          p: { xs: 2.5, md: 3.5 },
          minHeight: `calc(100vh - ${topY}px)`,
        }}
      >
        {children}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ color: "text.secondary", textAlign: "center", pb: 2, fontSize: 14 }} />
      </Box>
    </Box>
  );
}
