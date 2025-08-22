import React from 'react';
import UserContracts from './components/UserContracts';

function App() {
  const userId = 1; // 테스트용 사용자 ID

  return (
    <div className="App">
      <h1>계약서 대시보드</h1>
      <UserContracts userId={userId} />
    </div>
  );
}

export default App;
