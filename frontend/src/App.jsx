import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashBoard from './component/Dashboard';
import CropDetail from './component/CropDetail';
import CropUpload from './component/CropUpload';
import Login from './component/Login';
import Sign from './component/Sign';
import FarmerMessages from './component/FarmerMessages';
import OAuthSuccess from './component/OAuthSuccess';
import Cart from './component/Cart';
import Profile from './component/profile';
import ProtectedRoute from './component/ProtectedRoute';
import RoleProtectedRoute from './component/common/RoleProtectedRoute';
import Checkout from './component/Checkout';
import FarmerOrders from './component/FarmerOrders';
import './index.css';
import ChatPage from './component/ChatPage';
import { joinSocket, onNewNotification } from './component/socket';
import Navbar from './component/Navbar';
import FavoritesPage from './component/FavoritesPage';
import BuyerOrders from './component/BuyerOrders';
import NotificationPage from './component/NotificationPage';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Crops');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && (user._id || user.id)) {
      joinSocket(user._id || user.id);
      // Listen for real-time notifications
      onNewNotification((notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });
      // Fetch notifications from backend
      fetch('https://anndhara.onrender.com/notification', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          }
        });
    }
  }, []);

  return (
    <>
      <Navbar 
        notifications={notifications} 
        setNotifications={setNotifications}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Routes>
        <Route path='/' element={<DashBoard selectedCategory={selectedCategory} searchTerm={searchTerm} />} />
        <Route path='/crop-details/:id' element={<CropDetail />} />
        <Route path='/crop-upload' element={
          <RoleProtectedRoute>
            <CropUpload />
          </RoleProtectedRoute>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Sign />} />
        <Route path='/farmer-messages' element={
          <RoleProtectedRoute>
            <FarmerMessages />
          </RoleProtectedRoute>
        } />
        <Route path='/oauth-success' element={<OAuthSuccess />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/cart' element={
          <RoleProtectedRoute>
            <Cart />
          </RoleProtectedRoute>
        } />
        <Route path='/checkout' element={
          <RoleProtectedRoute>
            <Checkout />
          </RoleProtectedRoute>
        } />
        <Route path='/protected' element={<ProtectedRoute />} />
        <Route path='/farmer-orders' element={
          <RoleProtectedRoute>
            <FarmerOrders />
          </RoleProtectedRoute>
        } />
        <Route path='/buyer-orders' element={
          <RoleProtectedRoute>
            <BuyerOrders />
          </RoleProtectedRoute>
        } />
        <Route path='/chat/:otherUserId' element={
          <RoleProtectedRoute>
            <ChatPage />
          </RoleProtectedRoute>
        } />
        <Route path='/favorites' element={
          <RoleProtectedRoute>
            <FavoritesPage />
          </RoleProtectedRoute>
        } />
        <Route path='/notifications' element={
          <RoleProtectedRoute>
            <NotificationPage setNotifications={setNotifications} />
          </RoleProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
