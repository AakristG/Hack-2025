import React, { useState, FormEvent, ChangeEvent } from 'react';

interface SatisfactionFormData {
  customer_name: string;
  product_name: string;
  rating: number;
  comment: string;
}

interface AddSatisfactionFormProps {
  onAdd: (entry: SatisfactionFormData) => Promise<void>;
}

const AddSatisfactionForm: React.FC<AddSatisfactionFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState<SatisfactionFormData>({
    customer_name: '',
    product_name: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="customer_name" className="mb-2 text-gray-700 font-medium">
            Customer Name
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            placeholder="Enter customer name"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-600"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="product_name" className="mb-2 text-gray-700 font-medium">
            Product Name
          </label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="rating" className="mb-2 text-gray-700 font-medium">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-600"
          >
            <option value={1}>1 Star ⭐</option>
            <option value={2}>2 Stars ⭐⭐</option>
            <option value={3}>3 Stars ⭐⭐⭐</option>
            <option value={4}>4 Stars ⭐⭐⭐⭐</option>
            <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="comment" className="mb-2 text-gray-700 font-medium">
            Comment (Optional)
          </label>
          <input
            type="text"
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Enter comment"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-6 bg-purple-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Adding...' : 'Add Satisfaction Entry'}
      </button>
    </form>
  );
};

export default AddSatisfactionForm;

