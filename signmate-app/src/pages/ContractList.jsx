// ContractList.jsx
import React from "react";
import { Link } from "react-router-dom";

const contracts = [
  {
    title: "비밀유지서약서",
    desc: [
      "기업/기관용 비밀유지 서약서",
      "중요 정보와 기밀 사항을 안전하게 보호합니다."
    ],
    path: "/secret",
    color: "#f8d7da"
  },
  {
    title: "표준근로계약서",
    desc: [
      "근로계약서 작성용",
      "근로자와 사용자의 조건을 명확히 하고 분쟁을 예방합니다."
    ],
    path: "/employment",
    color: "#cfe2ff"
  },
  {
    title: "용역계약서",
    desc: [
      "서비스/용역 계약용",
      "업무 범위, 제공 서비스, 대가 등을 명확히 규정합니다."
    ],
    path: "/service",
    color: "#d1e7dd"
  },
  {
    title: "자재/물품 공급계약서",
    desc: [
      "물품/자재 공급 계약",
      "물품 규격, 수량, 납기, 결제 조건 등을 명확히 합니다."
    ],
    path: "/supply",
    color: "#fff3cd"
  },
  {
    title: "업무위탁 계약서",
    desc: [
      "업무 위탁 계약용",
      "외주 업무 범위와 책임을 명확히 하고 안전한 진행을 보장합니다."
    ],
    path: "/outsourcing",
    color: "#e2e3e5"
  },
  {
    title: "직접 작성",
    desc: [
      "계약서를 직접 작성해보세요",
      "템플릿에 없는 맞춤 계약서를 자유롭게 작성할 수 있습니다."
    ],
    path: "/custom",
    color: "#c9b6d3"
  }
];

export default function ContractList() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      {/* 슬로건 문구 */}
      <p style={{
        textAlign: "center",
        color: "#3d3d3dff",
        fontSize: "5rem",
        marginBottom: 100,
        marginTop: 100
      }}>
        시작부터 끝까지, <span style={{ fontWeight: "bold", color: "rgba(0, 134, 243, 1)" }}>사인메이트</span>로
      </p>

      <h1 style={{
        marginBottom: 20,
        fontSize: "1.8rem",
        fontWeight: 700,
        color: "#222",
        textAlign: "center"
      }}>
        계약서 목록
      </h1>

      {/* 계약서 카드 목록 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20
      }}>
        {contracts.map((c, idx) => (
          <Link
            to={c.path}
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // 중앙 정렬
              justifyContent: "center",
              textDecoration: "none",
              borderRadius: 16,
              padding: "24px 16px",
              minHeight: 200,
              backgroundColor: c.color,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "transform 0.25s, box-shadow 0.25s",
              textAlign: "center"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: "#333" }}>
              {c.title}
            </div>
            <div style={{ lineHeight: 1.6 }}>
              {c.desc.map((line, idx) => (
                <div key={idx} style={{
                  fontSize: idx === 0 ? 14 : 13,
                  fontWeight: idx === 0 ? 600 : 400,
                  color: idx === 0 ? "#333" : "#555",
                  marginBottom: idx === 0 ? 4 : 0
                }}>
                  {line}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
