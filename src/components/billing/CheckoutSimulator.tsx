import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowRight, Brain, Sparkles, QrCode, CreditCard, AlertCircle } from 'lucide-react';

interface Props {
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

const CheckoutSimulator: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [params, setParams] = useState({ plan: 'growth', email: 'founder@startup.io' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyId, setKeyId] = useState('');

  useEffect(() => {
    // 1. Extract parameters from URL query
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan') || 'growth';
    const email = urlParams.get('email') || 'founder@startup.io';
    setParams({ plan, email });

    // 2. Fetch Razorpay key configuration dynamically
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/billing/config');
        const data = await response.json();
        if (response.ok && data.key_id) {
          setKeyId(data.key_id);
        } else {
          setError('Failed to load payment configuration keys from the server.');
        }
      } catch (err) {
        setError('Unable to reach backend to fetch API credentials.');
      }
    };
    fetchConfig();
  }, []);

  const getPlanDetails = () => {
    switch (params.plan) {
      case 'starter':
        return { name: 'Starter', priceINR: 49, pricePaise: 4900, desc: '3 agents · 1k conversations/mo' };
      case 'enterprise':
        return { name: 'Enterprise', priceINR: 999, pricePaise: 99900, desc: 'Unlimited · SLA · SSO' };
      case 'growth':
      default:
        return { name: 'Growth', priceINR: 149, pricePaise: 14900, desc: '15 agents · 10k conversations/mo' };
    }
  };

  const planInfo = getPlanDetails();

  const handleRazorpayCheckout = async () => {
    if (!keyId) {
      setError('Razorpay credentials have not loaded. Please try again.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Create order on the backend Express server
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: planInfo.pricePaise,
          currency: 'INR',
          email: params.email,
          plan: params.plan
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to create order on the server.');
      }

      // 2. Check if Razorpay SDK is present on window
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay SDK is not loaded. Ensure checkout.js is available.');
      }

      // 3. Configure the official Razorpay Checkout Options
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'IndraAssist OS',
        description: `IndraAssist - ${planInfo.name} Tier Subscription`,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&h=256&fit=crop',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Trigger signature verification on backend
          setLoading(true);
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: params.email
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              setLoading(false);
              onSuccess(verifyData.user);
            } else {
              setLoading(false);
              setError(verifyData.error || 'Payment verification mismatch. Access denied.');
            }
          } catch (verr) {
            setLoading(false);
            setError('Payment succeeded but verification failed due to connection error.');
          }
        },
        prefill: {
          name: 'Startup Founder',
          email: params.email,
          contact: '9999999999'
        },
        theme: {
          color: '#3399FF'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled. You closed the checkout modal.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        setLoading(false);
        setError(`Payment failed: ${response.error.description} (Error Code: ${response.error.code})`);
      });

      // 4. Fire the modal!
      rzp.open();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An error occurred while launching Razorpay checkout.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', top: '-10%', left: '-15%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(51,153,255,0.15) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '850px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', position: 'relative', zIndex: 1 }}>
        
        {/* Left Panel: Razorpay Secure Launch */}
        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between', borderBottom: '1px solid var(--border)', paddingBottom: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', background: '#3399FF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>
                R
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>Razorpay Checkout <span style={{ fontSize: '0.72rem', color: '#3399FF', background: 'rgba(51,153,255,0.15)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>SDK Standard</span></span>
            </div>
            
            <button onClick={onCancel} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} className="hover:text-white">
              Cancel
            </button>
          </div>

          {/* Secure details instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Complete Subscription Payment</h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              To activate your workspace, please complete the payment using the official Razorpay Checkout gateway.
            </p>

            {/* Test credential notice cards */}
            <div style={{ background: 'rgba(51,153,255,0.06)', border: '1px dashed rgba(51,153,255,0.3)', borderRadius: 'var(--radius)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3399FF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Razorpay Test Mode Credentials
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: 'var(--text-secondary)', paddingLeft: '4px' }}>
                <div>• **Card Number**: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>4111 1111 1111 1111</span></div>
                <div>• **Expiry**: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>12/26</span> · **CVV**: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>123</span></div>
                <div>• **Test UPI VPA**: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>test@razorpay</span></div>
              </div>
            </div>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 14px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button 
              onClick={handleRazorpayCheckout}
              disabled={loading || !keyId}
              className="btn-primary glow-primary"
              style={{ width: '100%', padding: '14px', background: '#3399FF', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (loading || !keyId) ? 0.75 : 1, border: 'none', fontWeight: '700' }}
            >
              {loading ? 'Processing Payment...' : (<>Pay ₹{planInfo.priceINR}.00 with Razorpay <ArrowRight size={16} /></>)}
            </button>
          </div>

          {/* Secure indicator locks */}
          <div style={{ display: 'flex', itemsCenter: 'center', justifyContent: 'center', gap: '16px', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} />
              <span>TLS 256-bit Secure Gateway</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} />
              <span>Razorpay Verified API Merchant</span>
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
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-light)', textTransform: 'uppercase', tracking: '0.05em' }}>Razorpay subscription billing</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '6px', marginBottom: '24px' }}>₹{planInfo.priceINR}.00 <span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/ Month</span></h3>

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
                <span>₹{planInfo.priceINR}.00</span>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <span>USD equivalent</span>
                <span style={{ fontFamily: 'monospace' }}>{planInfo.priceUSD} / mo</span>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'between' }}>
                <span>Verification State</span>
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Real-Time Verification</span>
              </div>
            </div>
          </div>

          {/* QR Code Graphic placeholder */}
          <div className="glass" style={{ borderRadius: 'var(--radius)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(51,153,255,0.15)' }}>
            <QrCode size={40} color="#3399FF" style={{ opacity: 0.8 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>UPI Scan & Pay Ready</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Natively supports scan & pay via any UPI app (GPay, PhonePe, Paytm) inside the checkout portal!</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutSimulator;
