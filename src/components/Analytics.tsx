import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Users, 
  Globe,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';

interface Company {
  name: string;
  industry: string;
  primaryColor: string;
  logo: string;
}

interface Props {
  company: Company;
}

const Analytics: React.FC<Props> = ({ company }) => {
  const performanceMetrics = [
    {
      title: 'Resolution Rate',
      value: '98.7%',
      trend: '+2.3%',
      trendDirection: 'up',
      description: 'Queries resolved without human intervention'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5.0',
      trend: '+0.2',
      trendDirection: 'up',
      description: 'Average rating from customer feedback'
    },
    {
      title: 'Response Time',
      value: '1.2s',
      trend: '-0.3s',
      trendDirection: 'down',
      description: 'Average time to first response'
    },
    {
      title: 'Escalation Rate',
      value: '2.3%',
      trend: '-1.1%',
      trendDirection: 'down',
      description: 'Cases requiring human intervention'
    }
  ];

  const hourlyData = [
    { hour: '00', queries: 12, resolved: 11 },
    { hour: '01', queries: 8, resolved: 8 },
    { hour: '02', queries: 5, resolved: 5 },
    { hour: '03', queries: 3, resolved: 3 },
    { hour: '04', queries: 4, resolved: 4 },
    { hour: '05', queries: 7, resolved: 7 },
    { hour: '06', queries: 15, resolved: 14 },
    { hour: '07', queries: 28, resolved: 27 },
    { hour: '08', queries: 45, resolved: 44 },
    { hour: '09', queries: 67, resolved: 66 },
    { hour: '10', queries: 78, resolved: 77 },
    { hour: '11', queries: 82, resolved: 81 },
    { hour: '12', queries: 89, resolved: 88 },
    { hour: '13', queries: 85, resolved: 84 },
    { hour: '14', queries: 91, resolved: 89 },
    { hour: '15', queries: 88, resolved: 87 },
    { hour: '16', queries: 79, resolved: 78 },
    { hour: '17', queries: 72, resolved: 71 },
    { hour: '18', queries: 58, resolved: 57 },
    { hour: '19', queries: 43, resolved: 42 },
    { hour: '20', queries: 35, resolved: 34 },
    { hour: '21', queries: 28, resolved: 27 },
    { hour: '22', queries: 22, resolved: 21 },
    { hour: '23', queries: 16, resolved: 15 }
  ];

  const topQueries = [
    { query: 'Order tracking', count: 234, percentage: 18.5 },
    { query: 'Password reset', count: 189, percentage: 14.9 },
    { query: 'Refund request', count: 156, percentage: 12.3 },
    { query: 'Account issues', count: 134, percentage: 10.6 },
    { query: 'Product information', count: 98, percentage: 7.7 }
  ];

  const sentimentTrends = [
    { date: 'Mon', positive: 78, neutral: 18, negative: 4 },
    { date: 'Tue', positive: 82, neutral: 15, negative: 3 },
    { date: 'Wed', positive: 75, neutral: 20, negative: 5 },
    { date: 'Thu', positive: 88, neutral: 10, negative: 2 },
    { date: 'Fri', positive: 85, neutral: 12, negative: 3 },
    { date: 'Sat', positive: 79, neutral: 16, negative: 5 },
    { date: 'Sun', positive: 81, neutral: 15, negative: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Performance insights for {company.name}'s AI support system</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <span className={`flex items-center text-sm font-medium ${
                metric.trendDirection === 'up' ? 'text-green-600' : 'text-blue-600'
              }`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {metric.trend}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
            </div>
            <p className="text-sm text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              24-Hour Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between space-x-1">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="flex flex-col items-center space-y-1 mb-2">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(data.queries / 100) * 200}px` }}
                    ></div>
                    <div 
                      className="w-full bg-green-500 rounded-b"
                      style={{ height: `${(data.resolved / 100) * 200}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{data.hour}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Total Queries</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Queries */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Top Query Types
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topQueries.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.query}</span>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ThumbsUp className="w-5 h-5 mr-2 text-blue-600" />
            Customer Sentiment Trends
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {sentimentTrends.map((day, index) => (
              <div key={index} className="text-center">
                <div className="h-32 flex flex-col justify-end mb-2">
                  <div 
                    className="bg-green-500 rounded-t"
                    style={{ height: `${day.positive}%` }}
                  ></div>
                  <div 
                    className="bg-yellow-500"
                    style={{ height: `${day.neutral}%` }}
                  ></div>
                  <div 
                    className="bg-red-500 rounded-b"
                    style={{ height: `${day.negative}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Neutral</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Negative</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;