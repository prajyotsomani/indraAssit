import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowRight, Brain, Sparkles, QrCode, CreditCard, CheckCircle } from 'lucide-react';

interface Props {
  onSuccess: (paymentId: string, email: string) => void;
  onCancel: () => void;
}

const CheckoutSimulator: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [params, setParams] = useState({ plan: 'growth', email: 'founder@startup.io' });
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Extract parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan') || 'growth';
    const email = urlParams.get('email') || 'founder@startup.io';
    setParams({ plan, email });
  }, []);

  const getPlanDetails = () => {
    switch (params.plan) {
      case 'starter':
        return { name: 'Starter', price: '₹4,000', priceUSD: '$49', desc: '3 agents · 1k conversations/mo' };
      case 'enterprise':
        return { name: 'Enterprise', price: '₹80,000', priceUSD: '$999', desc: 'Unlimited · SLA · SSO' };
      case 'growth':
      default:
        return { name: 'Growth', price: '₹12,000', priceUSD: '$149', desc: '15 agents · 10k conversations/mo' };
    }
  };

  const planInfo = getPlanDetails();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentId.trim()) {
      setError('Please enter your Razorpay Payment ID.');
      return;
    }
    
    if (!paymentId.startsWith('pay_') || paymentId.length < 10) {
      setError('Invalid format! Razorpay Payment IDs start with "pay_" (e.g., pay_test_Op9x8y).');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/billing/verify-razorpay-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentId.trim(),
          email: params.email
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLoading(false);
        onSuccess(paymentId.trim(), params.email);
      } else {
        setLoading(false);
        setError(data.error || 'Verification failed. Please double check your Payment ID.');
      }
    } catch (err) {
      setLoading(false);
      setError('Server connection error. Please try again.');
    }
  };

  const handleAutoFill = () => {
    setPaymentId(`pay_test_${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
    setError('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://razorpay.me/@prajyotkumar');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', top: '-10%', left: '-15%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(51,153,255,0.15) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '880px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', position: 'relative', zIndex: 1 }}>
        
        {/* Left Panel: Razorpay Inbound Payment */}
        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', borderBottom: '1px solid var(--border)', paddingBottom: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', background: '#3399FF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>
                R
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>Razorpay Checkout <span style={{ fontSize: '0.72rem', color: '#3399FF', background: 'rgba(51,153,255,0.15)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Official Portal</span></span>
            </div>
            
            <button onClick={onCancel} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} className="hover:text-white">
              Cancel
            </button>
          </div>

          {/* Step 1: Redirect to pay */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Step 1: Complete Subscription Payment</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Click below to proceed to your secure Razorpay merchant page. You can pay instantly using **UPI (GPay/PhonePe), NetBanking, or Cards**.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', marginTop: '4px' }}>
              <a 
                href="https://razorpay.me/@prajyotkumar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary glow-primary"
                style={{ background: '#3399FF', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '0.85rem', fontWeight: '700', border: 'none' }}
              >
                Pay via Razorpay <ArrowRight size={15} />
              </a>
              <button 
                type="button" 
                onClick={handleCopyLink} 
                className="btn-ghost"
                style={{ padding: '12px', fontSize: '0.85rem', borderColor: copiedLink ? 'var(--success)' : 'var(--border)', color: copiedLink ? 'var(--success)' : 'var(--text-primary)' }}
              >
                {copiedLink ? (<><CheckCircle size={14} style={{ marginRight: '4px' }} /> Copied</>) : 'Copy Link'}
              </button>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          {/* Step 2: Input and verify */}
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Step 2: Verify & Activate Account</h3>
              <button type="button" onClick={handleAutoFill} style={{ fontSize: '0.72rem', color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Autofill Test ID
              </button>
            </div>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Once paid, copy your **Razorpay Payment ID** (starts with `pay_`, found on your payment receipt or email) and paste it below to instantly unlock your workspace.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Razorpay Payment Reference ID</label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  className="input-dark" 
                  placeholder="pay_Op9x8y7z..." 
                  value={paymentId}
                  onChange={e => setPaymentId(e.target.value)}
                  style={{ paddingLeft: '38px', fontFamily: 'monospace', letterSpacing: '0.05em' }} 
                />
              </div>
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 14px', borderRadius: 'var(--radius)' }}>{error}</p>}

            <button 
              className="btn-primary" 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#3399FF', fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.75 : 1, border: 'none', fontWeight: '700' }}
            >
              {loading ? 'Verifying payment...' : (<>Verify & Activate Workspace <Sparkles size={15} /></>)}
            </button>
          </form>

          {/* Secure lock */}
          <div style={{ display: 'flex', itemsCenter: 'center', justifyContent: 'center', gap: '16px', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} />
              <span>256-bit Secure verification</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} />
              <span>Razorpay Verified Merchant</span>
            </div>
          </div>

        </div>

        {/* Right Panel: Plan and Company Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
          
          {/* Brand branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: '800' }}>IndraAssist OS</span>
          </div>

          {/* Checkout billing details summary */}
          <div className="glass-strong" style={{ borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-card)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-light)', textTransform: 'uppercase', tracking: '0.05em' }}>Razorpay Plan billing</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '6px', marginBottom: '24px' }}>{planInfo.price} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/ Month</span></h3>

            {/* Plan item summary */}
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>IndraAssist - {planInfo.name} Plan</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{planInfo.desc}</div>
              </div>
            </div>

            {/* Price breakdown details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <span>Subtotal (INR)</span>
                <span>{planInfo.price}</span>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <span>USD equivalent</span>
                <span style={{ fontFamily: 'monospace' }}>{planInfo.priceUSD} / mo</span>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <span>Verification State</span>
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Awaiting ID</span>
              </div>
            </div>
          </div>

          {/* QR Code Graphic placeholder */}
          <div className="glass" style={{ borderRadius: 'var(--radius)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(51,153,255,0.15)' }}>
            <QrCode size={40} color="#3399FF" style={{ opacity: 0.8 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>UPI Scan & Pay Ready</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Use your BHIM UPI app on the Razorpay hosted payment page to scan and transfer instantly!</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutSimulator;
