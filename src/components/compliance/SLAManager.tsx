import React, { useState } from 'react';
import { ShieldAlert, Clock, ShieldCheck, Search, Trash2, FileJson, CheckCircle2, ChevronRight, AlertCircle, FileText } from 'lucide-react';

interface SLARule {
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  firstResponseTime: number; // in hours
  resolutionTime: number; // in hours
  escalationTarget: 'Admin' | 'Supervisor' | 'Agent';
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Security' | 'Billing' | 'Team' | 'Config';
  ipAddress: string;
}

const SLAManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'sla' | 'gdpr' | 'audit'>('sla');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* SLA State */
  const [slaRules, setSlaRules] = useState<SLARule[]>([
    { priority: 'Urgent', firstResponseTime: 1, resolutionTime: 4, escalationTarget: 'Admin' },
    { priority: 'High', firstResponseTime: 4, resolutionTime: 12, escalationTarget: 'Supervisor' },
    { priority: 'Medium', firstResponseTime: 12, resolutionTime: 24, escalationTarget: 'Agent' },
    { priority: 'Low', firstResponseTime: 24, resolutionTime: 72, escalationTarget: 'Agent' }
  ]);
  const [editingRule, setEditingRule] = useState<SLARule | null>(null);

  /* GDPR State */
  const [gdprEmail, setGdprEmail] = useState('');
  const [gdprVerified, setGdprVerified] = useState(false);
  const [gdprFound, setGdprFound] = useState(false);
  const [searchedCustomer, setSearchedCustomer] = useState<any>(null);

  /* Audit Log State */
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', timestamp: '2026-05-25 21:10:42', user: 'priya@techcorp.com', action: 'Modified routing rule "Billing Keywords"', category: 'Config', ipAddress: '192.168.1.45' },
    { id: '2', timestamp: '2026-05-25 18:24:11', user: 'priya@techcorp.com', action: 'Added payment method ending in 8888', category: 'Billing', ipAddress: '192.168.1.45' },
    { id: '3', timestamp: '2026-05-24 10:15:30', user: 'kabir@techcorp.com', action: 'Removed agent Rohan Gupta', category: 'Team', ipAddress: '192.168.1.92' },
    { id: '4', timestamp: '2026-05-23 15:42:01', user: 'system_daemon', action: 'SLA Breach alert triggered for Ticket #8291', category: 'Security', ipAddress: '127.0.0.1' },
    { id: '5', timestamp: '2026-05-22 09:30:12', user: 'priya@techcorp.com', action: 'Exported compliance data for client amit@tcs.com', category: 'Security', ipAddress: '192.168.1.45' }
  ]);
  const [auditSearch, setAuditSearch] = useState('');

  /* Handlers */
  const handleEditRuleClick = (rule: SLARule) => {
    setEditingRule({ ...rule });
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    setSlaRules(slaRules.map(r => r.priority === editingRule.priority ? editingRule : r));
    setEditingRule(null);
    triggerToast(`${editingRule.priority} SLA thresholds saved.`);
  };

  const handleGdprSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprEmail) return;
    // Simulate lookup
    if (gdprEmail.includes('@')) {
      setGdprFound(true);
      setSearchedCustomer({
        email: gdprEmail,
        chats: 12,
        tickets: 2,
        voiceLogs: 3,
        lastActive: '2026-05-20'
      });
      triggerToast('Customer GDPR records located.');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  const handleGdprExport = () => {
    if (!searchedCustomer) return;
    triggerToast(`Constructing compliance dossier for ${searchedCustomer.email}...`);
    setTimeout(() => {
      triggerToast(`GDPR_Dossier_${searchedCustomer.email.split('@')[0]}.json exported.`);
    }, 2000);
  };

  const handleGdprDelete = () => {
    if (!searchedCustomer) return;
    if (!gdprVerified) {
      alert('You must acknowledge the verification checkbox before deleting data.');
      return;
    }
    if (confirm(`CRITICAL: Are you absolutely sure you want to permanently erase all records for ${searchedCustomer.email}? This action CANNOT be undone under GDPR rules.`)) {
      // Add log
      const newLog: AuditLog = {
        id: String(Date.now()),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'priya@techcorp.com',
        action: `GDPR Deletion Request completed for ${searchedCustomer.email}`,
        category: 'Security',
        ipAddress: '192.168.1.45'
      };
      setAuditLogs([newLog, ...auditLogs]);
      setSearchedCustomer(null);
      setGdprFound(false);
      setGdprEmail('');
      setGdprVerified(false);
      triggerToast('All client communications redacted and anonymized.');
    }
  };

  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(auditSearch.toLowerCase()) || 
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.category.toLowerCase().includes(auditSearch.toLowerCase())
  );

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
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>Security & Policies</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>SLA & Compliance</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Set service level agreement rules, verify GDPR right-to-be-forgotten claims, and search system audit log histories.
          </p>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px', gap: '24px' }}>
        {[
          { id: 'sla', label: 'SLA Policies', icon: Clock },
          { id: 'gdpr', label: 'GDPR & Privacy', icon: ShieldCheck },
          { id: 'audit', label: 'System Audit Log', icon: FileText }
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
        {/* SLA EDIT PANEL */}
        {activeSubTab === 'sla' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Rules List */}
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>Active SLA Target Matrix</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>Determines compliance warnings and automated ticket escalation intervals.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {slaRules.map((rule) => (
                  <div key={rule.priority} style={{ padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rule.priority}</span>
                        <span className={`badge badge-${
                          rule.priority === 'Urgent' ? 'danger' : rule.priority === 'High' ? 'warning' : rule.priority === 'Medium' ? 'info' : 'neutral'
                        }`} style={{ fontSize: '0.6rem' }}>T-{rule.firstResponseTime}h</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        First Reply: <strong>{rule.firstResponseTime} hr</strong> · Close: <strong>{rule.resolutionTime} hr</strong>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Breach Escalates to: <span className="badge badge-purple" style={{ fontSize: '0.55rem', padding: '1px 4px' }}>{rule.escalationTarget}</span>
                      </div>
                    </div>

                    <button className="btn-ghost" onClick={() => handleEditRuleClick(rule)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Edit Target</button>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Alert Configuration */}
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>Breach Alert Pathways</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>Automate pathways when support queues exceed SLA parameters.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Warning Buffer Time</label>
                  <select className="input-dark" style={{ padding: '8px 12px', fontSize: '0.83rem' }}>
                    <option>15 minutes prior to breach</option>
                    <option>30 minutes prior to breach</option>
                    <option>1 hour prior to breach</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Warning Route Channel</label>
                  <select className="input-dark" style={{ padding: '8px 12px', fontSize: '0.83rem' }}>
                    <option>Slack integration #sla-warnings (Primary)</option>
                    <option>Admin system dashboard alerts</option>
                    <option>Direct supervisor SMS via Twilio</option>
                  </select>
                </div>

                <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.15)', padding: '14px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                  <ShieldAlert size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <strong>Rule active:</strong> Urgent SLA tickets are assigned warning tags 15m before expiration. Breach triggers immediate assignment transfer to role <strong>Admin</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GDPR PRIVACY PANEL */}
        {activeSubTab === 'gdpr' && (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>GDPR Client Data Management</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '24px' }}>
              Process "Right to Erasure" and data portability requests from customer emails securely.
            </p>

            <form onSubmit={handleGdprSearch} style={{ display: 'flex', gap: '10px', maxWidth: '500px', marginBottom: '24px' }}>
              <input 
                className="input-dark" 
                required
                type="email"
                placeholder="Enter client email address..." 
                value={gdprEmail} 
                onChange={e => setGdprEmail(e.target.value)} 
              />
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                <Search size={14} /> Find Data
              </button>
            </form>

            {gdprFound && searchedCustomer ? (
              <div className="animate-fadeIn" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>Customer Profile: {searchedCustomer.email}</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div className="stat-card" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Chat Sessions</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>{searchedCustomer.chats}</div>
                  </div>
                  <div className="stat-card" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tickets Opened</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>{searchedCustomer.tickets}</div>
                  </div>
                  <div className="stat-card" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Voice Call Transcripts</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>{searchedCustomer.voiceLogs}</div>
                  </div>
                  <div className="stat-card" style={{ padding: '14px', background: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Last Activity</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>{searchedCustomer.lastActive}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  {/* Action 1: Export */}
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h5 style={{ fontWeight: 700, fontSize: '0.85rem' }}>Export Data Dossier (Article 20 GRPD)</h5>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>Downloads a machine-readable JSON representation of all data associated with this email.</p>
                    </div>
                    <button className="btn-ghost" onClick={handleGdprExport} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                      <FileJson size={14} /> Export JSON File
                    </button>
                  </div>

                  <div className="divider" />

                  {/* Action 2: Delete */}
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1, marginRight: '24px' }}>
                      <h5 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--danger)' }}>Right to Erasure / Delete Data (Article 17 GDPR)</h5>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px', lineHeight: 1.4 }}>
                        Permanently scrub client name, email addresses, transcription databases, cookie identifiers, and transaction metadata.
                      </p>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          className="checkbox-dark"
                          checked={gdprVerified} 
                          onChange={e => setGdprVerified(e.target.checked)} 
                        />
                        <span>I understand that this action is permanent and legally binding.</span>
                      </label>
                    </div>
                    <button 
                      className="btn-ghost" 
                      onClick={handleGdprDelete} 
                      disabled={!gdprVerified}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', 
                        borderColor: gdprVerified ? 'rgba(239,68,68,0.3)' : 'var(--border)', 
                        color: gdprVerified ? 'var(--danger)' : 'var(--text-muted)',
                        cursor: gdprVerified ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <Trash2 size={14} /> Erase Records
                    </button>
                  </div>
                </div>
              </div>
            ) : gdprEmail ? (
              <div style={{ padding: '24px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Search for an email address to display GDPR options.
              </div>
            ) : null}
          </div>
        )}

        {/* AUDIT LOG PANEL */}
        {activeSubTab === 'audit' && (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>System Configuration Audit Logs</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>Track administrative modifications, security status alerts and database configurations.</p>
              </div>
              
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  className="input-dark" 
                  placeholder="Filter logs..." 
                  value={auditSearch} 
                  onChange={e => setAuditSearch(e.target.value)} 
                  style={{ paddingLeft: '30px', height: '34px', fontSize: '0.78rem' }} 
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px', fontWeight: 500 }}>Timestamp</th>
                    <th style={{ padding: '10px 8px', fontWeight: 500 }}>User</th>
                    <th style={{ padding: '10px 8px', fontWeight: 500 }}>Action</th>
                    <th style={{ padding: '10px 8px', fontWeight: 500 }}>Category</th>
                    <th style={{ padding: '10px 8px', fontWeight: 500, textAlign: 'right' }}>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{log.user}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{log.action}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className={`badge badge-${
                          log.category === 'Security' ? 'danger' : log.category === 'Billing' ? 'success' : log.category === 'Team' ? 'purple' : 'info'
                        }`} style={{ fontSize: '0.6rem' }}>
                          {log.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No audit logs correspond to the filter query.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editing Rule Dialog */}
      {editingRule && (
        <div className="modal-overlay">
          <div className="glass-strong animate-fadeIn" style={{ width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>Edit {editingRule.priority} SLA Target</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '24px' }}>Amend critical response thresholds to reflect team capacity schedules.</p>

            <form onSubmit={handleSaveRule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>First Response SLA (Hours)</label>
                <input 
                  type="number"
                  min="1" 
                  max="168"
                  className="input-dark" 
                  required
                  value={editingRule.firstResponseTime}
                  onChange={e => setEditingRule({ ...editingRule, firstResponseTime: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Resolution SLA (Hours)</label>
                <input 
                  type="number"
                  min="1" 
                  max="168"
                  className="input-dark" 
                  required
                  value={editingRule.resolutionTime}
                  onChange={e => setEditingRule({ ...editingRule, resolutionTime: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Breach Escalation Path</label>
                <select 
                  className="input-dark"
                  value={editingRule.escalationTarget}
                  onChange={e => setEditingRule({ ...editingRule, escalationTarget: e.target.value as any })}
                >
                  <option value="Agent">Agent (Standard Alert)</option>
                  <option value="Supervisor">Supervisor (Priority Notification)</option>
                  <option value="Admin">Admin (Critical Page Alert)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" className="btn-ghost" onClick={() => setEditingRule(null)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLAManager;
