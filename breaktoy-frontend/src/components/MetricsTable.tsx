// src/components/MetricsTable.tsx
import React from 'react';
import type { Metrics as MetricsType } from '../api/products';

export interface MetricsTableProps {
  metrics: MetricsType;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ metrics }) => {
  const { totalStock, totalValue, avgPrice } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Total In Stock */}
      <div className="bg-gray-700 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-sm uppercase text-gray-400">Total In Stock</p>
        <p className="text-2xl font-bold text-gray-100">{totalStock}</p>
      </div>

      {/* Total Inventory Value */}
      <div className="bg-gray-700 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-sm uppercase text-gray-400">Total Inventory Value</p>
        <p className="text-2xl font-bold text-gray-100">
          ${totalValue.toFixed(2)}
        </p>
      </div>

      {/* Average Price */}
      <div className="bg-gray-700 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-sm uppercase text-gray-400">Average Price</p>
        <p className="text-2xl font-bold text-gray-100">
          ${avgPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};


export default MetricsTable;
