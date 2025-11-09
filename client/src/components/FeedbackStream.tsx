import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MessageSquare, Smile, Meh, Frown, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import tmobileReviewsData from '../data/raw/tmobile_reviews_full.json';

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

interface ReviewData {
  name: string;
  location: string;
  text: string;
  sentiment: 'pos' | 'neu' | 'neg';
  tags: string[];
  likeCount: number;
  retweetCount: number;
  replyCount: number;
}

// Convert sentiment from JSON format to component format (fallback)
const convertSentiment = (sentiment: string): 'positive' | 'neutral' | 'negative' => {
  switch (sentiment) {
    case 'pos':
      return 'positive';
    case 'neu':
      return 'neutral';
    case 'neg':
      return 'negative';
    default:
      return 'neutral';
  }
};

// Calculate score based on sentiment and engagement out of 5
const calculateScore = (sentiment: 'positive' | 'neutral' | 'negative', review: ReviewData): number => {
  const baseScore = sentiment === 'positive' ? 4 : sentiment === 'neutral' ? 2.5 : 1;
  
  // Add engagement bonus (normalized to 0-1 points)
  const totalEngagement = review.likeCount + review.retweetCount * 2 + review.replyCount * 3;
  const engagementBonus = Math.min(1, Math.log10(totalEngagement + 1) * 0.25);
  
  return Math.min(5, Math.max(0, Math.round((baseScore + engagementBonus) * 10) / 10));
};

// Analyze sentiment using Gemini API
const analyzeSentimentWithGemini = async (text: string): Promise<'positive' | 'neutral' | 'negative'> => {
  try {
    // get the Gemini API token
    const token = localStorage.getItem('token');
    // pass your text to the 
    const response = await axios.post(
      '/api/gemini/sentiment',
      { text },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.sentiment;
  } catch (error) {
    // catch error so program doesn't crash
    console.error('Error analyzing sentiment with Gemini:', error);
    // Fallback: try to determine sentiment from text keywords
    const lowerText = text.toLowerCase();
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'good', 'awesome', 'perfect', 'best', 'happy', 'satisfied'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'disappointed', 'frustrated', 'slow', 'broken'];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
};

// Analyze category/tag using Gemini API
const analyzeCategoryWithGemini = async (text: string): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      '/api/gemini/category',
      { text },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.category;
  } catch (error) {
    console.error('Error analyzing category with Gemini:', error);
    return 'General';
  }
};

// Format category name (capitalize first letter of each word)
const formatCategory = (tags: string[]): string => {
  if (!tags || tags.length === 0) return 'General';
  return tags[0]
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Extended type for internal use
type FeedbackItemWithReview = FeedbackItem & { originalReview: ReviewData };

export function FeedbackStream({ isLive, onFeedbackUpdate }: FeedbackStreamProps) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItemWithReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [analyzingSentiments, setAnalyzingSentiments] = useState<Set<string>>(new Set());

  // Convert JSON data to FeedbackItem format (without sentiment initially)
  const rawReviews = useMemo(() => {
    const reviews = tmobileReviewsData as ReviewData[];
    return reviews.map((review, index) => ({
      id: `review-${index}`,
      user: review.name,
      message: review.text,
      sentiment: convertSentiment(review.sentiment) as 'positive' | 'neutral' | 'negative', // Temporary fallback
      category: formatCategory(review.tags),
      location: review.location,
      timestamp: new Date(Date.now() - (reviews.length - index) * 60000),
      score: 0, // Temporary score, will be updated after sentiment analysis
      originalReview: review, // Keep original review data for score calculation
    })) as FeedbackItemWithReview[];
  }, []);

  // Function to update sentiment and category for a feedback item
  const updateItemSentiment = useCallback(async (itemId: string, text: string, originalReview: ReviewData) => {
    if (analyzingSentiments.has(itemId)) return; // Already analyzing
    
    setAnalyzingSentiments(prev => new Set(prev).add(itemId));
    
    try {
      console.log(`[AI] Analyzing sentiment and category for item ${itemId}`);
      
      // Analyze both sentiment and category in parallel for better performance
      const [geminiSentiment, geminiCategory] = await Promise.all([
        analyzeSentimentWithGemini(text),
        analyzeCategoryWithGemini(text)
      ]);
      
      const newScore = calculateScore(geminiSentiment, originalReview);
      
      setFeedbackItems(prev => {
        const updated = prev.map(item => {
          if (item.id === itemId) {
            const itemWithReview = item as FeedbackItemWithReview;
            const { originalReview, ...itemWithoutReview } = itemWithReview;
            return { 
              ...itemWithoutReview, 
              sentiment: geminiSentiment, 
              category: geminiCategory,
              score: newScore 
            };
          }
          return item;
        });
        if (onFeedbackUpdate) {
          onFeedbackUpdate(updated);
        }
        // Keep originalReview in state for future updates
        return prev.map(item => {
          if (item.id === itemId) {
            const itemWithReview = item as FeedbackItemWithReview;
            return { 
              ...itemWithReview, 
              sentiment: geminiSentiment, 
              category: geminiCategory,
              score: newScore 
            };
          }
          return item;
        });
      });
    } catch (error) {
      console.error(`Error updating sentiment/category for item ${itemId}:`, error);
    } finally {
      setAnalyzingSentiments(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [analyzingSentiments, onFeedbackUpdate]);

  // TODO: Choose how much data we want to load in feedback stream upon loading
  useEffect(() => {
    const initialCount = 1;
    const shuffled = [...rawReviews].sort(() => Math.random() - 0.5);
    const initial = shuffled.slice(0, initialCount).map((item, idx) => {
      // Calculate score for initial items using fallback sentiment
      const score = item.originalReview ? calculateScore(item.sentiment, item.originalReview) : 0;
      return {
        ...item,
        score,
        timestamp: new Date(Date.now() - (initialCount - idx) * 60000), // Recent timestamps
      };
    });
    
    const sorted = initial.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setFeedbackItems(sorted);
    setCurrentIndex(initialCount);
    
    if (onFeedbackUpdate) {
      // Remove originalReview before passing to callback
      const sortedWithoutReview = sorted.map(({ originalReview, ...item }) => item);
      onFeedbackUpdate(sortedWithoutReview);
    }

    // Analyze initial items with Gemini for better accuracy (batch process)
    // Analyze first 10 items immediately, then continue with rest
    const analyzeInitialItems = async () => {
      const itemsToAnalyze = sorted.slice(0, 10); // Analyze first 10 for faster initial detection
      for (const item of itemsToAnalyze) {
        if (item.originalReview) {
          // Use updateItemSentiment from the current scope
          await updateItemSentiment(item.id, item.message, item.originalReview);
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    };
    
    // Start analyzing initial items after a short delay
    setTimeout(analyzeInitialItems, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Cycle through the reviews data
      const reviewIndex = currentIndex % rawReviews.length;
      const rawReview = rawReviews[reviewIndex];
      
      const newFeedback: FeedbackItemWithReview = {
        id: `review-${Date.now()}-${reviewIndex}`,
        user: rawReview.user,
        message: rawReview.message,
        sentiment: rawReview.sentiment, // Temporary, will be updated by sGemini
        category: rawReview.category,
        location: rawReview.location,
        timestamp: new Date(),
        score: 0, // Temporary, will be updated after sentiment analysis
        originalReview: rawReview.originalReview,
      };
      
      setCurrentIndex((prev) => (prev + 1) % rawReviews.length);
      
      setFeedbackItems((prev) => {
        const { originalReview, ...feedbackWithoutReview } = newFeedback;
        // Keep all previous items, no limit
        const updated = [feedbackWithoutReview, ...prev];
        if (onFeedbackUpdate) {
          onFeedbackUpdate(updated);
        }
        // Store with originalReview for sentiment analysis
        return [newFeedback, ...prev.map(item => {
          const itemWithReview = item as FeedbackItemWithReview;
          return itemWithReview;
        })];
      });

      // Analyze sentiment with Gemini for the new feedback
      if (rawReview.originalReview) {
        updateItemSentiment(newFeedback.id, newFeedback.message, rawReview.originalReview);
      }
    }, 3000); // TODO: Change to 2000 later

    return () => clearInterval(interval);
  }, [isLive, onFeedbackUpdate, currentIndex, rawReviews, updateItemSentiment]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-4 h-4 text-green-400" />;
      case 'neutral':
        return <Meh className="w-4 h-4 text-yellow-400" />;
      case 'negative':
        return <Frown className="w-4 h-4 text-red-400" />;
      default:
        return <Meh className="w-4 h-4 text-white-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'neutral':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'negative':
        return 'bg-red-900/30 text-red-400 border-red-700';
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
    <Card className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h3 className="text-white">Live Feedback Stream</h3>
        </div>
        <Badge variant="secondary" className="bg-white-100 text-white-700">
          {feedbackItems.length} items
        </Badge>
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto overflow-x-hidden space-y-3 pr-2 pl-1">
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
                  <span className="text-sm text-white">{item.user}</span>
                  <Badge variant="outline" className="text-xs text-white border-gray-600">
                    {item.category}
                  </Badge>
                </div>
                <span className="text-xs text-white-400">{item.score.toFixed(1)}/5</span>
              </div>
              <p className="text-sm text-white-300 mb-3">{item.message}</p>
              <div className="flex items-center gap-4 text-xs text-white-400">
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

