import React from 'react';

const StatisticsCard = ({ title, value }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default StatisticsCard;
