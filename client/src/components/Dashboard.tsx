import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FeedbackStream, FeedbackItem } from './FeedbackStream';
import { SentimentAnalysis } from './SentimentAnalysis';
import { IssueDetection } from './IssueDetection';
import { CustomerAppreciation } from './CustomerAppreciation';
import { ActionableInsights } from './ActionableInsights';

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
    <div className="min-h-screen relative overflow-hidden bg-black p-5">
      {/* <ParticleBackground /> */ }
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <header 
          className="bg-black rounded-xl p-6 mb-8 shadow-lg flex justify-between items-center border border-gray-800"
          style={{
            boxShadow: '0 0 10px rgba(226, 0, 116, 0.3), 0 0 20px rgba(226, 0, 116, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
        <div className="flex-1">
          <h1 className="text-white m-0 text-3xl font-bold">Welcome to your Pulse Dashboard</h1>
          {user && <p className="font-bold text-white mt-1 text-sm">Hello, {user.username}</p>}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white border-none py-2 px-5 rounded-lg text-base font-medium hover:bg-red-700 transition-colors active:scale-95"
        >
          Logout
        </button>
        </header>

      <main>
        {/* Real-Time Sentiment Analysis and Issue Detection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SentimentAnalysis feedbackItems={feedbackItems} isLive={isLive} />
            </div>
            <div className="space-y-2">
              <IssueDetection feedbackItems={feedbackItems} isLive={isLive} />
              <CustomerAppreciation feedbackItems={feedbackItems} />
            </div>
          </div>
        </div>

        {/* Live Feedback Stream and Actionable Insights Side by Side */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Twitter Feedback Stream */}
            <div 
              className="bg-black rounded-xl p-8 shadow-lg h-[600px] flex flex-col border border-gray-800"
              style={{
                boxShadow: '0 0 10px rgba(226, 0, 116, 0.3), 0 0 30px rgba(226, 0, 116, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-white text-2xl border-b-2 border-purple-600 pb-2.5">
                  Twitter Feedback Stream
                </h2>
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLive
                      ? 'bg-[#E20074] text-white hover:bg-[#C20066]'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {isLive ? '● Live' : '○ Paused'}
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <FeedbackStream isLive={isLive} onFeedbackUpdate={handleFeedbackUpdate} />
              </div>
            </div>

            {/* Actionable Insights */}
            <div className="h-[600px]">
              <ActionableInsights feedbackItems={feedbackItems} />
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;
