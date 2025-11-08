import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SatisfactionStats from './SatisfactionStats';
import SatisfactionTable from './SatisfactionTable';
import AddSatisfactionForm from './AddSatisfactionForm';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/satisfaction');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load satisfaction data');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/satisfaction/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load statistics');
    }
  };

  const handleAdd = async (newEntry) => {
    try {
      await axios.post('/api/satisfaction', newEntry);
      fetchData();
      fetchStats();
    } catch (err) {
      setError('Failed to add satisfaction entry');
    }
  };

  const handleDelete = async (id) => {
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
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Customer Satisfaction Analysis</h1>
        </div>
      </header>

      <main className="dashboard-content">
        {error && <div className="error-banner">{error}</div>}
        
        <SatisfactionStats stats={stats} />
        
        <div className="dashboard-section">
          <h2>Add New Satisfaction Entry</h2>
          <AddSatisfactionForm onAdd={handleAdd} />
        </div>

        <div className="dashboard-section">
          <h2>Customer Satisfaction Data</h2>
          <SatisfactionTable data={data} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

