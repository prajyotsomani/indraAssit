import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Settings, BarChart3, Users, Brain, Globe, Clock, 
  TrendingUp, Phone, Package, Ticket, Database, ShieldCheck, 
  CreditCard, Bell, Sparkles, LogOut, ChevronDown, CheckCircle2 
} from 'lucide-react';

import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import CompanyConfig from './components/CompanyConfig';
import Analytics from './components/Analytics';
import VoiceCallInterface from './components/VoiceCallInterface';
import OrderTracking from './components/OrderTracking';
import TicketManagement from './components/TicketManagement';
import DataManagement from './components/DataManagement';

import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import PricingPage from './components/billing/PricingPage';
import BillingDashboard from './components/billing/BillingDashboard';
import TeamManagement from './components/team/TeamManagement';
import AIInsightsHub from './components/ai/AIInsightsHub';
import IntegrationsHub from './components/integrations/IntegrationsHub';
import SLAManager from './components/compliance/SLAManager';
import UnifiedInbox from './components/inbox/UnifiedInbox';
import NotificationCenter, { NotificationItem } from './components/notifications/NotificationCenter';
import CheckoutSimulator from './components/billing/CheckoutSimulator';

type AppState = 'landing' | 'login' | 'signup' | 'pricing' | 'app' | 'checkout-simulator';

interface UserProfile {
  name: string;
  email: string;
  plan: string;
  company: string;
  industry: string;
  logo: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Custom company details that sync with Config tab
  const [currentCompany, setCurrentCompany] = useState({
    name: 'TechCorp Solutions',
    industry: 'Technology',
    primaryColor: '#6366f1',
    logo: '🏢'
  });

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'New WhatsApp Conversation',
      desc: 'Amit Kumar opened a live chat regarding check out.',
      timestamp: '10 mins ago',
      type: 'assignment',
      isRead: false
    },
    {
      id: 'notif_2',
      title: 'SLA Breach Warning',
      desc: 'Ticket #1823 (David Lee) has 15 minutes remaining before escalation.',
      timestamp: '30 mins ago',
      type: 'sla_warning',
      isRead: false
    },
    {
      id: 'notif_3',
      title: 'Growth Plan Activated',
      desc: 'Your Stripe payment was confirmed. Growth subscription benefits are now active.',
      timestamp: '2 hours ago',
      type: 'billing',
      isRead: true
    },
    {
      id: 'notif_4',
      title: 'High Rating Received',
      desc: 'Customer Sarah Jenkins left a 5.0 CSAT score on chat thread.',
      timestamp: '1 day ago',
      type: 'review',
      isRead: true
    }
  ]);

  // Dropdown states
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync user profile company details if updated
  useEffect(() => {
    if (user) {
      setCurrentCompany({
        name: user.company || 'TechCorp Solutions',
        industry: user.industry || 'Technology',
        primaryColor: '#6366f1',
        logo: user.logo || '🏢'
      });
    }
  }, [user]);

  // Listen for Stripe redirect URL query parameters & simulation routes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const email = urlParams.get('email');
    
    // Check if we are visiting the checkout simulator page
    if (window.location.pathname.includes('/checkout-simulator') || (urlParams.has('plan') && urlParams.has('session_id'))) {
      setAppState('checkout-simulator');
      return;
    }

    if (sessionId && email) {
      const verifyPayment = async () => {
        try {
          const response = await fetch(`/api/verify-session-proxy-placeholder-failed`); // Fallback safety
          // Real verify API endpoint call
          const realResponse = await fetch(`/api/billing/verify-session/${sessionId}?email=${email}`);
          const data = await realResponse.json();
          if (realResponse.ok && data.success) {
            setUser(data.user);
            setAppState('app');
            setActiveTab('dashboard');
            triggerToast('Payment Successful! Workspace Activated 🚀');
            window.history.replaceState({}, document.title, '/');
          }
        } catch (error) {
          console.error('Error verifying Stripe payment session:', error);
        }
      };
      verifyPayment();
    }
  }, []);

  // Navigation handlers
  const handleLoginSuccess = (userPayload: any) => {
    setUser(userPayload);
    setAppState('app');
    setActiveTab('dashboard');
    triggerToast('Logged in successfully!');
  };

  const handleSignupSuccess = (data: any) => {
    setUser({
      name: data.name || 'Founder Developer',
      email: data.email || 'founder@startup.io',
      plan: data.plan || 'growth',
      company: data.company || 'My Startup Ltd',
      industry: data.industry || 'Technology',
      logo: data.logo || '🚀'
    });
    setAppState('app');
    setActiveTab('dashboard');
    triggerToast('Account created! Welcome onboard.');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('landing');
    setShowProfileMenu(false);
    triggerToast('Logged out of workspace.');
  };

  const handleUpgradePlan = (planId: string) => {
    if (user) {
      setUser({ ...user, plan: planId });
    }
    setAppState('app');
    setActiveTab('billing');
    triggerToast(`Subscribed to ${planId.toUpperCase()} tier!`);
  };

  // Notifications actions
  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    triggerToast('All notifications marked read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    triggerToast('Notification drawer cleared.');
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  // Tabs structure
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inbox', label: 'Unified Inbox', icon: Globe, badge: '1' },
    { id: 'chat', label: 'Live Chat', icon: MessageCircle },
    { id: 'voice', label: 'Voice Calls', icon: Phone },
    { id: 'orders', label: 'Order Tracking', icon: Package },
    { id: 'tickets', label: 'Ticket Management', icon: Ticket },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'team', label: 'Team & Roster', icon: Users },
    { id: 'ai', label: 'AI Insights Hub', icon: Brain },
    { id: 'integrations', label: 'Integrations Hub', icon: Sparkles },
    { id: 'compliance', label: 'SLA & Compliance', icon: ShieldCheck, badge: '1 warning' },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'config', label: 'Company Setup', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard company={currentCompany} />;
      case 'inbox':
        return <UnifiedInbox />;
      case 'chat':
        return <ChatInterface company={currentCompany} />;
      case 'voice':
        return <VoiceCallInterface company={currentCompany} />;
      case 'orders':
        return <OrderTracking company={currentCompany} />;
      case 'tickets':
        return <TicketManagement company={currentCompany} />;
      case 'data':
        return <DataManagement company={currentCompany} />;
      case 'team':
        return <TeamManagement />;
      case 'ai':
        return <AIInsightsHub />;
      case 'integrations':
        return <IntegrationsHub />;
      case 'compliance':
        return <SLAManager />;
      case 'billing':
        return (
          <BillingDashboard 
            currentPlan={user?.plan || 'growth'} 
            onUpgrade={() => setAppState('pricing')} 
            onDowngrade={(newPlan) => {
              if (user) setUser({ ...user, plan: newPlan });
              triggerToast('Subscription updated.');
            }}
            userCompany={currentCompany}
          />
        );
      case 'config':
        return <CompanyConfig company={currentCompany} setCompany={setCurrentCompany} />;
      case 'analytics':
        return <Analytics company={currentCompany} />;
      default:
        return <Dashboard company={currentCompany} />;
    }
  };

  // Switch between layout routers
  if (appState === 'checkout-simulator') {
    return (
      <CheckoutSimulator 
        onSuccess={(verifiedUser) => {
          setUser(verifiedUser);
          setAppState('app');
          setActiveTab('dashboard');
          triggerToast('Workspace Activated via Razorpay! 🚀');
          window.history.replaceState({}, document.title, '/');
        }} 
        onCancel={() => {
          setAppState('landing');
          window.history.replaceState({}, document.title, '/');
        }}
      />
    );
  }

  if (appState === 'landing') {
    return (
      <LandingPage 
        onLogin={() => setAppState('login')} 
        onSignup={() => setAppState('signup')} 
        onPricing={() => setAppState('pricing')} 
      />
    );
  }

  if (appState === 'login') {
    return (
      <LoginPage 
        onLogin={handleLoginSuccess} 
        onSignup={() => setAppState('signup')} 
        onBack={() => setAppState('landing')} 
      />
    );
  }

  if (appState === 'signup') {
    return (
      <SignupPage 
        onComplete={handleSignupSuccess} 
        onLogin={() => setAppState('login')} 
      />
    );
  }

  if (appState === 'pricing') {
    return (
      <PricingPage 
        currentPlan={user?.plan || ''} 
        onBack={() => {
          if (user) setAppState('app');
          else setAppState('landing');
        }} 
        onSuccess={() => handleUpgradePlan('growth')} 
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
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

      {/* Header bar */}
      <header className="glass" style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Branding */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg shadow-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight">IndraAssist</h1>
                <p className="text-xs text-slate-400" style={{ fontSize: '0.68rem' }}>Enterprise Support OS</p>
              </div>
            </div>

            {/* Center: Live indicator */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-emerald-400">AI Agents Active</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Context:</span>
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-base leading-none">{currentCompany.logo}</span>
                  <span className="text-xs font-bold text-indigo-400">{currentCompany.name}</span>
                </div>
              </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {user?.plan !== 'enterprise' && (
                <button 
                  onClick={() => setAppState('pricing')}
                  className="btn-primary hidden sm:flex items-center gap-1.5" 
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  <Sparkles size={13} /> Upgrade Plan
                </button>
              )}

              {/* Notification Bell */}
              <button 
                onClick={() => setShowNotifications(true)}
                className="btn-ghost relative flex items-center justify-center w-9 h-9 rounded-lg" 
                style={{ padding: 0 }}
              >
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                  <span className="notif-dot animate-pulse-glow" style={{ top: '6px', right: '6px' }} />
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="btn-ghost flex items-center space-x-2 px-2 py-1 rounded-lg"
                  style={{ padding: '4px 8px' }}
                >
                  <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'PS'}
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showProfileMenu && (
                  <>
                    <div onClick={() => setShowProfileMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 110 }} />
                    <div className="glass-strong animate-fadeIn" style={{
                      position: 'absolute', right: 0, marginTop: '8px', width: '220px', 
                      borderRadius: 'var(--radius)', border: '1px solid var(--border-strong)',
                      padding: '8px', zIndex: 120, boxShadow: 'var(--shadow-card)'
                    }}>
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name || 'Priya Sharma'}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email || 'priya@techcorp.com'}</div>
                        <div className="badge badge-purple" style={{ fontSize: '0.55rem', padding: '1px 6px', marginTop: '6px' }}>{user?.plan ? user.plan.toUpperCase() : 'GROWTH'} PLAN</div>
                      </div>
                      
                      <button 
                        onClick={() => { setActiveTab('billing'); setShowProfileMenu(false); }}
                        style={{ width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: '0.8rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '4px' }}
                        className="hover:bg-white/5 hover:text-white"
                      >
                        Billing & Usage
                      </button>
                      <button 
                        onClick={() => { setActiveTab('config'); setShowProfileMenu(false); }}
                        style={{ width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: '0.8rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '4px' }}
                        className="hover:bg-white/5 hover:text-white"
                      >
                        Workspace Settings
                      </button>
                      
                      <div className="divider" style={{ margin: '6px 0' }} />
                      
                      <button 
                        onClick={handleLogout}
                        style={{ width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: '0.8rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        className="hover:bg-white/5"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Workspace layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="glass rounded-xl p-3 space-y-1">
              <span className="block px-3 text-2xs font-bold tracking-wider text-slate-500 uppercase mb-3 mt-1" style={{ fontSize: '0.65rem' }}>
                WORKSPACE MANAGEMENT
              </span>
              
              <div className="space-y-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`nav-item w-full ${isActive ? 'active' : ''}`}
                      style={{ border: 'none', background: 'transparent', outline: 'none' }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-semibold text-xs flex-1 text-left">{tab.label}</span>
                      {tab.badge && (
                        <span className={`badge badge-${tab.badge.includes('warning') ? 'warning' : 'info'}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>
                          {tab.badge.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Quick metrics panel */}
              <div className="mt-6 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <h4 style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Daily KPI Status</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Live Sessions</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Resolved Chats</span>
                    <span className="font-semibold text-emerald-400">312</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">SLA Success</span>
                    <span className="font-semibold text-indigo-400">98.2%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Response Speed</span>
                    <span className="font-semibold text-violet-400">0.8s</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Main workspace component display */}
          <div className="flex-1 min-w-0">
            {renderActiveComponent()}
          </div>

        </div>
      </div>

      {/* Slide-out Notification Center Drawer */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export default App;