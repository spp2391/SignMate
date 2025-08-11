import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Mailbox() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/mailbox")
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, []);

  const goToWriteContract = (contractId) => {
    // 예: 계약서 작성/수정 페이지로 이동 (contractId를 쿼리나 path로 넘김)
    navigate(`/contract-form/${contractId}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>김철수 메일함</h2>

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

export default Mailbox;
