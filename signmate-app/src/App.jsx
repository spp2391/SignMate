import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 공개(사용자) 앱 레이아웃과 페이지들
import PublicLayout from "./site/PublicLayout";        // 너의 기존 공개 레이아웃(AppBar 있는 곳)
import HomePage from "./site/pages/HomePage";
import ServicePage from "./site/pages/ServicePage";
// ... 기타 공개 페이지 임포트

// 관리자 앱 라우트 묶음
import AdminApp from "./admin/AdminApp";               // (아래 2번 파일)

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ 관리자 경로는 AdminApp으로 완전히 분리 (공개 헤더 X) */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* ✅ 공개 사이트 라우트는 PublicLayout 아래에만 */}
        <Route
          path="/*"
          element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/service" element={<ServicePage />} />
                {/* ... 공개 라우트들 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PublicLayout>
          }
        />
      </Routes>
    </Router>
  );
}
