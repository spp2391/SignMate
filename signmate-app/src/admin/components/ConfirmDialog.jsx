import React from "react";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ border: "1px solid #aaa", padding: 20, background: "#fff" }}>
      <p>{message}</p>
      <button onClick={onConfirm}>확인</button>
      <button onClick={onCancel}>취소</button>
    </div>
  );
}
