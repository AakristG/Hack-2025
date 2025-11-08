import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './SatisfactionStats.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

const SatisfactionStats = ({ stats }) => {
  if (!stats) {
    return <div className="stats-container">Loading statistics...</div>;
  }

  const total = stats.total?.[0]?.count || 0;
  const average = stats.average?.[0]?.avg || 0;
  const ratingDistribution = stats.byRating || [];
  const productStats = stats.byProduct || [];

  // Format rating distribution for chart
  const ratingData = ratingDistribution.map(item => ({
    rating: `${item.rating} Star${item.rating > 1 ? 's' : ''}`,
    count: item.count
  }));

  // Format product stats for chart
  const productData = productStats.map(item => ({
    name: item.product_name,
    average: parseFloat(item.avg_rating).toFixed(1),
    count: item.count
  }));

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Responses</h3>
          <p className="stat-value">{total}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p className="stat-value">{average ? parseFloat(average).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Rating Distribution</h3>
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

        <div className="chart-card">
          <h3>Average Rating by Product</h3>
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

      <div className="product-details">
        <h3>Product Details</h3>
        <div className="product-list">
          {productData.map((product, index) => (
            <div key={index} className="product-item">
              <span className="product-name">{product.name}</span>
              <span className="product-rating">Avg: {product.average} ⭐</span>
              <span className="product-count">({product.count} responses)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SatisfactionStats;

