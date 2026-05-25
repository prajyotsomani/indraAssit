import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Frown, Meh, User, Bot, Clock, Globe, AlertTriangle } from 'lucide-react';

interface Company {
  name: string;
  industry: string;
  primaryColor: string;
  logo: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  language?: string;
}

interface Props {
  company: Company;
}

const ChatInterface: React.FC<Props> = ({ company }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm IndraAssist, your AI support agent for ${company.name}. I'm here to help you with any questions or issues you may have. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      sentiment: 'positive'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [customerSentiment, setCustomerSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'great', 'excellent', 'thank', 'thanks', 'perfect', 'amazing', 'wonderful', 'love', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'horrible', 'worst', 'disappointed', 'problem'];
    
    const words = text.toLowerCase().split(' ');
    const positiveScore = words.filter(word => positiveWords.includes(word)).length;
    const negativeScore = words.filter(word => negativeWords.includes(word)).length;
    
    if (negativeScore > positiveScore) return 'negative';
    if (positiveScore > negativeScore) return 'positive';
    return 'neutral';
  };

  const generateAIResponse = (userMessage: string, sentiment: 'positive' | 'neutral' | 'negative'): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Sentiment-aware responses
    let empathyPrefix = '';
    if (sentiment === 'negative') {
      empathyPrefix = "I understand your frustration, and I'm here to help resolve this quickly. ";
    } else if (sentiment === 'positive') {
      empathyPrefix = "I'm glad to help! ";
    }

    // FAQ Responses
    if (lowerMessage.includes('refund') || lowerMessage.includes('return')) {
      return `${empathyPrefix}I can help you with refund requests. Our standard refund policy allows returns within 30 days of purchase. To process your refund, I'll need your order number. Can you please provide it?`;
    }
    
    if (lowerMessage.includes('order') && (lowerMessage.includes('track') || lowerMessage.includes('status'))) {
      return `${empathyPrefix}I can help you track your order. Please provide your order number, and I'll give you real-time updates on its status and expected delivery date.`;
    }
    
    if (lowerMessage.includes('password') || lowerMessage.includes('login')) {
      return `${empathyPrefix}I can help you reset your password. For security purposes, I'll guide you through our secure password reset process. Would you like me to send a reset link to your registered email address?`;
    }
    
    if (lowerMessage.includes('cancel') && lowerMessage.includes('subscription')) {
      return `${empathyPrefix}I can help you cancel your subscription. Before we proceed, may I know the reason for cancellation? This helps us improve our service. I can also offer alternative plans if that would be helpful.`;
    }

    if (lowerMessage.includes('billing') || lowerMessage.includes('charge') || lowerMessage.includes('payment')) {
      return `${empathyPrefix}I can help resolve billing issues. I see you're asking about charges or payments. Let me review your account details. Could you please confirm the last 4 digits of the payment method on file?`;
    }

    if (lowerMessage.includes('technical') || lowerMessage.includes('not working') || lowerMessage.includes('error')) {
      return `${empathyPrefix}I'll help troubleshoot this technical issue. Can you please describe exactly what happens when you encounter this problem? Any error messages you see would be very helpful for diagnosis.`;
    }

    // Default response
    return `${empathyPrefix}I understand your query about "${userMessage}". Let me help you with that. Based on your question, I'm checking our knowledge base for the most accurate information. Could you provide a bit more detail so I can give you the most relevant assistance?`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      sentiment: analyzeSentiment(inputText)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setCustomerSentiment(userMessage.sentiment || 'neutral');

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, userMessage.sentiment || 'neutral'),
        sender: 'ai',
        timestamp: new Date(),
        sentiment: 'positive'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <Frown className="w-4 h-4 text-red-400" />;
      default:
        return <Meh className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSentimentBadge = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return 'badge badge-success';
      case 'negative':
        return 'badge badge-danger';
      default:
        return 'badge badge-neutral';
    }
  };

  return (
    <div className="glass flex flex-col animate-fadeInUp" style={{ borderRadius: 'var(--radius-lg)', height: '600px', color: 'var(--text-primary)', overflow: 'hidden' }}>
      {/* Chat Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="var(--primary-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>IndraAssist Live Chat</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>AI Persona configured for {company.name}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Customer Sentiment Indicator */}
          <div className={getSentimentBadge(customerSentiment)} style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' }}>
            {getSentimentIcon(customerSentiment)}
            <span>{customerSentiment}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <Globe size={14} />
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '10px',
                flexDirection: isUser ? 'row-reverse' : 'row',
                maxWidth: '75%'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: isUser ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.15)',
                  border: isUser ? '1px solid var(--border)' : '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {isUser ? (
                    <User size={14} color="var(--text-secondary)" />
                  ) : (
                    <Bot size={14} color="var(--primary-light)" />
                  )}
                </div>
                
                <div>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: isUser ? 'var(--gradient-primary)' : 'var(--bg-surface)',
                    border: isUser ? 'none' : '1px solid var(--border)',
                    fontSize: '0.83rem',
                    lineHeight: 1.4,
                    color: '#fff'
                  }}>
                    <p style={{ margin: 0 }}>{message.text}</p>
                  </div>
                  
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: isUser ? 'flex-end' : 'flex-start',
                    marginTop: '4px', fontSize: '0.68rem', color: 'var(--text-muted)'
                  }}>
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.sentiment && !isUser && (
                      <div style={{ marginLeft: '6px', display: 'flex', alignItems: 'center' }}>
                        {getSentimentIcon(message.sentiment)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={14} color="var(--primary-light)" />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <div className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <div className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="input-dark"
              rows={1}
              style={{ minHeight: '38px', maxHeight: '120px', padding: '9px 14px', resize: 'none' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="btn-primary"
            style={{ width: '38px', height: '38px', borderRadius: 'var(--radius)', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (!inputText.trim() || isTyping) ? 0.5 : 1 }}
          >
            <Send size={15} />
          </button>
        </div>
        
        {/* Quick Actions / Canned inputs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {['Track my order', 'Request refund', 'Technical support', 'Billing question'].map((action) => (
            <button
              key={action}
              onClick={() => setInputText(action)}
              className="btn-ghost"
              style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.72rem' }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;