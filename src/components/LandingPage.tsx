import React, { useState } from 'react';
import { Brain, Zap, Shield, Globe, BarChart3, MessageCircle, Phone, ChevronRight, Star, Check, ArrowRight, Play, Menu, X } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onSignup: () => void;
  onPricing: () => void;
}

const LandingPage: React.FC<Props> = ({ onLogin, onSignup, onPricing }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    { icon: Brain, title: 'AI-Powered Chat', desc: 'GPT-driven responses with sentiment analysis, auto-routing, and 98.7% resolution rate.', color: '#6366f1' },
    { icon: Phone, title: 'Voice AI Calls', desc: 'Handle inbound calls with voice recognition, real-time transcription and smart escalation.', color: '#8b5cf6' },
    { icon: BarChart3, title: 'Deep Analytics', desc: 'Track SLA, agent KPIs, customer sentiment trends, and ROI metrics in real time.', color: '#06b6d4' },
    { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 compliant, end-to-end encryption, GDPR tools, SSO, and role-based access.', color: '#10b981' },
    { icon: Globe, title: 'Multi-Channel Inbox', desc: 'Unify chat, email, WhatsApp, social DMs, and voice into one intelligent inbox.', color: '#f59e0b' },
    { icon: Zap, title: 'Smart Automation', desc: 'Workflow rules, canned responses, SLA triggers and AI-suggested replies at scale.', color: '#ef4444' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Head of CX, Razorpay', text: 'IndraAssist reduced our support costs by 65% while improving CSAT from 3.8 to 4.9. Absolute game changer.', avatar: '👩‍💼' },
    { name: 'Arjun Mehra', role: 'CTO, Zepto', text: 'We handle 50k+ daily queries with a team of 10. The AI handles 97% autonomously. Incredible ROI.', avatar: '👨‍💻' },
    { name: 'Sneha Patel', role: 'VP Operations, Nykaa', text: 'The multi-language support and WhatsApp integration gave us reach we never had before. Love it.', avatar: '👩‍🔬' },
  ];

  const stats = [
    { value: '98.7%', label: 'AI Resolution Rate' },
    { value: '0.8s', label: 'Avg Response Time' },
    { value: '65%', label: 'Cost Reduction' },
    { value: '4.9/5', label: 'Avg CSAT Score' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Animated Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(8,8,24,0.8)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--gradient-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>IndraAssist</span>
            <span className="badge badge-info" style={{ marginLeft: '4px' }}>Beta</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={onPricing}>Pricing</button>
            <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={onLogin}>Log in</button>
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={onSignup}>Start Free Trial</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px 80px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div className="badge badge-purple animate-fadeInUp" style={{ marginBottom: '24px', fontSize: '0.75rem' }}>
          <Zap size={12} /> AI-First Customer Support Platform
        </div>
        <h1 className="animate-fadeInUp" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', animationDelay: '0.1s' }}>
          Your AI Support Team,{' '}
          <span className="gradient-text">Available 24/7</span>
        </h1>
        <p className="animate-fadeInUp" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7', animationDelay: '0.2s' }}>
          IndraAssist handles customer queries via chat, voice, email & social — autonomously — resolving 98.7% without human intervention. Built for India's fastest-growing companies.
        </p>

        <div className="animate-fadeInUp" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
          <button className="btn-primary glow-primary" style={{ padding: '14px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onSignup}>
            Start Free 14-Day Trial <ArrowRight size={18} />
          </button>
          <button className="btn-ghost" style={{ padding: '14px 28px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onLogin}>
            <Play size={16} /> Watch Demo
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>No credit card required · Cancel anytime · Setup in 5 minutes</p>
      </section>

      {/* Stats bar */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div className="glass animate-fadeInUp" style={{ borderRadius: 'var(--radius-xl)', padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', animationDelay: '0.4s' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto 100px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge badge-info" style={{ marginBottom: '16px' }}>Capabilities</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', marginBottom: '16px' }}>
            Everything your support team needs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            One platform. Every channel. Full AI autonomy from day one.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="stat-card hover-lift animate-fadeInUp" style={{ animationDelay: `${0.1 * i}s` }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${f.color}20`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto 100px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="badge badge-success" style={{ marginBottom: '16px' }}>Testimonials</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800' }}>Trusted by India's top startups</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="stat-card hover-lift">
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto 100px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-xl)', padding: '64px 48px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '16px' }}>
            Ready to transform your customer support?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1rem' }}>
            Join 500+ companies using IndraAssist to deliver instant, intelligent support at scale.
          </p>
          <button className="btn-primary glow-primary" style={{ padding: '16px 40px', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={onSignup}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>14-day free trial · No setup fees · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={16} color="white" />
          </div>
          <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>IndraAssist</span>
        </div>
        <p>© 2026 IndraAssist. All rights reserved. · Privacy Policy · Terms of Service · Security</p>
      </footer>
    </div>
  );
};

export default LandingPage;
