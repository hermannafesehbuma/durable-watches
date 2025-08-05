'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getAllOrdersWithDetailsForAdmin,
  updateOrderStatus,
} from '@/api/supabaseapi';
import Image from 'next/image';
import Link from 'next/link';
import { revalidateOrderPaths } from '@/lib/cache-utils';

interface OrderItem {
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    primary_image: {
      url: string;
      alt_text: string;
    } | null;
  };
}

interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  phone?: string;
}

interface Order {
  id: string;
  total: number;
  payment_method: string;
  email: string;
  created_at: string;
  status: string; // Changed from { status: string } to just string
  shipping_address: ShippingAddress | null;
  order_items: OrderItem[];
}

export default function AdminOrdersPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchOrders();
    }
  }, [user, isAdmin]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const { data, error } = await getAllOrdersWithDetailsForAdmin();

      if (error) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus((prev) => new Set(prev).add(orderId));

    try {
      const { error } = await updateOrderStatus(orderId, newStatus);

      if (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      } else {
        // Update the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Trigger additional revalidation if needed
        revalidateOrderPaths();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setUpdatingStatus((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSelectColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'border-yellow-300 bg-yellow-50 text-yellow-800';
      case 'paid':
        return 'border-blue-300 bg-blue-50 text-blue-800';
      case 'shipped':
        return 'border-purple-300 bg-purple-50 text-purple-800';
      case 'delivered':
        return 'border-green-300 bg-green-50 text-green-800';
      case 'cancelled':
        return 'border-red-300 bg-red-50 text-red-800';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-800';
    }
  };

  // Add this function to calculate order total from items
  const calculateOrderTotal = (orderItems: OrderItem[]) => {
    return (
      orderItems?.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0) || 0
    );
  };

  console.log(orders);

  if (loading || isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button
                onClick={fetchOrders}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-30">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Orders Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view all customer orders
              </p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full sm:w-auto text-center"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <p className="text-gray-500 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  const isUpdating = updatingStatus.has(order.id);

                  return (
                    <div key={order.id} className="p-4 sm:p-6">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-left"
                          >
                            Order #{order.id.slice(-8)}
                          </button>

                          {/* Status Select Dropdown */}
                          <div className="relative w-full sm:w-auto">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              disabled={isUpdating}
                              className={`w-full sm:w-auto px-3 py-1 rounded-full text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${getSelectColor(
                                order.status || 'pending'
                              )}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {isUpdating && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-lg text-teal-600">
                            $
                            {(
                              order.total ||
                              calculateOrderTotal(order.order_items)
                            ).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Customer:
                          </span>
                          <p className="text-gray-600">{order.email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Payment Method:
                          </span>
                          <p className="text-gray-600 capitalize">
                            {order.payment_method}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Items:
                          </span>
                          <p className=" text-gray-900">
                            {order.order_items?.length || 0} item(s)
                          </p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-6 border-t pt-6">
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                            {/* Shipping Address */}
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                Shipping Address
                              </h3>
                              {order.shipping_address ? (
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-900">
                                  <p className="font-medium ">
                                    {order.shipping_address.full_name}
                                  </p>
                                  <p>{order.shipping_address.address_line1}</p>
                                  {order.shipping_address.address_line2 && (
                                    <p>
                                      {order.shipping_address.address_line2}
                                    </p>
                                  )}
                                  <p>
                                    {order.shipping_address.city}
                                    {order.shipping_address.state &&
                                      `, ${order.shipping_address.state}`}
                                    {order.shipping_address.postal_code &&
                                      ` ${order.shipping_address.postal_code}`}
                                  </p>
                                  <p>{order.shipping_address.country}</p>
                                  {order.shipping_address.phone && (
                                    <p className="mt-2 text-sm text-gray-600">
                                      Phone: {order.shipping_address.phone}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500">
                                  No shipping address available
                                </p>
                              )}
                            </div>

                            {/* Order Items */}
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Order Items
                              </h3>
                              <div className="space-y-4 text-gray-900">
                                {order.order_items?.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                                  >
                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                      {item.product.primary_image?.url ? (
                                        <Image
                                          src={item.product.primary_image.url}
                                          alt={
                                            item.product.primary_image
                                              .alt_text || item.product.name
                                          }
                                          width={64}
                                          height={64}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                          <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium">
                                        {item.product.name}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity}
                                      </p>
                                      <p className="text-sm font-medium">
                                        ${item.product.price.toFixed(2)} each
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">
                                        $
                                        {(
                                          item.product.price * item.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                )) || (
                                  <p className="text-gray-500">
                                    No items found
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
