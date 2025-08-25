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
        return <Smile className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <Frown className="w-4 h-4 text-red-500" />;
      default:
        return <Meh className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">IndraAssist Chat</h3>
            <p className="text-sm text-gray-600">AI Support for {company.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Customer Sentiment Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getSentimentColor(customerSentiment)}`}>
            {getSentimentIcon(customerSentiment)}
            <span className="text-sm font-medium capitalize">{customerSentiment}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${message.sender === 'user' ? 'bg-gray-600' : 'bg-blue-600'}`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.sentiment && (
                    <div className="ml-2">
                      {getSentimentIcon(message.sentiment)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-100">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['Track my order', 'Request refund', 'Technical support', 'Billing question'].map((action) => (
            <button
              key={action}
              onClick={() => setInputText(action)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
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