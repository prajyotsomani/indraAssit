import React, { useState, useEffect } from 'react';
import { MessageCircle, Settings, BarChart3, Users, Brain, Globe, Clock, TrendingUp, Phone, Package, Ticket, Database } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import CompanyConfig from './components/CompanyConfig';
import Analytics from './components/Analytics';
import VoiceCallInterface from './components/VoiceCallInterface';
import OrderTracking from './components/OrderTracking';
import TicketManagement from './components/TicketManagement';
import DataManagement from './components/DataManagement';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentCompany, setCurrentCompany] = useState({
    name: 'TechCorp Solutions',
    industry: 'Technology',
    primaryColor: '#2563EB',
    logo: '🏢'
  });

  const tabs = [
    { id: 'chat', label: 'Live Chat', icon: MessageCircle },
    { id: 'voice', label: 'Voice Calls', icon: Phone },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Order Tracking', icon: Package },
    { id: 'tickets', label: 'Ticket Management', icon: Ticket },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'config', label: 'Company Setup', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface company={currentCompany} />;
      case 'voice':
        return <VoiceCallInterface company={currentCompany} />;
      case 'dashboard':
        return <Dashboard company={currentCompany} />;
      case 'orders':
        return <OrderTracking company={currentCompany} />;
      case 'tickets':
        return <TicketManagement company={currentCompany} />;
      case 'data':
        return <DataManagement company={currentCompany} />;
      case 'config':
        return <CompanyConfig company={currentCompany} setCompany={setCurrentCompany} />;
      case 'analytics':
        return <Analytics company={currentCompany} />;
      default:
        return <ChatInterface company={currentCompany} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IndraAssist</h1>
                <p className="text-sm text-gray-500">Advanced AI Support System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">AI System Online</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Current Company:</span>
                <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-md">
                  <span className="text-lg">{currentCompany.logo}</span>
                  <span className="text-sm font-medium text-blue-700">{currentCompany.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Navigation
              </h3>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Live Sessions</span>
                    <span className="text-sm font-semibold text-blue-600">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resolved Today</span>
                    <span className="text-sm font-semibold text-green-600">312</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Response</span>
                    <span className="text-sm font-semibold text-purple-600">0.8s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Open Tickets</span>
                    <span className="text-sm font-semibold text-orange-600">3</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;