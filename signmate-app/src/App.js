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

import React, { useState } from 'react';
import SendContract from './SendContract';

import SignContract from './SignContract';

function App() {
  const [page, setPage] = useState('send'); // 'send' or 'sign'

  return (
    <div>
      <button onClick={() => setPage('send')}>계약서 보내기</button>
      <button onClick={() => setPage('sign')}>서명하기</button>

      {page === 'send' && <SendContract />}
      {page === 'sign' && <SignContract />}
    </div>
  );
}

export default App;
