import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  total?: Array<{ count: number }>;
  average?: Array<{ avg: number }>;
  byRating?: Array<{ rating: number; count: number }>;
  byProduct?: Array<{ product_name: string; avg_rating: number; count: number }>;
  recent?: Array<{ id: number; customer_name: string; product_name: string; rating: number; comment: string | null; created_at: string }>;
}

interface SatisfactionStatsProps {
  stats: Stats | null;
}

const SatisfactionStats: React.FC<SatisfactionStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
        <div className="text-gray-600">Loading statistics...</div>
      </div>
    );
  }

  const total = stats.total?.[0]?.count || 0;
  const average = stats.average?.[0]?.avg || 0;
  const ratingDistribution = stats.byRating || [];
  const productStats = stats.byProduct || [];

  const ratingData = ratingDistribution.map(item => ({
    rating: `${item.rating} Star${item.rating > 1 ? 's' : ''}`,
    count: item.count
  }));

  const productData = productStats.map(item => ({
    name: item.product_name,
    average: parseFloat(item.avg_rating.toString()).toFixed(1),
    count: item.count
  }));

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Responses</h3>
          <p className="text-4xl font-bold text-purple-600">{total}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Rating</h3>
          <p className="text-4xl font-bold text-purple-600">
            {average ? parseFloat(average.toString()).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Rating by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>
        <div className="space-y-3">
          {productData.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <span className="font-medium text-gray-800">{product.name}</span>
              <span className="text-purple-600 font-semibold">Avg: {product.average} ⭐</span>
              <span className="text-gray-500 text-sm">({product.count} responses)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SatisfactionStats;

