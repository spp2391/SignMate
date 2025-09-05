import React, { useCallback, useEffect, useRef, useState } from "react";
import ContractBase from "../component/contracts/ContractBase";
import {getLoginUserName} from "./util";
import { useParams, useNavigate } from "react-router-dom";
import { debounce } from "lodash";


/** 자재/물품 공급계약서
 *  - 좌측 입력: 당사자, 계약일/장소, 조건/조항, 품목표
 *  - 서명: sign.supplier(갑/공급자), sign.buyer(을/수요자) → 서명패드
 */
const supplyTemplate = {
  name: "자재/물품 공급계약서",

  editable: [
    "supplierName","supplierRepresentative",
    "demanderName","demanderRepresentative",
    "contractDate","deliveryLocation",
    "deliveryTerms","inspectionAndWarranty",
    "paymentTerms","qualityGuaranteeTerms",
    "otherTerms",
    "supplierSignature", "demanderSignature",
    "items"
  ],

  defaults: {
    supplierName: "", // 갑
    supplierRepresentative : "",
    demanderName: "", // 을
    demanderRepresentative: "",
    contractDate: "",
    deliveryLocation: "",
    deliveryTerms: "",
    inspectionAndWarranty: "",
    paymentTerms: "",
    qualityGuaranteeTerms: "",
    otherTerms: "",
    items: Array.from({ length: 5 }).map(() => ({})),
    sign: {                // 여기 변경
        discloser: null,      // 기존 writerSignature
        recipient: null       // 기존 receiverSignature
      }
  },

  fields: [
    { type: "section", label: "당사자" },
    { type: "text", name: "supplierName", label: "공급자(갑)" },
    { type: "text", name: "supplierRepresentative",  label: "갑 대표자" },
    { type: "text", name: "demanderName",    label: "수요자(을)" },
    { type: "text", name: "demanderRepresentative",     label: "을 대표자" },

    { type: "section", label: "계약/인도" },
    { type: "date", name: "contractDate",  label: "계약일자" },
    { type: "text", name: "deliveryLocation",         label: "인도 장소" },

    { type: "section", label: "조건/조항" },
    { type: "textarea", name: "deliveryTerms", label: "인도 조건(운반/포장 등)" },
    { type: "textarea", name: "inspectionAndWarranty",  label: "검수·하자보수 조건" },
    { type: "textarea", name: "paymentTerms",  label: "대금지급 조건" },
    { type: "textarea", name: "qualityGuaranteeTerms", label: "품질보증/교환·환불" },
    { type: "textarea", name: "otherTerms",      label: "기타 조항" },

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

공급자(갑) {{supplierName}}(대표 {{supplierRepresentative}}) 과(와) 수요자(을) {{demanderName}}(대표 {{demanderRepresentative}})은 다음 조건으로 물품 공급에 합의한다.

제1조(계약일자·장소) 계약일자는 {{contractDate}} 이며, 인도 장소는 {{deliveryLocation}} 로 한다.
제2조(품목·수량·대금) 아래 표 기재 내역을 기준으로 한다.
[품목 내역 표는 본문 하단에 표시]

제3조(인도조건) {{deliveryTerms}}
제4조(검수·하자보수) {{inspectionAndWarranty}}
제5조(대금 및 지급) {{paymentTerms}}
제6조(품질보증 등) {{qualityGuaranteeTerms}}
제7조(기타) {{otherTerms}}

[서명]
(갑) {{supplierName}} (서명){{supplierSignature}}
{{sign.discloser}}

(을) {{demanderName}} (서명){{demanderSignature}}
{{sign.recipient}}
  `,

  footerNote: "※ 납기/검수/대금 조건을 구체적으로 기재하세요.",
};

export default function SupplyContractPage() {
  const [formData, setFormData] = useState(supplyTemplate.defaults);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const loginUserName = getLoginUserName();
  const { contractId } = useParams();
  const [currentUserRole, setCurrentUserRole] = useState("sender");
  const writerSigRef = useRef(null);
  const receiverSigRef = useRef(null);
 const navigate = useNavigate(); 
  useEffect(() => {
      if (!contractId) return;
  
      const fetchSecret = async () => {
        try {
          const res = await fetch(`/api/supply/${contractId}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });
          if (!res.ok) throw new Error("계약서 로딩 실패");
          const data = await res.json();
           console.log("📄 Contract 데이터:", data);
        console.log("👤 로그인 사용자:", loginUserName);
  
          setFormData(prev => ({
            ...prev,
            ...data,
            sign: {
              discloser: data.supplierSignature || prev.sign.discloser,
              recipient: data.demanderSignature || prev.sign.recipient
            }
          }));
  
          if (loginUserName) {
            if (loginUserName === data.supplierName) setCurrentUserRole("sender");
            else if (loginUserName === data.demanderName) setCurrentUserRole("receiver");
            else setCurrentUserRole("none");
          }
  
          if (data.supplierSignature) writerSigRef.current?.fromDataURL(data.supplierSignature);
          if (data.demanderSignature) receiverSigRef.current?.fromDataURL(data.demanderSignature);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchSecret();
    }, [contractId]);

  const handleChange = useCallback((updated) => {
    debouncedSetValue(updated);
  }, []);

  const debouncedSetValue = useRef(
      debounce((updated) => setFormData(prev => ({ ...prev, ...updated })), 300)
    ).current;

  const handleSave = async () => {
    console.log(formData);
    if (!formData.supplierName || !formData.demanderName) {
      alert("공급자와 수요자 이름은 필수입니다.");
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = {
        contractId: contractId, // 추가
        supplierName: formData.supplierName,
        supplierRepresentative: formData.supplierRepresentative,
        demanderName: formData.demanderName,
        demanderRepresentative: formData.demanderRepresentative,
        contractDate: formData.contractDate || null,
        deliveryLocation: formData.deliveryLocation,
        deliveryTerms: formData.deliveryTerms,
        inspectionAndWarranty: formData.inspectionAndWarranty,
        paymentTerms: formData.paymentTerms,
        qualityGuaranteeTerms: formData.qualityGuaranteeTerms,
        otherTerms: formData.otherTerms,
        items: formData.items.map(item => ({
          itemName: item.itemName,
          specification: item.specification,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
          remarks: item.remarks
        })),
        supplierSignature: formData.sign.discloser,
        demanderSignature: formData.sign.recipient,
      };

      console.log("payload.items:", payload.items);
      const url = contractId ? `/api/supply/${contractId}` : `/api/supply`;
      const method = contractId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json",
        "Authorization" : "Bearer " + localStorage.getItem("accessToken"),
         },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text() || "서버 오류");
      const data = await res.json();

      setFormData(prev => ({
        ...prev,
        ...data,
        sign: {
          discloser: data.supplierSignature || prev.sign.discloser,
          recipient: data.demanderSignature || prev.sign.recipient
        }
      }));

      alert("계약서 제출 완료!");
      navigate("/");
      if (data.supplierSignature) writerSigRef.current?.fromDataURL(data.supplierSignature);
      if (data.demanderSignature) receiverSigRef.current?.fromDataURL(data.demanderSignature);
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
        role={currentUserRole}
        onSubmit={handleSave}
         submitting={loadingSubmit}
      />
      {/* <button
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
      </button> */}
    </div>
  );
}