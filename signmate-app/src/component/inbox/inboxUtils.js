// inboxUtils.js
// ContractStatus : 계약 상태(enum)
// ContractType : 계약 종류(enum)
// CONTRACT_TYPE_LABEL : 한글 라벨 매핑
// STATUS_META : 상태별 색상/아이콘 정의
// formatLocalDateTime : 날짜 포맷 함수
// useContracts : 실제 API용 계약 데이터 훅

import { CheckCircle2, Clock, Pencil, Tag } from "lucide-react";

// 1) 상태(enum) & 계약서 종류(enum)
export const ContractStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
};

export const ContractType = {
  STANDARD: "STANDARD",
  OUTSOURCING: "OUTSOURCING",
  SECRET: "SECRET",
  SERVICE: "SERVICE",
  SUPPLY: "SUPPLY",
};

// 2) 한글 라벨 매핑
export const CONTRACT_TYPE_LABEL = {
  [ContractType.STANDARD]: "근로 계약서",
  [ContractType.OUTSOURCING]: "업무위탁 계약서",
  [ContractType.SECRET]: "비밀유지계약서",
  [ContractType.SERVICE]: "용역 계약서",
  [ContractType.SUPPLY]: "자재/물품 공급계약서",
};

// 3) 상태 배지 스타일 메타
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

// 4) 날짜 포맷 함수
export const formatLocalDateTime = (iso) =>
  new Date(iso).toLocaleString();
