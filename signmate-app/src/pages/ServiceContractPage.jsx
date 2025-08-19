// ServiceContractPage.jsx
import React, { useState } from "react";
import ContractBase from "./ContractBase";

/** 용역계약서
 *  - 좌측 입력: 당사자, 과업기간, 금액, 범위/산출물, 지급, 하자/지체, 서명일
 *  - 서명: sign.client(갑/발주자), sign.vendor(을/수행자) → 서명패드
 */
const serviceTemplate = {
  name: "용역계약서",

  editable: [
    "client.name","client.address","client.rep",
    "vendor.name","vendor.address","vendor.rep",
    "proj.name","proj.start","proj.end",
    "amount.total","amount.krw",
    "scope","deliverables",
    "pay.down","pay.mid","pay.finalDays",
    "warrantyMonths","delayRate",
    "signDate"
  ],

  defaults: {
    client: { name: "", address: "", rep: "" }, // 갑
    vendor: { name: "", address: "", rep: "" }, // 을
    proj: { name: "", start: "", end: "" },
    amount: { total: "", krw: "" },
    scope: "",
    deliverables: "",
    pay: { down: "", mid: "", finalDays: "" },
    warrantyMonths: "",
    delayRate: "",
    signDate: "",
    sign: { client: "", vendor: "" } // 서명 이미지(dataURL)
  },

  fields: [
    { type: "section", label: "당사자/프로젝트" },
    { type: "text", name: "client.name",    label: "갑(발주자)" },
    { type: "text", name: "client.address", label: "갑 주소" },
    { type: "text", name: "client.rep",     label: "갑 대표자" },

    { type: "text", name: "vendor.name",    label: "을(수행자)" },
    { type: "text", name: "vendor.address", label: "을 주소" },
    { type: "text", name: "vendor.rep",     label: "을 대표자" },

    { type: "text", name: "proj.name",  label: "프로젝트명" },
    { type: "date", name: "proj.start", label: "계약(과업) 시작일" },
    { type: "date", name: "proj.end",   label: "계약(과업) 종료일" },

    { type: "section", label: "금액/지급/검수" },
    { type: "text", name: "amount.total", label: "계약금액(원정 표기)" },
    { type: "text", name: "amount.krw",   label: "계약금액(숫자, ￦)" },

    { type: "textarea", name: "scope",        label: "과업 범위" },
    { type: "textarea", name: "deliverables", label: "산출물/검수 기준" },

    { type: "text", name: "pay.down",      label: "계약금" },
    { type: "text", name: "pay.mid",       label: "중도금" },
    { type: "text", name: "pay.finalDays", label: "잔금 지급기한(검수 후 n일)" },

    { type: "section", label: "하자/지체" },
    { type: "text", name: "warrantyMonths", label: "하자보수 기간(개월)" },
    { type: "text", name: "delayRate",      label: "지체상금률(예: 1/1000(일))" },

    { type: "section", label: "서명" },
    { type: "date", name: "signDate", label: "서명일" },
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
서명일: {{signDate}}

(갑) {{client.name}}  대표자: {{client.rep}} (서명)
{{sign.client}}

(을) {{vendor.name}}  대표자: {{vendor.rep}} (서명)
{{sign.vendor}}
  `,

  footerNote: "※ 과업 범위/검수 기준을 구체적으로 기재하세요.",
};

export default function ServiceContractPage() {
  const [formData, setFormData] = useState(serviceTemplate.defaults);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // ContractBase에서 field 변경 시 호출
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
    if (!formData.client.name || !formData.vendor.name) {
      alert("발주자와 수행자 이름은 필수입니다.");
      return;
    }
    setLoadingSubmit(true);

    try {
      const payload = {
        clientName: formData.client.name,
        clientRepresentative: formData.client.rep,
        clientAddress: formData.client.address,
        contractorName: formData.vendor.name,
        contractorRepresentative: formData.vendor.rep,
        contractorAddress: formData.vendor.address,
        projectName: formData.proj.name,
        contractStartDate: formData.proj.start || null,
        contractEndDate: formData.proj.end || null,
        contractAmount: formData.amount.krw ? Number(formData.amount.krw) : null,
        scopeOfWork: formData.scope,
        deliverablesAcceptanceCriteria: formData.deliverables,
        depositAmount: formData.pay.down ? Number(formData.pay.down) : null,
        interimPaymentAmount: formData.pay.mid ? Number(formData.pay.mid) : null,
        finalPaymentDueDays: formData.pay.finalDays ? Number(formData.pay.finalDays) : null,
        warrantyMonths: formData.warrantyMonths ? Number(formData.warrantyMonths) : null,
        delayPenaltyRate: formData.delayRate ? Number(formData.delayRate) : null,
        signatureDate: formData.signDate || null,
        writerSignature: formData.sign.client,
        receiverSignature: formData.sign.vendor
      };

      const res = await fetch("/api/new-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          "Authorization" : "Bearer " + localStorage.getItem("accessToken"),
         },
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

// fields 입력 시 formData 실시간 업데이트

  return (
    <div style={{ padding: 20 }}>
      <ContractBase
        template={serviceTemplate}
        data={serviceTemplate.defaults}
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