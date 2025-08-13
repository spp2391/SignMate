// ContractList.jsx
import React from "react";
import { Link } from "react-router-dom";

const contracts = [
  { title: "비밀유지서약서", desc: "기업/기관용 비밀유지 서약서", path: "/secret", color: "#f8d7da" },
  { title: "표준근로계약서", desc: "근로계약서 작성용", path: "/employment", color: "#cfe2ff" },
  { title: "용역계약서", desc: "서비스/용역 계약용", path: "/service", color: "#d1e7dd" },
  { title: "자재/물품 공급계약서", desc: "물품/자재 공급 계약", path: "/supply", color: "#fff3cd" },
  { title: "업무위탁 계약서", desc: "업무 위탁 계약용", path: "/outsourcing", color: "#e2e3e5" },
];

export default function ContractList() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 24 }}>계약서 목록</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16
      }}>
        {contracts.map((c, idx) => (
          <Link
            to={c.path}
            key={idx}
            style={{
              display: "block",
              textDecoration: "none",
              borderRadius: 12,
              padding: 16,
              backgroundColor: c.color,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: "#555" }}>{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
