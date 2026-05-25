import React, { useState } from 'react';
import { Check, CreditCard, Shield, Zap, Lock, ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
  currentPlan?: string;
}

const PricingPage: React.FC<Props> = ({ onBack, onSuccess, currentPlan = '' }) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [selected, setSelected] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null);

  const plans = [
    {
      id: 'starter', name: 'Starter', monthlyPrice: 49, annualPrice: 39,
      color: '#06b6d4', glow: 'rgba(6,182,212,0.2)',
      desc: 'Perfect for small support teams getting started with AI.',
      features: ['1 Workspace', '3 Agent seats', '1,000 conversations/mo', 'Live chat widget', 'Basic analytics', 'Email support', 'Standard AI responses', '5 automation rules'],
    },
    {
      id: 'growth', name: 'Growth', monthlyPrice: 149, annualPrice: 119,
      color: '#6366f1', glow: 'rgba(99,102,241,0.25)', popular: true,
      desc: 'For scaling teams that need advanced AI and analytics.',
      features: ['5 Workspaces', '15 Agent seats', '10,000 conversations/mo', 'Voice AI calls', 'Advanced analytics', 'Priority support', 'Custom AI persona', 'Unlimited automation', 'Ticket management', 'WhatsApp integration', 'API access', 'Team management'],
    },
    {
      id: 'enterprise', name: 'Enterprise', monthlyPrice: null, annualPrice: null,
      color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)',
      desc: 'For large-scale operations with enterprise security needs.',
      features: ['Unlimited workspaces', 'Unlimited agents', 'Unlimited conversations', 'All channels', 'Custom SLA & compliance', 'Dedicated success manager', 'SSO / SAML', 'Custom AI training', 'On-premise option', 'SLA guarantee', 'GDPR compliance tools', 'Custom integrations'],
    },
  ];

  const handleSelectPlan = (plan: any) => {
    if (plan.id === 'enterprise') {
      alert('Our team will contact you for a custom quote! 📞');
      return;
    }
    setCheckoutPlan(plan);
    setShowCheckout(true);
  };

  if (showCheckout && checkoutPlan) {
    return <CheckoutModal plan={checkoutPlan} billing={billing} onBack={() => setShowCheckout(false)} onSuccess={onSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <button className="btn-ghost" onClick={onBack} style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="badge badge-purple" style={{ marginBottom: '16px' }}>Pricing</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '16px' }}>
            Simple, <span className="gradient-text">transparent pricing</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>Start free for 14 days. No credit card required.</p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '99px', padding: '4px', gap: '4px' }}>
            <button className={`plan-toggle-btn ${billing === 'monthly' ? 'active' : 'inactive'}`} onClick={() => setBilling('monthly')}>Monthly</button>
            <button className={`plan-toggle-btn ${billing === 'annual' ? 'active' : 'inactive'}`} onClick={() => setBilling('annual')}>
              Annual <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', padding: '2px 6px', borderRadius: '99px', fontSize: '0.65rem', marginLeft: '4px' }}>Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {plans.map((plan) => {
            const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            const isCurrent = currentPlan === plan.id;
            return (
              <div key={plan.id} className={`hover-lift ${plan.popular ? 'pricing-popular' : 'stat-card'}`}
                style={{ borderRadius: 'var(--radius-xl)', padding: '32px', position: 'relative', transform: plan.popular ? 'scale(1.03)' : 'scale(1)' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-primary)', borderRadius: '99px', padding: '4px 20px', fontSize: '0.75rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap' }}>
                    ⭐ Most Popular
                  </div>
                )}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${plan.glow}`, border: `1px solid ${plan.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Zap size={22} color={plan.color} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '6px' }}>{plan.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '20px' }}>{plan.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    {price !== null ? (
                      <>
                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: plan.color }}>${price}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '2rem', fontWeight: '900', color: plan.color }}>Custom</span>
                    )}
                  </div>
                  {billing === 'annual' && price && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '4px' }}>Billed ${price! * 12}/year · Save ${(((billing === 'annual' ? plan.monthlyPrice! : plan.annualPrice!) - price) * 12)}/yr</p>
                  )}
                </div>

                <button
                  className="btn-primary"
                  onClick={() => handleSelectPlan(plan)}
                  style={{ width: '100%', padding: '12px', marginBottom: '24px', background: isCurrent ? 'rgba(255,255,255,0.08)' : (plan.popular ? 'var(--gradient-primary)' : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`), opacity: isCurrent ? 0.7 : 1 }}
                >
                  {isCurrent ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: `${plan.color}20`, border: `1px solid ${plan.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={11} color={plan.color} />
                      </div>
                      <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust section */}
        <div style={{ marginTop: '60px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {[{ icon: Shield, text: 'SOC 2 Type II Certified' }, { icon: Lock, text: 'GDPR Compliant' }, { icon: CreditCard, text: 'Secure Payments via Stripe' }].map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Icon size={16} color="var(--primary-light)" /> {t.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============= Checkout Modal ============= */
const CheckoutModal: React.FC<{ plan: any; billing: string; onBack: () => void; onSuccess: () => void }> = ({ plan, billing, onBack, onSuccess }) => {
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const finalPrice = couponApplied ? Math.round(price * 0.8) : price;

  const formatCard = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('success'); setTimeout(onSuccess, 2000); }, 2000);
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'INDRA20') setCouponApplied(true);
    else alert('Invalid coupon code');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {step === 'success' ? (
        <div className="animate-fadeInUp" style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid var(--success)', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
            <Check size={40} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '12px' }}>Payment Successful! 🎉</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to {plan.name} plan. Redirecting to dashboard...</p>
        </div>
      ) : (
        <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '560px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Pricing
          </button>
          <div className="glass" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '24px 32px', background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>Complete your purchase</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>IndraAssist {plan.name} Plan · 14-day free trial</p>
            </div>

            <div style={{ padding: '32px' }}>
              {/* Order summary */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{plan.name} ({billing})</span>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>${price}/mo</span>
                </div>
                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Coupon INDRA20 (-20%)</span>
                    <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>-${price - finalPrice}</span>
                  </div>
                )}
                <div className="divider" style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700' }}>Total today</span>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary-light)' }}>${finalPrice}/mo</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>You won't be charged during your 14-day trial.</p>
              </div>

              {/* Coupon */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <input className="input-dark" placeholder="Coupon code (try INDRA20)" value={coupon} onChange={e => setCoupon(e.target.value)} />
                <button className="btn-ghost" onClick={applyCoupon} style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: '0.85rem' }}>Apply</button>
              </div>

              {/* Card form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Cardholder Name</label>
                  <input className="input-dark" placeholder="Priya Sharma" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-dark" placeholder="4242 4242 4242 4242" value={card.number} onChange={e => setCard({ ...card, number: formatCard(e.target.value) })} style={{ paddingLeft: '38px' }} maxLength={19} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Expiry</label>
                    <input className="input-dark" placeholder="MM/YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })} maxLength={5} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>CVC</label>
                    <input className="input-dark" placeholder="•••" type="password" value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })} maxLength={3} />
                  </div>
                </div>
              </div>

              <button className="btn-primary glow-primary" onClick={handlePay} disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                <Lock size={16} /> {loading ? 'Processing...' : `Start Free Trial — $0 today`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                {['🔒 SSL Encrypted', 'Stripe Secured', 'Cancel Anytime'].map((t, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
