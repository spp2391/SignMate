import React from "react";
import ContractBase from "./ContractBase";

const outsourcingTemplate = {
  name: "업무위탁 계약서",
  editable: [
    "principal.name", "principal.rep", "principal.address", "principal.contact",
    "agent.name", "agent.rep", "agent.address", "agent.contact",
    "periodStart", "periodEnd",
    "milestones", // 주요 일정 추가
    "items", "totalPay", "signDate"
  ],
  defaults: {
    principal: { name: "", rep: "", address: "", contact: "" },
    agent: { name: "", rep: "", address: "", contact: "" },
    periodStart: "",
    periodEnd: "",
    totalPay: "",
    law: "대한민국 법", // 고정
    signDate: "",
    milestones: "", // 기본 빈 값
    items: Array.from({ length: 5 }).map(() => ({})),
  },
  fields: [
    { type: "section", label: "당사자 정보(갑)" },
    { type: "text", name: "principal.name", label: "갑 상호(명)" },
    { type: "text", name: "principal.rep", label: "갑 대표자" },
    { type: "text", name: "principal.address", label: "갑 주소" },
    { type: "text", name: "principal.contact", label: "갑 연락처" },

    { type: "section", label: "당사자 정보(을)" },
    { type: "text", name: "agent.name", label: "을 상호(명)" },
    { type: "text", name: "agent.rep", label: "을 대표자" },
    { type: "text", name: "agent.address", label: "을 주소" },
    { type: "text", name: "agent.contact", label: "을 연락처" },

    { type: "section", label: "수행 기간" },
    { type: "date", name: "periodStart", label: "시작일" },
    { type: "date", name: "periodEnd", label: "종료일" },

    { type: "section", label: "주요 일정" }, // 마일스톤 → 주요 일정
    { type: "textarea", name: "milestones", label: "중간 목표 및 일정" },

    { type: "section", label: "대가 정산" },
    {
      type: "table",
      name: "items",
      label: "정산 내역",
      minRows: 5,
      columns: [
        { key: "category", label: "구분" },
        { key: "unitPrice", label: "단가" },
        { key: "quantity", label: "수량" },
        { key: "perUnit", label: "1인/1건당" },
        { key: "pay", label: "지급액" },
        { key: "taskType", label: "업무구분" },
        { key: "note", label: "비고" },
      ],
    },
    { type: "text", name: "totalPay", label: "합계(총 지급액)" },

    { type: "section", label: "서명" },
    { type: "date", name: "signDate", label: "서명일" },
  ],
  body: `
업무위탁 계약서

1. 당사자
  - 위탁자(갑): {{principal.name}} (대표 {{principal.rep}} / 주소 {{principal.address}} / 연락처 {{principal.contact}})
  - 수탁자(을): {{agent.name}} (대표 {{agent.rep}} / 주소 {{agent.address}} / 연락처 {{agent.contact}})

2. 업무목적
  - 갑은 을에게 아래 제3조의 업무를 위탁하고, 을은 이를 성실히 수행한다.

3. 업무내용
  - 제품/서비스 운영지원, 현장 점검 및 보고, 자료 수집·분석 및 보고서 작성,
    재고/물류 관리 보조, 고객 응대 및 통지 업무, 기타 갑이 서면으로 지정하는 업무

4. 수행기간 및 주요 일정
  ① 수행기간: {{periodStart}} 부터 {{periodEnd}} 까지
  ② 주요 일정(중간 목표):
     {{milestones}}
  ③ 대가 산정·지급은 ‘정산 내역’ 표를 따른다.
  ④ 합계(총 지급액): {{totalPay}}

5. 비밀유지 및 지식재산권
  ① 을은 업무 수행 중 알게 된 일체의 비밀정보를 제3자에게 누설하지 않는다.
  ② 산출물의 저작권/소유권 귀속은 별도 특약이 없는 한 갑에게 귀속한다.

6. 보고 및 관리
  ① 을은 진행상황을 정기적으로 보고하고, 갑의 요청 시 관련 자료를 즉시 제출한다.
  ② 갑은 품질확보를 위해 검수 및 개선을 요구할 수 있다.

7. 계약의 해지
  - 일방의 중대한 위반 발생 시 상대방은 서면통지로 계약을 해지할 수 있다.

8. 기타
  - 본 계약에 정하지 아니한 사항은 민법 등 관계 법령 및 상관례를 따른다.
  - 준거법: {{law}}

[서명]
서명일: {{signDate}}

(갑) {{principal.name}} / 대표자: {{principal.rep}} (서명)
주소: {{principal.address}} / 연락처: {{principal.contact}}

(을) {{agent.name}} / 대표자: {{agent.rep}} (서명)
주소: {{agent.address}} / 연락처: {{agent.contact}}
  `,
  footerNote: "※ 과업명세서, 검수기준, 지연배상·하자보수 등 특약을 필요 시 추가하세요.",
};

export default function OutsourcingContractPage() {
  return <ContractBase template={outsourcingTemplate} />;
}
