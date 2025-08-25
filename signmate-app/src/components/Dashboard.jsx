import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CONTRACT_TYPE_LABEL, STATUS_META, ContractStatus } from "../component/inbox/inboxUtils";

export default function Dashboard({ userId = 1, contracts: contractsProp }) {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 부모에서 contracts를 넘겨주면 그걸 사용, 없으면 fetch
  useEffect(() => {
    if (Array.isArray(contractsProp)) {
      setContracts(contractsProp);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`http://localhost:8080/contracts/user/${userId}`)
      .then((res) => res.json())
      .then((json) => {
        const items = Array.isArray(json) ? json : (json?.contracts ?? []);
        setContracts(items);
      })
      .catch((err) => {
        console.error(err);
        setContracts([]);
      })
      .finally(() => setIsLoading(false));
  }, [userId, contractsProp]);

  const { countsByStatus, countsByType } = useMemo(() => {
    const s = {};
    const t = {};
    (contracts || []).forEach((d) => {
      const st = d.status;
      const ct = d.contractType;
      s[st] = (s[st] || 0) + 1;
      t[ct] = (t[ct] || 0) + 1;
    });
    return { countsByStatus: s, countsByType: t };
  }, [contracts]);

  const chartData = useMemo(
    () =>
      Object.entries(countsByType).map(([type, count]) => ({
        name: CONTRACT_TYPE_LABEL[type] || type,
        value: count,
      })),
    [countsByType]
  );

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f472b6", "#a78bfa"];

  if (isLoading) {
    return <div className="text-center py-10 text-neutral-500">불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(ContractStatus).map((status) => {
          const meta = STATUS_META[status];
          return (
            <div key={status} className={`rounded-xl border p-4 flex flex-col items-center ${meta.className}`}>
              <meta.Icon className="w-6 h-6 mb-2" />
              <div className="font-semibold">{meta.label}</div>
              <div className="text-lg">{countsByStatus[status] || 0} 건</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">계약서 유형 분포</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
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
