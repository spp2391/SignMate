// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import SecretPage from "./pages/SecretPage";
import EmploymentContractPage from "./pages/EmploymentContractPage";
import ServiceContractPage from "./pages/ServiceContractPage";
import SupplyContractPage from "./pages/SupplyContractPage";
import OutsourcingContractPage from "./pages/OutsourcingContractPage";
import Login from "./User/pages/Login";
import Mailbox from "./component/Mailbox";

export default function App() {
  return (
    
    <Router>
      <nav style={{ padding: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/secrets/1">비밀유지서약서</Link>
        <Link to="/employment">표준근로계약서</Link>
        <Link to="/service">용역계약서</Link>
        <Link to="/supply">자재/물품 공급계약서</Link>
        <Link to="/outsourcing">업무위탁 계약서</Link>
      </nav>

      <Routes>
        <Route path="/secrets/:contractId" element={<SecretPage signerId="김철수" />} />
        <Route path="/employment" element={<EmploymentContractPage />} />
        <Route path="/service" element={<ServiceContractPage />} />
        <Route path="/supply" element={<SupplyContractPage />} />
        <Route path="/outsourcing" element={<OutsourcingContractPage />} />
        {/* 기본 라우트 */}
        <Route path="/notifications" element={<Mailbox />} />
        <Route path="*" element={<SecretPage signerId="김철수" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
