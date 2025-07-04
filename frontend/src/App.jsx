import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './index.css';

import ProtectedRoute from './component/ProtectedRoute';
import DashBoard from './component/Dashboard';
import Login from './component/Login';
import Signup from './component/Sign';
import OAuthSuccess from './component/OAuthSuccess';
import CropUpload from './component/CropUpload';
import CropList from './component/CropList';
import CropDetails from './component/CropDetail';
import ChatBox from './component/ChatBox';
import FarmerMessages from './component/FarmerMessages';

function ChatPage() {
  const { id } = useParams(); // farmer id
  const rawUser = JSON.parse(localStorage.getItem('user'));
  const user = rawUser ? { ...rawUser, _id: rawUser.id } : null;
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:9001/user?id=${id}`)
        .then(res => res.json())
        .then(data => {
          // Try both data.data and data.farmer for compatibility
          const found = (data.data && Array.isArray(data.data)) ? data.data.find(u => u._id === id) : null;
          const fallback = (data.farmer && Array.isArray(data.farmer)) ? data.farmer.find(u => u._id === id) : null;
          setOtherUser(found || fallback || { _id: id });
        });
    }
  }, [id]);

  if (!user) return <div>Please login to chat.</div>;
  if (!otherUser) return <div>Loading chat...</div>;
  return <ChatBox user={user} otherUser={otherUser} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const decoded = jwtDecode(parsed.token);
        setToken(parsed.token);
        setUser({
          ...decoded,
          token: parsed.token,
          id: decoded.id, // JWT token contains 'id' field
          _id: decoded.id || decoded._id || parsed._id || parsed.id, // Always set _id
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Signup />} />
      <Route path='/oauth-success' element={<OAuthSuccess />} />
      <Route path='/crop-upload' element={<CropUpload />} />
      <Route path='/crop-list' element={<CropList />} />
      <Route path='/crop/:id' element={<CropDetails />} />
      <Route path='/crop-details/:id' element={<CropDetails />} />
      <Route path='/chat/:id' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path='/farmer-messages' element={<ProtectedRoute><FarmerMessages /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
