import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  FileText, 
  Trash2, 
  Edit, 
  Plus,
  Search,
  Filter,
  Save,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Company {
  name: string;
  industry: string;
  primaryColor: string;
  logo: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  status: 'active' | 'draft' | 'archived';
  usage: number;
}

interface ProductInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  features: string[];
  specifications: Record<string, string>;
  lastUpdated: Date;
  status: 'active' | 'discontinued';
}

interface Props {
  company: Company;
}

const DataManagement: React.FC<Props> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'products' | 'policies'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock FAQ data
  const [faqData, setFaqData] = useState<FAQItem[]>([
    {
      id: 'faq-1',
      question: 'How do I track my order?',
      answer: 'You can track your order by entering your order number on our tracking page or by logging into your account and viewing your order history.',
      category: 'Orders & Shipping',
      tags: ['tracking', 'orders', 'shipping'],
      lastUpdated: new Date('2024-01-15'),
      status: 'active',
      usage: 245
    },
    {
      id: 'faq-2',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some restrictions apply for certain product categories.',
      category: 'Returns & Refunds',
      tags: ['returns', 'refunds', 'policy'],
      lastUpdated: new Date('2024-01-10'),
      status: 'active',
      usage: 189
    },
    {
      id: 'faq-3',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions in the email we send you.',
      category: 'Account & Login',
      tags: ['password', 'login', 'account'],
      lastUpdated: new Date('2024-01-12'),
      status: 'active',
      usage: 156
    }
  ]);

  // Mock Product data
  const [productData, setProductData] = useState<ProductInfo[]>([
    {
      id: 'prod-1',
      name: 'Wireless Headphones Pro',
      description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
      category: 'Electronics',
      price: 299.99,
      features: ['Noise Cancellation', '30-hour Battery', 'Wireless Charging', 'Voice Assistant'],
      specifications: {
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Weight': '250g',
        'Connectivity': 'Bluetooth 5.0'
      },
      lastUpdated: new Date('2024-01-18'),
      status: 'active'
    },
    {
      id: 'prod-2',
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
      category: 'Wearables',
      price: 199.99,
      features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking'],
      specifications: {
        'Display': '1.4" AMOLED',
        'Battery Life': '7 days',
        'Water Resistance': '5ATM',
        'Sensors': 'Heart Rate, GPS, Accelerometer'
      },
      lastUpdated: new Date('2024-01-16'),
      status: 'active'
    }
  ]);

  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: '',
    tags: '',
    status: 'active' as 'active' | 'draft' | 'archived'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    features: '',
    specifications: '',
    status: 'active' as 'active' | 'discontinued'
  });

  const categories = {
    faq: ['Orders & Shipping', 'Returns & Refunds', 'Account & Login', 'Billing & Payments', 'Technical Support'],
    products: ['Electronics', 'Wearables', 'Accessories', 'Software', 'Services']
  };

  const handleAddFAQ = () => {
    const faq: FAQItem = {
      id: `faq-${faqData.length + 1}`,
      question: newFAQ.question,
      answer: newFAQ.answer,
      category: newFAQ.category,
      tags: newFAQ.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      lastUpdated: new Date(),
      status: newFAQ.status,
      usage: 0
    };

    setFaqData([...faqData, faq]);
    setNewFAQ({ question: '', answer: '', category: '', tags: '', status: 'active' });
    setShowAddForm(false);
  };

  const handleAddProduct = () => {
    const product: ProductInfo = {
      id: `prod-${productData.length + 1}`,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      price: newProduct.price,
      features: newProduct.features.split(',').map(f => f.trim()).filter(f => f),
      specifications: JSON.parse(newProduct.specifications || '{}'),
      lastUpdated: new Date(),
      status: newProduct.status
    };

    setProductData([...productData, product]);
    setNewProduct({ name: '', description: '', category: '', price: 0, features: '', specifications: '', status: 'active' });
    setShowAddForm(false);
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqData(faqData.filter(faq => faq.id !== id));
  };

  const handleDeleteProduct = (id: string) => {
    setProductData(productData.filter(product => product.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'draft':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'archived':
      case 'discontinued':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'archived':
      case 'discontinued':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProducts = productData.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderFAQTab = () => (
    <div className="space-y-6">
      {/* FAQ Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.faq.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(faq.status)}`}>
                    {getStatusIcon(faq.status)}
                    <span className="font-medium capitalize">{faq.status}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{faq.answer}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Category: {faq.category}</span>
                  <span>Usage: {faq.usage} times</span>
                  <span>Updated: {faq.lastUpdated.toLocaleDateString()}</span>
                </div>
                {faq.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {faq.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setEditingItem(faq)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFAQ(faq.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProductTab = () => (
    <div className="space-y-6">
      {/* Product Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.products.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                <p className="text-2xl font-bold text-blue-600">${product.price}</p>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(product.status)}`}>
                {getStatusIcon(product.status)}
                <span className="font-medium capitalize">{product.status}</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{product.description}</p>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Features:</h5>
                <div className="flex flex-wrap gap-1">
                  {product.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Specifications:</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Updated: {product.lastUpdated.toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingItem(product)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Database className="w-6 h-6 mr-2 text-blue-600" />
            Data Management System
          </h2>
          <p className="text-sm text-gray-600 mt-1">Manage FAQs, product information, and company policies</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'faq', label: 'FAQ Management', icon: FileText },
            { id: 'products', label: 'Product Information', icon: Database },
            { id: 'policies', label: 'Company Policies', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bulk Actions */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {activeTab === 'faq' ? `${faqData.length} FAQs` : `${productData.length} Products`}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {activeTab === 'faq' && renderFAQTab()}
        {activeTab === 'products' && renderProductTab()}
        {activeTab === 'policies' && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Policies</h3>
            <p className="text-gray-600 mb-6">Manage your company policies and terms of service</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Policy Document
            </button>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Add New {activeTab === 'faq' ? 'FAQ' : 'Product'}
              </h3>
            </div>
            <div className="p-6">
              {activeTab === 'faq' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <input
                      type="text"
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                    <textarea
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newFAQ.category}
                        onChange={(e) => setNewFAQ({...newFAQ, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.faq.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={newFAQ.status}
                        onChange={(e) => setNewFAQ({...newFAQ, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newFAQ.tags}
                      onChange={(e) => setNewFAQ({...newFAQ, tags: e.target.value})}
                      placeholder="e.g., shipping, returns, account"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.products.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={newProduct.status}
                        onChange={(e) => setNewProduct({...newProduct, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={newProduct.features}
                      onChange={(e) => setNewProduct({...newProduct, features: e.target.value})}
                      placeholder="e.g., Wireless, Waterproof, Long Battery"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specifications (JSON format)</label>
                    <textarea
                      value={newProduct.specifications}
                      onChange={(e) => setNewProduct({...newProduct, specifications: e.target.value})}
                      placeholder='{"Weight": "250g", "Battery": "30 hours"}'
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={activeTab === 'faq' ? handleAddFAQ : handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save {activeTab === 'faq' ? 'FAQ' : 'Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;