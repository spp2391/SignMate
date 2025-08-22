import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getContractsByUser } from '../api/contractApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserContracts = ({ userId }) => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getContractsByUser(userId);
      setContracts(data);
    };
    fetchData();
  }, [userId]);

  // 계약 유형별 수 카운트
  const typeCounts = contracts.reduce((acc, contract) => {
    acc[contract.contractType] = (acc[contract.contractType] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: '계약서 수',
        data: Object.values(typeCounts),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>사용자 계약서 시각화</h2>
      <Bar data={data} />
    </div>
  );
};

export default UserContracts;
