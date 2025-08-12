import React from "react";
import ContractBase from "./ContractBase";

const ndaTemplate = {
  name: "비밀유지계약서(NDA)",
  editable: [
    "discloser.name","discloser.rep","discloser.address",
    "recipient.name","recipient.rep","recipient.address",
    "effective","purpose","termMonths","survivalYears"
  ],
  defaults: {
    discloser: { name: "", rep: "", address: "" }, // 갑
    recipient: { name: "", rep: "", address: "" }, // 을
    effective: "",
    purpose: "",
    termMonths: "24",
    survivalYears: "5",
    // 고정값
    marking: "서면은 ‘비밀’ 표시, 구두는 14일 내 서면 통지",
    security: "접근권한 최소화, 암호화 전송/보관, 보안사고 즉시 통지",
    returnWay: "요구 시 지체 없이 반환 또는 완전 파기(증빙 제출)",
    injunctive: "금지명령 등 즉시 구제 가능",
    audit: "사전 통지 후 합리적 범위 내 확인 가능",
    law: "대한민국 법",
    court: "을의 본점 소재지 법원",
  },
  fields: [
    { type: "section", label: "당사자" },
    { type: "text", name: "discloser.name",    label: "공개자(갑)" },
    { type: "text", name: "discloser.rep",     label: "갑 대표자" },
    { type: "text", name: "discloser.address", label: "갑 주소" },
    { type: "text", name: "recipient.name",    label: "수신자(을)" },
    { type: "text", name: "recipient.rep",     label: "을 대표자" },
    { type: "text", name: "recipient.address", label: "을 주소" },

    { type: "section", label: "기간/목적" },
    { type: "date",     name: "effective",   label: "발효일" },
    { type: "textarea", name: "purpose",     label: "정보 제공 목적" },
    { type: "text",     name: "termMonths",  label: "계약기간(개월)" },
    { type: "text",     name: "survivalYears", label: "비밀유지 존속기간(년)" },
  ],
  body: `
비밀유지계약서(NDA)

1. 당사자
  - 공개자(갑): {{discloser.name}} (대표 {{discloser.rep}} / 주소 {{discloser.address}})
  - 수신자(을): {{recipient.name}} (대표 {{recipient.rep}} / 주소 {{recipient.address}})

2. 목적: {{purpose}}

3. 비밀정보의 범위
  - 서면·구두·전자적 형태 일체 및 그 복제물, 분석물, 파생물. 다만, 수신자가 입증하는 다음은 제외
    (i) 공지 정보, (ii) 제3자로부터 적법 취득, (iii) 독자 개발, (iv) 법령·기관 요구

4. 표시 및 통지
  - {{marking}}

5. 비밀유지 의무 및 보호조치
  - 목적 외 사용 금지, 제3자 제공 금지, 필요 최소한 인원에 한해 접근 허용
  - 보호조치: {{security}}

6. 기간
  - 계약기간: 발효일({{effective}})부터 {{termMonths}}개월
  - 존속기간: 계약 종료 후 {{survivalYears}}년간 비밀유지 의무 존속

7. 자료의 반환/파기
  - {{returnWay}}

8. 권리 귀속
  - 비밀정보에 대한 권리는 공개자에게 귀속되며, 어떠한 권리도 양도·라이선스되는 것으로 해석되지 않는다.

9. 손해배상 및 긴급구제
  - 위반 시 손해배상 청구 가능하며, {{injunctive}}.

10. 이행 확인(감사)
  - {{audit}}

11. 준거법·관할: {{law}} / {{court}}

[서명]
갑: {{discloser.name}} (서명)  /  을: {{recipient.name}} (서명)
  `,
  footerNote: "※ 표기·보호조치·반환 방식은 실제 보안정책에 맞춰 구체화하세요.",
};

export default function SecretPage() {
  return <ContractBase template={ndaTemplate} />;
}
