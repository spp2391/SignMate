import React, { useState } from "react";
import ContractBase from "./ContractBase";


/** 자재/물품 공급계약서
 *  - 좌측 입력: 당사자, 계약일/장소, 조건/조항, 품목표
 *  - 서명: sign.supplier(갑/공급자), sign.buyer(을/수요자) → 서명패드
 */
const supplyTemplate = {
  name: "자재/물품 공급계약서",

  editable: [
    "supplier.name","supplier.rep",
    "buyer.name","buyer.rep",
    "contractDate","place",
    "deliveryTerms","inspectTerms","paymentTerms","warrantyTerms","etcTerms",
    "items"
  ],

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
    sign: { supplier: "", buyer: "" } // 서명 이미지(dataURL)
  },

  fields: [
    { type: "section", label: "당사자" },
    { type: "text", name: "supplier.name", label: "공급자(갑)" },
    { type: "text", name: "supplier.rep",  label: "갑 대표자" },
    { type: "text", name: "buyer.name",    label: "수요자(을)" },
    { type: "text", name: "buyer.rep",     label: "을 대표자" },

    { type: "section", label: "계약/인도" },
    { type: "date", name: "contractDate",  label: "계약일자" },
    { type: "text", name: "place",         label: "인도 장소" },

    { type: "section", label: "조건/조항" },
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
       { key: "itemName", label: "품명" },
  { key: "specification", label: "규격" },
  { key: "unit", label: "단위" },
  { key: "quantity", label: "수량", type: "number" },
  { key: "unitPrice", label: "단가" },
  { key: "amount", label: "금액" },
  { key: "remarks", label: "비고" },
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
(갑) {{supplier.name}} (서명)
{{sign.supplier}}

(을) {{buyer.name}} (서명)
{{sign.buyer}}
  `,

  footerNote: "※ 납기/검수/대금 조건을 구체적으로 기재하세요.",
};

export default function SupplyContractPage() {
  const [formData, setFormData] = useState(supplyTemplate.defaults);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleChange = (updated) => {
    setFormData(prev => {
      const newState = { ...prev };
      Object.entries(updated).forEach(([key, value]) => {
        if (key.includes(".")) {
          const [parent, child] = key.split(".");
          newState[parent] = { ...newState[parent], [child]: value };
        } else {
          newState[key] = value;
        }
      });
      return newState;
    });
  };

  const handleSave = async () => {
    if (!formData.supplier.name || !formData.buyer.name) {
      alert("공급자와 수요자 이름은 필수입니다.");
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = {
        contractId: formData.contractId, // 추가
        supplierName: formData.supplier.name,
        supplierRepresentative: formData.supplier.rep,
        demanderName: formData.buyer.name,
        demanderRepresentative: formData.buyer.rep,
        contractDate: formData.contractDate || null,
        deliveryLocation: formData.place,
        deliveryTerms: formData.deliveryTerms,
        inspectionAndWarranty: formData.inspectTerms,
        paymentTerms: formData.paymentTerms,
        qualityGuaranteeTerms: formData.warrantyTerms,
        otherTerms: formData.etcTerms,
        items: formData.items.map(item => ({
          itemName: item.itemName,
          specification: item.specification,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
          remarks: item.remarks
        })),
        supplierSignature: formData.sign.supplier,
        demanderSignature: formData.sign.buyer
      };

      console.log("payload.items:", payload.items);

      const res = await fetch("/api/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text() || "서버 오류");
      const result = await res.json();
      alert("계약서 제출 완료!");
      console.log("서버 응답:", result);
    } catch (err) {
      alert("저장 실패: " + err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <ContractBase
        template={supplyTemplate}
        data={formData}
        handleChange={handleChange}
      />
      <button
        onClick={handleSave}
        disabled={loadingSubmit}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 18,
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        {loadingSubmit ? "제출 중..." : "제출하기"}
      </button>
    </div>
  );
}