import { useEffect, useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Zap, TrendingUp, Activity } from 'lucide-react';
import { FeedbackItem } from './FeedbackStream';
import axios from 'axios';

interface IssueDetectionProps {
  feedbackItems: FeedbackItem[];
  isLive: boolean;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedUsers: number;
  category: string;
  location?: string;
  detectedAt: Date;
  trend: 'increasing' | 'stable' | 'decreasing';
  relatedFeedback: FeedbackItem[];
}

export function IssueDetection({ feedbackItems, isLive }: IssueDetectionProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get negative feedback items
  const negativeFeedback = useMemo(() => {
    return feedbackItems.filter(item => item.sentiment === 'negative');
  }, [feedbackItems]);

  // Group negative feedback by category and location
  const groupedFeedback = useMemo(() => {
    const groups: Record<string, FeedbackItem[]> = {};
    
    negativeFeedback.forEach(item => {
      // Create a key based on category and location
      const key = `${item.category}|${item.location}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }, [negativeFeedback]);

  // Generate issue title using Gemini
  const generateIssueTitle = async (feedbackGroup: FeedbackItem[]): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      const sampleTexts = feedbackGroup.slice(0, 3).map(f => f.message).join(' | ');
      
      const response = await axios.post(
        '/api/gemini/generate',
        { 
          prompt: `Based on these customer complaints, generate a concise issue title (max 8 words):
          
${sampleTexts}

Respond with ONLY the issue title, nothing else.`
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
      console.error('Error generating issue title:', error);
      // Fallback: use category name
      return `${feedbackGroup[0].category} issue detected`;
    }
  };

  // Analyze issues from grouped feedback
  useEffect(() => {
    if (negativeFeedback.length === 0) {
      setIssues([]);
      return;
    }

    const analyzeIssues = async () => {
      setIsAnalyzing(true);
      
      try {
        const newIssues: Issue[] = [];
        
        // Process each group
        for (const [key, group] of Object.entries(groupedFeedback)) {
          // Only create issue if there are at least 2 similar complaints
          if (group.length < 2) continue;

          const [category, location] = key.split('|');
          const affectedCount = group.length;
          
          // Determine severity based on affected users
          let severity: 'low' | 'medium' | 'high' = 'low';
          if (affectedCount >= 10) severity = 'high';
          else if (affectedCount >= 5) severity = 'medium';

          // Generate issue title
          const title = await generateIssueTitle(group);
          
          // Determine trend (simplified - could be enhanced)
          const recentCount = group.filter(f => {
            const timeDiff = Date.now() - f.timestamp.getTime();
            return timeDiff < 10 * 60 * 1000; // Last 10 minutes
          }).length;
          
          const trend: 'increasing' | 'stable' | 'decreasing' = 
            recentCount >= affectedCount * 0.5 ? 'increasing' : 
            recentCount >= affectedCount * 0.2 ? 'stable' : 'decreasing';

          newIssues.push({
            id: `issue-${Date.now()}-${key}`,
            title,
            description: `${title} affecting ${location || 'multiple locations'}`,
            severity,
            affectedUsers: affectedCount,
            category,
            location,
            detectedAt: new Date(),
            trend,
            relatedFeedback: group,
          });
        }

        // Update issues, keeping ALL existing issues and adding new ones
        setIssues(prev => {
          // Keep all existing issues, but update their affected users count if they still have feedback
          const updatedIssues = prev.map(issue => {
            const currentGroup = groupedFeedback[`${issue.category}|${issue.location}`];
            if (currentGroup && currentGroup.length >= 2) {
              // Update severity if needed
              const newSeverity: 'low' | 'medium' | 'high' = currentGroup.length >= 10 ? 'high' : 
                                 currentGroup.length >= 5 ? 'medium' : 'low';
              
              return {
                ...issue,
                affectedUsers: currentGroup.length,
                severity: newSeverity,
                relatedFeedback: currentGroup, // Update related feedback
              };
            }
            // Keep the issue even if it no longer has enough feedback (it's historical)
            return issue;
          });

          // Merge with new issues, avoiding duplicates
          const mergedIssues = [...updatedIssues];
          newIssues.forEach(newIssue => {
            const exists = mergedIssues.some(issue => 
              issue.category === newIssue.category && 
              issue.location === newIssue.location &&
              // Check if it's the same issue (within 5 minutes of detection)
              Math.abs(issue.detectedAt.getTime() - newIssue.detectedAt.getTime()) < 5 * 60 * 1000
            );
            if (!exists) {
              mergedIssues.push(newIssue);
            }
          });

          // Sort by detection time (most recent first), then by affected users
          return mergedIssues.sort((a, b) => {
            // Most recent first
            if (b.detectedAt.getTime() !== a.detectedAt.getTime()) {
              return b.detectedAt.getTime() - a.detectedAt.getTime();
            }
            // Then by affected users
            return b.affectedUsers - a.affectedUsers;
          });
        });
      } catch (error) {
        console.error('Error analyzing issues:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Debounce analysis to avoid too frequent API calls
    const timeoutId = setTimeout(analyzeIssues, 2000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedFeedback, negativeFeedback.length]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <Activity className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-green-600 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Keep all issues, but mark which ones are recent
  const activeIssues = issues; // Show all issues, not just recent ones
  const recentIssues = issues.filter(issue => {
    const timeDiff = Date.now() - issue.detectedAt.getTime();
    return timeDiff < 60 * 60 * 1000; // Issues detected in last hour
  });

  return (
    <Card className="bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900 font-semibold text-lg">Issue Detection</h3>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-700">
          {recentIssues.length} active
        </Badge>
      </div>

      {isAnalyzing && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Analyzing feedback for issues...
        </div>
      )}

      {activeIssues.length === 0 && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No active issues detected</p>
          <p className="text-sm mt-1">All systems operating normally</p>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activeIssues.map((issue) => {
          const issueKey = `${issue.category}|${issue.location}`;
          const currentGroup = groupedFeedback[issueKey];
          const isActive = currentGroup && currentGroup.length >= 2;
          
          return (
            <div
              key={issue.id}
              className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)} ${
                !isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{issue.title}</h4>
                      {!isActive && (
                        <Badge variant="outline" className="bg-gray-200 text-gray-600 text-xs">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    {issue.location && (
                      <p className="text-xs text-gray-600 mt-0.5">Location: {issue.location}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                  {issue.severity}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  {issue.affectedUsers.toLocaleString()} users
                </Badge>
                {isActive && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Active
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                <span>Detected {getTimeAgo(issue.detectedAt)}</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(issue.trend)}
                  <span className="capitalize">{issue.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </Card>
  );
}

