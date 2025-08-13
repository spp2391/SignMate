// SecretPage.jsx
import React from "react";
import ContractBase from "./ContractBase";

/** 비밀유지계약서(NDA)
 *  - 좌측 입력: 당사자, 발효일/기간, 목적, 준거법
 *  - 서명: sign.discloser(공개자/갑), sign.recipient(수신자/을) → 서명패드
 */
const ndaTemplate = {
  name: "비밀유지계약서(NDA)",

  // 서명은 패드에서 처리되므로 editable에 굳이 넣지 않아도 ContractBase가 본문에서 자동 감지
  editable: [
    "discloser.name","discloser.rep","discloser.address",
    "recipient.name","recipient.rep","recipient.address",
    "effective","purpose","termMonths","survivalYears","law"
  ],

  defaults: {
    discloser: { name: "", rep: "", address: "" }, // 갑
    recipient: { name: "", rep: "", address: "" }, // 을
    effective: "",
    purpose: "",
    termMonths: "",
    survivalYears: "",
    law: "대한민국 법",
    sign: { discloser: "", recipient: "" } // 서명 이미지(dataURL)
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
    { type: "date", name: "effective",   label: "발효일" },
    { type: "textarea", name: "purpose", label: "정보 제공 목적" },
    { type: "text", name: "termMonths",    label: "계약기간(개월)" },
    { type: "text", name: "survivalYears", label: "비밀유지 존속기간(년)" },
    { type: "text", name: "law",           label: "준거법" },
  ],

  body: `
비밀유지계약서(NDA)

1. 당사자
  - 공개자(갑): {{discloser.name}} (대표 {{discloser.rep}} / 주소 {{discloser.address}})
  - 수신자(을): {{recipient.name}} (대표 {{recipient.rep}} / 주소 {{recipient.address}})

2. 목적: {{purpose}}
3. 비밀정보의 범위: 서면·구두·전자적 형태의 모든 정보 및 그 복제물
4. 비밀유지 의무: 수신자는 목적 외 사용 금지, 제3자 제공 금지, 필요한 보호조치 이행
5. 예외: 공지 정보, 제3자로부터 적법 취득, 독자적 개발, 법령·법원·기관 요구
6. 계약기간: 발효일({{effective}})부터 {{termMonths}}개월
7. 존속기간: 계약 종료 후 {{survivalYears}}년간 비밀유지 의무 존속
8. 자료의 반환/파기: 공개자의 요구 시 지체 없이 반환 또는 파기
9. 손해배상 및 금지명령: 위반 시 손해배상 및 가처분 등 법적 구제 가능
10. 준거법 및 관할: {{law}}

[서명]
갑: {{discloser.name}} (서명)
{{sign.discloser}}

을: {{recipient.name}} (서명)
{{sign.recipient}}
  `,

  footerNote: "※ 필요 시 제재 조항·계약금액 연동 조항을 추가하세요.",
};

export default function SecretPage() {
  return <ContractBase template={ndaTemplate} />;
}
