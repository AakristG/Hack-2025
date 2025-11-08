import React from 'react';

interface SatisfactionEntry {
  id: number;
  customer_name: string;
  product_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface SatisfactionTableProps {
  data: SatisfactionEntry[];
  onDelete: (id: number) => void;
}

const SatisfactionTable: React.FC<SatisfactionTableProps> = ({ data, onDelete }) => {
  const getRatingStars = (rating: number): string => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        No satisfaction data available. Add some entries to get started!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <th className="px-6 py-4 text-left text-sm font-semibold border-b border-purple-700">Customer Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b border-purple-700">Product</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b border-purple-700">Rating</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b border-purple-700">Comment</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b border-purple-700">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold border-b border-purple-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
              <td className="px-6 py-4 text-gray-800">{item.customer_name}</td>
              <td className="px-6 py-4 text-gray-800">{item.product_name}</td>
              <td className="px-6 py-4">
                <span className="text-yellow-500 text-lg">{getRatingStars(item.rating)}</span>
                <span className="text-gray-600 ml-2">({item.rating})</span>
              </td>
              <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{item.comment || '-'}</td>
              <td className="px-6 py-4 text-gray-600">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800 text-xl transition-colors"
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

