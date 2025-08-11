import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const templateFields = [
  { name: "clientName", label: "발주자", type: "text", required: true },
  { name: "projectName", label: "프로젝트명", type: "text", required: true },
  { name: "contractStartDate", label: "계약 시작일", type: "date", required: true },
  { name: "totalAmount", label: "총 계약금액", type: "text", required: false },
  { name: "paymentTerms", label: "지급 조건", type: "textarea", required: false },
];

function ContractForm() {
  const { contractId } = useParams();

  const [formData, setFormData] = useState({
    id: "",  // 수정 시 필요한 고유 ID
    writerName: "",
    receiverName: "",
    clientName: "",
    projectName: "",
    contractStartDate: "",
    totalAmount: "",
    paymentTerms: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (contractId) {
      setLoadingData(true);
      fetch(`/api/service-contracts/${contractId}`)
        .then(res => {
          if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
          return res.json();
        })
        .then(data => {
          setFormData({
            id: data.id || "",
            writerName: data.writerName || "",
            receiverName: data.receiverName || "",
            clientName: data.clientName || "",
            projectName: data.projectName || "",
            contractStartDate: data.contractStartDate ? data.contractStartDate.substring(0, 10) : "",
            totalAmount: data.totalAmount || "",
            paymentTerms: data.paymentTerms || "",
          });
        })
        .catch(err => alert(err.message))
        .finally(() => setLoadingData(false));
    }
  }, [contractId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.writerName || !formData.receiverName) {
      alert("계약자 이름과 받는 사람 이름은 필수입니다.");
      return;
    }
    for (const field of templateFields) {
      if (field.required && !formData[field.name]) {
        alert(`${field.label}은(는) 필수 입력입니다.`);
        return;
      }
    }

    setLoading(true);

    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id ? `/api/service-contracts/${formData.id}` : "/api/service-contracts";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "서버 오류 발생");
      }

      alert(formData.id ? "계약서가 정상 수정되었습니다!" : "계약서가 정상 제출되었습니다!");
      // 필요시 페이지 이동 등 처리 추가 가능
    } catch (error) {
      alert("제출 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <p>계약서 데이터를 불러오는 중...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>{formData.id ? "계약서 수정" : "계약서 작성"}</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="writerName" style={{ fontWeight: "bold" }}>
            계약자 이름 <span style={{ color: "red" }}>*</span>
          </label>
          <input
            id="writerName"
            name="writerName"
            type="text"
            value={formData.writerName}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="receiverName" style={{ fontWeight: "bold" }}>
            받는 사람 이름 <span style={{ color: "red" }}>*</span>
          </label>
          <input
            id="receiverName"
            name="receiverName"
            type="text"
            value={formData.receiverName}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {templateFields.map(({ name, label, type, required }) => (
          <div key={name} style={{ marginBottom: 16 }}>
            <label htmlFor={name} style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
              {label} {required && <span style={{ color: "red" }}>*</span>}
            </label>
            {type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                rows={4}
                style={{ width: "100%", padding: 8 }}
              />
            ) : (
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name] || ""}
                onChange={handleChange}
                style={{ width: "100%", padding: 8 }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.5rem 1.5rem", fontSize: 16 }}
        >
          {loading ? (formData.id ? "수정 중..." : "제출 중...") : (formData.id ? "수정하기" : "제출하기")}
        </button>
      </form>
    </div>
  );
}

export default ContractForm;
