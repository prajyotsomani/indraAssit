import React, { useState } from 'react';
import { X, Bell, ShieldAlert, Award, CreditCard, Clock, Database, Trash2, Check, Settings2 } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  timestamp: string;
  type: 'assignment' | 'sla_warning' | 'billing' | 'review' | 'system';
  isRead: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearAll
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState({
    emailDigest: 'daily',
    slaSms: true,
    newTickets: true,
    weeklyReports: false
  });

  if (!isOpen) return null;

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'sla_warning':
        return { icon: ShieldAlert, color: 'var(--danger)', bg: 'rgba(239,68,68,0.12)' };
      case 'review':
        return { icon: Award, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' };
      case 'billing':
        return { icon: CreditCard, color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' };
      case 'system':
        return { icon: Database, color: 'var(--info)', bg: 'rgba(6,182,212,0.12)' };
      case 'assignment':
      default:
        return { icon: Bell, color: 'var(--primary-light)', bg: 'rgba(99,102,241,0.12)' };
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500, display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', transition: 'all 0.3s ease'
    }}>
      {/* Click outside to close */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />

      {/* Drawer Body */}
      <div className="glass-strong animate-slideRight" style={{
        position: 'relative', width: '100%', maxWidth: '400px', height: '100%',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
        zIndex: 510, borderLeft: '1px solid var(--border)'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--primary-light)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Notification Center</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setShowConfig(!showConfig)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: showConfig ? 'var(--primary-light)' : 'var(--text-secondary)' }}
              title="Notification Settings"
            >
              <Settings2 size={18} />
            </button>
            <button 
              onClick={onClose}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {showConfig ? (
          /* Preferences Panel */
          <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }} className="animate-fadeIn">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Alert Subscriptions</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <div>
                  <h5 style={{ fontWeight: 600, fontSize: '0.875rem' }}>Direct Ticket Assignments</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Notify instantly when assigned a customer chat.</p>
                </div>
                <div 
                  className={`toggle ${preferences.newTickets ? 'on' : ''}`}
                  onClick={() => setPreferences({ ...preferences, newTickets: !preferences.newTickets })}
                />
              </div>

              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <div>
                  <h5 style={{ fontWeight: 600, fontSize: '0.875rem' }}>SLA Warnings via SMS</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Send supervisor push alerts 15m before breaches.</p>
                </div>
                <div 
                  className={`toggle ${preferences.slaSms ? 'on' : ''}`}
                  onClick={() => setPreferences({ ...preferences, slaSms: !preferences.slaSms })}
                />
              </div>

              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <div>
                  <h5 style={{ fontWeight: 600, fontSize: '0.875rem' }}>Weekly Revenue Reports</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Receive full SaaS usage and billing PDF digests.</p>
                </div>
                <div 
                  className={`toggle ${preferences.weeklyReports ? 'on' : ''}`}
                  onClick={() => setPreferences({ ...preferences, weeklyReports: !preferences.weeklyReports })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, marginBottom: '6px' }}>Email Notification Frequency</label>
                <select 
                  className="input-dark" 
                  value={preferences.emailDigest} 
                  onChange={e => setPreferences({ ...preferences, emailDigest: e.target.value })}
                  style={{ padding: '8px 12px', fontSize: '0.83rem' }}
                >
                  <option value="instant">Instant individual alerts</option>
                  <option value="daily">Daily aggregated digests</option>
                  <option value="weekly">Weekly summary reports</option>
                  <option value="disabled">Do not send email updates</option>
                </select>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => {
                setShowConfig(false);
                alert('Notification preferences updated successfully.');
              }}
              style={{ width: '100%', marginTop: '32px' }}
            >
              Save Preferences
            </button>
          </div>
        ) : (
          /* Notifications List Drawer */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Quick Actions */}
            {notifications.length > 0 && (
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyItems: 'center', justifyContent: 'between', background: 'rgba(255,255,255,0.01)' }}>
                <button 
                  onClick={onMarkAllRead}
                  className="btn-ghost" 
                  style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <Check size={14} /> Mark all as read
                </button>
                <button 
                  onClick={onClearAll}
                  className="btn-ghost" 
                  style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger)', cursor: 'pointer' }}
                >
                  <Trash2 size={14} /> Clear all
                </button>
              </div>
            )}

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="space-y-3">
              {notifications.map((item) => {
                const config = getTypeStyle(item.type);
                const Icon = config.icon;

                return (
                  <div 
                    key={item.id} 
                    onClick={() => onMarkRead(item.id)}
                    style={{
                      padding: '16px', borderRadius: 'var(--radius)', 
                      border: '1px solid var(--border)', 
                      background: item.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(99,102,241,0.06)',
                      cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                      display: 'flex', gap: '12px'
                    }}
                  >
                    {!item.isRead && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '6px', height: '6px', background: 'var(--primary)',
                        borderRadius: '50%'
                      }} />
                    )}

                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: config.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0
                    }}>
                      <Icon size={16} color={config.color} />
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: item.isRead ? 600 : 700, margin: 0 }}>{item.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '3px', lineHeight: 1.4 }}>{item.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '6px' }}>
                        <Clock size={10} /> {item.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {notifications.length === 0 && (
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Bell size={28} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  You are all caught up! No new alerts.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
