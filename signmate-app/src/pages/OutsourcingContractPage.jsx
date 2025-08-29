import React, { useCallback, useEffect, useRef, useState } from "react";
import ContractBase from "../component/contracts/ContractBase";
import { debounce } from "lodash";
import { useParams,useNavigate } from "react-router-dom";
import { getLoginUserName } from "./util";

/** 업무위탁 계약서
 *  - 좌측 입력: 당사자, 기간, 정산표, 합계, 서명일
 *  - 고정: 준거법(대한민국 법)
 *  - 서명: sign.principal(갑), sign.agent(을) → 서명패드
 */
const outsourcingTemplate = {
  name: "업무위탁 계약서",

  editable: [
    "clientName","clientRepresentative","clientAddress","clientContact",
    "contractorName","contractorRepresentative","contractorAddress","contractorContact",
    "contractStartDate","contractEndDate",
    "tasks","totalPaymentAmount","governingLaw","signatureDate"
  ],

  defaults: {
    // :"",:"",:"",:"",
    clientName:"",clientRepresentative:"",clientAddress:"",clientContact:"", // 갑
    contractorName:"",contractorRepresentative:"",contractorAddress:"",contractorContact:"", // 을
    contractStartDate: "",
    contractEndDate:   "",
    tasks: Array.from({ length: 5 }).map(() => ({})),
    totalPaymentAmount: "",
    signatureDate: "",
    governingLaw: "대한민국 법", // 고정
    sign: { discloser: null, recipient: null }
  },

  fields: [
    { type: "section", label: "당사자 정보(갑)" },
    { type: "text",  name: "clientName",    label: "갑 상호(명)" },
    { type: "text",  name: "clientAddress",     label: "갑 대표자" },
    { type: "text",  name: "clientRepresentative", label: "갑 주소" },
    { type: "text",  name: "clientContact", label: "갑 연락처" },

    { type: "section", label: "당사자 정보(을)" },
    { type: "text",  name: "contractorName",    label: "을 상호(명)" },
    { type: "text",  name: "contractorRepresentative",     label: "을 대표자" },
    { type: "text",  name: "contractorAddress", label: "을 주소" },
    { type: "text",  name: "contractorContact", label: "을 연락처" },

    { type: "section", label: "수행 기간" },
    { type: "date", name: "contractStartDate", label: "시작일" },
    { type: "date", name: "contractEndDate",   label: "종료일" },

    { type: "section", label: "대가 정산" },
    {
      type: "table",
      name: "tasks",
      label: "정산 내역",
      minRows: 5,
      columns: [
        { key: "category",  label: "구분" },
        { key: "unitPrice", label: "단가" },
        { key: "quantity",  label: "수량" },
        { key: "perUnit",   label: "1인/1건당" },
        { key: "paymentAmount",       label: "지급액" },
        { key: "taskType",  label: "업무구분" },
        { key: "remarks",      label: "비고" },
      ],
    },
    { type: "text", name: "totalPaymentAmount", label: "합계(총 지급액)" },

    { type: "section", label: "서명" },
    // { type: "date", name: "signDate", label: "서명일" },
    { type: "text", name: "governingLaw", label: "대한민국 법" },
    { type: "date", name: "signatureDate", label: "서명일" },
  ],

  body: `
업무위탁 계약서

1. 당사자
  - 위탁자(갑): {{clientName}} (대표 {{clientRepresentative}} / 주소 {{clientAddress}} / 연락처 {{clientContact}})
  - 수탁자(을): {{contractorName}} (대표 {{contractorRepresentative}} / 주소 {{contractorAddress}} / 연락처 {{contractorContact}})

2. 업무목적
  - 갑은 을에게 아래 제3조의 업무를 위탁하고, 을은 이를 성실히 수행한다.

3. 업무내용
  - 제품/서비스 운영지원, 현장 점검 및 보고, 자료 수집·분석 및 보고서 작성,
    재고/물류 관리 보조, 고객 응대 및 통지 업무, 기타 갑이 서면으로 지정하는 업무

4. 수행기간 및 대가정산
  ① 수행기간: {{contractStartDate}} 부터 {{contractEndDate}} 까지
  ② 대가 산정·지급은 ‘정산 내역’ 표를 따른다.
  ③ 합계(총 지급액): {{totalPaymentAmount}}

5. 비밀유지 및 지식재산권
  ① 을은 업무 수행 중 알게 된 일체의 비밀정보를 제3자에게 누설하지 않는다.
  ② 산출물의 저작권/소유권 귀속은 별도 특약이 없는 한 갑에게 귀속한다.

6. 보고 및 관리
  ① 을은 진행상황을 정기적으로 보고하고, 갑의 요청 시 관련 자료를 즉시 제출한다.
  ② 갑은 품질확보를 위해 검수 및 개선을 요구할 수 있다.

7. 계약의 해지
  - 일방의 중대한 위반 발생 시 상대방은 서면통지로 계약을 해지할 수 있다.

8. 기타
  - 본 계약에 정하지 아니한 사항은 민법 등 관계 법령 및 상관례를 따른다.
  - 준거법: {{governingLaw}}

[서명]
서명일: {{signatureDate}}

(갑) {{clientName}} / 대표자: {{clientRepresentative}} (서명)
{{sign.discloser}}

(을) {{contractorName}} / 대표자: {{contractorRepresentative}} (서명)
{{sign.recipient}}
  `,

  footerNote: "※ 과업명세서, 검수기준, 지연배상·하자보수 등 특약을 필요 시 추가하세요.",
};

export default function OutsourcingContractPage() {
  const [formData, setFormData] = useState(outsourcingTemplate.defaults);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { contractId } = useParams();
  const writerSigRef = useRef(null);
  const receiverSigRef = useRef(null);
  const [currentUserRole, setCurrentUserRole] = useState("sender");
  const navigate = useNavigate(); 
  
  const handleChange = useCallback((updated) => {
      debouncedSetValue(updated);
    }, []);
  
    const debouncedSetValue = useRef(
      debounce((updated) => setFormData(prev => {
        return { ...prev, ...updated };
      }), 300)
    ).current;

  // 로그인 사용자 이름 추출
  const loginUserName = getLoginUserName();
  useEffect(() => {
      if (!contractId) return;
  
      const fetchContract = async () => {
        try {
          const res = await fetch(`/api/outsourcing/${contractId}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
          });
          if (!res.ok) throw new Error("계약서 로딩 실패");
          const data = await res.json();
          console.log("📄 Contract 데이터:", data);
      console.log("👤 로그인 사용자:", loginUserName);
  
          setFormData(prev => ({
            ...prev,
            ...data,
            signatureDate:data.signatureDate,
            sign: {
              discloser: data.writerSignature || prev.sign.discloser,
              recipient: data.receiverSignature || prev.sign.recipient
            }
          }));
  
          if (loginUserName) {
            if (loginUserName === data.clientName) setCurrentUserRole("sender");
            else if (loginUserName === data.contractorName) setCurrentUserRole("receiver");
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

  const handleSave = async (force = false) => {
    if (!formData.clientName || !formData.contractorName) {
      alert("갑과 을 이름은 필수입니다.");
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = {
        contractId: formData.contractId,
        clientName: formData.clientName,
        clientRepresentative: formData.clientRepresentative,
        clientAddress: formData.clientAddress,
        clientContact: formData.clientContact,
        contractorName: formData.contractorName,
        contractorRepresentative: formData.contractorRepresentative,
        contractorAddress: formData.contractorAddress,
        contractorContact: formData.contractorContact,
        contractStartDate: formData.contractStartDate || null,
        contractEndDate: formData.contractEndDate || null,
        taskDescription: formData.taskDescription,
        totalPaymentAmount: formData.totalPaymentAmount,
         signatureDate: formData.signatureDate || null
        ?formData.signatureDate + "T00:00:00"
        : null,
        governingLaw:formData.governingLaw,
        tasks: formData.tasks.map(item => ({
          category: item.category,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          perUnit: item.perUnit,
          paymentAmount: item.paymentAmount,
          taskType: item.taskType,
          remarks: item.remarks,
        })),
        writerSignature: formData.sign.discloser,
        receiverSignature: formData.sign.recipient
      };
      const query = force ? "?force=true" : "";
     const res = await fetch("/api/outsourcing" + query, {
  method: "POST",
  headers: { "Content-Type": "application/json",
    "Authorization" : "Bearer " + localStorage.getItem("accessToken"),
   },
  body: JSON.stringify(payload)
});

// 409 체크를 최우선
if (res.status === 409) {
  const text = await res.text();
  const confirmForce = window.confirm(text + "\n계속 진행하시겠습니까?");
  if (confirmForce) {
    // 재귀 호출 시 force=true
    await handleSave(true);
  }
  return; // 여기서 바로 return해야 기존 alert("계약서 제출 완료") 안 뜸
}


      if (!res.ok) throw new Error(await res.text() || "서버 오류");
      const result = await res.json();
      alert("계약서 제출 완료!");
      console.log("서버 응답:", result);
      navigate("/");
    } catch (err) {
      alert("저장 실패: " + err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <ContractBase
        template={outsourcingTemplate}
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