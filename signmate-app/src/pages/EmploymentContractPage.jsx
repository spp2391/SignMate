import React from "react";
import ContractBase from "./ContractBase";

const employmentTemplate = {
  name: "표준근로계약서(기간의 정함이 없는 경우)",
  defaults: {
    employer: { name: "", address: "", ceo: "" },
    employee: { name: "", address: "", phone: "" },
    start: { year: "", month: "", day: "" },
    work: { place: "", duty: "" },
    time: { startH: "", endH: "", breakH: "", breakM: "" },
    weeklyWorkday: "", weeklyHoliday: "",
    wage: { base: "", bonus: "", extra: "" },
    payday: "", paymethod: "통장입금",
    ins: { nps: false, nhi: false, ei: false, aci: false },
  },
  fields: [
    { type: "text", name: "employer.name",    label: "사업주(회사명)" },
    { type: "text", name: "employer.address", label: "사업주 주소" },
    { type: "text", name: "employer.ceo",     label: "대표자" },

    { type: "text", name: "employee.name",    label: "근로자 성명" },
    { type: "text", name: "employee.address", label: "근로자 주소" },
    { type: "text", name: "employee.phone",   label: "근로자 연락처" },

    { type: "text", name: "start.year",  label: "근로개시(년)" },
    { type: "text", name: "start.month", label: "근로개시(월)" },
    { type: "text", name: "start.day",   label: "근로개시(일)" },

    { type: "text",     name: "work.place", label: "근무 장소" },
    { type: "textarea", name: "work.duty",  label: "업무 내용" },

    { type: "text", name: "time.startH", label: "소정근로 시작(시)" },
    { type: "text", name: "time.endH",   label: "소정근로 종료(시)" },
    { type: "text", name: "time.breakH", label: "휴게(시)" },
    { type: "text", name: "time.breakM", label: "휴게(분)" },

    { type: "text", name: "weeklyWorkday", label: "근무일(예: 월~금)" },
    { type: "text", name: "weeklyHoliday", label: "주휴일(예: 일)" },

    { type: "text", name: "wage.base",  label: "임금(월/시급)" },
    { type: "text", name: "wage.bonus", label: "상여금(있음 시 금액/율)" },
    { type: "text", name: "wage.extra", label: "기타수당(제수당 등)" },

    { type: "text",   name: "payday",    label: "임금지급일(매월 n일 등)" },
    { type: "select", name: "paymethod", label: "지급방법", options: ["직접지급","통장입금"] },

    { type: "checkbox", name: "ins.nps", label: "국민연금" },
    { type: "checkbox", name: "ins.nhi", label: "건강보험" },
    { type: "checkbox", name: "ins.ei",  label: "고용보험" },
    { type: "checkbox", name: "ins.aci", label: "산재보험" },
  ],
  body: `
(이하 "사업주"라 함) {{employer.name}} 과(와) (이하 "근로자"라 함) {{employee.name}} 은 다음과 같이 근로계약을 체결한다.

1. 근로개시일: {{start.year}}년 {{start.month}}월 {{start.day}}일 부터
2. 근무 장소: {{work.place}}
3. 업무 내용: {{work.duty}}
4. 소정근로시간: {{time.startH}}시부터 {{time.endH}}시까지 (휴게시간: {{time.breakH}}시 {{time.breakM}}분)
5. 근무일/휴일: 매주 {{weeklyWorkday}} 근무, 주휴일 매주 {{weeklyHoliday}}요일

6. 임금
 - 임금(월/시간): {{wage.base}} 원
 - 상여금: {{wage.bonus}}
 - 기타수당(제수당 등): {{wage.extra}}
 - 임금지급일: {{payday}}
 - 지급방법: {{paymethod}}

7. 연차유급휴가: 근로기준법에 따름
8. 사회보험 적용여부: 국민연금({{ins.nps}}) 건강보험({{ins.nhi}}) 고용보험({{ins.ei}}) 산재보험({{ins.aci}})
9. 근로계약의 교부: 계약서 사본 각 1부 교부·보관
10. 성실한 이행: 근로계약·취업규칙 준수
11. 기타: 미정 사항은 근로기준법령에 따름

[서명]
(사업주) {{employer.name}} / 대표자: {{employer.ceo}} (서명) / 주소: {{employer.address}}
(근로자) 성명: {{employee.name}} (서명) / 주소: {{employee.address}} / 연락처: {{employee.phone}}
  `,
  footerNote: "※ 필수 항목을 정확히 기재하세요.",
};

export default function EmploymentContractPage() {
  return <ContractBase template={employmentTemplate} />;
}
