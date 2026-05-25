import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, Share2, Sparkles, Search, Filter, Send, CheckCircle2, User, CornerDownLeft, FileText, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'ai';
  text: string;
  timestamp: string;
  channel?: 'chat' | 'email' | 'whatsapp' | 'voice';
}

interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string;
  channel: 'chat' | 'email' | 'whatsapp' | 'voice';
  lastMessage: string;
  timestamp: string;
  status: 'new' | 'open' | 'pending' | 'resolved';
  sentiment: 'positive' | 'neutral' | 'negative';
  unread: boolean;
  messages: ChatMessage[];
}

const UnifiedInbox: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      customerName: 'Amit Kumar',
      customerEmail: 'amit@tcs.com',
      channel: 'whatsapp',
      lastMessage: 'Hey, when will my Growth subscription activate? I completed check out.',
      timestamp: '10m ago',
      status: 'open',
      sentiment: 'neutral',
      unread: true,
      messages: [
        { id: '1a', sender: 'customer', text: 'Hey, when will my Growth subscription activate? I completed check out.', timestamp: '21:19' },
        { id: '1b', sender: 'ai', text: 'Hello Amit! Standard processing completes immediately. I will pull up your subscription profile. If you have your invoice ID, please send it here.', timestamp: '21:20' }
      ]
    },
    {
      id: '2',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@vertex.io',
      channel: 'email',
      lastMessage: 'SLA Alert: Requesting custom contract pricing agreement for Enterprise migration.',
      timestamp: '2h ago',
      status: 'open',
      sentiment: 'positive',
      unread: false,
      messages: [
        { id: '2a', sender: 'customer', text: 'Hi support team, we are scaling to 45 agents next month and need to migrate from Growth to Enterprise. Can we arrange a customized SLA contract agreement?', timestamp: '19:15' }
      ]
    },
    {
      id: '3',
      customerName: 'Rohit Mehta',
      customerEmail: 'rohit@mehtaconsulting.in',
      channel: 'chat',
      lastMessage: 'Our server API is experiencing 504 errors on webhook verification requests.',
      timestamp: '4h ago',
      status: 'pending',
      sentiment: 'negative',
      unread: false,
      messages: [
        { id: '3a', sender: 'customer', text: 'Our server API is experiencing 504 errors on webhook verification requests.', timestamp: '17:30' },
        { id: '3b', sender: 'agent', text: 'Let me look at our webhook callbacks logs, Rohit. Are you calling our sandbox endpoint or live endpoint?', timestamp: '17:42' },
        { id: '3c', sender: 'customer', text: 'We are hitting the live endpoint: api.indraassist.com/v1/webhooks', timestamp: '17:45' }
      ]
    },
    {
      id: '4',
      customerName: 'David Lee',
      customerEmail: 'david@leeenterprises.co',
      channel: 'voice',
      lastMessage: 'Transcription: "I need to reset our organization 2FA keys. Our IT director lost access."',
      timestamp: '1d ago',
      status: 'resolved',
      sentiment: 'negative',
      unread: false,
      messages: [
        { id: '4a', sender: 'customer', text: 'I need to reset our organization 2FA keys. Our IT director lost access.', timestamp: 'Yesterday' },
        { id: '4b', sender: 'agent', text: 'Reset completed. Verification link sent to secondary recovery email.', timestamp: 'Yesterday' }
      ]
    }
  ]);

  const [activeId, setActiveId] = useState<string>('1');
  const [statusFilter, setStatusFilter] = useState<'open' | 'pending' | 'resolved'>('open');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [replyText, setReplyText] = useState('');
  const [replyChannel, setReplyChannel] = useState<'chat' | 'email' | 'whatsapp'>('chat');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeConv = conversations.find(c => c.id === activeId) || conversations[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: 'agent',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: replyChannel
    };

    const updatedConvs = conversations.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          lastMessage: replyText,
          unread: false,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setReplyText('');
    triggerToast('Response sent to customer.');
  };

  const handleResolve = () => {
    setConversations(conversations.map(c => c.id === activeId ? { ...c, status: 'resolved' } : c));
    triggerToast('Conversation marked as Resolved.');
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setConversations(conversations.map(c => c.id === id ? { ...c, unread: false } : c));
  };

  const getChannelIcon = (channel: string, size = 16) => {
    switch (channel) {
      case 'email':
        return <Mail size={size} color="var(--info)" />;
      case 'whatsapp':
        return <Phone size={size} color="var(--success)" />;
      case 'voice':
        return <Phone size={size} color="var(--warning)" />;
      case 'chat':
      default:
        return <MessageSquare size={size} color="var(--primary-light)" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>★ Positive</span>;
      case 'negative':
        return <span className="badge badge-danger" style={{ fontSize: '0.6rem' }}>⚠️ Angry</span>;
      case 'neutral':
      default:
        return <span className="badge badge-neutral" style={{ fontSize: '0.6rem' }}>Neutral</span>;
    }
  };

  const filteredConvs = conversations.filter(c => {
    const matchesStatus = c.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    const matchesSearch = c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesChannel && matchesSearch;
  });

  const cannedSuggestions = [
    { label: 'Pricing Inquiry', text: 'Our Growth plan is $149/mo (billed monthly) or $119/mo (billed annually). This supports up to 15 agents and custom AI personas.' },
    { label: 'Webhook Guide', text: 'You can test active callbacks. Head to the Integrations tab, choose Webhooks, and key in your HTTPS endpoint.' },
    { label: 'Escalate to Admin', text: 'I am routing this request to our Chief Information Administrator to process the server verification credentials.' }
  ];

  return (
    <div className="animate-fadeInUp" style={{ color: 'var(--text-primary)', height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>
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

      {/* Main Inbox Body Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Conversation List panel */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Filters Top */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                className="input-dark" 
                placeholder="Search inbox..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8rem' }} 
              />
            </div>

            {/* Status tabs filter */}
            <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {(['open', 'pending', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    flex: 1, border: 'none', background: statusFilter === status ? 'var(--primary)' : 'transparent',
                    color: statusFilter === status ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.75rem', fontWeight: 600, padding: '6px 0', borderRadius: '6px',
                    textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Channel Filters Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 4px' }}>
              {['all', 'chat', 'whatsapp', 'email', 'voice'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  style={{
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    padding: '4px 8px', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderBottom: channelFilter === ch ? '2px solid var(--primary)' : '2px solid transparent'
                  }}
                  title={`Show only ${ch}`}
                >
                  {ch === 'all' ? <span style={{ fontSize: '0.72rem', color: channelFilter === 'all' ? 'var(--primary-light)' : 'var(--text-secondary)', fontWeight: 600 }}>All</span> : getChannelIcon(ch, 14)}
                </button>
              ))}
            </div>
          </div>

          {/* List Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }} className="space-y-1">
            {filteredConvs.map((conv) => {
              const isActive = conv.id === activeId;
              return (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  style={{
                    padding: '12px', borderRadius: 'var(--radius)', cursor: 'pointer',
                    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                    transition: 'all 0.15s ease', position: 'relative'
                  }}
                >
                  {conv.unread && (
                    <div style={{ position: 'absolute', top: '14px', right: '14px', width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                  )}

                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getChannelIcon(conv.channel, 12)}
                      <span style={{ fontWeight: 600, fontSize: '0.83rem', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{conv.customerName}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{conv.timestamp}</span>
                  </div>

                  <p style={{
                    fontSize: '0.75rem', color: 'var(--text-secondary)',
                    textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',
                    lineHeight: 1.4, margin: '4px 0 6px 0'
                  }}>
                    {conv.lastMessage}
                  </p>

                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                    {getSentimentBadge(conv.sentiment)}
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{conv.customerEmail}</span>
                  </div>
                </div>
              );
            })}

            {filteredConvs.length === 0 && (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                No active conversations match search filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Conversation Chat Workspace */}
        {activeConv ? (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Thread Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {activeConv.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{activeConv.customerName}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{activeConv.customerEmail} · Active via {activeConv.channel}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {activeConv.status !== 'resolved' && (
                  <button className="btn-ghost" onClick={handleResolve} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', padding: '6px 12px' }}>
                    <CheckCircle2 size={14} color="var(--success)" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>

            {/* Message Thread Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeConv.messages.map((msg) => {
                const isCustomer = msg.sender === 'customer';
                const isAI = msg.sender === 'ai';

                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    flexDirection: isCustomer ? 'row' : 'row-reverse',
                    alignItems: 'start',
                    gap: '10px',
                    alignSelf: isCustomer ? 'flex-start' : 'flex-end',
                    maxWidth: '75%'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isCustomer ? 'rgba(255,255,255,0.06)' : isAI ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.15)',
                      border: isCustomer ? '1px solid var(--border)' : isAI ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(99,102,241,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {isCustomer ? <User size={13} /> : isAI ? <Sparkles size={13} color="var(--accent-light)" /> : 'ME'}
                    </div>

                    <div>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        background: isCustomer ? 'var(--bg-surface)' : isAI ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))' : 'var(--gradient-primary)',
                        border: isCustomer ? '1px solid var(--border)' : isAI ? '1px solid rgba(139,92,246,0.3)' : 'none',
                        fontSize: '0.83rem',
                        lineHeight: 1.4,
                        color: '#fff'
                      }}>
                        {msg.text}
                      </div>
                      <div style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        marginTop: '4px',
                        textAlign: isCustomer ? 'left' : 'right'
                      }}>
                        {isAI ? 'AI Autoreply' : msg.sender === 'agent' ? `Replied via ${msg.channel || 'chat'}` : 'Customer'} · {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Answer Recommendations */}
            {activeConv.status !== 'resolved' && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Sparkles size={12} color="var(--primary-light)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-light)' }}>AI Canned Suggestions</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {cannedSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReplyText(s.text)}
                      className="btn-ghost"
                      style={{
                        padding: '6px 12px', fontSize: '0.72rem', borderRadius: '99px',
                        whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <CornerDownLeft size={10} /> {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Input Dock */}
            {activeConv.status !== 'resolved' ? (
              <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', gap: '12px', alignItems: 'end' }}>
                <div style={{ width: '100px' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Channel</label>
                  <select 
                    className="input-dark" 
                    value={replyChannel}
                    onChange={e => setReplyChannel(e.target.value as any)}
                    style={{ padding: '6px 8px', fontSize: '0.75rem', height: '34px' }}
                  >
                    <option value="chat">Live Chat</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <textarea
                    rows={1}
                    className="input-dark"
                    placeholder={`Reply to ${activeConv.customerName} via ${replyChannel}...`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    style={{ resize: 'none', height: '34px', padding: '7px 12px', fontSize: '0.8rem', fontFamily: 'inherit' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={14} />
                </button>
              </form>
            ) : (
              <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                This conversation is resolved. Reopen by sending a message or assign a new agent.
              </div>
            )}
          </div>
        ) : (
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Select a conversation from the sidebar to start responding.
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedInbox;
