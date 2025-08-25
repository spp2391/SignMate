import React, { useState } from 'react';
import axios from 'axios';

const SendContract = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [contractText, setContractText] = useState('본 계약은 다음 조건에 따릅니다...');

  const handleSend = async () => {
    const res = await axios.post('/api/contracts/send', {
      email: recipientEmail,
      text: contractText
    });
    alert('계약서가 전송되었습니다!');
  };

  return (
    <div>
      <h2>계약서 작성 및 전송</h2>
      <textarea value={contractText} onChange={e => setContractText(e.target.value)} />
      <input type="email" placeholder="상대방 이메일" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
      <button onClick={handleSend}>계약서 보내기</button>
    </div>
  );
};

export default SendContract;
