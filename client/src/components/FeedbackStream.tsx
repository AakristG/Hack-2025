import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MessageSquare, Smile, Meh, Frown, MapPin, Clock } from 'lucide-react';

export interface FeedbackItem {
  id: string;
  user: string;
  message: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  location: string;
  timestamp: Date;
  score: number;
}

interface FeedbackStreamProps {
  isLive: boolean;
  onFeedbackUpdate?: (items: FeedbackItem[]) => void;
}

const feedbackTemplates = [
  { message: "5G speeds are incredible! Downloaded a movie in seconds.", sentiment: 'positive' as const, category: 'Network Speed', score: 95 },
  { message: "Customer service was very helpful with my billing question.", sentiment: 'positive' as const, category: 'Customer Service', score: 88 },
  { message: "New coverage in my area is amazing, no more dead zones!", sentiment: 'positive' as const, category: 'Coverage', score: 92 },
  { message: "App is okay but could use better navigation.", sentiment: 'neutral' as const, category: 'Mobile App', score: 65 },
  { message: "Experiencing slow data speeds during peak hours.", sentiment: 'negative' as const, category: 'Network Speed', score: 35 },
  { message: "Love the Tuesday deals and perks!", sentiment: 'positive' as const, category: 'Promotions', score: 90 },
  { message: "Hold times on support calls are too long.", sentiment: 'negative' as const, category: 'Customer Service', score: 40 },
  { message: "International roaming worked perfectly on my trip.", sentiment: 'positive' as const, category: 'Roaming', score: 93 },
  { message: "Billing statement is confusing.", sentiment: 'neutral' as const, category: 'Billing', score: 55 },
  { message: "Network outage lasted 2 hours in downtown area.", sentiment: 'negative' as const, category: 'Network Reliability', score: 25 },
  { message: "Unlimited plan is great value for my family.", sentiment: 'positive' as const, category: 'Plans', score: 87 },
  { message: "Store staff was knowledgeable and friendly.", sentiment: 'positive' as const, category: 'Retail Experience', score: 91 },
];

const locations = ['Dallas', 'Austin', 'Houston', 'San Antonio', 'Fort Worth', 'El Paso'];
const userNames = ['Sarah M.', 'John D.', 'Emily R.', 'Michael T.', 'Jessica L.', 'David K.', 'Amanda P.', 'Chris W.'];

export function FeedbackStream({ isLive, onFeedbackUpdate }: FeedbackStreamProps) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    // Generate initial feedback
    const initial: FeedbackItem[] = [];
    for (let i = 0; i < 10; i++) {
      const template = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
      initial.push({
        id: `initial-${i}`,
        user: userNames[Math.floor(Math.random() * userNames.length)],
        message: template.message,
        sentiment: template.sentiment,
        category: template.category,
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        score: template.score,
      });
    }
    const sorted = initial.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setFeedbackItems(sorted);
    if (onFeedbackUpdate) {
      onFeedbackUpdate(sorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const template = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
      const newFeedback: FeedbackItem = {
        id: Date.now().toString(),
        user: userNames[Math.floor(Math.random() * userNames.length)],
        message: template.message,
        sentiment: template.sentiment,
        category: template.category,
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: new Date(),
        score: template.score,
      };
      setFeedbackItems((prev) => {
        const updated = [newFeedback, ...prev.slice(0, 49)];
        if (onFeedbackUpdate) {
          onFeedbackUpdate(updated);
        }
        return updated;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isLive, onFeedbackUpdate]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-4 h-4 text-green-600" />;
      case 'neutral':
        return <Meh className="w-4 h-4 text-yellow-600" />;
      case 'negative':
        return <Frown className="w-4 h-4 text-red-600" />;
      default:
        return <Meh className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="bg-white p-6 h-[600px] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900">Live Feedback Stream</h3>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {feedbackItems.length} items
        </Badge>
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto space-y-3 pr-2 pl-1">
          {feedbackItems.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition-all duration-300 w-full box-border ${getSentimentColor(item.sentiment)}`}
              style={index === 0 && isLive ? { 
                boxShadow: 'inset 0 0 0 2px rgba(96, 165, 250, 0.5)',
                marginLeft: '4px',
                marginTop: '4px',
                marginRight: '4px'
              } : {}}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(item.sentiment)}
                  <span className="text-sm">{item.user}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">{item.score}/100</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{item.message}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(item.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

