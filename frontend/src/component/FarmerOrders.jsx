import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, getCurrentUser, isFarmer } from '../utils/apiHelper';
import OrderTable from './common/OrderTable';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isFarmer()) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getFarmerOrders(user._id || user.id);
        setOrders(data.orders || []);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

  const handleStatusChange = async (orderId, status, reason = null) => {
    try {
      const updateData = { status };
      if (reason) updateData.reason = reason;
      
      const data = await orderAPI.updateOrder(orderId, updateData);
      if (data.success) {
        if (status === 'rejected') {
          setOrders(orders => orders.filter(o => o._id !== orderId));
        } else {
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status } : o));
        }
      }
    } catch {
      alert('Failed to update order status');
    }
  };

  // Remove order handler
  const handleRemoveOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to remove this order?')) return;
    try {
      const data = await orderAPI.updateOrder(orderId, { status: 'cancelled' });
      if (data.success) {
        setOrders(orders => orders.filter(o => o._id !== orderId));
      } else {
        alert(data.message || 'Failed to remove order.');
      }
    } catch {
      alert('Failed to remove order.');
    }
  };

  const handleMessageClick = (buyerId, orderId, cropId) => {
    navigate(`/chat/${buyerId}?orderId=${orderId}&cropId=${cropId}`);
  };

  const handleDeleteAllOrders = async () => {
    if (!window.confirm('Are you sure you want to delete all your orders? This will cancel each order.')) return;
    try {
      for (const order of orders) {
        await orderAPI.updateOrder(order._id, { status: 'cancelled' });
      }
      setOrders([]);
    } catch {
      alert('Failed to delete all your orders.');
    }
  };

  if (loading) return <div className='p-8 text-green-700'>Loading orders...</div>;
  if (error) return <div className='p-8 text-red-600'>{error}</div>;

  return (
    <div className='min-h-screen bg-white p-6'>
      <h2 className='text-2xl font-bold mb-4 text-green-700'>Orders for Your Crops</h2>
      {orders.length === 0 ? (
        <p className='text-gray-500'>No orders yet.</p>
      ) : (
        <OrderTable
          orders={orders}
          userRole="farmer"
          onStatusChange={handleStatusChange}
          onRemoveOrder={handleRemoveOrder}
          onMessageClick={handleMessageClick}
          onDeleteAllOrders={handleDeleteAllOrders}
        />
      )}
    </div>
  );
};

export default FarmerOrders; 