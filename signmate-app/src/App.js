// src/App.js
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
import Join from './User/pages/Join';
<<<<<<< HEAD
import Login from './User/pages/Login';
import Edit from './User/pages/Edit';

function App() {
    return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/join" element={<Join />} />
				<Route path="/mypage/edit" element={<Edit/>} />
			</Routes>
		</BrowserRouter>
=======


export default function App() {
  const token = localStorage.getItem("accessToken");
  let userId = null;

  if (token) {
    try {
      // TokenProvider.getUserId와 같은 로직을 프론트에서 JS로 구현
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id; // claim에 저장된 userId
    } catch (err) {
      console.error("JWT 파싱 실패:", err);
    }
  }
  return (


    <Router>
      {/* <nav style={{ padding: 12, display: "flex", gap: 10, flexWrap: "wrap" }}> */}
        <Link to="/secret">비밀유지서약서</Link>
        <Link to="/employment">표준근로계약서</Link>
        <Link to="/service">용역계약서</Link>
        <Link to="/supply">자재/물품 공급계약서</Link>
        <Link to="/outsourcing">업무위탁 계약서</Link>
        <Header />
      {/* </nav> */}


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
                <Route path="/inbox" element={<Inbox userId={userId} />} />
                <Route path="/inbox" element={<ContractInboxPage />} />
                <Route path="/secret/:contractId" element={<SecretPage signerId="" />} />
               <Route path="/employment/:contractId" element={<EmploymentContractPage />} />
               <Route path="/supply/:contractId" element={<SupplyContractPage signerId="" />} />
                <Route path="/service/:contractId" element={<ServiceContractPage signerId="" />} />
                <Route path="/outsourcing/:contractId" element={<OutsourcingContractPage signerId="" />} />
                <Route path="/notifications" element={<Mailbox />} />
                <Route path="*" element={<SecretPage signerId="" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/notice" element={<NoticePage />} />
                <Route path="/join" element={<Join />} />
                {/* 기본 라우트 */}
            </Routes>
            <Footer />
        </Router>
>>>>>>> origin/Lee
    );
}

// export default App;
