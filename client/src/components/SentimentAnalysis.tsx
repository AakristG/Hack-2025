import { useEffect, useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FeedbackItem } from './FeedbackStream';

interface SentimentAnalysisProps {
  feedbackItems: FeedbackItem[];
  isLive: boolean;
}

interface SentimentStats {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  averageScore: number;
  byCategory: Record<string, { positive: number; neutral: number; negative: number; total: number }>;
  recentTrend: 'up' | 'down' | 'stable';
}

const COLORS = {
  positive: '#10b981', // green-500
  neutral: '#eab308',  // yellow-500
  negative: '#ef4444', // red-500
};

export function SentimentAnalysis({ feedbackItems, isLive }: SentimentAnalysisProps) {
  const [previousStats, setPreviousStats] = useState<SentimentStats | null>(null);

  const currentStats = useMemo<SentimentStats>(() => {
    const stats: SentimentStats = {
      positive: 0,
      neutral: 0,
      negative: 0,
      total: feedbackItems.length,
      averageScore: 0,
      byCategory: {},
      recentTrend: 'stable',
    };

    let totalScore = 0;

    feedbackItems.forEach((item) => {
      stats[item.sentiment]++;
      totalScore += item.score;

      if (!stats.byCategory[item.category]) {
        stats.byCategory[item.category] = {
          positive: 0,
          neutral: 0,
          negative: 0,
          total: 0,
        };
      }
      stats.byCategory[item.category][item.sentiment]++;
      stats.byCategory[item.category].total++;
    });

    stats.averageScore = stats.total > 0 ? Math.round(totalScore / stats.total) : 0;

    // Calculate trend
    if (previousStats) {
      const currentPositive = (stats.positive / stats.total) * 100;
      const previousPositive = (previousStats.positive / previousStats.total) * 100;
      const diff = currentPositive - previousPositive;
      
      if (diff > 2) stats.recentTrend = 'up';
      else if (diff < -2) stats.recentTrend = 'down';
      else stats.recentTrend = 'stable';
    }

    return stats;
  }, [feedbackItems, previousStats]);

  useEffect(() => {
    // Update previous stats periodically to track trends
    const interval = setInterval(() => {
      setPreviousStats({ ...currentStats });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [currentStats]);

  const positivePercentage = currentStats.total > 0 
    ? Math.round((currentStats.positive / currentStats.total) * 100) 
    : 0;
  const neutralPercentage = currentStats.total > 0 
    ? Math.round((currentStats.neutral / currentStats.total) * 100) 
    : 0;
  const negativePercentage = currentStats.total > 0 
    ? Math.round((currentStats.negative / currentStats.total) * 100) 
    : 0;

  const pieData = [
    { name: 'Positive', value: currentStats.positive, color: COLORS.positive },
    { name: 'Neutral', value: currentStats.neutral, color: COLORS.neutral },
    { name: 'Negative', value: currentStats.negative, color: COLORS.negative },
  ];

  const categoryData = Object.entries(currentStats.byCategory)
    .map(([category, stats]) => ({
      category,
      positive: stats.positive,
      neutral: stats.neutral,
      negative: stats.negative,
      total: stats.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6); // Top 6 categories

  const getTrendIcon = () => {
    switch (currentStats.recentTrend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Sentiment Overview */}
      <Card className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900 font-semibold text-lg">Overall Sentiment</h3>
          </div>
          {isLive && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Live
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600">{currentStats.positive}</div>
            <div className="text-sm text-gray-600 mt-1">Positive</div>
            <div className="text-xs text-gray-500 mt-1">{positivePercentage}%</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600">{currentStats.neutral}</div>
            <div className="text-sm text-gray-600 mt-1">Neutral</div>
            <div className="text-xs text-gray-500 mt-1">{neutralPercentage}%</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-600">{currentStats.negative}</div>
            <div className="text-sm text-gray-600 mt-1">Negative</div>
            <div className="text-xs text-gray-500 mt-1">{negativePercentage}%</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Average Score</span>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-2xl font-bold text-purple-600">{currentStats.averageScore}/100</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${currentStats.averageScore}%` }}
            />
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Sentiment by Category */}
      <Card className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900 font-semibold text-lg">Sentiment by Category</h3>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {Object.keys(currentStats.byCategory).length} categories
          </Badge>
        </div>

        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" stackId="a" fill={COLORS.positive} name="Positive" />
              <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} name="Neutral" />
              <Bar dataKey="negative" stackId="a" fill={COLORS.negative} name="Negative" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categoryData.map((item) => {
            const posPercent = item.total > 0 ? Math.round((item.positive / item.total) * 100) : 0;
            const neuPercent = item.total > 0 ? Math.round((item.neutral / item.total) * 100) : 0;
            const negPercent = item.total > 0 ? Math.round((item.negative / item.total) * 100) : 0;
            
            return (
              <div key={item.category} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{item.category}</span>
                  <span className="text-xs text-gray-500">{item.total} total</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-green-600">Positive</span>
                      <span className="text-gray-600">{posPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${posPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-yellow-600">Neutral</span>
                      <span className="text-gray-600">{neuPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full"
                        style={{ width: `${neuPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-red-600">Negative</span>
                      <span className="text-gray-600">{negPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{ width: `${negPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

