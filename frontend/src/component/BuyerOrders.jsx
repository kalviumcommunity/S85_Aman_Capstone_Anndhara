import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, getCurrentUser, isBuyer } from '../utils/apiHelper';
import OrderTable from './common/OrderTable';

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isBuyer()) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getOrders({ buyer: user._id || user.id });
        setOrders(data.orders || []);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

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

  if (loading) return <div className='p-8 text-green-700'>Loading your orders...</div>;
  if (error) return <div className='p-8 text-red-600'>{error}</div>;

  return (
    <div className='min-h-screen bg-white p-6'>
      <h2 className='text-2xl font-bold mb-4 text-green-700'>My Orders</h2>
      {orders.length === 0 ? (
        <p className='text-gray-500'>You have not placed any orders yet.</p>
      ) : (
        <OrderTable
          orders={orders}
          userRole="buyer"
          onRemoveOrder={handleRemoveOrder}
          onDeleteAllOrders={handleDeleteAllOrders}
        />
      )}
    </div>
  );
};

export default BuyerOrders; 