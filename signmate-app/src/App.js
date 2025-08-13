import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ContractForm from "./component/ContractForm";

import MyPage from "./component/MyPage";        // 철수 마이페이지
import MyPage2 from "./component/MyPage2";      // 영희 마이페이지
import Mailbox from "./component/Mailbox";
import Mailbox2 from "./component/Mailbox2";
import ReceiverSignPage from "./component/ReceiverSignPage";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/contract-form" style={{ marginRight: "1rem" }}>계약 작성</Link>
        <Link to="/mypage1" style={{ marginRight: "1rem" }}>철수 마이페이지</Link>
        <Link to="/mypage2" style={{ marginRight: "1rem" }}>영희 마이페이지</Link>
        <Link to="/mailbox" style={{ marginRight: "1rem" }}>메일함</Link>
        <Link to="/mailbox2">영희메일함</Link>
      </nav>

      <Routes>
        {/* 계약 작성 */}
        <Route path="/contract-form" element={<ContractForm />} />
        {/* 계약 수정 */}
        <Route path="/contract-form/:id" element={<ContractForm />} />
        <Route path="/mypage1" element={<MyPage />} />
        <Route path="/mypage2" element={<MyPage2 />} />
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/mailbox2" element={<Mailbox2 />} />
        <Route path="/receiver-sign/:contractId" element={<ReceiverSignPage />} />
      </Routes>
    </Router>
  );
}

export default App;
