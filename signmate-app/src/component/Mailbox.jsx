import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Mailbox({ refreshUnread }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // 알림 목록 가져오기
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // 읽음 처리 후 이동
const handleClick = async (contractId, notificationId) => {
  // 1. 로컬에서 바로 읽음 처리
  setNotifications((prev) =>
    prev.map((n) =>
      n.notificationId === notificationId ? { ...n, isRead: true } : n
    )
  );

  if (refreshUnread) refreshUnread();

  // 2. 서버에 읽음 처리 비동기 요청
  fetch(`/api/notifications/read/${notificationId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  }).catch((err) => console.error("읽음 처리 실패:", err));

  // 3. navigate
  navigate(`/secrets/${contractId}`);
};


  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: 10 }}>
      {notifications.length === 0 && <p>알림이 없습니다.</p>}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {notifications.map((n) => (
          <li
            key={n.notificationId}
            onClick={() => handleClick(n.contractId, n.notificationId)}
            style={{
              cursor: "pointer",
              marginBottom: 8,
              padding: "8px 6px",
              borderRadius: 6,
              backgroundColor: n.isRead ? "#fff" : "#fff",
              border: "1px solid #f1f5f9",
            }}
          >
            <strong>{n.message}</strong>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
