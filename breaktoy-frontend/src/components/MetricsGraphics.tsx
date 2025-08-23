import React from 'react';
import type { Metrics as MetricsType } from '../api/products';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface MetricsGraphicsProps {
  metrics: MetricsType;
}

const MetricsGraphics: React.FC<MetricsGraphicsProps> = ({ metrics }) => {
  const { byCategory } = metrics;

  // Transform data into array suitable for recharts
  const dataStock = Object.entries(byCategory).map(([category, m]) => ({
    category,
    stock: m.totalStock,
  }));

  const dataAvgPrice = Object.entries(byCategory).map(([category, m]) => ({
    category,
    avgPrice: m.avgPrice,
  }));

  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden mb-6 p-6">
    <h3 className="text-lg font-semibold mb-4 text-center text-gray-100">
    Products In Stock by Category
    </h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={dataStock} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" tick={{ fill: '#ccc' }} />
            <YAxis tick={{ fill: '#ccc' }} />
            <Tooltip
              // fondo oscuro y sin borde
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: 4,
              }}
              // etiqueta (categoría) con texto claro
              labelStyle={{ color: '#f3f4f6', fontSize: 12 }}
              // items (valores) con texto claro
              itemStyle={{ color: '#f9fafb', fontSize: 12 }}
            />
            <Legend />
            <Bar dataKey="stock" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-semibold mb-4 mt-8 text-center text-gray-100">
      Average Price by Category
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={dataAvgPrice} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" tick={{ fill: '#ccc' }} />
            <YAxis tickFormatter={value => `$${value.toFixed(2)}`} tick={{ fill: '#ccc' }} />
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: 4,
              }}
              labelStyle={{ color: '#f3f4f6', fontSize: 12 }}
              itemStyle={{ color: '#f9fafb', fontSize: 12 }}
            />
            <Legend />
            <Bar dataKey="avgPrice" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsGraphics;
