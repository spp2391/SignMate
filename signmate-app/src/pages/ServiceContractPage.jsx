// ServiceContractPage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import ContractBase from "../component/contracts/ContractBase";
import { debounce } from "lodash";
import { getLoginUserName } from "./util";
import { useParams } from "react-router-dom";

/** 용역계약서
 *  - 좌측 입력: 당사자, 과업기간, 금액, 범위/산출물, 지급, 하자/지체, 서명일
 *  - 서명: sign.client(갑/발주자), sign.vendor(을/수행자) → 서명패드
 */
const serviceTemplate = {
  name: "용역계약서",

  editable: [
    "clientName","clientAddress","clientRepresentative",
    "contractorName","contractorAddress","contractorRepresentative",
    "projectName","contractStartDate","contractEndDate",
    "contractAmountKRW","contractAmount",
    "scopeOfWork","deliverablesAcceptanceCriteria",
    "depositAmount","interimPaymentAmount","finalPaymentDueDays",
    "warrantyMonths","delayPenaltyRate",
    "signatureDate"
  ],

  defaults: {
    // :"",:"",:"",
    clientName:"",clientAddress:"",clientRepresentative:"", // 갑
    contractorName:"",contractorAddress:"",contractorRepresentative:"", // 을
    projectName:"",contractStartDate:"",contractEndDate:"",
    contractAmountKRW:"",contractAmount:"",
    scopeOfWork: "",
    deliverablesAcceptanceCriteria: "",
    depositAmount:"",interimPaymentAmount:"",finalPaymentDueDays:"",
    warrantyMonths: "",
    delayPenaltyRate: "",
    signatureDate: "",
    sign: { client: "", vendor: "" } // 서명 이미지(dataURL)
  },

  fields: [
    { type: "section", label: "당사자/프로젝트" },
    { type: "text", name: "clientName",    label: "갑(발주자)" },
    { type: "text", name: "clientAddress", label: "갑 주소" },
    { type: "text", name: "clientRepresentative",     label: "갑 대표자" },

    { type: "text", name: "contractorName",    label: "을(수행자)" },
    { type: "text", name: "contractorAddress", label: "을 주소" },
    { type: "text", name: "contractorRepresentative",     label: "을 대표자" },

    { type: "text", name: "projectName",  label: "프로젝트명" },
    { type: "date", name: "contractStartDate", label: "계약(과업) 시작일" },
    { type: "date", name: "contractEndDate",   label: "계약(과업) 종료일" },

    { type: "section", label: "금액/지급/검수" },
    { type: "text", name: "contractAmountKRW", label: "계약금액(원정 표기)" },
    { type: "text", name: "contractAmount",   label: "계약금액(숫자, ￦)" },

    { type: "textarea", name: "scopeOfWork",        label: "과업 범위" },
    { type: "textarea", name: "deliverablesAcceptanceCriteria", label: "산출물/검수 기준" },

    { type: "text", name: "depositAmount",      label: "계약금" },
    { type: "text", name: "interimPaymentAmount",       label: "중도금" },
    { type: "text", name: "finalPaymentDueDays", label: "잔금 지급기한(검수 후 n일)" },

    { type: "section", label: "하자/지체" },
    { type: "text", name: "warrantyMonths", label: "하자보수 기간(개월)" },
    { type: "text", name: "delayPenaltyRate",      label: "지체상금률(예: 1/1000(일))" },

    { type: "section", label: "서명" },
    { type: "date", name: "signatureDate", label: "서명일" },
  ],

  body: `
용역계약서

1. 발주자(갑): {{clientName}} (대표 {{clientRepresentative}}) / 주소: {{clientAddress}}
2. 수행자(을): {{contractorName}} (대표 {{contractorRepresentative}}) / 주소: {{contractorAddress}}
3. 프로젝트명: {{projectName}}
4. 계약기간: {{contractStartDate}} ~ {{contractEndDate}}
5. 계약금액: 금 {{contractAmount}} (￦ {{contractAmountKRW}})
6. 과업 범위: {{scopeOfWork}}
7. 산출물/검수 기준: {{deliverablesAcceptanceCriteria}}

8. 대금지급
  가. 계약금: {{depositAmount}}원
  나. 중도금: {{interimPaymentAmount}}원
  다. 잔금: 검수 완료 후 {{finalPaymentDueDays}}일 이내 지급

9. 하자보수: 검수 완료일로부터 {{warrantyMonths}}개월
10. 지체상금: 계약금액의 {{delayPenaltyRate}} 적용
11. 비밀유지 및 지재권: 별첨 특약에 따름
12. 기타: 미정 사항은 민법 및 관계 법령에 따름

[서명]
서명일: {{signatureDate}}

(갑) {{clientName}}  대표자: {{clientRepresentative}} (서명)
{{sign.client}}

(을) {{contractorName}}  대표자: {{contractorRepresentative}} (서명)
{{sign.vendor}}
  `,

  footerNote: "※ 과업 범위/검수 기준을 구체적으로 기재하세요.",
};

export default function ServiceContractPage() {
  const [formData, setFormData] = useState(serviceTemplate.defaults);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { contractId } = useParams();
  const writerSigRef = useRef(null);
  const receiverSigRef = useRef(null);
  const [currentUserRole, setCurrentUserRole] = useState("sender");

  // 로그인 사용자 이름 추출
    const loginUserName = getLoginUserName();
  
    useEffect(() => {
      if (!contractId) return;
  
      const fetchContract = async () => {
        try {
          const res = await fetch(`/api/employment/${contractId}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
          });
          if (!res.ok) throw new Error("계약서 로딩 실패");
          const data = await res.json();
  
          setFormData(prev => ({
            ...prev,
            ...data,
            sign: {
              employer: data.writerSignature || prev.sign.employer,
              employee: data.receiverSignature || prev.sign.employee
            }
          }));
  
          if (loginUserName) {
            if (loginUserName === data.employerName) setCurrentUserRole("employer");
            else if (loginUserName === data.employeeName) setCurrentUserRole("employee");
            else setCurrentUserRole("none");
          }
  
          if (data.writerSignature) writerSigRef.current?.fromDataURL(data.writerSignature);
          if (data.receiverSignature) receiverSigRef.current?.fromDataURL(data.receiverSignature);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchContract();
    }, [contractId]);
  // ContractBase에서 field 변경 시 호출
  // handleChange: SecretPage처럼 debounced 처리
    const handleChange = useCallback((updated) => {
      debouncedSetValue(updated);
    }, []);
  
    const debouncedSetValue = useRef(
      debounce((updated) => setFormData(prev => {
        return { ...prev, ...updated };
      }), 300)
    ).current;

  const handleSave = async () => {
    if (!formData.clientName || !formData.contractorName) {
      alert("발주자와 수행자 이름은 필수입니다.");
      return;
    }
    setLoadingSubmit(true);

    try {
      const payload = {
        clientName: formData.clientName,
        clientRepresentative: formData.clientRepresentative,
        clientAddress: formData.clientAddress,
        contractorName: formData.contractorName,
        contractorRepresentative: formData.contractorRepresentative,
        contractorAddress: formData.contractorAddress,
        projectName: formData.projectName,
        contractStartDate: formData.contractStartDate || null,
        contractEndDate: formData.contractEndDate || null,
        contractAmount: formData.contractAmountKRW ? Number(formData.contractAmountKRW) : null,
        scopeOfWork: formData.scopeOfWork,
        deliverablesAcceptanceCriteria: formData.deliverablesAcceptanceCriteria,
        depositAmount: formData.depositAmount ? Number(formData.depositAmount) : null,
        interimPaymentAmount: formData.interimPaymentAmount ? Number(formData.interimPaymentAmount) : null,
        finalPaymentDueDays: formData.finalPaymentDueDays ? Number(formData.finalPaymentDueDays) : null,
        warrantyMonths: formData.warrantyMonths ? Number(formData.warrantyMonths) : null,
        delayPenaltyRate: formData.delayPenaltyRate ? Number(formData.delayPenaltyRate) : null,
        signatureDate: formData.signatureDate || null,
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
        role={currentUserRole}
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