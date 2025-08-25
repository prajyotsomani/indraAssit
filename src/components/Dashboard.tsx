import React from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Globe,
  Brain
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

const Dashboard: React.FC<Props> = ({ company }) => {
  const stats = [
    {
      title: 'Active Conversations',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-0.3s',
      changeType: 'decrease',
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Resolved Today',
      value: '148',
      change: '+23%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      title: 'Customer Satisfaction',
      value: '94.5%',
      change: '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const recentActivities = [
    { time: '2 mins ago', action: 'Resolved billing inquiry', customer: 'John Doe', sentiment: 'positive' },
    { time: '5 mins ago', action: 'Escalated technical issue', customer: 'Sarah Smith', sentiment: 'negative' },
    { time: '8 mins ago', action: 'Processed refund request', customer: 'Mike Johnson', sentiment: 'neutral' },
    { time: '12 mins ago', action: 'Provided order tracking', customer: 'Emma Wilson', sentiment: 'positive' },
    { time: '15 mins ago', action: 'Password reset assistance', customer: 'David Brown', sentiment: 'positive' }
  ];

  const languageStats = [
    { language: 'English', percentage: 68, count: 1024 },
    { language: 'Spanish', percentage: 15, count: 225 },
    { language: 'French', percentage: 8, count: 120 },
    { language: 'German', percentage: 6, count: 90 },
    { language: 'Other', percentage: 3, count: 45 }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      emerald: 'text-emerald-600 bg-emerald-50',
      purple: 'text-purple-600 bg-purple-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{company.logo}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-gray-600">{company.industry} • Support Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">AI System Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">Customer: {activity.customer}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(activity.sentiment)}`}>
                      {activity.sentiment}
                    </span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Language Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {languageStats.map((lang, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 w-16">{lang.language}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${lang.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{lang.percentage}%</span>
                    <p className="text-xs text-gray-600">{lang.count} queries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            AI Performance Metrics
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98.7%</div>
              <p className="text-sm text-gray-600">Query Resolution Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2.3%</div>
              <p className="text-sm text-gray-600">Human Escalation Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
              <p className="text-sm text-gray-600">Average Satisfaction Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;