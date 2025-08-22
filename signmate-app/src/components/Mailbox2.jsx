import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Mailbox2() {  // 영희 버전이라서 Mailbox2로 이름 변경
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/mailbox/younghee') // 필요시 API 주소를 영희용으로 변경
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, []);

  const goToWriteContract = (contractId) => {
    navigate(`/contract-form/${contractId}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>김영희 메일함</h2>

      {notifications.length === 0 ? (
        <p>받은 메일이 없습니다.</p>
      ) : (
        <ul>
          {notifications.map(({ notificationId, contractId, createdAt }) => (
            <li key={notificationId} style={{ marginBottom: "1rem" }}>
              계약서 ID: {contractId} - 알림 받은 시간: {new Date(createdAt).toLocaleString()}
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => goToWriteContract(contractId)}
              >
                계약서 작성/답변하기
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Mailbox2;
