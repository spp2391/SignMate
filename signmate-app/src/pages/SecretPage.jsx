// SecretPage.jsx
import { useCallback, useEffect, useRef, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import ContractBase from "../component/contracts/ContractBase";


/** 비밀유지계약서(NDA)
 *  - 좌측 입력: 당사자, 발효일/기간, 목적, 준거법
 *  - 서명: sign.discloser(공개자/갑), sign.recipient(수신자/을) → 서명패드
 */
const ndaTemplate = {
  name: "비밀유지계약서(NDA)",

  // 서명은 패드에서 처리되므로 editable에 굳이 넣지 않아도 ContractBase가 본문에서 자동 감지
  editable: [
    "writerName","discloserRepresentative","discloserAddress",
    "receiverName","receiverRepresentative","receiverAddress",
    "effectiveDate","purpose","contractDurationMonths",
    "confidentialityDurationYears","governingLaw",
     "writerSignature","receiverSignature",
  ],

  defaults: {
    writerName : "",
    discloserRepresentative :"" ,
    discloserAddress :"" ,
    receiverName :"" ,
    receiverRepresentative :"" ,
    receiverAddress :"" ,
    effectiveDate: "",
    purpose: "",
    contractDurationMonths: "",
    confidentialityDurationYears: "",
    governingLaw: "대한민국 법",
    sign: {                // 여기 변경
        discloser: null,      // 기존 writerSignature
        recipient: null       // 기존 receiverSignature
      }
  },

  fields: [
    { type: "section", label: "당사자" },
    { type: "text", name: "writerName",    label: "공개자(갑)" },
    { type: "text", name: "discloserRepresentative",     label: "갑 대표자" },
    { type: "text", name: "discloserAddress", label: "갑 주소" },

    { type: "text", name: "receiverName",    label: "수신자(을)" },
    { type: "text", name: "receiverRepresentative",     label: "을 대표자" },
    { type: "text", name: "receiverAddress", label: "을 주소" },

    { type: "section", label: "기간/목적" },
    { type: "date", name: "effectiveDate",   label: "발효일" },
    { type: "textarea", name: "purpose", label: "정보 제공 목적" },
    { type: "text", name: "contractDurationMonths",    label: "계약기간(개월)" },
    { type: "text", name: "confidentialityDurationYears", label: "비밀유지 존속기간(년)" },
    { type: "text", name: "governingLaw",           label: "준거법" },
    // { type: "text", name: "writerSignature",           label: "갑서명" },
    // { type: "text", name: "receiverSignature",           label: "을서명" }, 
  ],
  

  body: `
비밀유지계약서(NDA)

1. 당사자
  - 공개자(갑): {{writerName}} (대표 {{discloserRepresentative}} / 주소 {{discloserAddress}})
  - 수신자(을): {{receiverName}} (대표 {{receiverRepresentative}} / 주소 {{receiverAddress}})

2. 목적: {{purpose}}
3. 비밀정보의 범위: 서면·구두·전자적 형태의 모든 정보 및 그 복제물
4. 비밀유지 의무: 수신자는 목적 외 사용 금지, 제3자 제공 금지, 필요한 보호조치 이행
5. 예외: 공지 정보, 제3자로부터 적법 취득, 독자적 개발, 법령·법원·기관 요구
6. 계약기간: 발효일({{effectiveDate}})부터 {{contractDurationMonths}}개월
7. 존속기간: 계약 종료 후 {{confidentialityDurationYears}}년간 비밀유지 의무 존속
8. 자료의 반환/파기: 공개자의 요구 시 지체 없이 반환 또는 파기
9. 손해배상 및 금지명령: 위반 시 손해배상 및 가처분 등 법적 구제 가능
10. 준거법 및 관할: {{governingLaw}}

[서명]
갑: {{writerName}} (서명){{writerSignature}}
{{sign.discloser}}

을: {{receiverName}} (서명){{receiverSignature}}
{{sign.recipient}}
  `,

  footerNote: "※ 필요 시 제재 조항·계약금액 연동 조항을 추가하세요.",
};


// export default function SecretPage() {
//   return <ContractBase template={ndaTemplate} />;
// }


export default function SecretPage() {
  const { contractId } = useParams();
  const [formData, setFormData] = useState(ndaTemplate.defaults);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const writerSigRef = useRef(null);
  const receiverSigRef = useRef(null);
  const [currentUserRole, setCurrentUserRole] = useState("sender");
  const navigate = useNavigate(); 
  const handleChange = useCallback((updated) => {
    debouncedSetValue(updated);
  }, []);

  const debouncedSetValue = useRef(
    debounce((updated) => setFormData(prev => ({ ...prev, ...updated })), 300)
  ).current;

 const getLoginUserName = () => {
  try {
    const token = localStorage.getItem("accessToken"); // LoginInputArea에서 넣은 값 그대로
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
     console.log("JWT Payload 확인:", payload);
   return payload.username || payload.name || payload.sub;

  } catch (e) {
    console.error("JWT 파싱 실패", e);
    return null;
  }
};

  const loginUserName = getLoginUserName();

  useEffect(() => {
    if (!contractId) return;

    const fetchSecret = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_ABASE_URL+`/api/secret/${contractId}`, {
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
           effectiveDate: data.effectiveDate 
    ? data.effectiveDate.split("T")[0]  
    : "",
          sign: {
            discloser: data.writerSignature || prev.sign.discloser,
            recipient: data.receiverSignature || prev.sign.recipient
          }
        }));

        if (loginUserName) {
          if (loginUserName === data.writerName) setCurrentUserRole("sender");
          else if (loginUserName === data.receiverName) setCurrentUserRole("receiver");
          else setCurrentUserRole("none");
        }

        if (data.writerSignature) writerSigRef.current?.fromDataURL(data.writerSignature);
        if (data.receiverSignature) receiverSigRef.current?.fromDataURL(data.receiverSignature);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSecret();
  }, [contractId]);

  const handleSave = async () => {
    if (!formData.writerName || !formData.receiverName) {
      alert("공개자와 수신자 이름은 필수입니다.");
      return;
    }
    setLoadingSubmit(true);

    try {
      const payload = {
        contractId: contractId || null,
        discloserRepresentative: formData.discloserRepresentative,
        discloserAddress: formData.discloserAddress,
        receiverRepresentative: formData.receiverRepresentative,
        receiverAddress: formData.receiverAddress,
        writerName: formData.writerName,
        receiverName: formData.receiverName,
        purpose: formData.purpose,
        effectiveDate: formData.effectiveDate 
    ? formData.effectiveDate + "T00:00:00"
    : null,

        contractDurationMonths: formData.contractDurationMonths ? Number(formData.contractDurationMonths) : null,
        confidentialityDurationYears: formData.confidentialityDurationYears ? Number(formData.confidentialityDurationYears) : null,
        governingLaw: formData.governingLaw,
        writerSignature: formData.sign.discloser,
        receiverSignature: formData.sign.recipient,
      };

      const method = contractId ? "PUT" : "POST";
      const url = contractId ? process.env.REACT_APP_ABASE_URL+`/api/secret/${contractId}` : `/api/secret`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setFormData(prev => ({
        ...prev,
        ...data,
      effectiveDate: data.effectiveDate ? data.effectiveDate.split("T")[0] : "",
        sign: {
          discloser: data.writerSignature || prev.sign.discloser,
          recipient: data.receiverSignature || prev.sign.recipient
        }
      }));

      alert("계약서 제출 완료!");
      navigate("/");
      if (data.writerSignature) writerSigRef.current?.fromDataURL(data.writerSignature);
      if (data.receiverSignature) receiverSigRef.current?.fromDataURL(data.receiverSignature);
    } catch (err) {
      alert("저장 실패: " + err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <ContractBase template={ndaTemplate} data={formData} handleChange={handleChange} role={currentUserRole} onSubmit={handleSave} submitting={loadingSubmit}   />
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
          cursor: "pointer",
        }}
      >
        {loadingSubmit ? "제출 중..." : "제출하기"}
      </button> */}
    </div>
  );
}