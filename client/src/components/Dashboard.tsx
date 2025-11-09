import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FeedbackStream, FeedbackItem } from './FeedbackStream';
import { SentimentAnalysis } from './SentimentAnalysis';
import ParticleBackground from './ParticleBackground';

const Dashboard: React.FC = () => {
  const [isLive, setIsLive] = useState<boolean>(true);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleFeedbackUpdate = (items: FeedbackItem[]) => {
    setFeedbackItems(items);
  };

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 p-5">
      {/* Particle Animation Background */}
      <ParticleBackground />
      
      {/* Content */}
      <div className="relative z-10">
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
        {/* Real-Time Sentiment Analysis */}
        <div className="mb-8">
          <SentimentAnalysis feedbackItems={feedbackItems} isLive={isLive} />
        </div>

        {/* Live Feedback Stream */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 text-2xl border-b-2 border-purple-600 pb-2.5">
              Twitter Feedback Stream
            </h2>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isLive
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {isLive ? '● Live' : '○ Paused'}
            </button>
          </div>
          <FeedbackStream isLive={isLive} onFeedbackUpdate={handleFeedbackUpdate} />
        </div>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;
