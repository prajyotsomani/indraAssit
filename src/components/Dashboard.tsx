import React from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
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
      color: 'var(--primary-light)',
      bg: 'rgba(99,102,241,0.15)'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-0.3s',
      changeType: 'decrease',
      icon: Clock,
      color: 'var(--success)',
      bg: 'rgba(16,185,129,0.15)'
    },
    {
      title: 'Resolved Today',
      value: '148',
      change: '+23%',
      changeType: 'increase',
      icon: CheckCircle2,
      color: 'var(--info)',
      bg: 'rgba(6,182,212,0.15)'
    },
    {
      title: 'Customer Satisfaction',
      value: '94.5%',
      change: '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'var(--accent-light)',
      bg: 'rgba(139,92,246,0.15)'
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

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <span className="badge badge-success">Positive</span>;
      case 'negative': return <span className="badge badge-danger">Negative</span>;
      default: return <span className="badge badge-neutral">Neutral</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp" style={{ color: 'var(--text-primary)' }}>
      {/* Company Header */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '2.5rem' }}>{company.logo}</span>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{company.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{company.industry} · Support Command Center</p>
            </div>
          </div>
          <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
            <span className="status-dot status-online animate-pulse" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>AI Core Engine Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <span className="badge badge-success" style={{ 
                  background: stat.changeType === 'increase' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                  color: stat.changeType === 'increase' ? '#34d399' : '#818cf8',
                  border: 'none', fontSize: '0.65rem'
                }}>
                  {stat.change}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>{stat.value}</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px', fontWeight: 500 }}>{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Recent Activity */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="var(--primary-light)" /> Recent Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map((activity, index) => (
              <div key={index} style={{ padding: '12px', borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.83rem', fontWeight: 600, margin: 0 }}>{activity.action}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Customer: {activity.customer}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getSentimentBadge(activity.sentiment)}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--primary-light)" /> Language Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {languageStats.map((lang, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, marginRight: '16px' }}>
                  <span style={{ fontSize: '0.83rem', fontWeight: 600, width: '60px' }}>{lang.language}</span>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${lang.percentage}%`,
                        background: 'linear-gradient(90deg, var(--primary), var(--accent))'
                      }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700 }}>{lang.percentage}%</span>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>{lang.count} queries</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={18} color="var(--primary-light)" /> AI Performance Metrics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
          <div className="stat-card" style={{ padding: '20px', background: 'rgba(99,102,241,0.04)' }}>
            <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '6px' }}>98.7%</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 500, margin: 0 }}>Query Resolution Rate</p>
          </div>
          <div className="stat-card" style={{ padding: '20px', background: 'rgba(16,185,129,0.04)' }}>
            <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '6px' }}>2.3%</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 500, margin: 0 }}>Human Escalation Rate</p>
          </div>
          <div className="stat-card" style={{ padding: '20px', background: 'rgba(139,92,246,0.04)' }}>
            <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '6px' }}>4.8 / 5</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 500, margin: 0 }}>Average satisfaction score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;