// EmploymentContractPage.jsx
import React from "react";
import ContractBase from "./ContractBase";

/** 표준근로계약서(기간의 정함이 없는 경우)
 *  - 좌측 입력: 사업주/근로자, 근로개시/근무, 임금/지급, 사회보험
 *  - 고정값: 법정수당, 수습, 해지예고일 등 회사 표준 문구
 *  - 서명: sign.employer(사업주), sign.employee(근로자) → 서명패드에서 입력
 */
const employmentTemplate = {
  name: "표준근로계약서(기간의 정함이 없는 경우)",

  // 좌측 폼에서 수정 가능한 키 목록(서명 제외: 패드에서 입력)
  editable: [
    "employer.name","employer.address","employer.ceo",
    "employee.name","employee.address","employee.phone",
    "start.year","start.month","start.day",
    "work.place","work.duty",
    "time.startH","time.endH","time.breakH","time.breakM",
    "weeklyWorkday","weeklyHoliday",
    "wage.base","wage.bonus","wage.extra",
    "payday","paymethod",
    "ins.nps","ins.nhi","ins.ei","ins.aci"
  ],

  // 기본값(회사 표준 문구 포함)
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
    // 회사 고정 안내 문구
    rates: { overtime: "통상임금의 1.5배", night: "통상임금의 1.5배", holiday: "통상임금의 1.5배" },
    probationMonths: "3",
    noticeDays: "30",
    privacy: "업무 수행 및 인사‧급여 목적 범위 내",
    rulesUrl: "(회사 내규 위치)",
    sign: { employer: "", employee: "" } // 서명 이미지(패드에서 세팅)
  },

  // 좌측 입력 폼(본문 등장 순서 기준으로 정렬됨)
  fields: [
    { type: "section", label: "사업주/근로자" },
    { type: "text", name: "employer.name",    label: "사업주(회사명)" },
    { type: "text", name: "employer.address", label: "사업주 주소" },
    { type: "text", name: "employer.ceo",     label: "대표자" },
    { type: "text", name: "employee.name",    label: "근로자 성명" },
    { type: "text", name: "employee.address", label: "근로자 주소" },
    { type: "text", name: "employee.phone",   label: "근로자 연락처" },

    { type: "section", label: "근로개시/근무" },
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

    { type: "section", label: "임금/지급" },
    { type: "text", name: "wage.base",  label: "임금(월/시급)" },
    { type: "text", name: "wage.bonus", label: "상여금(있음 시 금액/율)" },
    { type: "text", name: "wage.extra", label: "기타수당(제수당 등)" },
    { type: "text",   name: "payday",    label: "임금지급일(매월 n일 등)" },
    { type: "select", name: "paymethod", label: "지급방법", options: ["직접지급","통장입금"] },

    { type: "section", label: "사회보험" },
    { type: "checkbox", name: "ins.nps", label: "국민연금" },
    { type: "checkbox", name: "ins.nhi", label: "건강보험" },
    { type: "checkbox", name: "ins.ei",  label: "고용보험" },
    { type: "checkbox", name: "ins.aci", label: "산재보험" },
  ],

  // 본문 (미리보기/인쇄)
  body: `
(이하 "사업주") {{employer.name}} 과(와) (이하 "근로자") {{employee.name}} 은 다음과 같이 근로계약을 체결한다.

1. 근로개시일: {{start.year}}년 {{start.month}}월 {{start.day}}일 부터
2. 근무 장소: {{work.place}}
3. 업무 내용: {{work.duty}}
4. 소정근로시간: {{time.startH}}시 ~ {{time.endH}}시 (휴게 {{time.breakH}}시간 {{time.breakM}}분)
5. 근무일/휴일: 매주 {{weeklyWorkday}} 근무, 주휴일 매주 {{weeklyHoliday}}요일

6. 임금
 - 기본임금(월/시간): {{wage.base}} 원
 - 상여금: {{wage.bonus}}
 - 기타수당(제수당 등): {{wage.extra}}
 - 임금지급일: {{payday}} (지급방법: {{paymethod}})
 - 법정수당: 연장 {{rates.overtime}}, 야간 {{rates.night}}, 휴일 {{rates.holiday}} 적용

7. 수습
 - 수습기간: 입사일로부터 {{probationMonths}}개월. 법령이 허용하는 범위 내에서 임금 차등 지급 가능.

8. 휴가/휴일
 - 연차유급휴가 및 출‧퇴근·휴게 등은 근로기준법과 회사 취업규칙에 따른다.

9. 사회보험
 - 적용 여부: 국민연금({{ins.nps}}), 건강보험({{ins.nhi}}), 고용보험({{ins.ei}}), 산재보험({{ins.aci}}).

10. 개인정보
 - 이용 목적: {{privacy}}. 관련 법령과 회사 정책에 따라 보관·파기한다.

11. 성실의무/비밀유지
 - 근로자는 업무상 알게 된 비밀을 보호하며, 회사 자산을 선량한 관리자로서 보전한다.

12. 계약해지/징계
 - 일방은 중대한 사유 발생 시 해지할 수 있다. 해지 예고는 원칙적으로 {{noticeDays}}일 이전에 한다(법령 예외 인정).
 - 징계, 임직원 행위기준 등은 취업규칙/인사규정에 따른다. (위치: {{rulesUrl}})

13. 퇴직 및 퇴직급여
 - 근로자퇴직급여 보장법 등 관계 법령 및 회사 규정에 따른다.

14. 분쟁해결
 - 분쟁은 상호 협의하되, 불성립 시 관할 노동관서 또는 관할법원에 따른다.

15. 교부
 - 본 계약서 사본 각 1부씩 교부·보관한다.

[서명]
(사업주) {{employer.name}} / 대표자: {{employer.ceo}} (서명) / 주소: {{employer.address}}
{{sign.employer}}

(근로자) 성명: {{employee.name}} (서명) / 주소: {{employee.address}} / 연락처: {{employee.phone}}
{{sign.employee}}
  `,

  footerNote: "※ 취업규칙·인사규정과 함께 운영하면 좋습니다.",
};

export default function EmploymentContractPage() {
  return <ContractBase template={employmentTemplate} />;
}
