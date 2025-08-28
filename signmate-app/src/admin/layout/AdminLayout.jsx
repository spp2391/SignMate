import * as React from "react";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  GlobalStyles,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminSidebar from "../components/AdminSidebar.jsx";

const drawerWidth = 220;
const FALLBACK_HEADER_H = 64;
const BORDER_COLOR = "#e5e8eb";

// 필요 시 -1 또는 +1로 미세 보정 (헤더에 자체 border-bottom이 있을 때 -1 추천)
const LINE_OFFSET = 0;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [topY, setTopY] = React.useState(FALLBACK_HEADER_H);

  const toggleDrawer = () => setMobileOpen((p) => !p);

  // 👉 헤더 bottom을 디바이스 픽셀에 '스냅'하여 0.5px 오차 제거
  React.useLayoutEffect(() => {
    const measure = () => {
      const el = document.getElementById("site-header") || document.querySelector("header");
      const rect = el?.getBoundingClientRect();
      if (rect) {
        const dpr = window.devicePixelRatio || 1;
        // 헤더 bottom을 dpr 그리드에 스냅
        const snapped = Math.round((rect.bottom + LINE_OFFSET) * dpr) / dpr;
        setTopY(snapped);
      } else {
        setTopY(FALLBACK_HEADER_H);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true }); // 헤더가 sticky일 수도 있어서
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  const drawer = <AdminSidebar onNavigate={() => setMobileOpen(false)} />;

  return (
    <Box sx={{ display: "block", bgcolor: "#f5f7fb", minHeight: "100vh" }}>
      <CssBaseline />

      {/* 가독성 + margin-collapse 방지 */}
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

      {/* ✅ 전역 1px 라인: 헤더 bottom에 '스냅된' topY로 한 번만 그림 */}
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

      {/* 모바일 햄버거 */}
      <IconButton
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          left: 12,
          top: topY + 12,
          display: { xs: "inline-flex", sm: "none" },
          zIndex: 1500,
          bgcolor: "white",
          border: `1px solid ${BORDER_COLOR}`,
          boxShadow: 1,
        }}
        size="small"
      >
        <MenuIcon fontSize="small" />
      </IconButton>

      {/* 모바일: 임시 드로어 — 상단 보더 제거(전역 라인이 담당) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
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

      {/* 데스크탑: 영구 드로어 — 상단 보더 제거 */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
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

      {/* 메인 — 전역 라인과 같은 y좌표 공유. borderTop 없음. */}
      <Box
        component="main"
        className="admin-main"
        sx={{
          mt: 0,
          pt: 0,     // margin-collapse 방지
          borderTop: "none",
          ml: { xs: 0, sm: `${drawerWidth}px` },
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
