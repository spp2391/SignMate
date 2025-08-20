// inboxUtils.js
// ContractStatus : 계약 상태(enum)
// ContractType : 계약 종류(enum)
// CONTRACT_TYPE_LABEL : 한글 라벨 매핑
// STATUS_META : 상태별 색상/아이콘 정의
// formatLocalDateTime : 날짜 포맷 함수
// MOCK_DOCS : 더미 데이터 (실제 API 대신 사용)
// useContracts : 계약 데이터를 가져오는 커스텀 훅
// 이 파일은 화면UI이 아니라 데이터,상수,도우미 함수 관리용


// 1) 상태(enum) & 계약서 종류(enum)
export const ContractStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
};

export const ContractType = {
  EMPLOYMENT: "EMPLOYMENT",   // 근로 계약서
  OUTSOURCING: "OUTSOURCING", // 업무위탁 계약서
  SECRET: "SECRET",           // 비밀유지계약서
  SERVICE: "SERVICE",         // 용역 계약서
  SUPPLY: "SUPPLY",           // 자재/물품 공급계약서
};

// 2) 한글 라벨 매핑
export const CONTRACT_TYPE_LABEL = {
  [ContractType.EMPLOYMENT]: "근로 계약서",
  [ContractType.OUTSOURCING]: "업무위탁 계약서",
  [ContractType.SECRET]: "비밀유지계약서",
  [ContractType.SERVICE]: "용역 계약서",
  [ContractType.SUPPLY]: "자재/물품 공급계약서",
};

// 3) 상태 배지 스타일 메타 (lucide-react 아이콘 사용)
import { CheckCircle2, Clock, Pencil, Tag } from "lucide-react";

export const STATUS_META = {
  [ContractStatus.DRAFT]: {
    label: "작성 중",
    Icon: Pencil,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  [ContractStatus.PENDING]: {
    label: "서명 대기",
    Icon: Tag,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [ContractStatus.IN_PROGRESS]: {
    label: "진행 중",
    Icon: Clock,
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  [ContractStatus.COMPLETED]: {
    label: "서명 완료",
    Icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

// 4) 날짜 포맷(간단)
export const formatLocalDateTime = (iso) =>
  new Date(iso).toLocaleString();

// 5) 목데이터
export const MOCK_DOCS = [
  {
    id: "1",
    title: "홍길동 근로 계약서 - (주)싸인메이트",
    participants: "김길동, 홍길동",
    contractType: ContractType.EMPLOYMENT,
    status: ContractStatus.COMPLETED,
    lastEdited: "2024-07-13T13:00:00Z",
    requester: "요청자",
  },
  {
    id: "2",
    title: "업무위탁 계약서 - BB산업",
    participants: "싸인메이트, BB산업",
    contractType: ContractType.OUTSOURCING,
    status: ContractStatus.PENDING,
    lastEdited: "2024-06-13T17:03:00Z",
  },
  {
    id: "3",
    title: "비밀유지계약서 - 시설관리공단",
    participants: "싸인메이트, 박씨인",
    contractType: ContractType.SECRET,
    status: ContractStatus.IN_PROGRESS,
    lastEdited: "2024-06-11T13:00:00Z",
  },
  {
    id: "4",
    title: "용역 계약서 - 전자부품",
    participants: "싸인메이트, 전자부품",
    contractType: ContractType.SERVICE,
    status: ContractStatus.DRAFT,
    lastEdited: "2024-05-21T11:00:00Z",
  },
  {
    id: "5",
    title: "자재 공급계약서 - 홍길동 고객",
    participants: "홍길동 고객",
    contractType: ContractType.SUPPLY,
    status: ContractStatus.IN_PROGRESS,
    lastEdited: "2024-05-17T17:00:00Z",
  },
];

// 6) 데이터 패칭 훅 (실제 API로 교체하면 됨)
import { useEffect, useState } from "react";

export function useContracts() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setData(MOCK_DOCS), 300);
    return () => clearTimeout(t);
  }, []);
  return { data: data || [], isLoading: !data };
}
