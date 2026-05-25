import React, { useState } from 'react';
import { CreditCard, Download, ShieldCheck, HelpCircle, AlertTriangle, ArrowUpRight, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  currentPlan: string;
  onUpgrade: () => void;
  onDowngrade: (planId: string) => void;
  userCompany?: {
    name: string;
    industry: string;
  };
}

const BillingDashboard: React.FC<Props> = ({ currentPlan, onUpgrade, onDowngrade, userCompany }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'pm_1', brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2028, isDefault: true },
    { id: 'pm_2', brand: 'Mastercard', last4: '8888', expMonth: 6, expYear: 2029, isDefault: false }
  ]);
  const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-005', date: '2026-05-01', amount: 149.00, status: 'Paid', plan: 'Growth Plan' },
    { id: 'INV-2026-004', date: '2026-04-01', amount: 149.00, status: 'Paid', plan: 'Growth Plan' },
    { id: 'INV-2026-003', date: '2026-03-01', amount: 149.00, status: 'Paid', plan: 'Growth Plan' },
    { id: 'INV-2026-002', date: '2026-02-01', amount: 49.00, status: 'Paid', plan: 'Starter Plan' },
    { id: 'INV-2026-001', date: '2026-01-15', amount: 0.00, status: 'Paid', plan: 'Trial Session' }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const getPlanDetails = () => {
    switch (currentPlan.toLowerCase()) {
      case 'starter':
        return { name: 'Starter Plan', price: 49, maxAgents: 3, maxConvs: 1000, maxWorkspaces: 1 };
      case 'growth':
      default:
        return { name: 'Growth Plan', price: 149, maxAgents: 15, maxConvs: 10000, maxWorkspaces: 5 };
      case 'enterprise':
        return { name: 'Enterprise Plan', price: null, maxAgents: 999, maxConvs: 99999, maxWorkspaces: 999 };
    }
  };

  const plan = getPlanDetails();

  // Usage details (simulated)
  const usage = {
    agents: 6,
    conversations: 4320,
    workspaces: 2
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.number || !newCard.expiry || !newCard.cvc) {
      alert('Please fill out all card fields.');
      return;
    }
    const cleanNumber = newCard.number.replace(/\s/g, '');
    const last4 = cleanNumber.slice(-4) || '1111';
    const brand = cleanNumber.startsWith('5') ? 'Mastercard' : 'Visa';
    const [month, year] = newCard.expiry.split('/');
    
    const newMethod = {
      id: `pm_${Date.now()}`,
      brand,
      last4,
      expMonth: parseInt(month) || 12,
      expYear: parseInt(year) ? 2000 + parseInt(year) : 2028,
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddCard(false);
    setNewCard({ name: '', number: '', expiry: '', cvc: '' });
    showToast('Payment method added successfully!');
  };

  const handleDeleteCard = (id: string) => {
    const cardToDelete = paymentMethods.find(c => c.id === id);
    if (cardToDelete?.isDefault) {
      alert('Cannot delete the default payment method.');
      return;
    }
    setPaymentMethods(paymentMethods.filter(c => c.id !== id));
    showToast('Payment method removed.');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(c => ({
      ...c,
      isDefault: c.id === id
    })));
    showToast('Default payment method updated.');
  };

  const downloadInvoice = (invId: string) => {
    showToast(`Downloading invoice ${invId}.pdf...`);
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(false);
    onDowngrade('free');
    showToast('Your plan has been downgraded to the free tier.');
  };

  const handleAcceptRetentionOffer = () => {
    setShowCancelModal(false);
    showToast('Thank you! A 50% discount has been applied to your next 3 months.');
  };

  return (
    <div className="animate-fadeInUp" style={{ color: 'var(--text-primary)' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', 
          background: 'var(--bg-surface)', border: '1px solid var(--success)', 
          borderRadius: 'var(--radius)', padding: '12px 24px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'slideInRight 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="var(--success)" />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>Billing Dashboard</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Manage Subscriptions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Control billing cycles, payment setups, and view historical invoices.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={onUpgrade} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Upgrade Plan <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Active Plan summary */}
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', justifyItems: 'center', gap: '8px' }}>
              <span>Current Subscription</span>
            </h3>
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', marginBottom: '16px' }}>
              <div>
                <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '900' }}>{plan.name}</span>
                {plan.price !== null ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Billed monthly at <strong>${plan.price}</strong>/mo</p>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Custom Enterprise Agreement</p>
                )}
              </div>
              <div className="badge badge-success" style={{ height: 'fit-content' }}>Active</div>
            </div>
            
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              Next renewal date: <strong>June 1, 2026</strong>. Billed to primary Visa ending in 4242.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <button className="btn-ghost" onClick={onUpgrade} style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}>Change Plan</button>
            {currentPlan !== 'free' && (
              <button 
                className="btn-ghost" 
                onClick={() => setShowCancelModal(true)} 
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', borderColor: 'rgba(239,68,68,0.2)', color: 'var(--danger)' }}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Usage meters */}
        <div className="stat-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Usage This Month</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Conversations */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Conversations</span>
                <span style={{ fontWeight: 600 }}>{usage.conversations.toLocaleString()} / {plan.maxConvs.toLocaleString()}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(usage.conversations / plan.maxConvs) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}></div>
              </div>
            </div>

            {/* Agent seats */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Agent Seats</span>
                <span style={{ fontWeight: 600 }}>{usage.agents} / {plan.maxAgents}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(usage.agents / plan.maxAgents) * 100}%`, background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }}></div>
              </div>
            </div>

            {/* Workspaces */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Connected Workspaces</span>
                <span style={{ fontWeight: 600 }}>{usage.workspaces} / {plan.maxWorkspaces}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(usage.workspaces / plan.maxWorkspaces) * 100}%`, background: 'linear-gradient(90deg, #ef4444, #8b5cf6)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '12px', marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <ShieldCheck size={16} color="var(--primary-light)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Quota resets in <strong>6 days</strong> (June 1). Additional usage is automatically queued.
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Payment Methods */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Payment Methods</h3>
            {!showAddCard && (
              <button 
                onClick={() => setShowAddCard(true)}
                className="btn-ghost" 
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={14} /> Add Card
              </button>
            )}
          </div>

          {showAddCard ? (
            <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Name on Card</label>
                <input className="input-dark" required placeholder="Cardholder name" value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} style={{ padding: '8px 12px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Card Number</label>
                <input 
                  className="input-dark" 
                  required
                  placeholder="4242 4242 4242 4242" 
                  value={newCard.number} 
                  onChange={e => setNewCard({...newCard, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)})} 
                  style={{ padding: '8px 12px' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Expiry</label>
                  <input 
                    className="input-dark" 
                    required
                    placeholder="MM/YY" 
                    value={newCard.expiry} 
                    onChange={e => setNewCard({...newCard, expiry: e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5)})} 
                    style={{ padding: '8px 12px' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>CVC</label>
                  <input 
                    className="input-dark" 
                    required
                    placeholder="123" 
                    type="password"
                    value={newCard.cvc} 
                    onChange={e => setNewCard({...newCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 3)})} 
                    style={{ padding: '8px 12px' }} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}>Save Card</button>
                <button type="button" className="btn-ghost" onClick={() => setShowAddCard(false)} style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentMethods.map((method) => (
                <div key={method.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: method.isDefault ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '28px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={16} color="var(--primary-light)" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{method.brand} •••• {method.last4}</span>
                        {method.isDefault && <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>Default</span>}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expires {method.expMonth}/{method.expYear}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!method.isDefault && (
                      <button 
                        className="btn-ghost" 
                        onClick={() => handleSetDefault(method.id)} 
                        style={{ padding: '4px 8px', fontSize: '0.7rem', border: 'none' }}
                      >
                        Set Default
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteCard(method.id)}
                      className="btn-ghost" 
                      style={{ padding: '6px', border: 'none', color: 'var(--danger)' }}
                      title="Delete card"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoice History */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Invoices</h3>
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px', fontWeight: 500 }}>ID</th>
                  <th style={{ padding: '10px 8px', fontWeight: 500 }}>Date</th>
                  <th style={{ padding: '10px 8px', fontWeight: 500 }}>Plan</th>
                  <th style={{ padding: '10px 8px', fontWeight: 500 }}>Amount</th>
                  <th style={{ padding: '10px 8px', fontWeight: 500, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>{inv.id}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{inv.date}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{inv.plan}</span>
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>${inv.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button 
                        className="btn-ghost" 
                        onClick={() => downloadInvoice(inv.id)}
                        style={{ padding: '6px', border: 'none', background: 'transparent' }}
                      >
                        <Download size={14} color="var(--primary-light)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancellation Modal (with Retention Offer) */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="glass-strong" style={{ width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-card)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--danger)' }} />
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'start', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={24} color="var(--danger)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>Wait! Don't leave just yet...</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  We are sad to see you go. Since you've been with us, we've saved you over 4,320 conversations from human routing.
                </p>
              </div>
            </div>

            {/* Special Retention offer */}
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
              <span className="badge badge-purple" style={{ marginBottom: '8px' }}>Exclusive Loyalty Offer</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '6px' }}>50% OFF for 3 Months</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '16px' }}>
                Apply this coupon immediately to reduce your bill to just <strong>$74.50/mo</strong>. Keep all your settings, team configuration and history.
              </p>
              <button 
                className="btn-primary" 
                onClick={handleAcceptRetentionOffer}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
              >
                Apply Offer & Stay
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-ghost" 
                onClick={handleCancelSubscription} 
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
              >
                Downgrade to Free
              </button>
              <button 
                className="btn-ghost" 
                onClick={() => setShowCancelModal(false)} 
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                Nevermind
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingDashboard;
