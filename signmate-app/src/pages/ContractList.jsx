// src/pages/ContractList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const contracts = [
  {
    id: 1,
    title: "시공계약",
    description: "내부 시스템에서 즉시 계약서, 확인서를 발송하고 처리합니다.",
    tag: "API 연동형",
    company: "삼성전자",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800"
  },
  {
    id: 2,
    title: "근로계약 · 약정서 · 동의서",
    description: "불필요한 행정 소모와 시간을 크게 줄일 수 있었습니다.",
    tag: "플랫폼형",
    company: "한국국제협력단",
    bgColor: "bg-blue-200",
    textColor: "text-blue-900"
  },
  {
    id: 3,
    title: "택배 대리점 계약",
    description: "맞춤형 전자계약 API 연동으로 계약 체결과 관리가 상당히 편리해졌습니다.",
    tag: "API 연동형",
    company: "롯데글로벌로지스",
    bgColor: "bg-red-100",
    textColor: "text-red-800"
  },
];

export default function ContractList() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {contracts.map((contract) => (
        <div key={contract.id} className={`p-6 rounded-lg shadow ${contract.bgColor}`}>
          <h2 className={`text-xl font-bold mb-2 ${contract.textColor}`}>{contract.title}</h2>
          <p className="mb-3 text-gray-700">{contract.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <span className="border rounded px-2 py-1">{contract.tag}</span>
            <span>{contract.company}</span>
          </div>
          <button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded"
            onClick={() => navigate(`/contracts/${contract.id}`)}
          >
            작성하기
          </button>
        </div>
      ))}
    </div>
  );
}
