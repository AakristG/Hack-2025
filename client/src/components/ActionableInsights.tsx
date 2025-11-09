import { useEffect, useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Lightbulb, Loader2 } from 'lucide-react';
import { FeedbackItem } from './FeedbackStream';
import axios from 'axios';

interface ActionableInsightsProps {
  feedbackItems: FeedbackItem[];
}

interface Insight {
  id: string;
  suggestion: string;
  generatedAt: Date;
}

export function ActionableInsights({ feedbackItems }: ActionableInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get negative feedback items
  const negativeFeedback = useMemo(() => {
    return feedbackItems.filter(item => item.sentiment === 'negative');
  }, [feedbackItems]);

  // Generate insights using Gemini
  useEffect(() => {
    if (negativeFeedback.length === 0) {
      setInsights([]);
      return;
    }

    // Only generate if we have at least 3 negative feedback items
    if (negativeFeedback.length < 3) {
      return;
    }

    const generateInsights = async () => {
      setIsGenerating(true);
      
      try {
        const token = localStorage.getItem('token');
        
        // Get sample negative feedback (up to 10 items)
        const sampleFeedback = negativeFeedback
          .slice(0, 10)
          .map(item => `- ${item.message} (${item.category}, ${item.location})`)
          .join('\n');

        const response = await axios.post(
          '/api/gemini/generate',
          {
            prompt: `Based on these customer complaints, generate 3-5 actionable suggestions to improve the service. 

Customer Complaints:
${sampleFeedback}

Generate ONLY the suggestions, one per line, in a clear and concise format. Each suggestion should be:
- Specific and actionable
- Based on the patterns in the complaints
- Focused on solving the problems mentioned

Format each suggestion as a simple sentence starting with a verb (e.g., "Improve...", "Reduce...", "Enhance..."). Do not include numbers, bullet points, or any other formatting - just plain text suggestions separated by newlines.`
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const suggestionsText = response.data.text.trim();
        
        // Parse suggestions (split by newlines and filter empty lines)
        const suggestions = suggestionsText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.match(/^\d+[.)]/)) // Remove numbered lists
          .map(line => line.replace(/^[-•*]\s*/, '')) // Remove bullet points
          .filter(line => line.length > 10) // Filter out very short lines
          .slice(0, 5); // Limit to 5 suggestions

        // Create insight objects
        const newInsights: Insight[] = suggestions.map((suggestion, index) => ({
          id: `insight-${Date.now()}-${index}`,
          suggestion: suggestion.trim(),
          generatedAt: new Date()
        }));

        setInsights(newInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    // Debounce to avoid too frequent API calls
    const timeoutId = setTimeout(generateInsights, 3000);
    return () => clearTimeout(timeoutId);
  }, [negativeFeedback]);

  return (
    <Card className="bg-white p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900 font-semibold text-lg">Actionable Insights</h3>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          AI Generated Suggestions
        </Badge>
      </div>

      {isGenerating && (
        <div className="text-center py-8 text-gray-500">
          <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-purple-600" />
          <p className="text-sm">Generating suggestions...</p>
        </div>
      )}

      {!isGenerating && insights.length === 0 && negativeFeedback.length >= 3 && (
        <div className="text-center py-8 text-gray-500">
          <p>No insights available yet</p>
          <p className="text-sm mt-1">Analyzing feedback...</p>
        </div>
      )}

      {!isGenerating && negativeFeedback.length < 3 && (
        <div className="text-center py-8 text-gray-500">
          <p>Need more feedback</p>
          <p className="text-sm mt-1">At least 3 negative reviews required for insights</p>
        </div>
      )}

      {!isGenerating && insights.length > 0 && (
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-0">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <p className="text-sm text-gray-800 leading-relaxed">{insight.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

