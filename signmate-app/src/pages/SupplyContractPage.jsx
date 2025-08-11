import React from "react";
import ContractBase from "./ContractBase";

const supplyTemplate = {
  name: "자재/물품 공급계약서",
  defaults: {
    supplier: { name: "", rep: "" }, // 갑
    buyer:    { name: "", rep: "" }, // 을
    contractDate: "",
    place: "",
    deliveryTerms: "",
    inspectTerms: "",
    paymentTerms: "",
    warrantyTerms: "",
    etcTerms: "",
    items: Array.from({ length: 5 }).map(() => ({})),
  },
  fields: [
    { type: "text", name: "supplier.name", label: "공급자(갑)" },
    { type: "text", name: "supplier.rep",  label: "갑 대표자" },
    { type: "text", name: "buyer.name",    label: "수요자(을)" },
    { type: "text", name: "buyer.rep",     label: "을 대표자" },

    { type: "date", name: "contractDate",  label: "계약일자" },
    { type: "text", name: "place",         label: "인도 장소" },

    { type: "textarea", name: "deliveryTerms", label: "인도 조건(운반/포장 등)" },
    { type: "textarea", name: "inspectTerms",  label: "검수·하자보수 조건" },
    { type: "textarea", name: "paymentTerms",  label: "대금지급 조건" },
    { type: "textarea", name: "warrantyTerms", label: "품질보증/교환·환불" },
    { type: "textarea", name: "etcTerms",      label: "기타 조항" },

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

공급자(갑) {{supplier.name}}(대표 {{supplier.rep}}) 과(와) 수요자(을) {{buyer.name}}(대표 {{buyer.rep}})은 다음 조건으로 물품 공급에 합의한다.

제1조(계약일자·장소) 계약일자는 {{contractDate}} 이며, 인도 장소는 {{place}} 로 한다.
제2조(품목·수량·대금) 아래 표 기재 내역을 기준으로 한다.
[품목 내역 표는 본문 하단에 표시]

제3조(인도조건) {{deliveryTerms}}
제4조(검수·하자보수) {{inspectTerms}}
제5조(대금 및 지급) {{paymentTerms}}
제6조(품질보증 등) {{warrantyTerms}}
제7조(기타) {{etcTerms}}

[서명]
갑: {{supplier.name}} (서명)   /   을: {{buyer.name}} (서명)
  `,
  footerNote: "※ 납기/검수/대금 조건을 구체적으로 기재하세요.",
};

export default function SupplyContractPage() {
  return <ContractBase template={supplyTemplate} />;
}
