import React from "react";
import ContractBase from "./ContractBase";

const supplyTemplate = {
  name: "자재/물품 공급계약서",
  editable: [
    "supplier.name","supplier.rep",
    "buyer.name","buyer.rep",
    "contractDate","place","deliveryDate","allowPartial",
    "items","paymentTerms","paymentMethod"
  ],
  defaults: {
    supplier: { name: "", rep: "" },
    buyer:    { name: "", rep: "" },
    contractDate: "",
    place: "",
    incoterms: "국내 인도(DDP 상당)",
    deliveryDate: "",
    allowPartial: "허용",
    deliveryTerms: "",
    inspectTerms: "납품일로부터 7영업일 내 수량·외관·기능 검수",
    paymentTerms: "세금계산서 수취 익월 말 지급",
    paymentMethod: "계좌이체",
    warrantyTerms: "납품일로부터 12개월",
    recall: "결함 발견 시 공급자 비용으로 교환/회수",
    ldRate: "1/1000(일)",
    termination: "상대방 중대한 위반 시 서면통지로 해지",
    law: "대한민국 법",
    court: "을의 본점 소재지 법원",
    etcTerms: "",
    items: Array.from({ length: 5 }).map(() => ({})),
  },
  fields: [
    { type: "section", label: "당사자/기본" },
    { type: "text", name: "supplier.name", label: "공급자(갑)" },
    { type: "text", name: "supplier.rep",  label: "갑 대표자" },
    { type: "text", name: "buyer.name",    label: "수요자(을)" },
    { type: "text", name: "buyer.rep",     label: "을 대표자" },
    { type: "date", name: "contractDate",  label: "계약일자" },

    { type: "section", label: "납품/검수/대금" },
    { type: "text", name: "place",        label: "인도 장소" },
    { type: "text", name: "deliveryDate", label: "납품(완료)일" },
    { type: "text", name: "allowPartial", label: "분납 허용(허용/불허)" },
    { type: "textarea", name: "paymentTerms",  label: "대금지급 조건(기한/서류)" },
    { type: "text", name: "paymentMethod", label: "지급방법" },

    { type: "section", label: "품목 내역" },
    {
      type: "table",
      name: "items",
      label: "품목 내역",
      minRows: 5,
      columns: [
        { key: "name",   label: "품명" },
        { key: "spec",   label: "규격" },
        { key: "unit",   label: "단위" },
        { key: "qty",    label: "수량", type: "number" },
        { key: "price",  label: "단가" },
        { key: "amount", label: "금액" },
        { key: "note",   label: "비고" },
      ],
    },
  ],
  body: `
자재/물품 공급계약서

공급자(갑) {{supplier.name}}(대표 {{supplier.rep}})과(와) 수요자(을) {{buyer.name}}(대표 {{buyer.rep}})은 다음과 같이 계약한다.

제1조(계약일자·장소·조건)
 - 계약일자: {{contractDate}}
 - 인도 장소: {{place}}, 인도조건: {{incoterms}}
 - 납품(완료)일: {{deliveryDate}} / 분납: {{allowPartial}}

제2조(품목·수량·대금)
 - 별지 표 ‘품목 내역’에 따른다. 단가·금액은 부가세 처리 기준에 따라 정산한다.

제3조(위험이전·소유권)
 - 인도 완료 시점에 위험이 이전되며, 대금 완제 시 소유권이 이전된다(별도 약정 없는 한).

제4조(운반·포장·인수)
 - {{deliveryTerms}}

제5조(검수·하자보수)
 - {{inspectTerms}}
 - 하자 발견 시 갑 비용으로 교환·보수하며, 동일 하자 반복 시 리콜 등 {{recall}}을 따른다.

제6조(대금 및 지급)
 - 지급 조건: {{paymentTerms}} / 지급방법: {{paymentMethod}}

제7조(지체상금)
 - 을 귀책 지연 시 계약금액 기준 {{ldRate}}의 지체상금을 적용한다.

제8조(보증)
 - 품질보증 기간/범위: {{warrantyTerms}}

제9조(해지)
 - {{termination}}. 해지 시 이미 공급된 물품에 대해서는 기성 정산한다.

제10조(기타)
 - {{etcTerms}}

제11조(준거법·관할)
 - 준거법: {{law}} / 관할법원: {{court}}

[서명]
갑: {{supplier.name}} (서명)   /   을: {{buyer.name}} (서명)
  `,
  footerNote: "※ 인도조건, 검수기준, 보증·리콜·지체상금은 표준으로 고정해두고 필요 시에만 변경하세요.",
};

export default function SupplyContractPage() {
  return <ContractBase template={supplyTemplate} />;
}
