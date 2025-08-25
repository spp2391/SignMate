import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Index from "./components/index/index";
import ContractList from "./pages/ContractList";
import SecretPage from "./pages/SecretPage";
import EmploymentContractPage from "./pages/EmploymentContractPage";
import ServiceContractPage from "./pages/ServiceContractPage";
import SupplyContractPage from "./pages/SupplyContractPage";
import OutsourcingContractPage from "./pages/OutsourcingContractPage";
import CompanyStatisticsPage from './pages/CompanyStatisticsPage';
import ContractInboxPage from './pages/ContractInboxPage';
import Login from "./User/pages/Login";
import Mailbox from "./component/Mailbox";
import Inbox from "./component/inbox/Inbox";
import NoticePage from "./pages/Notice";


export default function App() {
  return (
    
    <Router>
      {/* <nav style={{ padding: 12, display: "flex", gap: 10, flexWrap: "wrap" }}> */}
        <Link to="/secrets">비밀유지서약서</Link>
        <Link to="/employment">표준근로계약서</Link>
        <Link to="/service">용역계약서</Link>
        <Link to="/supply">자재/물품 공급계약서</Link>
        <Link to="/outsourcing">업무위탁 계약서</Link>
        <Header />
      {/* </nav> */}

         
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contracts" element={<ContractList />} />
                <Route path="/secrets" element={<SecretPage />} />
                <Route path="/employment" element={<EmploymentContractPage />} />
                <Route path="/service" element={<ServiceContractPage />} />
                <Route path="/supply" element={<SupplyContractPage />} />
                <Route path="/outsourcing" element={<OutsourcingContractPage />} />
                <Route path="/company-statistics" element={<CompanyStatisticsPage />} />
                <Route path="*" element={<Index />} />
                <Route path="/inbox" element={<ContractInboxPage />} />
                <Route path="/secrets/:contractId" element={<SecretPage signerId="" />} />
                <Route path="/notifications" element={<Mailbox />} />
                <Route path="*" element={<SecretPage signerId="" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/notice" element={<NoticePage />} />
                {/* 기본 라우트 */}
            </Routes>
            <Footer />
        </Router>
    );
}
