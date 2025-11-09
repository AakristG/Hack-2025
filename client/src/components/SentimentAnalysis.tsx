// All things to do with the pie chart and bar graph

import { useEffect, useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3, PieChart } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { FeedbackItem } from './FeedbackStream';

interface SentimentAnalysisProps {
  feedbackItems: FeedbackItem[];
  isLive: boolean;
  /** Which section(s) to render */
  mode?: 'overall' | 'byCategory' | 'both';
  /** Optional height class to control card heights (e.g. "h-64" or "h-[520px]") */
  height?: string;
}

interface SentimentStats {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  /** Average of item.score (0–100) */
  averageScore: number;
  byCategory: Record<string, { positive: number; neutral: number; negative: number; total: number }>;
  recentTrend: 'up' | 'down' | 'stable';
}

// Theme colors
const COLORS = {
  positive: '#10b981', // green-500
  neutral:  '#eab308', // yellow-500
  negative: '#ef4444', // red-500
};

export function SentimentAnalysis({
  feedbackItems,
  isLive,
  mode = 'both',
  height
}: SentimentAnalysisProps) {
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

    // Calculate average score out of 5 (scores are already 0-5 scale)
    stats.averageScore = stats.total > 0 ? Math.round((totalScore / stats.total) * 10) / 10 : 0;

    // Calculate trend vs previous
    if (previousStats && previousStats.total > 0 && stats.total > 0) {
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
    }, 30000); // every 30s

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
    { name: 'Neutral',  value: currentStats.neutral,  color: COLORS.neutral  },
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
    <div
      className={`grid grid-cols-1 ${mode === 'both' ? 'lg:grid-cols-2 gap-6' : 'grid-cols-1 gap-6'} ${height ?? ''}`}
    >
      {(mode === 'overall' || mode === 'both') && (
        /* Overall Sentiment Overview */
        <Card className={`p-6 ${mode !== 'both' && height ? 'h-full' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h3 className="text-white font-semibold text-lg">Overall User Satisfaction</h3>
            </div>
            {isLive && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Live
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-700">
              <div className="text-3xl font-bold text-green-600">{currentStats.positive}</div>
              <div className="text-sm text-gray-300 mt-1">Positive</div>
              <div className="text-xs text-gray-400 mt-1">{positivePercentage}%</div>
            </div>
            <div className="text-center p-4 bg-yellow-900/30 rounded-lg border border-yellow-700">
              <div className="text-3xl font-bold text-yellow-500">{currentStats.neutral}</div>
              <div className="text-sm text-gray-300 mt-1">Neutral</div>
              <div className="text-xs text-gray-400 mt-1">{neutralPercentage}%</div>
            </div>
            <div className="text-center p-4 bg-red-900/30 rounded-lg border border-red-700">
              <div className="text-3xl font-bold text-red-500">{currentStats.negative}</div>
              <div className="text-sm text-gray-300 mt-1">Negative</div>
              <div className="text-xs text-gray-400 mt-1">{negativePercentage}%</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Happiness Index Score</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-600">{currentStats.averageScore}/5</span>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStats.averageScore / 5) * 100}%` }}
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
      )}

      {(mode === 'byCategory' || mode === 'both') && (
        /* Happiness by Category */
        <Card className={`p-6 ${mode !== 'both' && height ? 'h-full' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-white font-semibold text-lg">Happiness by Category</h3>
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
                <Bar dataKey="neutral"  stackId="a" fill={COLORS.neutral}  name="Neutral" />
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
                <div key={item.category} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{item.category}</span>
                    <span className="text-xs text-white">{item.total} total</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-green-600">Positive</span>
                        <span className="text-white">{posPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${posPercent}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-yellow-600">Neutral</span>
                        <span className="text-white">{neuPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${neuPercent}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-red-600">Negative</span>
                        <span className="text-white">{negPercent}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${negPercent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
