// src/components/Metrics.tsx
import React from 'react';
import type { Metrics as MetricsType } from '../api/products';

export interface MetricsProps {
  metrics: MetricsType;
}

const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  const { totalStock, totalValue, avgPrice, byCategory } = metrics;

  const getStockClass = (qty: number) =>
    qty < 5 ? 'text-red-400'
    : qty <= 10 ? 'text-yellow-400'
    : 'text-green-400';

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-4 rounded shadow mb-4 overflow-x-auto transition-colors">
      <table className="min-w-full text-center divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {['Category','Total in Stock','Total Value','Avg Price'].map(h => (
              <th
                key={h}
                className="p-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          {Object.entries(byCategory).map(([cat, m]) => (
            <tr key={cat} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2 font-medium">{cat}</td>
              <td className={`p-2 font-medium ${getStockClass(m.totalStock)}`}>
                {m.totalStock}
              </td>
              <td className="p-2">${m.totalValue.toFixed(2)}</td>
              <td className="p-2">${m.avgPrice.toFixed(2)}</td>
            </tr>
          ))}
            <tr className="font-bold border-t border-gray-200 dark:border-gray-700 bg-blue-900">
            <td className="p-2">Overall</td>
            <td className={`p-2 font-medium ${getStockClass(totalStock)}`}>
              {totalStock}
            </td>
            <td className="p-2">${totalValue.toFixed(2)}</td>
            <td className="p-2">${avgPrice.toFixed(2)}</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Metrics;
