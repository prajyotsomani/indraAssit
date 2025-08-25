import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck,
  AlertCircle,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';

interface Company {
  name: string;
  industry: string;
  primaryColor: string;
  logo: string;
}

interface OrderStatus {
  id: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  timestamp: Date;
  location?: string;
  description: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderDate: Date;
  estimatedDelivery: Date;
  currentStatus: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingAddress: string;
  statusHistory: OrderStatus[];
}

interface Props {
  company: Company;
}

const OrderTracking: React.FC<Props> = ({ company }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchResults, setSearchResults] = useState<Order[]>([]);

  // Mock order data
  const mockOrders: Order[] = [
    {
      id: 'ORD-12345',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      customerPhone: '+1-555-0123',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 199.99 },
        { name: 'Phone Case', quantity: 2, price: 29.99 }
      ],
      total: 259.97,
      orderDate: new Date('2024-01-15'),
      estimatedDelivery: new Date('2024-01-20'),
      currentStatus: 'in_transit',
      trackingNumber: 'TRK789456123',
      shippingAddress: '123 Main St, New York, NY 10001',
      statusHistory: [
        {
          id: '1',
          status: 'processing',
          timestamp: new Date('2024-01-15T10:00:00'),
          description: 'Order received and being processed'
        },
        {
          id: '2',
          status: 'shipped',
          timestamp: new Date('2024-01-16T14:30:00'),
          location: 'New York Distribution Center',
          description: 'Package shipped from warehouse'
        },
        {
          id: '3',
          status: 'in_transit',
          timestamp: new Date('2024-01-17T09:15:00'),
          location: 'Philadelphia, PA',
          description: 'Package in transit to destination'
        }
      ]
    },
    {
      id: 'ORD-67890',
      customerName: 'Sarah Smith',
      customerEmail: 'sarah.smith@email.com',
      customerPhone: '+1-555-0456',
      items: [
        { name: 'Laptop Stand', quantity: 1, price: 89.99 }
      ],
      total: 89.99,
      orderDate: new Date('2024-01-18'),
      estimatedDelivery: new Date('2024-01-22'),
      currentStatus: 'delivered',
      trackingNumber: 'TRK456789012',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      statusHistory: [
        {
          id: '1',
          status: 'processing',
          timestamp: new Date('2024-01-18T11:00:00'),
          description: 'Order received and being processed'
        },
        {
          id: '2',
          status: 'shipped',
          timestamp: new Date('2024-01-19T16:00:00'),
          location: 'Los Angeles Distribution Center',
          description: 'Package shipped from warehouse'
        },
        {
          id: '3',
          status: 'delivered',
          timestamp: new Date('2024-01-21T14:30:00'),
          location: '456 Oak Ave, Los Angeles, CA',
          description: 'Package delivered successfully'
        }
      ]
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = mockOrders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setSearchResults(results);
    if (results.length === 1) {
      setSelectedOrder(results[0]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_transit':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Package className="w-4 h-4" />;
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Order Tracking System
          </h2>
          <p className="text-sm text-gray-600 mt-1">Track orders by Order ID, Email, Phone, or Tracking Number</p>
        </div>

        <div className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Order ID, Email, Phone, or Tracking Number..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Track Order</span>
            </button>
          </div>

          {/* Quick Search Examples */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {['ORD-12345', 'john.doe@email.com', '+1-555-0123', 'TRK789456123'].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setSearchQuery(example);
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
            <p className="text-sm text-gray-600">Found {searchResults.length} order(s)</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {searchResults.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName} • {order.customerEmail}</p>
                      <p className="text-sm text-gray-500">
                        Ordered: {order.orderDate.toLocaleDateString()} • Total: ${order.total}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.currentStatus)}`}>
                      {getStatusIcon(order.currentStatus)}
                      <span className="text-sm font-medium">{formatStatus(order.currentStatus)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      {selectedOrder && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Details: {selectedOrder.id}</h3>
                <p className="text-sm text-gray-600">Tracking Number: {selectedOrder.trackingNumber}</p>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(selectedOrder.currentStatus)}`}>
                {getStatusIcon(selectedOrder.currentStatus)}
                <span className="font-medium">{formatStatus(selectedOrder.currentStatus)}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Shipping Address
                  </h4>
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">${item.price}</p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-semibold">
                      <span>Total:</span>
                      <span>${selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Tracking Timeline
                </h4>
                <div className="space-y-4">
                  {selectedOrder.statusHistory.map((status, index) => (
                    <div key={status.id} className="flex items-start space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{formatStatus(status.status)}</p>
                          <span className="text-xs text-gray-500">
                            {status.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{status.description}</p>
                        {status.location && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {status.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Estimated Delivery */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Estimated Delivery</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedOrder.estimatedDelivery.toLocaleDateString()} by 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;