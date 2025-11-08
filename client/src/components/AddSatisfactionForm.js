import React, { useState } from 'react';
import './AddSatisfactionForm.css';

const AddSatisfactionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    product_name: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onAdd(formData);
    setFormData({
      customer_name: '',
      product_name: '',
      rating: 5,
      comment: ''
    });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="satisfaction-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="customer_name">Customer Name</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            placeholder="Enter customer name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_name">Product Name</label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value={1}>1 Star ⭐</option>
            <option value={2}>2 Stars ⭐⭐</option>
            <option value={3}>3 Stars ⭐⭐⭐</option>
            <option value={4}>4 Stars ⭐⭐⭐⭐</option>
            <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment (Optional)</label>
          <input
            type="text"
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Enter comment"
          />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="submit-button">
        {submitting ? 'Adding...' : 'Add Satisfaction Entry'}
      </button>
    </form>
  );
};

export default AddSatisfactionForm;

