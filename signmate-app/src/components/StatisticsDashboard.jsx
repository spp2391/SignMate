import React, { useEffect, useState } from 'react';
import { getCompanyStatistics } from '../api/statisticsApi';
import StatisticsCard from './StatisticsCard';

const StatisticsDashboard = ({ companyName }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getCompanyStatistics(companyName);
        console.log('API 응답:', data);  // <- 여기에 콘솔 로그 추가
        setStatistics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [companyName]);

  if (loading) return <p>Loading...</p>;
  if (!statistics) return <p>No data available</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatisticsCard title="계약 기간" value={statistics.relationshipLength} />
      <StatisticsCard title="활성 계약" value={statistics.activeContracts} />
      <StatisticsCard title="평균 계약 기간" value={statistics.averageContractDuration} />
      <StatisticsCard title="평균 제안~계약일" value={statistics.averageProposalToSignDays} />
      <StatisticsCard title="이익률" value={statistics.profitMargin} />
      <StatisticsCard title="총 비용" value={statistics.totalCost} />
      <StatisticsCard title="연간 매출 성장" value={statistics.annualRevenueGrowth} />
      <StatisticsCard title="계약 마진율" value={statistics.contractMarginRate} />
    </div>
  );
};

export default StatisticsDashboard;
