import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Mailbox() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/notifications", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
      }
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, []);

  const handleClick = (contractId) => {
    navigate(`/contracts/${contractId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>메일함</h2>
      {notifications.length === 0 && <p>알림이 없습니다.</p>}
      <ul>
        {notifications.map(n => (
          <li key={n.notificationId} style={{ cursor: "pointer", marginBottom: 10 }}
              onClick={() => handleClick(n.contractId)}>
            <strong>{n.message}</strong> 
            <div style={{ fontSize: 12, color: "#666" }}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
