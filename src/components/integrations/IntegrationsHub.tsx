import React, { useState } from 'react';
import { Share2, Search, Link2, Settings, Plus, Trash2, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  desc: string;
  category: 'CRM' | 'Collaboration' | 'E-Commerce' | 'Developer';
  status: 'Connected' | 'Available' | 'Coming Soon';
  icon: string;
}

interface Webhook {
  id: string;
  url: string;
  event: string;
  isActive: boolean;
  created: string;
}

const IntegrationsHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'webhooks'>('directory');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* directory state */
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'slack', name: 'Slack', desc: 'Sync customer chats directly to dedicated internal channels.', category: 'Collaboration', status: 'Connected', icon: '💬' },
    { id: 'salesforce', name: 'Salesforce', desc: 'Automate lead routing and sync support cases into CRM records.', category: 'CRM', status: 'Available', icon: '💼' },
    { id: 'hubspot', name: 'HubSpot', desc: 'Bridge customer conversations into contact timelines.', category: 'CRM', status: 'Available', icon: '🎯' },
    { id: 'whatsapp', name: 'WhatsApp Business', desc: 'Direct chat channel integration for consumer support.', category: 'Collaboration', status: 'Connected', icon: '📞' },
    { id: 'shopify', name: 'Shopify', desc: 'Look up orders and process refund workflows from within live chat.', category: 'E-Commerce', status: 'Available', icon: '🛍️' },
    { id: 'stripe', name: 'Stripe', desc: 'Track card charges, subscriptions and apply retention coupons.', category: 'E-Commerce', status: 'Available', icon: '💳' },
    { id: 'teams', name: 'MS Teams', desc: 'Relay support events to employee workspace channels.', category: 'Collaboration', status: 'Coming Soon', icon: '👥' },
    { id: 'jira', name: 'Jira Service Desk', desc: 'Create engineering bug tickets directly from resolved chats.', category: 'Developer', status: 'Available', icon: '🛠️' },
    { id: 'zendesk', name: 'Zendesk', desc: 'Export ticketing histories into legacy support dashboards.', category: 'CRM', status: 'Coming Soon', icon: '📥' }
  ]);
  
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [connectingApp, setConnectingApp] = useState<Integration | null>(null);
  
  /* webhook state */
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: '1', url: 'https://api.techcorp.com/v1/indra-receiver', event: 'chat.started', isActive: true, created: '2026-05-10' },
    { id: '2', url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXX', event: 'ticket.created', isActive: true, created: '2026-05-18' },
    { id: '3', url: 'https://crm.techcorp.com/webhooks/sla', event: 'sla.breached', isActive: false, created: '2026-05-20' }
  ]);
  const [newWebhook, setNewWebhook] = useState({ url: '', event: 'chat.started' });
  const [showAddWebhook, setShowAddWebhook] = useState(false);

  /* API Key display state */
  const [showApiKey, setShowApiKey] = useState(false);
  const mockApiKey = 'indra_live_sk_4f923e2098ba4e89bc7710c920ba8a7e';

  /* Handlers */
  const handleConnectClick = (app: Integration) => {
    setConnectingApp(app);
  };

  const confirmConnection = () => {
    if (!connectingApp) return;
    setIntegrations(integrations.map(item => item.id === connectingApp.id ? { ...item, status: 'Connected' } : item));
    setConnectingApp(null);
    triggerToast(`${connectingApp.name} successfully connected!`);
  };

  const handleDisconnect = (appId: string, name: string) => {
    if (confirm(`Are you sure you want to disconnect ${name}?`)) {
      setIntegrations(integrations.map(item => item.id === appId ? { ...item, status: 'Available' } : item));
      triggerToast(`${name} disconnected.`);
    }
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhook.url) return;
    const item: Webhook = {
      id: String(Date.now()),
      url: newWebhook.url,
      event: newWebhook.event,
      isActive: true,
      created: new Date().toISOString().split('T')[0]
    };
    setWebhooks([...webhooks, item]);
    setShowAddWebhook(false);
    setNewWebhook({ url: '', event: 'chat.started' });
    triggerToast('Webhook registered successfully!');
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w));
    triggerToast('Webhook status modified.');
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    triggerToast('Webhook endpoint deleted.');
  };

  const regenerateApiKey = () => {
    if (confirm('Are you sure? Any tools referencing this key will immediately lose access.')) {
      triggerToast('A new API credential has been generated.');
    }
  };

  const filteredApps = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="animate-fadeInUp" style={{ color: 'var(--text-primary)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', 
          background: 'var(--bg-surface)', border: '1px solid var(--success)', 
          borderRadius: 'var(--radius)', padding: '12px 24px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'slideInRight 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="var(--success)" />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>Integrations & API</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Integrations Hub</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Sync external applications with your customer interactions or register custom HTTP webhooks for event listening.
          </p>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px', gap: '24px' }}>
        {[
          { id: 'directory', label: 'App Directory', icon: Share2 },
          { id: 'webhooks', label: 'Webhooks & API Keys', icon: Link2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 4px', fontSize: '0.875rem', fontWeight: 600,
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div>
        {/* DIRECTORY PANEL */}
        {activeSubTab === 'directory' && (
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  className="input-dark" 
                  placeholder="Search integrations..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  style={{ paddingLeft: '36px', height: '38px' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {['All', 'CRM', 'Collaboration', 'E-Commerce', 'Developer'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className="btn-ghost"
                    style={{
                      padding: '6px 12px', fontSize: '0.78rem',
                      background: selectedCat === cat ? 'var(--primary)' : 'transparent',
                      color: selectedCat === cat ? '#fff' : 'var(--text-secondary)',
                      borderColor: selectedCat === cat ? 'var(--primary)' : 'var(--border)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredApps.map((app) => (
                <div key={app.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '2rem' }}>{app.icon}</span>
                    <span className={`badge badge-${
                      app.status === 'Connected' 
                        ? 'success' 
                        : app.status === 'Available' 
                        ? 'info' 
                        : 'neutral'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {app.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>{app.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '20px', flex: 1 }}>{app.desc}</p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    {app.status === 'Connected' && (
                      <button 
                        className="btn-ghost" 
                        onClick={() => handleDisconnect(app.id, app.name)}
                        style={{ width: '100%', borderColor: 'rgba(239,68,68,0.2)', color: 'var(--danger)', fontSize: '0.78rem', padding: '8px' }}
                      >
                        Disconnect
                      </button>
                    )}
                    {app.status === 'Available' && (
                      <button 
                        className="btn-primary" 
                        onClick={() => handleConnectClick(app)}
                        style={{ width: '100%', fontSize: '0.78rem', padding: '8px' }}
                      >
                        Connect App
                      </button>
                    )}
                    {app.status === 'Coming Soon' && (
                      <button 
                        className="btn-ghost" 
                        disabled
                        style={{ width: '100%', opacity: 0.5, fontSize: '0.78rem', padding: '8px', cursor: 'not-allowed' }}
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEBHOOKS PANEL */}
        {activeSubTab === 'webhooks' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Webhook registry */}
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Active Webhook Endpoints</h3>
                {!showAddWebhook && (
                  <button className="btn-ghost" onClick={() => setShowAddWebhook(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.75rem' }}>
                    <Plus size={14} /> Add Webhook
                  </button>
                )}
              </div>

              {showAddWebhook ? (
                <form onSubmit={handleAddWebhook} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Endpoint URL</label>
                    <input 
                      className="input-dark" 
                      required
                      type="url"
                      placeholder="https://api.yourdomain.com/callbacks" 
                      value={newWebhook.url} 
                      onChange={e => setNewWebhook({ ...newWebhook, url: e.target.value })} 
                      style={{ padding: '8px 12px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Trigger Event</label>
                    <select 
                      className="input-dark"
                      value={newWebhook.event}
                      onChange={e => setNewWebhook({ ...newWebhook, event: e.target.value })}
                      style={{ padding: '8px 12px' }}
                    >
                      <option value="chat.started">chat.started</option>
                      <option value="chat.ended">chat.ended</option>
                      <option value="ticket.created">ticket.created</option>
                      <option value="ticket.resolved">ticket.resolved</option>
                      <option value="sla.breached">sla.breached</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.78rem' }}>Register</button>
                    <button type="button" className="btn-ghost" onClick={() => setShowAddWebhook(false)} style={{ flex: 1, padding: '8px', fontSize: '0.78rem' }}>Cancel</button>
                  </div>
                </form>
              ) : null}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {webhooks.map((webhook) => (
                  <div key={webhook.id} style={{ padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '16px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <code style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>{webhook.event}</code>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Created {webhook.created}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{webhook.url}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div 
                        className={`toggle ${webhook.isActive ? 'on' : ''}`} 
                        onClick={() => handleToggleWebhook(webhook.id)}
                        style={{ transform: 'scale(0.85)' }}
                      />
                      <button 
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="btn-ghost" 
                        style={{ border: 'none', color: 'var(--danger)', padding: '4px', background: 'transparent' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Keys */}
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>Developer API Credentials</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>Authenticate external backend API processes into IndraAssist workflows.</p>
              
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>SECRET ACCESS KEY</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showApiKey ? 'text' : 'password'} 
                      readOnly 
                      value={mockApiKey} 
                      className="input-dark" 
                      style={{ paddingRight: '40px', fontFamily: 'monospace', fontSize: '0.8rem', height: '36px' }} 
                    />
                    <button 
                      onClick={() => setShowApiKey(!showApiKey)}
                      style={{ position: 'absolute', right: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button 
                    className="btn-ghost" 
                    onClick={() => {
                      navigator.clipboard.writeText(mockApiKey);
                      triggerToast('API credential copied to clipboard.');
                    }}
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button className="btn-ghost" onClick={regenerateApiKey} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', width: '100%', justifyContent: 'center' }}>
                <RefreshCw size={12} /> Regenerate Secret Key
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OAuth Simulator Dialog */}
      {connectingApp && (
        <div className="modal-overlay">
          <div className="glass-strong animate-fadeInUp" style={{ width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '2.5rem' }}>🤖</span>
              <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', alignSelf: 'center' }}>⚡</span>
              <span style={{ fontSize: '2.5rem' }}>{connectingApp.icon}</span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>Connect {connectingApp.name} to IndraAssist</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '24px' }}>
              This will authorize <strong>IndraAssist</strong> to request the following permissions on your {connectingApp.name} workspace:
            </p>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', textAlign: 'left', marginBottom: '24px', fontSize: '0.83rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>🛡️ Read chat conversations and agent metadata</div>
              <div>💬 Post notifications to workspace channels</div>
              <div>⚙️ Register callbacks and sync support tickets</div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-primary" onClick={confirmConnection} style={{ flex: 1 }}>Authorize</button>
              <button className="btn-ghost" onClick={() => setConnectingApp(null)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsHub;
