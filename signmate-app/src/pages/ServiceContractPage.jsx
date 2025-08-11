import React from "react";
import ContractBase from "./ContractBase";

const serviceTemplate = {
  name: "용역계약서",
  defaults: {
    client: { name: "", address: "", rep: "" }, // 갑
    vendor: { name: "", address: "", rep: "" }, // 을
    proj: { name: "", start: "", end: "" },
    amount: { total: "", krw: "" },
    pay: { down: "", mid: "", finalDays: "" },
    warrantyMonths: "",
    delayRate: "",
    scope: "",
    deliverables: "",
  },
  fields: [
    { type: "text", name: "client.name",    label: "갑(발주자)" },
    { type: "text", name: "client.address", label: "갑 주소" },
    { type: "text", name: "client.rep",     label: "갑 대표자" },

    { type: "text", name: "vendor.name",    label: "을(수행자)" },
    { type: "text", name: "vendor.address", label: "을 주소" },
    { type: "text", name: "vendor.rep",     label: "을 대표자" },

    { type: "text", name: "proj.name",  label: "프로젝트명" },
    { type: "date", name: "proj.start", label: "계약(과업) 시작일" },
    { type: "date", name: "proj.end",   label: "계약(과업) 종료일" },

    { type: "text", name: "amount.total", label: "계약금액(원정 표기)" },
    { type: "text", name: "amount.krw",   label: "계약금액(숫자, ￦)" },

    { type: "textarea", name: "scope",        label: "과업 범위" },
    { type: "textarea", name: "deliverables", label: "산출물/검수 기준" },

    { type: "text", name: "pay.down",      label: "계약금" },
    { type: "text", name: "pay.mid",       label: "중도금" },
    { type: "text", name: "pay.finalDays", label: "잔금 지급기한(검수 후 n일)" },

    { type: "text", name: "warrantyMonths", label: "하자보수 기간(개월)" },
    { type: "text", name: "delayRate",      label: "지체상금률(예: 1/100)" },
  ],
  body: `
용역계약서

1. 발주자(갑): {{client.name}} (대표 {{client.rep}}) / 주소: {{client.address}}
2. 수행자(을): {{vendor.name}} (대표 {{vendor.rep}}) / 주소: {{vendor.address}}
3. 프로젝트명: {{proj.name}}
4. 계약기간: {{proj.start}} ~ {{proj.end}}
5. 계약금액: 금 {{amount.total}} (￦ {{amount.krw}})
6. 과업 범위: {{scope}}
7. 산출물/검수 기준: {{deliverables}}

8. 대금지급
  가. 계약금: {{pay.down}}원
  나. 중도금: {{pay.mid}}원
  다. 잔금: 검수 완료 후 {{pay.finalDays}}일 이내 지급

9. 하자보수: 검수 완료일로부터 {{warrantyMonths}}개월
10. 지체상금: 계약금액의 {{delayRate}} 적용
11. 비밀유지 및 지재권: 별첨 특약에 따름
12. 기타: 미정 사항은 민법 및 관계 법령에 따름

[서명]
(갑) {{client.name}}  대표자: {{client.rep}} (서명)
(을) {{vendor.name}}  대표자: {{vendor.rep}} (서명)
  `,
  footerNote: "※ 과업 범위/검수 기준을 구체적으로 기재하세요.",
};

export default function ServiceContractPage() {
  return <ContractBase template={serviceTemplate} />;
}
