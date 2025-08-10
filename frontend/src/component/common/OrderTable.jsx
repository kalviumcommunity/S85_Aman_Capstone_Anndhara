import React from 'react';

const OrderTable = ({ 
  orders, 
  userRole, 
  onStatusChange, 
  onRemoveOrder, 
  onMessageClick,
  onDeleteAllOrders 
}) => {
  // Helper to get progress and color for each status
  const getOrderProgress = (status) => {
    const steps = ['pending', 'accepted', 'shipped', 'completed'];
    const cancelled = status === 'cancelled' || status === 'rejected';
    const idx = steps.indexOf(status);
    return {
      progress: cancelled ? 0 : ((idx + 1) / steps.length) * 100,
      color: cancelled ? 'bg-red-400' : idx === 3 ? 'bg-green-600' : 'bg-blue-500',
      label: cancelled ? (status.charAt(0).toUpperCase() + status.slice(1)) : (status.charAt(0).toUpperCase() + status.slice(1)),
      cancelled
    };
  };

  const getTableHeaders = () => {
    if (userRole === 'buyer') {
      return ['Crop', 'Farmer', 'Quantity', 'Proposed Price', 'Address', 'Status', 'Actions'];
    } else {
      return ['Buyer', 'Crop', 'Quantity', 'Proposed Price', 'Address', 'Status', 'Actions'];
    }
  };

  const renderOrderRow = (order) => {
    const { progress, color, label, cancelled } = getOrderProgress(order.status);
    
    return (
      <tr key={order._id} className='border-b'>
        {userRole === 'buyer' ? (
          <>
            <td className='p-2 border'>
              {order.crop?.name || 'N/A'}<br/>
              <span className='text-xs text-gray-500'>{order.crop?.type}</span>
            </td>
            <td className='p-2 border'>
              {order.farmer?.username || 'N/A'}<br/>
              <span className='text-xs text-gray-500'>{order.farmer?.email}</span>
            </td>
          </>
        ) : (
          <>
            <td className='p-2 border'>
              {order.buyer?.username}<br/>
              <span className='text-xs text-gray-500'>{order.buyer?.email}</span>
            </td>
            <td className='p-2 border'>
              {order.crop?.name}<br/>
              <span className='text-xs text-gray-500'>{order.crop?.type}</span>
            </td>
          </>
        )}
        
        <td className='p-2 border'>{order.quantityOrdered} kg</td>
        <td className='p-2 border'>₹{order.proposedPrice}/kg</td>
        <td className='p-2 border'>{order.address}</td>
        
        <td className='p-2 border font-semibold'>
          {userRole === 'buyer' ? (
            <div className='flex flex-col gap-1'>
              <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              <div className='w-32 h-2 bg-gray-200 rounded'>
                <div
                  className={`${color} h-2 rounded transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                  title={label}
                ></div>
              </div>
            </div>
          ) : (
            <span>{order.status}</span>
          )}
        </td>
        
        <td className='p-2 border'>
          {userRole === 'farmer' && order.status === 'pending' && (
            <div className='flex gap-2'>
              <button
                className='bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700'
                onClick={() => onStatusChange(order._id, 'accepted')}
              >
                Accept
              </button>
              <button
                className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                onClick={async () => {
                  const reason = window.prompt('Please provide a reason for rejection:');
                  if (!reason) return;
                  onStatusChange(order._id, 'rejected', reason);
                }}
              >
                Reject
              </button>
            </div>
          )}
          
          {onMessageClick && (
            <button
              className={`bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mt-2 ${!order.crop?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (order.crop && order.crop._id) {
                  const otherUserId = userRole === 'buyer' ? order.farmer?._id : order.buyer?._id;
                  onMessageClick(otherUserId, order._id, order.crop._id);
                }
              }}
              disabled={!order.crop || !order.crop._id}
              title={!order.crop || !order.crop._id ? 'No crop context for this chat' : ''}
            >
              💬 Message
            </button>
          )}
          
          {['completed', 'cancelled', 'rejected'].includes(order.status) ? null : (
            <button
              className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs mt-2'
              onClick={() => onRemoveOrder(order._id)}
            >
              Remove
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div>
      <table className='w-full border text-sm'>
        <thead>
          <tr className='bg-green-100'>
            {getTableHeaders().map((header, index) => (
              <th key={index} className='p-2 border'>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(renderOrderRow)}
        </tbody>
      </table>
      
      {onDeleteAllOrders && orders.length > 0 && (
        <button
          className='mt-6 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 font-semibold w-full'
          onClick={onDeleteAllOrders}
        >
          Delete All My Orders
        </button>
      )}
    </div>
  );
};

export default OrderTable; 