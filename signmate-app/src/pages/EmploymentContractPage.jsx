import { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import debounce from "lodash/debounce";
import ContractBase from "../component/contracts/ContractBase";
import { getLoginUserName } from "./util";
// 표준근로계약서 템플릿 (원본 유지)
const employmentTemplate = {
  name: "표준근로계약서(기간의 정함이 없는 경우)",
  editable: [
    "employerName","employerAddress","employerRepresentative",
    "employeeName","employeeAddress","employeeContact",
    "workStartYear","workStartMonth","workStartDay",
    "workLocation","workDescription",
    "workStartHour","workEndHour","breakHour","breakMinute",
    "workDays","weeklyHoliday",
    "wageAmount","bonus","otherAllowance",
    "wagePaymentDate","paymentMethod",
    "nationalPension","healthInsurance","employmentInsurance","industrialAccidentInsurance"
  ],
  defaults: {
    // :"", :"", :"", :"", :"", :"",
    employerName: "", employerRepresentative:"", employerAddress:"",
    employeeName:"",employeeAddress:"",employeeContact:"",
    workStartYear:"", workStartMonth:"", workStartDay:"",
    workLocation:"", workDescription:"",
    workStartHour:"", workEndHour:"", breakHour:"", breakMinute:"",
    workDays: "", weeklyHoliday: "",
    wageAmount:"", bonus:"", otherAllowance:"",
    wagePaymentDate: "", paymentMethod: "통장입금",
    nationalPension: false, healthInsurance: false, employmentInsurance: false, industrialAccidentInsurance: false,
    rates: { overtime: "통상임금의 1.5배", night: "통상임금의 1.5배", holiday: "통상임금의 1.5배" },
    probationMonths: "3",
    noticeDays: "30",
    privacy: "업무 수행 및 인사‧급여 목적 범위 내",
    rulesUrl: "(회사 내규 위치)",
    sign: { employer: null, employee: null }
  },
  fields: [
    { type: "section", label: "사업주/근로자" },
  { type: "text", name: "employerName", label: "사업주(회사명)" },
  { type: "text", name: "employerAddress", label: "사업주 주소" },
  { type: "text", name: "employerRepresentative", label: "대표자" },
  { type: "text", name: "employeeName", label: "근로자 성명" },
  { type: "text", name: "employeeAddress", label: "근로자 주소" },
  { type: "text", name: "employeeContact", label: "근로자 연락처" },

  { type: "section", label: "근로개시/근무" },
  { type: "text", name: "workStartYear", label: "근로개시(년)" },
  { type: "text", name: "workStartMonth", label: "근로개시(월)" },
  { type: "text", name: "workStartDay", label: "근로개시(일)" },
  { type: "text", name: "workLocation", label: "근무 장소" },
  { type: "textarea", name: "workDescription", label: "업무 내용" },
  { type: "text", name: "workStartHour", label: "소정근로 시작(시)" },
  { type: "text", name: "workEndHour", label: "소정근로 종료(시)" },
  { type: "text", name: "breakHour", label: "휴게(시)" },
  { type: "text", name: "breakMinute", label: "휴게(분)" },
  { type: "text", name: "workDays", label: "근무일(예: 월~금)" },
  { type: "text", name: "weeklyHoliday", label: "주휴일(예: 일)" },

  { type: "section", label: "임금/지급" },
  { type: "text", name: "wageAmount", label: "임금(월/시급)" },
  { type: "text", name: "bonus", label: "상여금(있음 시 금액/율)" },
  { type: "text", name: "otherAllowance", label: "기타수당(제수당 등)" },
  { type: "text", name: "wagePaymentDate", label: "임금지급일(매월 n일 등)" },
  { type: "select", name: "paymentMethod", label: "지급방법", options: ["직접지급","통장입금"] },

  { type: "section", label: "사회보험" },
  { type: "checkbox", name: "nationalPension", label: "국민연금" },
  { type: "checkbox", name: "healthInsurance", label: "건강보험" },
  { type: "checkbox", name: "employmentInsurance", label: "고용보험" },
  { type: "checkbox", name: "industrialAccidentInsurance", label: "산재보험" },
  ],
    body: `
(이하 "사업주") {{employerName}} 과(와) (이하 "근로자") {{employeeName}} 은 다음과 같이 근로계약을 체결한다.

1. 근로개시일: {{workStartYear}}년 {{workStartMonth}}월 {{workStartDay}}일 부터
2. 근무 장소: {{workLocation}}
3. 업무 내용: {{workDescription}}
4. 소정근로시간: {{workStartHour}}시 ~ {{workEndHour}}시 (휴게 {{breakHour}}시간 {{breakMinute}}분)
5. 근무일/휴일: 매주 {{workDays}} 근무, 주휴일 매주 {{weeklyHoliday}}요일

6. 임금
 - 기본임금(월/시간): {{wageAmount}} 원
 - 상여금: {{bonus}}
 - 기타수당(제수당 등): {{otherAllowance}}
 - 임금지급일: {{wagePaymentDate}} (지급방법: {{paymentMethod}})
 - 법정수당: 연장 {{rates.overtime}}, 야간 {{rates.night}}, 휴일 {{rates.holiday}} 적용

7. 수습
 - 수습기간: 입사일로부터 3개월. 법령이 허용하는 범위 내에서 임금 차등 지급 가능.

8. 휴가/휴일
 - 연차유급휴가 및 출‧퇴근·휴게 등은 근로기준법과 회사 취업규칙에 따른다.

9. 사회보험
 - 적용 여부: 국민연금({{nationalPension}}), 건강보험({{healthInsurance}}), 고용보험({{employmentInsurance}}), 산재보험({{industrialAccidentInsurance}}).

10. 개인정보
 - 이용 목적: 관련 법령과 회사 정책에 따라 보관·파기한다.

11. 성실의무/비밀유지
 - 근로자는 업무상 알게 된 비밀을 보호하며, 회사 자산을 선량한 관리자로서 보전한다.

12. 계약해지/징계
 - 일방은 중대한 사유 발생 시 해지할 수 있다. 해지 예고는 원칙적으로 30일 이전에 한다(법령 예외 인정).
 - 징계, 임직원 행위기준 등은 취업규칙/인사규정에 따른다. (위치: 회사 내규 위치)

13. 퇴직 및 퇴직급여
 - 근로자퇴직급여 보장법 등 관계 법령 및 회사 규정에 따른다.

14. 분쟁해결
 - 분쟁은 상호 협의하되, 불성립 시 관할 노동관서 또는 관할법원에 따른다.

15. 교부
 - 본 계약서 사본 각 1부씩 교부·보관한다.

[서명]
(사업주) {{employerName}} / 대표자: {{employerRepresentative}} (서명){{writerSignature}} / 주소: {{employerAddress}}
{{sign.employer}}

(근로자) 성명: {{employeeName}} (서명){{receiverSignature}} / 주소: {{employeeAddress}} / 연락처: {{employeeContact}}
{{sign.employee}}

  `,
  footerNote: "※ 취업규칙·인사규정과 함께 운영하면 좋습니다.",
};

export default function EmploymentContractPage() {
  const { contractId } = useParams();
  const [formData, setFormData] = useState(employmentTemplate.defaults);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const writerSigRef = useRef(null);
  const receiverSigRef = useRef(null);
  const [currentUserRole, setCurrentUserRole] = useState("sender");
  const navigate = useNavigate(); 
  // handleChange: SecretPage처럼 debounced 처리
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
        const res = await fetch(process.env.REACT_APP_ABASE_URL+`/api/employment/${contractId}`, {
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
          if (loginUserName === data.employerName) setCurrentUserRole("sender");
          else if (loginUserName === data.employeeName) setCurrentUserRole("receiver");
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

  const handleSave = async () => {
    setLoadingSubmit(true);
    try {
      const dto = {
  contractId: contractId || null,
  employerName: formData.employerName,
  employerRepresentative: formData.employerRepresentative,
  employerAddress: formData.employerAddress,
  employeeName: formData.employeeName,
  employeeAddress: formData.employeeAddress,
  employeeContact: formData.employeeContact,
  workStartYear: parseInt(formData.workStartYear) || new Date().getFullYear(),
  workStartMonth: parseInt(formData.workStartMonth) || 1,
  workStartDay: parseInt(formData.workStartDay) || 1,
  workLocation: formData.workLocation,
  workDescription: formData.workDescription,
  workStartHour: parseInt(formData.workStartHour || 0),
  workEndHour: parseInt(formData.workEndHour || 0),
  breakHour: parseInt(formData.breakHour || 0),
  breakMinute: parseInt(formData.breakMinute || 0),
  workDays: formData.workDays,
  weeklyHoliday: formData.weeklyHoliday,
  wageAmount: formData.wageAmount,
  bonus: formData.bonus,
  otherAllowance: formData.otherAllowance,
  wagePaymentDate: formData.wagePaymentDate,
  paymentMethod: formData.paymentMethod,
  nationalPension: formData.nationalPension,
  healthInsurance: formData.healthInsurance,
  employmentInsurance: formData.employmentInsurance,
  industrialAccidentInsurance: formData.industrialAccidentInsurance,
  writerSignature: formData.sign?.employer || null,
  receiverSignature: formData.sign?.employee || null,
  body: employmentTemplate.body
};

      const method = contractId ? "PUT" : "POST";
      const url = contractId ? process.env.REACT_APP_ABASE_URL+`/api/employment/${contractId}` : `/api/employment`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(dto)
      });

      if (!res.ok) throw new Error(await res.text() || "서버 오류");
      const result = await res.json();
      setFormData(prev => ({
        ...prev,
        ...result,
        sign: {
          employer: result.writerSignature || prev.sign.employer,
          employee: result.receiverSignature || prev.sign.employee
        }
      }));

      alert("계약서 제출 완료! ID = " + result.id);
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
        template={employmentTemplate}
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
        {loadingSubmit ? "제출 중..." : "계약서 저장"}
      </button> */}
    </div>
  );
}