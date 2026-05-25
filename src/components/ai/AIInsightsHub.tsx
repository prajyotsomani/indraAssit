import React, { useState } from 'react';
import { Brain, FileText, Send, Share2, Award, Plus, Trash2, CheckCircle2, ChevronRight, Upload, Globe, BarChart3, Database } from 'lucide-react';

interface ResponseTemplate {
  id: string;
  trigger: string;
  content: string;
  category: 'Billing' | 'Support' | 'Sales' | 'Technical';
}

interface RoutingRule {
  id: string;
  name: string;
  condition: string;
  targetRole: string;
  isActive: boolean;
}

interface DocSource {
  id: string;
  name: string;
  type: 'file' | 'url';
  status: 'Ready' | 'Processing' | 'Failed';
  words: number;
}

const AIInsightsHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'responses' | 'routing' | 'training' | 'intents'>('responses');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* 1. Canned Responses State */
  const [templates, setTemplates] = useState<ResponseTemplate[]>([
    { id: '1', trigger: 'pricing_inquiry', content: 'Our plans start at $49/mo for the Starter tier and $149/mo for the Growth tier. Annual subscriptions receive a 20% discount. Feel free to review our Pricing tab in your sidebar!', category: 'Billing' },
    { id: '2', trigger: 'refund_policy', content: 'We offer a full refund within 14 days of purchase. After 14 days, refunds are evaluated on a case-by-case basis by our billing supervisor.', category: 'Billing' },
    { id: '3', trigger: 'api_documentation', content: 'You can access our developer API documentation at api.indraassist.com/docs. API integration is available on our Growth and Enterprise tiers.', category: 'Technical' },
    { id: '4', trigger: 'voice_call_setup', content: 'To initiate an automated voice support channel, navigate to the Voice Calls tab, verify your twilio endpoint, and activate your target AI persona.', category: 'Technical' },
    { id: '5', trigger: 'sales_demo', content: 'If you want to arrange a specialized enterprise demonstration, please leave your name, phone number, and company size, and our representatives will reach out within 2 hours.', category: 'Sales' }
  ]);
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [newResponse, setNewResponse] = useState({ trigger: '', content: '', category: 'Support' as any });

  /* 2. Routing Rules State */
  const [rules, setRules] = useState<RoutingRule[]>([
    { id: '1', name: 'Billing Keywords to Supervisor', condition: 'If message contains "refund", "invoice", "charge", "stripe"', targetRole: 'Supervisor', isActive: true },
    { id: '2', name: 'Critical Severity Escalation', condition: 'If user sentiment score is under -0.6 (Highly Negative)', targetRole: 'Admin', isActive: true },
    { id: '3', name: 'Technical Support Auto-Route', condition: 'If message contains "api", "database", "sdk", "webhook"', targetRole: 'Agent', isActive: true },
    { id: '4', name: 'Basic inquiries auto-response', condition: 'If intent is identified as FAQ (e.g. office hours, address)', targetRole: 'Viewer', isActive: false }
  ]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', condition: '', targetRole: 'Agent' });

  /* 3. AI Training State */
  const [sources, setSources] = useState<DocSource[]>([
    { id: '1', name: 'Frequently_Asked_Questions.pdf', type: 'file', status: 'Ready', words: 4300 },
    { id: '2', name: 'https://docs.techcorp.com/guide', type: 'url', status: 'Ready', words: 12500 },
    { id: '3', name: 'Refund_Guidelines_Internal.docx', type: 'file', status: 'Processing', words: 1200 },
    { id: '4', name: 'https://help.techcorp.com/troubleshooting', type: 'url', status: 'Processing', words: 5600 }
  ]);
  const [isTraining, setIsTraining] = useState(false);
  const [showAddURL, setShowAddURL] = useState(false);
  const [newURL, setNewURL] = useState('');

  /* Intent Analytics Data (Simulated) */
  const intents = [
    { label: 'Billing & Invoice Inquiries', percentage: 32, count: 1240 },
    { label: 'Integration Setup (API, Webhooks)', percentage: 26, count: 1010 },
    { label: 'Account Access & Password Resets', percentage: 20, count: 780 },
    { label: 'System Configuration Questions', percentage: 14, count: 540 },
    { label: 'Spam / Out of Scope', percentage: 8, count: 310 }
  ];

  /* Handlers */
  const handleAddResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trigger || !newResponse.content) return;
    setTemplates([...templates, { id: String(Date.now()), ...newResponse }]);
    setShowAddResponse(false);
    setNewResponse({ trigger: '', content: '', category: 'Support' });
    triggerToast('New canned response added.');
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.condition) return;
    setRules([...rules, { id: String(Date.now()), ...newRule, isActive: true }]);
    setShowAddRule(false);
    setNewRule({ name: '', condition: '', targetRole: 'Agent' });
    triggerToast('New routing rule activated.');
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    triggerToast('Rule status updated.');
  };

  const handleAddWebURL = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newURL) return;
    setSources([...sources, { id: String(Date.now()), name: newURL, type: 'url', status: 'Processing', words: 0 }]);
    setShowAddURL(false);
    setNewURL('');
    triggerToast('Web URL crawling started...');
  };

  const handleUploadFile = () => {
    // Simulating file picker
    const fileName = prompt('Enter mock file name to upload:', 'Security_Whitepaper.pdf');
    if (!fileName) return;
    setSources([...sources, { id: String(Date.now()), name: fileName, type: 'file', status: 'Processing', words: 0 }]);
    triggerToast(`${fileName} is uploading & extracting...`);
  };

  const startReTraining = () => {
    setIsTraining(true);
    triggerToast('Retraining AI model on new assets...');
    setTimeout(() => {
      setSources(sources.map(s => ({ ...s, status: 'Ready', words: s.words || Math.floor(Math.random() * 4000) + 1000 })));
      setIsTraining(false);
      triggerToast('AI Persona updated with new documents!');
    }, 3000);
  };

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
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>AI Management Suite</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>AI Insights Hub</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Train your custom AI model, configure auto-routing workflows, edit canned responses, and inspect user intent analytics.
          </p>
        </div>
        {activeSubTab === 'training' && (
          <button 
            className="btn-primary glow-primary" 
            onClick={startReTraining} 
            disabled={isTraining}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isTraining ? 0.7 : 1 }}
          >
            <Brain size={16} /> {isTraining ? 'Training Model...' : 'Train Model Now'}
          </button>
        )}
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px', gap: '24px' }}>
        {[
          { id: 'responses', label: 'Canned Responses', icon: FileText },
          { id: 'routing', label: 'Auto-Routing Rules', icon: Share2 },
          { id: 'training', label: 'AI Training Center', icon: Database },
          { id: 'intents', label: 'Intent Analytics', icon: BarChart3 }
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

      {/* Content Panels */}
      <div>
        {/* TAB 1: CANNED RESPONSES */}
        {activeSubTab === 'responses' && (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Suggested Reply Templates</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>Autosuggested shortcuts to reduce human agent response times.</p>
              </div>
              <button className="btn-ghost" onClick={() => setShowAddResponse(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}>
                <Plus size={14} /> Add Template
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {templates.map((tpl) => (
                <div key={tpl.id} style={{ padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'between', alignItems: 'start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span className="badge badge-neutral" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)' }}>/{tpl.trigger}</span>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{tpl.category}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>"{tpl.content}"</p>
                  </div>
                  <button 
                    className="btn-ghost" 
                    onClick={() => {
                      setTemplates(templates.filter(t => t.id !== tpl.id));
                      triggerToast('Canned response deleted.');
                    }}
                    style={{ border: 'none', color: 'var(--danger)', padding: '4px', background: 'transparent' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ROUTING RULES */}
        {activeSubTab === 'routing' && (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Intelligent Routing Rules</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>Define conditions to direct live tickets to appropriate team roles automatically.</p>
              </div>
              <button className="btn-ghost" onClick={() => setShowAddRule(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}>
                <Plus size={14} /> Add Rule
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {rules.map((rule) => (
                <div key={rule.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{rule.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Condition:</span>
                      <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--primary-light)' }}>{rule.condition}</code>
                      <ChevronRight size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Assigns to:</span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{rule.targetRole}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div 
                      className={`toggle ${rule.isActive ? 'on' : ''}`} 
                      onClick={() => handleToggleRule(rule.id)}
                    />
                    <button 
                      className="btn-ghost" 
                      onClick={() => {
                        setRules(rules.filter(r => r.id !== rule.id));
                        triggerToast('Routing rule deleted.');
                      }}
                      style={{ border: 'none', color: 'var(--danger)', padding: '4px', background: 'transparent' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TRAINING CENTER */}
        {activeSubTab === 'training' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Knowledge Sources</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>Upload internal company literature or document sites to customize responses.</p>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button className="btn-primary" onClick={handleUploadFile} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px' }}>
                  <Upload size={14} /> Upload Doc
                </button>
                <button className="btn-ghost" onClick={() => setShowAddURL(true)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px' }}>
                  <Globe size={14} /> Crawl URL
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sources.map((src) => (
                  <div key={src.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '12px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.83rem', textOverflow: 'ellipsis', overflow: 'hidden' }}>{src.name}</div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {src.type === 'file' ? 'Document Upload' : 'Web URL'} · {src.words > 0 ? `${src.words.toLocaleString()} words` : 'Calculating...'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge badge-${src.status === 'Ready' ? 'success' : 'warning'}`} style={{ fontSize: '0.6rem' }}>
                        {src.status}
                      </span>
                      <button 
                        className="btn-ghost" 
                        onClick={() => {
                          setSources(sources.filter(s => s.id !== src.id));
                          triggerToast('Knowledge asset removed.');
                        }}
                        style={{ border: 'none', color: 'var(--danger)', padding: '4px', background: 'transparent' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Model Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>AI Agent Tone</label>
                    <select className="input-dark" style={{ padding: '8px 12px', fontSize: '0.83rem' }}>
                      <option>Empathetic & Helpful (Corporate Standard)</option>
                      <option>Casual & Friendly (SaaS Startups)</option>
                      <option>Highly Professional & Formal (Enterprise Finance)</option>
                      <option>Strictly Technical & Direct (Developer Tools)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>AI Confidence Threshold (Routing Trigger)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="range" min="50" max="95" defaultValue="85" style={{ flex: 1, accentColor: 'var(--primary)' }} />
                      <span style={{ fontSize: '0.83rem', fontWeight: 600 }}>85%</span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>AI will auto-reply only when confidence matches or exceeds this percentage.</p>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '16px', marginTop: '24px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', color: 'var(--primary-light)' }}>Training Status</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                  Current model compiled on <strong>May 25, 2026, 21:00</strong>. Model references 2 knowledge files and 2 crawled domains.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTENT ANALYTICS */}
        {activeSubTab === 'intents' && (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Intent Classification (Last 30 Days)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '24px' }}>Customer conversation categories grouped dynamically by AI Intent clustering.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {intents.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.83rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.count.toLocaleString()} tickets ({item.percentage}%)</span>
                  </div>
                  <div className="progress-bar" style={{ height: '10px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${item.percentage}%`, 
                        background: idx === 0 
                          ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' 
                          : idx === 1 
                          ? 'linear-gradient(90deg, #06b6d4, #10b981)' 
                          : idx === 2 
                          ? 'linear-gradient(90deg, #a78bfa, #8b5cf6)'
                          : 'linear-gradient(90deg, #475569, #94a3b8)'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '32px' }}>
              <div className="stat-card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Top AI-Saved Cost Category</h4>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account & Password Resets</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '4px' }}>780 tickets resolved without agent touch ($2,340 saved).</p>
              </div>
              <div className="stat-card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Escalation Rate</h4>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>11.8%</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '4px' }}>Percentage of conversations requiring agent intervention.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Canned Response */}
      {showAddResponse && (
        <div className="modal-overlay">
          <div className="glass-strong" style={{ width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px' }}>New Canned Response</h3>
            
            <form onSubmit={handleAddResponse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Trigger Tag (No spaces)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}>/</span>
                  <input 
                    className="input-dark" 
                    required
                    placeholder="e.g. check_refund" 
                    value={newResponse.trigger} 
                    onChange={e => setNewResponse({ ...newResponse, trigger: e.target.value.toLowerCase().replace(/\s/g, '_') })} 
                    style={{ paddingLeft: '24px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Category</label>
                <select 
                  className="input-dark" 
                  value={newResponse.category}
                  onChange={e => setNewResponse({ ...newResponse, category: e.target.value as any })}
                >
                  <option value="Billing">Billing</option>
                  <option value="Technical">Technical</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Response Text</label>
                <textarea 
                  className="input-dark" 
                  required
                  rows={4}
                  placeholder="Enter the template text here..." 
                  value={newResponse.content} 
                  onChange={e => setNewResponse({ ...newResponse, content: e.target.value })} 
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Response</button>
                <button type="button" className="btn-ghost" onClick={() => setShowAddResponse(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Routing Rule */}
      {showAddRule && (
        <div className="modal-overlay">
          <div className="glass-strong" style={{ width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px' }}>New Routing Rule</h3>
            
            <form onSubmit={handleAddRule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Rule Name</label>
                <input 
                  className="input-dark" 
                  required
                  placeholder="e.g. Server Issues to Admin" 
                  value={newRule.name} 
                  onChange={e => setNewRule({ ...newRule, name: e.target.value })} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Condition Statement</label>
                <input 
                  className="input-dark" 
                  required
                  placeholder='e.g. If body contains "critical", "crash"' 
                  value={newRule.condition} 
                  onChange={e => setNewRule({ ...newRule, condition: e.target.value })} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Assign Target Role</label>
                <select 
                  className="input-dark" 
                  value={newRule.targetRole}
                  onChange={e => setNewRule({ ...newRule, targetRole: e.target.value })}
                >
                  <option value="Agent">Agent</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Activate Rule</button>
                <button type="button" className="btn-ghost" onClick={() => setShowAddRule(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Crawl URL */}
      {showAddURL && (
        <div className="modal-overlay">
          <div className="glass-strong" style={{ width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>Crawl Documentation URL</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '20px' }}>AI will spider this address recursively to construct canned answers and response nodes.</p>
            
            <form onSubmit={handleAddWebURL} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Web URL Address</label>
                <input 
                  className="input-dark" 
                  required
                  type="url"
                  placeholder="https://docs.yourcompany.com/faq" 
                  value={newURL} 
                  onChange={e => setNewURL(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Start Spidering</button>
                <button type="button" className="btn-ghost" onClick={() => setShowAddURL(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsHub;
