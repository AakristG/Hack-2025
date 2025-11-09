import { useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Mail, Star } from 'lucide-react';
import { FeedbackItem } from './FeedbackStream';
import axios from 'axios';

interface CustomerAppreciationProps {
  feedbackItems: FeedbackItem[];
}

interface TopCustomer {
  user: string;
  location: string;
  positiveCount: number;
  averageScore: number;
  recentFeedback: FeedbackItem[];
  email?: string; // We'll try to extract from the data if available
}

export function CustomerAppreciation({ feedbackItems }: CustomerAppreciationProps) {
  const [generatingEmail, setGeneratingEmail] = useState<string | null>(null);

  // Get top customers with most positive feedback
  const topCustomers = useMemo(() => {
    // Filter positive feedback
    const positiveFeedback = feedbackItems.filter(item => item.sentiment === 'positive');
    
    // Group by user
    const customerMap = new Map<string, FeedbackItem[]>();
    
    positiveFeedback.forEach(item => {
      if (!customerMap.has(item.user)) {
        customerMap.set(item.user, []);
      }
      customerMap.get(item.user)!.push(item);
    });

    // Convert to array and calculate stats
    const customers: TopCustomer[] = Array.from(customerMap.entries())
      .map(([user, items]) => {
        const averageScore = items.reduce((sum, item) => sum + item.score, 0) / items.length;
        const recentFeedback = items
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 3); // Get 3 most recent
        
        return {
          user,
          location: items[0].location, // Use first item's location
          positiveCount: items.length,
          averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal place
          recentFeedback,
        };
      })
      .filter(customer => customer.positiveCount >= 2) // At least 2 positive comments
      .sort((a, b) => {
        // Sort by positive count first, then by average score
        if (b.positiveCount !== a.positiveCount) {
          return b.positiveCount - a.positiveCount;
        }
        return b.averageScore - a.averageScore;
      })
      .slice(0, 5); // Top 5 customers

    return customers;
  }, [feedbackItems]);

  // Generate thank you email using Gemini
  const generateThankYouEmail = async (customer: TopCustomer): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      const sampleFeedback = customer.recentFeedback
        .map(f => f.message)
        .slice(0, 2)
        .join(' | ');

      const response = await axios.post(
        '/api/gemini/generate',
        {
          prompt: `Write a professional and warm thank you email to a valued customer named ${customer.user} from ${customer.location}. 

The customer has left ${customer.positiveCount} positive feedback comments with an average satisfaction score of ${customer.averageScore}/5.

Sample feedback from the customer:
${sampleFeedback}

Write a brief, personalized thank you email (3-4 sentences) that:
1. Thanks them for their continued support
2. Acknowledges their positive feedback
3. Expresses appreciation for being a valued customer
4. Ends with a warm closing

Format as an email with:
Subject: [Generate a subject line]
Body: [Email body]

Keep it professional but warm and genuine.`
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.text.trim();
    } catch (error) {
      console.error('Error generating thank you email:', error);
      // Fallback email
      return `Subject: Thank You for Your Continued Support, ${customer.user}!

Dear ${customer.user},

Thank you for being such a valued customer! We truly appreciate your ${customer.positiveCount} positive feedback comments and your continued support. Your satisfaction means the world to us, and we're thrilled to have you as part of our community.

We're committed to providing you with the best service possible, and your feedback helps us continue to improve.

Thank you again for choosing us!

Best regards,
Customer Appreciation Team`;
    }
  };

  const handleEmailClick = async (customer: TopCustomer) => {
    setGeneratingEmail(customer.user);
    
    try {
      const emailContent = await generateThankYouEmail(customer);
      
      // Parse subject and body from the generated email
      const subjectMatch = emailContent.match(/Subject:\s*(.+?)(?:\n|$)/i);
      const bodyMatch = emailContent.match(/Body:\s*([\s\S]+)/i) || 
                       emailContent.match(/(?:Subject:.*\n\n?)([\s\S]+)/i) ||
                       emailContent.match(/(.+)/);
      
      const subject = subjectMatch ? subjectMatch[1].trim() : `Thank You for Your Support, ${customer.user}!`;
      const body = bodyMatch ? bodyMatch[1].trim() : emailContent;
      
      // Create mailto link
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
    } catch (error) {
      console.error('Error preparing email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setGeneratingEmail(null);
    }
  };

  return (
    <Card className="bg-white p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900 font-semibold text-lg">Customer Appreciation</h3>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          {topCustomers.length} top customers
        </Badge>
      </div>

      {topCustomers.length === 0 && (
        <div className="text-center py-8 text-gray-500 flex-shrink-0">
          <Heart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No top customers identified yet</p>
          <p className="text-sm mt-1">Positive feedback will appear here</p>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-0">
        {topCustomers.map((customer, index) => (
          <div
            key={`${customer.user}-${index}`}
            className="p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <h4 className="font-semibold text-sm text-gray-900">{customer.user}</h4>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-600">{customer.location}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  {customer.positiveCount} positive
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  {customer.averageScore.toFixed(1)}/5
                </Badge>
              </div>
            </div>

            {customer.recentFeedback.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">Recent feedback:</p>
                <p className="text-xs text-gray-700 italic line-clamp-2">
                  "{customer.recentFeedback[0].message}"
                </p>
              </div>
            )}

            <button
              onClick={() => handleEmailClick(customer)}
              disabled={generatingEmail === customer.user}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {generatingEmail === customer.user ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Thank You Email</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      
    </Card>
  );
}

