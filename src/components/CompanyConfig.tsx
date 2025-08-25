import React, { useState } from 'react';
import { Building2, Palette, Globe, Database, Save } from 'lucide-react';

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

  const industries = [
    'Technology', 'E-commerce', 'Banking & Finance', 'Healthcare',
    'Telecommunications', 'Retail', 'Manufacturing', 'Education',
    'Travel & Hospitality', 'Real Estate'
  ];

  const colorOptions = [
    '#2563EB', '#7C3AED', '#059669', '#DC2626',
    '#EA580C', '#9333EA', '#0891B2', '#BE123C'
  ];

  const logoEmojis = ['🏢', '🏬', '🏭', '🏦', '🏥', '📱', '💻', '🛒', '✈️', '🏨'];

  const handleSave = () => {
    setCompany(formData);
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter company name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setFormData({ ...formData, primaryColor: color })}
              className={`w-12 h-12 rounded-lg border-2 ${
                formData.primaryColor === color ? 'border-gray-400 ring-2 ring-gray-300' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo/Icon
        </label>
        <div className="grid grid-cols-5 gap-3">
          {logoEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setFormData({ ...formData, logo: emoji })}
              className={`text-2xl p-3 rounded-lg border-2 ${
                formData.logo === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Supported Languages</h4>
        <p className="text-sm text-blue-700">
          IndraAssist automatically detects and responds in the customer's preferred language.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
          'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
        ].map((language) => (
          <label key={language} className="flex items-center space-x-2">
            <input
              type="checkbox"
              defaultChecked={['English', 'Spanish', 'French'].includes(language)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{language}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Knowledge Base Integration</h4>
        <p className="text-sm text-green-700">
          Upload your company's FAQ documents, policies, and product information.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FAQ Documents
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Upload FAQ documents</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Choose Files
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Catalog
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Upload product information</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Choose Files
            </button>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuration Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Configuration Sections</h3>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Configuration Content */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {sections.find(s => s.id === activeSection)?.label} Configuration
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize IndraAssist for your company's specific needs
            </p>
          </div>

          <div className="p-6">
            {renderActiveSection()}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyConfig;