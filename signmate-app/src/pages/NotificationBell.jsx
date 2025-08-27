import { useEffect, useRef, useState } from "react";
import Mailbox from "../component/Mailbox";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  // ESC로 닫기 + 바깥 클릭시 닫기
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  // 읽지 않은 알림 수 가져오기
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications/unread-count", {
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
      });
      if (res.ok) {
        const count = await res.json();
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Unread count fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    let interval = null
    if(localStorage.getItem("accessToken")){
      interval = setInterval(fetchUnreadCount, 60*1000);// 5초마다 갱신
    }
     
    return () => {
      if(interval != null) clearInterval(interval);}
  }, []);

  const togglePanel = () => setOpen((v) => !v);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={togglePanel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mailbox-panel"
        style={{
          position: "relative",
          background: "transparent",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
        }}
        title="알림"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            fontSize: 12,
            lineHeight: '18px',
            textAlign: 'center',
            background: '#ef4444',
            color: '#fff',
            padding: '0 5px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id="mailbox-panel"
          ref={panelRef}
          role="dialog"
          aria-label="알림함"
          style={{
            position: "fixed",
            top: 72,
            right: 300,
            width: 360,
            maxHeight: 600,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* 헤더 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
          }}>
            <strong>알림함</strong>
            <button
              onClick={() => setOpen(false)}
              aria-label="닫기"
              style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          {/* 내용 */}
          <div style={{
            borderTop: "1px solid #f1f5f9",
            maxHeight: 540,
            overflowY: "auto",
          }}>
            <Mailbox refreshUnread={fetchUnreadCount} />
          </div>
        </div>
      )}
    </div>
  );
}
