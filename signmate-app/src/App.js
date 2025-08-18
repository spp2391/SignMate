import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import Index from "./components/index/index.jsx";
import ContractList from "./pages/ContractList.jsx";
import SecretPage from "./pages/SecretPage.jsx";
import EmploymentContractPage from "./pages/EmploymentContractPage.jsx";
import ServiceContractPage from "./pages/ServiceContractPage.jsx";
import SupplyContractPage from "./pages/SupplyContractPage.jsx";
import OutsourcingContractPage from "./pages/OutsourcingContractPage.jsx";
import CompanyStatisticsPage from './pages/CompanyStatisticsPage';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/secret" element={<SecretPage />} />
        <Route path="/employment" element={<EmploymentContractPage />} />
        <Route path="/service" element={<ServiceContractPage />} />
        <Route path="/supply" element={<SupplyContractPage />} />
        <Route path="/outsourcing" element={<OutsourcingContractPage />} />
        <Route path="/company-statistics" element={<CompanyStatisticsPage />} />
        <Route path="*" element={<Index />} />
      </Routes>
      <Footer />
    </Router>
  );
}
