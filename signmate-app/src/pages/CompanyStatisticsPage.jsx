import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

// -----------------------
// 그래프 컴포넌트
// -----------------------
function SingleBarChart({ title, data, isPercent, isLargeNumber }) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#8dd1e1"];

  return (
    <div style={{
      background: "#fff", padding: "20px", borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", flex: 1
    }}>
      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis 
            scale={isLargeNumber ? "log" : "auto"} 
            domain={['auto', 'auto']}
            tickFormatter={val => isLargeNumber ? val.toLocaleString() : val}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (isPercent) return [value + "%", name];
              if (isLargeNumber) return [value.toLocaleString(), name];
              return [value, name];
            }}
          />
          <Legend verticalAlign="top" height={36}/>
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// -----------------------
// 통계 보여주는 컴포넌트
// -----------------------
function CompanyStatistics({ companyName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyName) return;
    setLoading(true);

    fetch(process.env.REACT_APP_ABASE_URL+`/api/statistics/${encodeURIComponent(companyName)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [companyName]);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>데이터가 없습니다.</div>;

  // -----------------------
  // 데이터 구성
  // -----------------------
  const smallNumberData = [
    { name: "활성 계약", value: stats.activeContracts || 0 },
    { name: "신규 계약", value: stats.newContracts || 0 },
    { name: "해지 계약", value: stats.cancelledContracts || 0 },
    { name: "관계 기간", value: stats.relationshipLength || 0 },
    { name: "평균 계약 기간", value: stats.averageContractDuration || 0 },
    { name: "제안~계약일 평균", value: stats.averageProposalToSignDays || 0 },
  ];

  const percentData = [
    { name: "수익률(%)", value: stats.profitMargin || 0 },
    { name: "연간 성장률(%)", value: stats.annualRevenueGrowth || 0 },
    { name: "계약 마진율(%)", value: stats.contractMarginRate || 0 },
    { name: "재계약율(%)", value: stats.renewalRate || 0 },
    { name: "고객 만족도(%)", value: stats.customerSatisfaction || 0 },
  ];

  const totalCostData = [
    { name: "총 비용(만원)", value: Math.round((stats.totalCost || 0) / 10000) },
    { name: "운영비(만원)", value: Math.round((stats.operatingCost || 0) / 10000) },
    { name: "마케팅 비용(만원)", value: Math.round((stats.marketingCost || 0) / 10000) },
    { name: "인건비(만원)", value: Math.round((stats.staffCost || 0) / 10000) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 기본 카드 통계 */}
      <div style={{
        background: "#fff", padding: "20px", borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{stats.companyName} 통계</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "20px"
        }}>
          <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px", textAlign: "center" }}>
            <p>관계 기간</p>
            <strong>{stats.relationshipLength}일</strong>
          </div>
          <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px", textAlign: "center" }}>
            <p>평균 계약 기간</p>
            <strong>{stats.averageContractDuration}일</strong>
          </div>
          <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px", textAlign: "center" }}>
            <p>제안~계약일 평균</p>
            <strong>{stats.averageProposalToSignDays}일</strong>
          </div>
        </div>
      </div>

      {/* 그래프 3개 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <SingleBarChart title="작은 수 통계" data={smallNumberData} />
        <SingleBarChart title="% 통계" data={percentData} isPercent />
        <SingleBarChart title="총 비용 통계 (만원)" data={totalCostData} isLargeNumber />
      </div>
    </div>
  );
}

// -----------------------
// 회사명 입력 + 조회 페이지
// -----------------------
export default function CompanyStatisticsPage() {
  const [companyName, setCompanyName] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyName.trim() === "") {
      alert("회사명을 입력해주세요.");
      return;
    }
    setSubmittedName(companyName.trim());
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Noto Sans KR', sans-serif", background: "#f0f2f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>회사 통계 조회</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
        <input 
          type="text" 
          value={companyName} 
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="회사명을 입력하세요" 
          style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", width: "250px" }}
        />
        <button type="submit" style={{
          padding: "10px 20px", fontSize: "16px", borderRadius: "8px", border: "none", background: "#4f46e5", color: "#fff", cursor: "pointer"
        }}>
          조회
        </button>
      </form>

      {submittedName && <CompanyStatistics companyName={submittedName} />}
    </div>
  );
}
