import React, { useEffect, useState } from "react";

const sampleTemplateFields = [
  { name: "clientName", label: "발주자", type: "text", required: true },
  { name: "projectName", label: "프로젝트명", type: "text", required: true },
  { name: "contractStartDate", label: "계약 시작일", type: "date", required: true },
  { name: "totalAmount", label: "총 계약금액", type: "text", required: false },
  { name: "paymentTerms", label: "지급 조건", type: "textarea", required: false },
];

function ContractForm() {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({id:1,});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFields(sampleTemplateFields);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        alert(`${field.label}은(는) 필수 입력입니다.`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch("/api/service-contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "서버 오류 발생");
      }

      alert("계약서가 정상 제출되었습니다!");
      setFormData({});
    } catch (error) {
      alert("제출 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>계약서 작성 테스트 폼</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(({ name, label, type, required }) => (
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
        <button type="submit" style={{ padding: "0.5rem 1.5rem", fontSize: 16 }} disabled={loading}>
          {loading ? "제출 중..." : "제출하기"}
        </button>
      </form>
    </div>
  );
}

export default ContractForm;
