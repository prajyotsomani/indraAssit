import React, { useState } from 'react';
import { Brain, User, Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Check, ChevronRight } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
  onLogin: () => void;
}

const steps = ['Account', 'Company', 'Plan', 'Done'];

const SignupPage: React.FC<Props> = ({ onComplete, onLogin }) => {
  const [step, setStep] = useState(0);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    company: '', industry: 'Technology', size: '1-10',
    plan: 'growth'
  });

  const industries = ['Technology', 'E-commerce', 'Banking & Finance', 'Healthcare', 'Retail', 'Education', 'Travel', 'Real Estate'];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const plans = [
    { id: 'starter', name: 'Starter', price: '$49', desc: '3 agents · 1k conversations/mo', color: '#06b6d4' },
    { id: 'growth', name: 'Growth', price: '$149', desc: '15 agents · 10k conversations/mo', color: '#6366f1', popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', desc: 'Unlimited · SLA · SSO', color: '#8b5cf6' },
  ];

  const next = async () => {
    if (step < steps.length - 1) {
      if (step === steps.length - 2) {
        setLoading(true);
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: form.email,
              name: form.name,
              company: form.company,
              industry: form.industry,
              plan: form.plan
            })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
          }
          setForm(prev => ({ ...prev, ...data.user }));
          setLoading(false);
          setStep(s => s + 1);
        } catch (err: any) {
          setLoading(false);
          alert(err.message || 'Signup failed. Please try again.');
        }
      } else {
        setStep(s => s + 1);
      }
    }
  };

  const finish = () => onComplete(form);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--gradient-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>IndraAssist</span>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '32px' }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div className={`step-circle ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.7rem', color: i === step ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: i === step ? '600' : '400' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ height: '2px', width: '60px', background: i < step ? 'var(--primary)' : 'var(--border)', marginBottom: '24px', transition: 'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '40px' }}>
          {/* Step 0: Account */}
          {step === 0 && (
            <div className="animate-fadeInUp">
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>Create your account</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '28px' }}>Start your 14-day free trial. No credit card required.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-dark" placeholder="Priya Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ paddingLeft: '38px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Work Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-dark" type="email" placeholder="priya@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: '38px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-dark" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: '38px', paddingRight: '38px' }} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Company */}
          {step === 1 && (
            <div className="animate-fadeInUp">
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>Tell us about your company</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '28px' }}>We'll customize IndraAssist for your industry.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Company Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-dark" placeholder="Acme Corp" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={{ paddingLeft: '38px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Industry</label>
                  <select className="input-dark" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Team Size</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {sizes.map(s => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, size: s })} style={{
                        padding: '8px 4px', borderRadius: 'var(--radius)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                        background: form.size === s ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)',
                        border: `1px solid ${form.size === s ? 'var(--primary)' : 'var(--border)'}`,
                        color: form.size === s ? 'var(--primary-light)' : 'var(--text-secondary)',
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Plan */}
          {step === 2 && (
            <div className="animate-fadeInUp">
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>Choose your plan</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '28px' }}>14-day free trial on all plans. Change anytime.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {plans.map(p => (
                  <button key={p.id} type="button" onClick={() => setForm({ ...form, plan: p.id })} style={{
                    padding: '16px', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                    background: form.plan === p.id ? 'rgba(99,102,241,0.12)' : 'var(--bg-card)',
                    border: `1px solid ${form.plan === p.id ? 'var(--primary)' : 'var(--border)'}`,
                    position: 'relative',
                  }}>
                    {p.popular && <span className="badge badge-info" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.65rem' }}>Popular</span>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: `2px solid ${form.plan === p.id ? 'var(--primary)' : 'var(--border)'}`, background: form.plan === p.id ? 'var(--primary)' : 'transparent', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{p.name}</span>
                          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: p.color }}>{p.price}<span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>{p.price !== 'Custom' ? '/mo' : ''}</span></span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="animate-fadeInUp" style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid var(--success)', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                <Check size={40} color="var(--success)" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>You're all set! 🎉</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Welcome to IndraAssist, <strong style={{ color: 'var(--text-primary)' }}>{form.name || 'there'}</strong>!</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '32px' }}>Your 14-day free trial has started. Explore all features and upgrade anytime.</p>
              <button className="btn-primary glow-primary" style={{ padding: '14px 40px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={finish}>
                Go to Dashboard <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step < 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <button className="btn-ghost" onClick={() => step === 0 ? onLogin() : setStep(s => s - 1)} style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                {step === 0 ? 'Log in instead' : 'Back'}
              </button>
              <button className="btn-primary" onClick={next} disabled={loading} style={{ padding: '10px 24px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : (<>{step === 2 ? 'Create Account' : 'Continue'} <ChevronRight size={16} /></>)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
