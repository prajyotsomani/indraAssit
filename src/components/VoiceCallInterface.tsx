import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Clock,
  User,
  Bot,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface Company {
  name: string;
  industry: string;
  primaryColor: string;
  logo: string;
}

interface CallLog {
  id: string;
  customerPhone: string;
  duration: string;
  status: 'resolved' | 'escalated' | 'ongoing';
  issue: string;
  timestamp: Date;
}

interface Props {
  company: Company;
}

const VoiceCallInterface: React.FC<Props> = ({ company }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [currentCustomer, setCurrentCustomer] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      id: '1',
      customerPhone: '+1-555-0123',
      duration: '3:45',
      status: 'resolved',
      issue: 'Order tracking inquiry',
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '2',
      customerPhone: '+1-555-0456',
      duration: '7:22',
      status: 'escalated',
      issue: 'Billing dispute',
      timestamp: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      id: '3',
      customerPhone: '+1-555-0789',
      duration: '2:18',
      status: 'resolved',
      issue: 'Password reset help',
      timestamp: new Date(Date.now() - 1000 * 60 * 90)
    }
  ]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCallActive) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleIncomingCall = () => {
    setCurrentCustomer('+1-555-0987');
    setIsCallActive(true);
    setTranscript('');
    setAiResponse('Hello! This is IndraAssist AI voice support for ' + company.name + '. How can I help you today?');
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCurrentCustomer('');
    setIsListening(false);
    setTranscript('');
    setAiResponse('');
    
    // Add to call logs
    const newLog: CallLog = {
      id: Date.now().toString(),
      customerPhone: currentCustomer || '+1-555-0987',
      duration: formatDuration(callDuration),
      status: 'resolved',
      issue: 'Customer inquiry',
      timestamp: new Date()
    };
    setCallLogs(prev => [newLog, ...prev]);
  };

  const simulateVoiceRecognition = () => {
    setIsListening(true);
    
    // Simulate customer speech
    setTimeout(() => {
      const customerQueries = [
        "Hi, I need to track my order #12345",
        "I'm having trouble logging into my account",
        "I want to return a product I bought last week",
        "My payment was charged twice for the same order",
        "The product I received is damaged"
      ];
      
      const randomQuery = customerQueries[Math.floor(Math.random() * customerQueries.length)];
      setTranscript(randomQuery);
      setIsListening(false);
      
      // Generate AI response
      setTimeout(() => {
        generateAIVoiceResponse(randomQuery);
      }, 1000);
    }, 2000);
  };

  const generateAIVoiceResponse = (customerQuery: string) => {
    const lowerQuery = customerQuery.toLowerCase();
    
    let response = '';
    
    if (lowerQuery.includes('track') && lowerQuery.includes('order')) {
      response = "I can help you track your order. I found order #12345 in our system. It was shipped yesterday and is currently in transit. You should receive it by tomorrow evening. Would you like me to send you the tracking link via SMS?";
    } else if (lowerQuery.includes('login') || lowerQuery.includes('account')) {
      response = "I understand you're having trouble accessing your account. Let me help you reset your password. For security, I'll send a verification code to your registered phone number. Can you confirm the last 4 digits of your phone number?";
    } else if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
      response = "I can process your return request. Our return policy allows returns within 30 days. I'll email you a prepaid return label. Once we receive the item, your refund will be processed within 3-5 business days. Is there anything specific wrong with the product?";
    } else if (lowerQuery.includes('charged twice') || lowerQuery.includes('payment')) {
      response = "I see the duplicate charge on your account. This appears to be a temporary authorization that will be automatically released within 24-48 hours. However, I can expedite this process and have it removed immediately. Let me process that for you now.";
    } else if (lowerQuery.includes('damaged')) {
      response = "I'm sorry to hear your product arrived damaged. I'll immediately process a replacement for you at no charge. The new item will be shipped today with express delivery. You'll also receive a prepaid return label for the damaged item. Is this acceptable?";
    } else {
      response = "I understand your concern. Let me check our system for the best solution. Based on your query, I'm accessing our knowledge base to provide you with accurate information. Please hold for just a moment.";
    }
    
    setAiResponse(response);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'badge badge-success';
      case 'escalated':
        return 'badge badge-danger';
      case 'ongoing':
      default:
        return 'badge badge-info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'escalated':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'ongoing':
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp" style={{ color: 'var(--text-primary)' }}>
      {/* Voice Call Interface */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={20} color="var(--primary-light)" />
            Voice Call Interface
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px' }}>AI voice customer support simulation for {company.name}</p>
        </div>

        <div style={{ padding: '24px' }}>
          {!isCallActive ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="animate-float" style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <PhoneCall size={36} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>System Ready for Call Handling</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '24px' }}>IndraAssist voice bot is active and listening for incoming dial triggers.</p>
              <button
                onClick={handleIncomingCall}
                className="btn-primary glow-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
              >
                <Phone size={16} /> Simulate Inbound Call
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Active Call Header */}
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', padding: '14px 20px', borderRadius: 'var(--radius)', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentCustomer}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Duration: {formatDuration(callDuration)}</div>
                  </div>
                </div>
                <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="status-dot status-online animate-pulse" />
                  <span>ONGOING CALL</span>
                </div>
              </div>

              {/* Conversation Display */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '160px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                {/* AI Response */}
                {aiResponse && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'start', alignSelf: 'flex-start', maxWidth: '80%' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={14} color="var(--primary-light)" />
                    </div>
                    <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', padding: '12px 16px', borderRadius: '16px' }}>
                      <p style={{ fontSize: '0.83rem', lineHeight: 1.4, margin: 0 }}>{aiResponse}</p>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>IndraVoice Agent</span>
                    </div>
                  </div>
                )}

                {/* Customer Speech */}
                {transcript && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'start', alignSelf: 'flex-end', flexDirection: 'row-reverse', maxWidth: '80%' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={14} color="var(--text-secondary)" />
                    </div>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '16px' }}>
                      <p style={{ fontSize: '0.83rem', lineHeight: 1.4, margin: 0 }}>"{transcript}"</p>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block', textAlign: 'right' }}>Customer Speech (Real-time Transcript)</span>
                    </div>
                  </div>
                )}

                {/* Listening Indicator */}
                {isListening && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                    <div className="badge badge-purple animate-pulse" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mic size={12} /> Listening for customer utterance...
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls */}
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="btn-ghost"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isMuted ? 'rgba(239,68,68,0.15)' : 'transparent', color: isMuted ? 'var(--danger)' : 'var(--text-secondary)', borderColor: isMuted ? 'var(--danger)' : 'var(--border)' }}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button
                  onClick={simulateVoiceRecognition}
                  disabled={isListening}
                  className="btn-primary"
                  style={{ padding: '0 24px', height: '44px', fontSize: '0.83rem', opacity: isListening ? 0.7 : 1 }}
                >
                  {isListening ? 'Processing speech...' : 'Simulate Customer Speaking'}
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className="btn-ghost"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: !isSpeakerOn ? 'rgba(239,68,68,0.15)' : 'transparent', color: !isSpeakerOn ? 'var(--danger)' : 'var(--text-secondary)', borderColor: !isSpeakerOn ? 'var(--danger)' : 'var(--border)' }}
                  title={isSpeakerOn ? 'Mute speaker' : 'Unmute speaker'}
                >
                  {isSpeakerOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="btn-primary glow-danger"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger)' }}
                  title="Hang up call"
                >
                  <PhoneOff size={18} color="white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call Logs */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Recent Call Logs</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px' }}>Log histories for automated telephone queues.</p>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {callLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'between', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={16} color="var(--primary-light)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{log.customerPhone}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{log.issue}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {log.timestamp.toLocaleString()} · Duration: {log.duration}
                    </div>
                  </div>
                </div>
                <div className={getStatusBadgeClass(log.status)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {getStatusIcon(log.status)}
                  <span style={{ textTransform: 'capitalize' }}>{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallInterface;