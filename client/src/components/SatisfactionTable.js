import React from 'react';
import './SatisfactionTable.css';

const SatisfactionTable = ({ data, onDelete }) => {
  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (data.length === 0) {
    return <div className="empty-state">No satisfaction data available. Add some entries to get started!</div>;
  }

  return (
    <div className="table-container">
      <table className="satisfaction-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.customer_name}</td>
              <td>{item.product_name}</td>
              <td>
                <span className="rating-stars">{getRatingStars(item.rating)}</span>
                <span className="rating-number">({item.rating})</span>
              </td>
              <td className="comment-cell">{item.comment || '-'}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => onDelete(item.id)}
                  className="delete-button"
                  title="Delete entry"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SatisfactionTable;

