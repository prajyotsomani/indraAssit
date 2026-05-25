import React, { useState } from 'react';
import { Users, Mail, Plus, Search, Filter, Shield, MoreVertical, Trash2, Award, Zap, CheckCircle2 } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Agent' | 'Viewer';
  status: 'online' | 'busy' | 'offline';
  resolvedCount: number;
  rating: number;
  avatar: string;
  activeChats: number;
}

const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Priya Sharma', email: 'priya@techcorp.com', role: 'Admin', status: 'online', resolvedCount: 342, rating: 4.9, avatar: '👩‍💻', activeChats: 4 },
    { id: '2', name: 'Kabir Verma', email: 'kabir@techcorp.com', role: 'Supervisor', status: 'online', resolvedCount: 289, rating: 4.8, avatar: '👨‍💻', activeChats: 2 },
    { id: '3', name: 'Aarav Patel', email: 'aarav@techcorp.com', role: 'Agent', status: 'busy', resolvedCount: 154, rating: 4.7, avatar: '👨‍💼', activeChats: 5 },
    { id: '4', name: 'Ishita Sen', email: 'ishita@techcorp.com', role: 'Agent', status: 'online', resolvedCount: 201, rating: 4.9, avatar: '👩‍💼', activeChats: 3 },
    { id: '5', name: 'Rohan Gupta', email: 'rohan@techcorp.com', role: 'Agent', status: 'offline', resolvedCount: 92, rating: 4.5, avatar: '👨‍🎨', activeChats: 0 },
    { id: '6', name: 'Anjali Nair', email: 'anjali@techcorp.com', role: 'Viewer', status: 'offline', resolvedCount: 0, rating: 0, avatar: '👩‍🎨', activeChats: 0 }
  ]);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Supervisor' | 'Agent' | 'Viewer'>('Agent');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newMember: Member = {
      id: String(members.length + 1),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'offline',
      resolvedCount: 0,
      rating: 0,
      avatar: inviteRole === 'Admin' || inviteRole === 'Supervisor' ? '👨‍💼' : '👩‍💼',
      activeChats: 0
    };

    setMembers([...members, newMember]);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
    setInviteRole('Agent');
    triggerToast(`Invitation sent to ${inviteEmail}!`);
  };

  const handleRoleChange = (id: string, newRole: any) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
    triggerToast(`Role updated successfully.`);
  };

  const handleRemove = (id: string) => {
    const member = members.find(m => m.id === id);
    if (confirm(`Are you sure you want to remove ${member?.name} from the team?`)) {
      setMembers(members.filter(m => m.id !== id));
      triggerToast(`${member?.name} has been removed.`);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterRole === 'All' || m.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const onlineCount = members.filter(m => m.status === 'online').length;
  const busyCount = members.filter(m => m.status === 'busy').length;
  const avgRating = (members.filter(m => m.rating > 0).reduce((acc, m) => acc + m.rating, 0) / members.filter(m => m.rating > 0).length).toFixed(1);

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
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>Roster & KPIs</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Team Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage staff credentials, allocate roles, and view support speed and rating KPIs.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowInviteModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Invite Agent
        </button>
      </div>

      {/* KPI Overviews */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Team Size</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-light)' }}>{members.length}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Members</span>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Active Agents</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{onlineCount}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Online now</span>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Busy / In-Chat</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>{busyCount}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Handling tickets</span>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Avg CSAT Rating</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-light)' }}>{avgRating} ★</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>out of 5.0</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Roster List */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', overflowX: 'auto' }}>
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                className="input-dark" 
                placeholder="Search by name or email..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ paddingLeft: '36px', height: '38px' }} 
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Role:</span>
              <select 
                className="input-dark" 
                value={filterRole} 
                onChange={e => setFilterRole(e.target.value)} 
                style={{ padding: '6px 12px', width: '130px', height: '38px' }}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Agent">Agent</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* Roster Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Tickets Resolved</th>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Rating</th>
                <th style={{ padding: '12px 10px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-white/2 bg-transparent">
                  <td style={{ padding: '14px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{member.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <select 
                      className="input-dark" 
                      value={member.role}
                      onChange={e => handleRoleChange(member.id, e.target.value as any)}
                      style={{ padding: '4px 8px', fontSize: '0.78rem', width: '100px', border: 'none', background: 'rgba(255,255,255,0.03)' }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Agent">Agent</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`status-dot status-${member.status}`} />
                      <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: member.status === 'online' ? 'var(--success)' : member.status === 'busy' ? 'var(--warning)' : 'var(--text-muted)' }}>{member.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: 600 }}>{member.resolvedCount}</td>
                  <td style={{ padding: '14px 10px' }}>
                    {member.rating > 0 ? (
                      <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{member.rating} ★</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                    <button 
                      className="btn-ghost" 
                      onClick={() => handleRemove(member.id)}
                      style={{ padding: '6px', border: 'none', color: 'var(--danger)', background: 'transparent' }}
                      title="Remove Member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No team members match the search parameters.
            </div>
          )}
        </div>

        {/* Workload Distribution Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="var(--primary-light)" /> Workload Balance
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {members.filter(m => m.status === 'online' || m.status === 'busy').map((m) => {
                const maxLoad = 5;
                const percent = Math.min((m.activeChats / maxLoad) * 100, 100);
                let progressColor = 'var(--gradient-primary)';
                if (m.activeChats >= 5) progressColor = 'linear-gradient(90deg, #ef4444, #f59e0b)';
                else if (m.activeChats <= 2) progressColor = 'linear-gradient(90deg, #10b981, #06b6d4)';

                return (
                  <div key={m.id}>
                    <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{m.activeChats} / {maxLoad} chats</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%`, background: progressColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.05))' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="var(--accent-light)" /> Agent of the Week
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <span style={{ fontSize: '2.5rem' }}>🏆</span>
              <div>
                <h4 style={{ fontWeight: 700, margin: 0 }}>Priya Sharma</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>342 resolved · 4.9 Avg CSAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Agent Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="glass-strong" style={{ width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>Invite New Team Member</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Send an email invitation link to add an agent or supervisor to TechCorp Solutions.
            </p>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
                <input 
                  className="input-dark" 
                  required
                  placeholder="e.g. John Doe" 
                  value={inviteName} 
                  onChange={e => setInviteName(e.target.value)} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    className="input-dark" 
                    required
                    type="email"
                    placeholder="john@company.com" 
                    value={inviteEmail} 
                    onChange={e => setInviteEmail(e.target.value)} 
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>System Role</label>
                <select 
                  className="input-dark" 
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as any)}
                >
                  <option value="Agent">Agent (Can answer calls & chats)</option>
                  <option value="Supervisor">Supervisor (Can manage rules & routing)</option>
                  <option value="Admin">Admin (Full administrative control)</option>
                  <option value="Viewer">Viewer (Read-only analytics)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Send Invitation</button>
                <button type="button" className="btn-ghost" onClick={() => setShowInviteModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
