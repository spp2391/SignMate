import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// 로그인 유저 Context 등에서 signerId 받아와서 적용하세요!

const templateFields = [
  { name: "clientName", label: "발주자", type: "text", required: true },
  { name: "projectName", label: "프로젝트명", type: "text", required: true },
  { name: "contractStartDate", label: "계약 시작일", type: "date", required: true },
  { name: "totalAmount", label: "총 계약금액", type: "text", required: false },
  { name: "paymentTerms", label: "지급 조건", type: "textarea", required: false },
];

function ContractForm({ signerId /* 로그인 유저 ID */ }) {
  const { id: contractIdFromUrl } = useParams();

  const [loadingData, setLoadingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    contractId: "",
    writerName: "",
    receiverName: "",
    clientName: "",
    projectName: "",
    contractStartDate: "",
    totalAmount: "",
    paymentTerms: "",
  });

  const [signatureFile, setSignatureFile] = useState(null);

  useEffect(() => {
    if (contractIdFromUrl) {
      setLoadingData(true);
      fetch(`/api/service-contracts/${contractIdFromUrl}`)
        .then((res) => {
          if (!res.ok) throw new Error("계약서 데이터를 불러오는 데 실패했습니다.");
          return res.json();
        })
        .then((data) => {
          setFormData({
            id: data.id || contractIdFromUrl,
            contractId: data.contractId || contractIdFromUrl,
            writerName: data.writerName || "",
            receiverName: data.receiverName || "",
            clientName: data.clientName || "",
            projectName: data.projectName || "",
            contractStartDate: data.contractStartDate ? data.contractStartDate.substring(0, 10) : "",
            totalAmount: data.totalAmount || "",
            paymentTerms: data.paymentTerms || "",
          });
        })
        .catch((err) => alert(err.message))
        .finally(() => setLoadingData(false));
    } else {
      setFormData((prev) => ({ ...prev, id: "", contractId: "" }));
    }
  }, [contractIdFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSignatureFile(e.target.files[0]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSignatureUpload = async () => {
    if (!signatureFile) {
      alert("서명 파일을 선택하세요");
      return;
    }
    if (!formData.id) {
      alert("먼저 계약서를 저장해야 서명을 업로드할 수 있습니다.");
      return;
    }
    if (!signerId) {
      alert("로그인 정보가 필요합니다.");
      return;
    }

    setUploadingSignature(true);

    try {
      const base64 = await toBase64(signatureFile);
      const signatureHash = btoa(signatureFile.name + Date.now());

      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: formData.id,
          signerId,
          signatureImage: base64,
          signatureHash,
          role: "writer",  // 작성자 서명 고정
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "서명 업로드 실패");
      }

      alert("서명 업로드 성공!");
      setSignatureFile(null);
    } catch (error) {
      alert("업로드 오류: " + error.message);
    } finally {
      setUploadingSignature(false);
    }
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

    setLoadingSubmit(true);

    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `/api/service-contracts/${contractIdFromUrl}`
        : "/api/service-contracts";

      const payload = {
        contractId: contractIdFromUrl ? Number(contractIdFromUrl) : formData.contractId || formData.id,
        writerName: formData.writerName,
        receiverName: formData.receiverName,
        clientName: formData.clientName,
        projectName: formData.projectName,
        contractStartDate: formData.contractStartDate,
        totalAmount: formData.totalAmount,
        paymentTerms: formData.paymentTerms,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "서버 오류 발생");
      }

      let result;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      alert(formData.id ? "계약서가 정상 수정되었습니다!" : "계약서가 정상 제출되었습니다!");

      if (!formData.id && typeof result === "object" && result.id) {
        setFormData((prev) => ({ ...prev, id: result.id, contractId: result.contractId || result.id }));
      }
    } catch (error) {
      alert("제출 실패: " + error.message);
    } finally {
      setLoadingSubmit(false);
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

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="signatureFile" style={{ fontWeight: "bold", display: "block", marginBottom: 4 }}>
          서명 도장 파일 업로드 (작성자 전용)
        </label>
        <input
          id="signatureFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "block", margin: "8px 0" }}
        />
        <button
          type="button"
          onClick={handleSignatureUpload}
          style={{ padding: "0.5rem 1.5rem", fontSize: 16 }}
          disabled={uploadingSignature}
        >
          {uploadingSignature ? "업로드 중..." : "서명 업로드"}
        </button>
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
          style={{ padding: "0.5rem 1.5rem", fontSize: 16 }}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (formData.id ? "수정 중..." : "제출 중...") : formData.id ? "수정하기" : "제출하기"}
        </button>
      </form>
    </div>
  );
}

export default ContractForm;
