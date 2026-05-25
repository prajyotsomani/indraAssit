import React, { useState } from 'react';
import { Building2, Palette, Globe, Database, Save, CheckCircle2 } from 'lucide-react';

interface Company {
  name: string;
  industry: string;
  primaryColor: string;
  logo: string;
}

interface Props {
  company: Company;
  setCompany: (company: Company) => void;
}

const CompanyConfig: React.FC<Props> = ({ company, setCompany }) => {
  const [formData, setFormData] = useState(company);
  const [activeSection, setActiveSection] = useState('basic');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const industries = [
    'Technology', 'E-commerce', 'Banking & Finance', 'Healthcare',
    'Telecommunications', 'Retail', 'Manufacturing', 'Education',
    'Travel & Hospitality', 'Real Estate'
  ];

  const colorOptions = [
    '#6366f1', '#8b5cf6', '#10b981', '#ef4444',
    '#f59e0b', '#06b6d4', '#ec4899', '#3b82f6'
  ];

  const logoEmojis = ['🏢', '🏬', '🏭', '🏦', '🏥', '📱', '💻', '🛒', '✈️', '🏨'];

  const handleSave = () => {
    setCompany(formData);
    triggerToast('Workspace settings saved successfully!');
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'branding', label: 'Branding Layout', icon: Palette },
    { id: 'languages', label: 'Language Settings', icon: Globe },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database }
  ];

  const renderBasicInfo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeIn">
      <div>
        <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Company Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-dark"
          placeholder="Enter company name"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Industry Segment
        </label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          className="input-dark"
        >
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderBranding = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeIn">
      <div>
        <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Primary Brand Color
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setFormData({ ...formData, primaryColor: color })}
              style={{ 
                backgroundColor: color, 
                height: '44px',
                borderRadius: '8px',
                border: formData.primaryColor === color ? '2px solid white' : '1px solid var(--border)',
                cursor: 'pointer',
                boxShadow: formData.primaryColor === color ? '0 0 12px rgba(255,255,255,0.3)' : 'none',
                transition: 'all 0.15s'
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Workspace Logo / Emoji
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {logoEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setFormData({ ...formData, logo: emoji })}
              className="btn-ghost"
              style={{
                fontSize: '1.5rem',
                padding: '10px',
                borderRadius: '8px',
                background: formData.logo === emoji ? 'rgba(99,102,241,0.15)' : 'transparent',
                borderColor: formData.logo === emoji ? 'var(--primary)' : 'var(--border)',
                cursor: 'pointer'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguages = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeIn">
      <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', padding: '16px', borderRadius: '8px' }}>
        <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-light)', marginBottom: '6px' }}>Supported Languages</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>
          IndraAssist automatically detects user locale and queries to reply in their localized preferred language.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {[
          'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
          'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
        ].map((language) => (
          <label key={language} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="checkbox-dark"
              defaultChecked={['English', 'Spanish', 'French', 'Hindi'].includes(language)}
            />
            <span style={{ color: 'var(--text-secondary)' }}>{language}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeIn">
      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', padding: '16px', borderRadius: '8px' }}>
        <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--success)', marginBottom: '6px' }}>Knowledge Base Integration</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>
          Upload your organization's manuals, FAQ sheets, and literature files to train the AI persona (Growth/Enterprise).
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            FAQ Documentation
          </label>
          <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center' }}>
            <Database style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} size={32} />
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Drag & drop FAQ documents (PDF, DOCX)</p>
            <button className="btn-ghost" type="button" style={{ padding: '6px 16px', fontSize: '0.78rem' }} onClick={() => alert('Mock upload triggered.')}>Choose Files</button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Product Catalog Sheet
          </label>
          <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center' }}>
            <Database style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} size={32} />
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Upload inventory lists or sheets (CSV, JSON)</p>
            <button className="btn-ghost" type="button" style={{ padding: '6px 16px', fontSize: '0.78rem' }} onClick={() => alert('Mock upload triggered.')}>Choose Files</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic':
        return renderBasicInfo();
      case 'branding':
        return renderBranding();
      case 'languages':
        return renderLanguages();
      case 'knowledge':
        return renderKnowledgeBase();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div style={{ color: 'var(--text-primary)' }} className="animate-fadeInUp">
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        
        {/* Navigation Sidebar */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '16px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '8px' }}>SETUP OPTIONS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`nav-item w-full ${isActive ? 'active' : ''}`}
                  style={{ border: 'none', background: 'transparent', outline: 'none', textAlign: 'left' }}
                >
                  <Icon size={16} />
                  <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Panel */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', gridColumn: 'span 2' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              {sections.find(s => s.id === activeSection)?.label} Setup
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px' }}>Configure settings to direct IndraAssist integrations.</p>
          </div>

          <div style={{ padding: '24px' }}>
            {renderActiveSection()}
          </div>

          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={14} /> Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyConfig;