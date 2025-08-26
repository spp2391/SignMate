import { CheckCircle2, Clock, Pencil, Tag } from "lucide-react";

export const ContractStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

export const ContractType = {
  EMPLOYMENT: "EMPLOYMENT",
  OUTSOURCING: "OUTSOURCING",
  SECRET: "SECRET",
  SERVICE: "SERVICE",
  SUPPLY: "SUPPLY",
};

export const CONTRACT_TYPE_LABEL = {
  [ContractType.EMPLOYMENT]: "근로 계약서",
  [ContractType.OUTSOURCING]: "업무위탁 계약서",
  [ContractType.SECRET]: "비밀유지계약서",
  [ContractType.SERVICE]: "용역 계약서",
  [ContractType.SUPPLY]: "자재/물품 공급계약서",
};

export const CONTRACT_TYPE_PATH = {
  [ContractType.STANDARD]: "employment",
  [ContractType.BUSINESS_OUTSOURCING]: "outsourcing",
  [ContractType.SECRET]: "secret",
  [ContractType.SERVICE]: "service",
  [ContractType.SUPPLY]: "supply",
};

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

export const formatLocalDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};