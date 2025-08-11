// import React from 'react';
// import NDAForm from './SendContract';
// import SendContract from './SendContract';

// function App() {
//   return (
//     <div className="App">
//       <SendContract />
//     </div>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import SendContract from './SendContract';

// import SignContract from './SignContract';
// import ContractForm from './component/ContractForm';

// function App() {
//   return <ContractForm />;
// }


// export default App;

// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import ContractForm from "./component/ContractForm";
// import MyPage from "./component/MyPage";
// import Mailbox from "./component/Mailbox";


// function App() {
//   return (
//     <Router>
//       <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
//         <Link to="/" style={{ marginRight: "1rem" }}>계약 작성</Link>
//         <Link to="/mypage" style={{ marginRight: "1rem" }}>마이페이지</Link>
//         <Link to="/mailbox">메일함</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<ContractForm />} />
//         <Route path="/mypage" element={<MyPage />} />
//         <Route path="/mailbox" element={<Mailbox />} />
//          <Route path="/contract-form/:id" element={<ContractForm />} />
//       </Routes>
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ContractForm from "./component/ContractForm";

import MyPage2 from "./component/MyPage2";  // 영희 마이페이지
import Mailbox from "./component/Mailbox";
import Mailbox2 from "./component/Mailbox2";
import MyPage from "./component/MyPage";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>계약 작성</Link>
        <Link to="/mypage1" style={{ marginRight: "1rem" }}>철수 마이페이지</Link>
        <Link to="/mypage2" style={{ marginRight: "1rem" }}>영희 마이페이지</Link>
        <Link to="/mailbox">메일함</Link>
         <Link to="/mailbox2">영희메일함</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ContractForm />} />
        <Route path="/mypage1" element={<MyPage />} />  {/* 철수 */}
        <Route path="/mypage2" element={<MyPage2 />} />  {/* 영희 */}
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/mailbox2" element={<Mailbox2 />} />
        <Route path="/contract-form/:id" element={<ContractForm />} />
      </Routes>
    </Router>
  );
}


export default App;

