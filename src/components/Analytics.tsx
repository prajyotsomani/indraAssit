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
      description: 'Resolved autonomously without human agent'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5.0',
      trend: '+0.2',
      trendDirection: 'up',
      description: 'Average score from rating forms'
    },
    {
      title: 'Response Time',
      value: '1.2s',
      trend: '-0.3s',
      trendDirection: 'down',
      description: 'Average query answering speed'
    },
    {
      title: 'Escalation Rate',
      value: '2.3%',
      trend: '-1.1%',
      trendDirection: 'down',
      description: 'Tickets transferred to staff'
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
    <div className="space-y-6 animate-fadeInUp" style={{ color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Analytics Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Performance insights and metrics for {company.name}'s support desk.</p>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{metric.title}</h3>
              <span className="badge badge-success" style={{
                background: metric.trendDirection === 'up' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                color: metric.trendDirection === 'up' ? '#34d399' : '#818cf8',
                border: 'none', fontSize: '0.65rem'
              }}>
                {metric.trend}
              </span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>{metric.value}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: 0, lineHeight: 1.4 }}>{metric.description}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Hourly Activity */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--primary-light)" /> 24-Hour Activity
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'between', height: '180px', gap: '4px', paddingBottom: '12px' }}>
            {hourlyData.map((data, index) => {
              const maxVal = 100;
              const qHeight = Math.min((data.queries / maxVal) * 120, 120);
              const rHeight = Math.min((data.resolved / maxVal) * 120, 120);

              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', gap: '1px' }}>
                    <div 
                      className="chart-bar"
                      style={{ 
                        width: '8px', 
                        height: `${qHeight}px`, 
                        background: 'var(--primary-light)',
                        boxShadow: '0 0 8px rgba(99,102,241,0.2)'
                      }}
                      title={`Queries: ${data.queries}`}
                    />
                    <div 
                      className="chart-bar"
                      style={{ 
                        width: '8px', 
                        height: `${rHeight}px`, 
                        background: 'var(--success)',
                        boxShadow: '0 0 8px rgba(16,185,129,0.2)'
                      }}
                      title={`Resolved: ${data.resolved}`}
                    />
                  </div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '6px' }}>{data.hour}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary-light)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Queries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--success)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Resolved</span>
            </div>
          </div>
        </div>

        {/* Top Queries */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary-light)" /> Top Query Categories
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            {topQueries.map((item, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{item.query}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.count} tickets ({item.percentage}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.percentage}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThumbsUp size={18} color="var(--primary-light)" /> Customer Sentiment Trends
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', height: '160px', alignItems: 'end' }}>
          {sentimentTrends.map((day, index) => {
            const posH = day.positive * 1.2;
            const neuH = day.neutral * 1.2;
            const negH = day.negative * 1.2;

            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    className="chart-bar"
                    style={{ height: `${posH}px`, background: 'var(--success)' }}
                    title={`Positive: ${day.positive}%`}
                  />
                  <div 
                    className="chart-bar"
                    style={{ height: `${neuH}px`, background: 'var(--warning)' }}
                    title={`Neutral: ${day.neutral}%`}
                  />
                  <div 
                    className="chart-bar"
                    style={{ height: `${negH}px`, background: 'var(--danger)' }}
                    title={`Negative: ${day.negative}%`}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>{day.date}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--success)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Positive</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--warning)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Neutral</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--danger)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Negative</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;