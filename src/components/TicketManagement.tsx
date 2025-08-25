import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User,
  MessageSquare,
  Calendar,
  Tag,
  ArrowUp,
  ArrowRight,
  ArrowDown
} from 'lucide-react';

interface Company {
  name: string;
  industry: string;
  primaryColor: string;
  logo: string;
}

interface TicketData {
  id: string;
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  aiAttempts: number;
  escalationReason: string;
  tags: string[];
}

interface Props {
  company: Company;
}

const TicketManagement: React.FC<Props> = ({ company }) => {
  const [tickets, setTickets] = useState<TicketData[]>([
    {
      id: 'TKT-001',
      title: 'Unable to process refund for damaged item',
      description: 'Customer received a damaged laptop and AI could not verify purchase history due to system integration issues.',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      customerPhone: '+1-555-0123',
      priority: 'high',
      status: 'open',
      category: 'Refunds & Returns',
      createdAt: new Date('2024-01-20T10:30:00'),
      updatedAt: new Date('2024-01-20T10:30:00'),
      aiAttempts: 3,
      escalationReason: 'Could not verify purchase in system database',
      tags: ['refund', 'damaged-product', 'system-error']
    },
    {
      id: 'TKT-002',
      title: 'Complex billing dispute requiring manual review',
      description: 'Customer disputes multiple charges over 6 months. AI analysis inconclusive due to complex billing history.',
      customerName: 'Sarah Smith',
      customerEmail: 'sarah.smith@email.com',
      customerPhone: '+1-555-0456',
      priority: 'urgent',
      status: 'in_progress',
      category: 'Billing & Payments',
      assignedTo: 'Mike Johnson',
      createdAt: new Date('2024-01-19T14:15:00'),
      updatedAt: new Date('2024-01-20T09:00:00'),
      aiAttempts: 5,
      escalationReason: 'Complex billing history requires human analysis',
      tags: ['billing', 'dispute', 'complex-case']
    },
    {
      id: 'TKT-003',
      title: 'Technical integration issue with third-party service',
      description: 'Customer cannot connect their account to external service. AI detected API integration problem.',
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      customerPhone: '+1-555-0789',
      priority: 'medium',
      status: 'resolved',
      category: 'Technical Support',
      assignedTo: 'Lisa Chen',
      createdAt: new Date('2024-01-18T16:45:00'),
      updatedAt: new Date('2024-01-19T11:30:00'),
      aiAttempts: 2,
      escalationReason: 'Technical issue beyond AI troubleshooting scope',
      tags: ['technical', 'integration', 'api']
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: '',
    escalationReason: '',
    tags: ''
  });

  const categories = [
    'Refunds & Returns',
    'Billing & Payments',
    'Technical Support',
    'Account Issues',
    'Product Information',
    'Shipping & Delivery',
    'General Inquiry'
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_progress':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'closed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low':
        return <ArrowDown className="w-4 h-4" />;
      case 'medium':
        return <ArrowRight className="w-4 h-4" />;
      case 'high':
      case 'urgent':
        return <ArrowUp className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = searchQuery === '' || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreateTicket = () => {
    const ticket: TicketData = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      title: newTicket.title,
      description: newTicket.description,
      customerName: newTicket.customerName,
      customerEmail: newTicket.customerEmail,
      customerPhone: newTicket.customerPhone,
      priority: newTicket.priority,
      status: 'open',
      category: newTicket.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      aiAttempts: 0,
      escalationReason: newTicket.escalationReason,
      tags: newTicket.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({
      title: '',
      description: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      priority: 'medium',
      category: '',
      escalationReason: '',
      tags: ''
    });
    setShowCreateForm(false);
  };

  const updateTicketStatus = (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date() }
        : ticket
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Ticket className="w-6 h-6 mr-2 text-blue-600" />
                Ticket Management System
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage escalated cases that require human intervention</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Ticket Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'open').length}</div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{tickets.filter(t => t.status === 'in_progress').length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{tickets.filter(t => t.priority === 'urgent').length}</div>
              <div className="text-sm text-gray-600">Urgent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Create New Ticket</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={newTicket.customerName}
                    onChange={(e) => setNewTicket({...newTicket, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newTicket.customerEmail}
                    onChange={(e) => setNewTicket({...newTicket, customerEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newTicket.customerPhone}
                    onChange={(e) => setNewTicket({...newTicket, customerPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTicket.tags}
                    onChange={(e) => setNewTicket({...newTicket, tags: e.target.value})}
                    placeholder="e.g., refund, urgent, billing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Escalation Reason</label>
                  <input
                    type="text"
                    value={newTicket.escalationReason}
                    onChange={(e) => setNewTicket({...newTicket, escalationReason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Tickets ({filteredTickets.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{ticket.id}</h4>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityIcon(ticket.priority)}
                      <span className="font-medium capitalize">{ticket.priority}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="font-medium capitalize">{ticket.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <h5 className="font-medium text-gray-900 mb-1">{ticket.title}</h5>
                  <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {ticket.customerName}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {ticket.createdAt.toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      AI Attempts: {ticket.aiAttempts}
                    </span>
                  </div>
                  {ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ticket.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <select
                    value={ticket.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateTicketStatus(ticket.id, e.target.value as any);
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{selectedTicket.id}</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ticket Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Title:</span> {selectedTicket.title}</p>
                      <p><span className="font-medium">Category:</span> {selectedTicket.category}</p>
                      <p><span className="font-medium">Priority:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                      </p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status.replace('_', ' ')}
                        </span>
                      </p>
                      <p><span className="font-medium">AI Attempts:</span> {selectedTicket.aiAttempts}</p>
                      <p><span className="font-medium">Escalation Reason:</span> {selectedTicket.escalationReason}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedTicket.customerName}</p>
                      <p><span className="font-medium">Email:</span> {selectedTicket.customerEmail}</p>
                      <p><span className="font-medium">Phone:</span> {selectedTicket.customerPhone}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Created:</span> {selectedTicket.createdAt.toLocaleString()}</p>
                      <p><span className="font-medium">Last Updated:</span> {selectedTicket.updatedAt.toLocaleString()}</p>
                      {selectedTicket.assignedTo && (
                        <p><span className="font-medium">Assigned To:</span> {selectedTicket.assignedTo}</p>
                      )}
                    </div>
                  </div>
                  {selectedTicket.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTicket.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;