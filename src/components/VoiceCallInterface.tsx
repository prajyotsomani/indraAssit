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
  CheckCircle
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
    setAiResponse('Hello! This is IndraAssist AI support for ' + company.name + '. How can I help you today?');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-50';
      case 'escalated':
        return 'text-red-600 bg-red-50';
      case 'ongoing':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ongoing':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Call Interface */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Phone className="w-6 h-6 mr-2 text-blue-600" />
            Voice Call Interface
          </h2>
          <p className="text-sm text-gray-600 mt-1">AI-powered voice support for {company.name}</p>
        </div>

        <div className="p-6">
          {!isCallActive ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mx-auto mb-6">
                <PhoneCall className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Receive Calls</h3>
              <p className="text-gray-600 mb-6">IndraAssist is ready to handle customer voice calls</p>
              <button
                onClick={handleIncomingCall}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Phone className="w-5 h-5" />
                <span>Simulate Incoming Call</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Call Header */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{currentCustomer}</p>
                    <p className="text-sm text-gray-600">Call Duration: {formatDuration(callDuration)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">Active Call</span>
                </div>
              </div>

              {/* Conversation Display */}
              <div className="space-y-4">
                {/* AI Response */}
                {aiResponse && (
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900">{aiResponse}</p>
                      <span className="text-xs text-gray-500 mt-2 block">AI Response</span>
                    </div>
                  </div>
                )}

                {/* Customer Speech */}
                {transcript && (
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="flex-1 bg-gray-100 rounded-lg p-4 max-w-md">
                      <p className="text-sm text-gray-900">{transcript}</p>
                      <span className="text-xs text-gray-500 mt-2 block">Customer</span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Listening Indicator */}
                {isListening && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-700">Listening to customer...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center space-x-4 pt-6 border-t">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={simulateVoiceRecognition}
                  disabled={isListening}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isListening ? 'Listening...' : 'Listen to Customer'}
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`p-3 rounded-full ${!isSpeakerOn ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors`}
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call Logs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Call Logs</h3>
          <p className="text-sm text-gray-600 mt-1">Voice call history and outcomes</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {callLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{log.customerPhone}</p>
                    <p className="text-sm text-gray-600">{log.issue}</p>
                    <p className="text-xs text-gray-500">
                      {log.timestamp.toLocaleString()} • Duration: {log.duration}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getStatusColor(log.status)}`}>
                  {getStatusIcon(log.status)}
                  <span className="text-sm font-medium capitalize">{log.status}</span>
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