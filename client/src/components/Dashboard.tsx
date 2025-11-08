import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SatisfactionStats from './SatisfactionStats';
import SatisfactionTable from './SatisfactionTable';
import AddSatisfactionForm from './AddSatisfactionForm';

interface SatisfactionEntry {
  id: number;
  customer_name: string;
  product_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface Stats {
  total?: Array<{ count: number }>;
  average?: Array<{ avg: number }>;
  byRating?: Array<{ rating: number; count: number }>;
  byProduct?: Array<{ product_name: string; avg_rating: number; count: number }>;
  recent?: SatisfactionEntry[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [data, setData] = useState<SatisfactionEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await axios.get<SatisfactionEntry[]>('/api/satisfaction');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load satisfaction data');
      setLoading(false);
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      const response = await axios.get<Stats>('/api/satisfaction/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load statistics');
    }
  };

  const handleAdd = async (newEntry: Omit<SatisfactionEntry, 'id' | 'created_at'>): Promise<void> => {
    try {
      await axios.post('/api/satisfaction', newEntry);
      fetchData();
      fetchStats();
    } catch (err) {
      setError('Failed to add satisfaction entry');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`/api/satisfaction/${id}`);
        fetchData();
        fetchStats();
      } catch (err) {
        setError('Failed to delete entry');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-5">
        <div className="text-center text-white text-2xl py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-5">
      <header className="bg-white rounded-xl p-6 mb-8 shadow-lg flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-purple-600 m-0 text-3xl font-bold">Customer Satisfaction Analysis</h1>
          {user && <p className="text-gray-600 mt-1 text-sm">Welcome, {user.username}</p>}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white border-none py-2 px-5 rounded-lg text-base font-medium hover:bg-red-700 transition-colors active:scale-95"
        >
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 py-4 px-4 rounded-lg mb-5 text-center">
            {error}
          </div>
        )}

        <SatisfactionStats stats={stats} />

        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="text-gray-800 mb-5 text-2xl border-b-2 border-purple-600 pb-2.5">
            Add New Satisfaction Entry
          </h2>
          <AddSatisfactionForm onAdd={handleAdd} />
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="text-gray-800 mb-5 text-2xl border-b-2 border-purple-600 pb-2.5">
            Customer Satisfaction Data
          </h2>
          <SatisfactionTable data={data} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

