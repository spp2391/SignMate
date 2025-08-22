// Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
 // useContracts만 import
import { CONTRACT_TYPE_LABEL, STATUS_META, ContractStatus } from "../component/inbox/inboxUtils"; // 상수들은 inboxUtils에서 가져오기

export default function Dashboard() {
  // const { data, isLoading } = useContracts(); // 항상 배열로 초기화
  //  const [data, setData] = useState([]);
   const [contract, setContract]= useState([]);
   const [setDashboard]= useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect (() => {
    fetch("http://localhost:8080/contracts/user/3") // 백엔드 API 주소
      .then((res) => res.json())
      .then((json) => {
        setContract(json.contracts);
        setDashboard(json.dashboard);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [])

  // 계약 상태별 집계
  const stats = useMemo(() => {
    const countsByStatus = {};
    const countsByType = {};

    if (Array.isArray(contract)) {
      contract.forEach((d) => {
        countsByStatus[d.status] = (countsByStatus[d.status] || 0) + 1;
        countsByType[d.contractType] = (countsByType[d.contractType] || 0) + 1;
      });
    }

    return { countsByStatus, countsByType };
  }, [contract]);

  const chartData = Object.entries(stats.countsByType).map(([type, count]) => ({
    name: CONTRACT_TYPE_LABEL[type] || type,
    value: count,
  }));

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f472b6", "#a78bfa"];

  if (isLoading) {
    return <div className="text-center py-10 text-neutral-500">불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 상태 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(ContractStatus).map((status) => {
          const meta = STATUS_META[status];
          return (
            <div
              key={status}
              className={`rounded-xl border p-4 flex flex-col items-center ${meta.className}`}
            >
              <meta.Icon className="w-6 h-6 mb-2" />
              <div className="font-semibold">{meta.label}</div>
              <div className="text-lg">{stats.countsByStatus[status] || 0} 건</div>
            </div>
          );
        })}
      </div>

      {/* 계약서 유형 분포 (원형 차트) */}
      <div className="rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">계약서 유형 분포</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
