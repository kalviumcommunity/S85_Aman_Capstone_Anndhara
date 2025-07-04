import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const getInitials = (name, email) => {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return '?';
};

const FarmerMessages = () => {
  const [user, setUser] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();

  // Utility to check if token is expired
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  // Parse user from localStorage once on component mount
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.token && isTokenExpired(userData.token)) {
        localStorage.removeItem('user');
        setUser(null);
      } else {
        setUser(userData ? { ...userData, _id: userData._id || userData.id } : null);
      }
    } catch (e) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!user || !user.id || !user.token || isTokenExpired(user.token)) {
      setError("Please log in again. Your session has expired.");
      setLoading(false);
      return;
    }

    const fetchBuyers = async () => {
      try {
        setLoading(true);
        const userId = user.id;
        const response = await axios.get(`http://localhost:9001/message/buyers/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBuyers(response.data.buyers || []);
        setFilteredBuyers(response.data.buyers || []);
        // Fetch unread counts
        const unreadRes = await axios.get(`http://localhost:9001/message/unread-counts/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUnreadCounts(unreadRes.data.unreadCounts || {});
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No buyers have messaged you yet. When buyers view your crops and click 'Message Farmer', they will appear here.");
        } else if (err.response && err.response.status === 403) {
          setError("Access denied: Unauthorized");
        } else if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Could not load buyers. Please try again in a few moments.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, [user?.id, user?.token]);

  // Search/filter buyers
  useEffect(() => {
    if (!search) {
      setFilteredBuyers(buyers);
    } else {
      setFilteredBuyers(
        buyers.filter(buyer =>
          (buyer.username && buyer.username.toLowerCase().includes(search.toLowerCase())) ||
          (buyer.email && buyer.email.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, buyers]);

  const handleChatClick = (buyerId) => {
    navigate(`/chat/${buyerId}`);
  };

  if (!user || user.role !== 'farmer') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">This page is only for farmers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-700">Messages</h1>
              <p className="text-gray-600 mt-2">Buyers who have messaged you about your crops</p>
            </div>
            <button
              onClick={() => navigate('/')} 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              ← Back to Dashboard
            </button>
          </div>
          {/* Search bar */}
          <div className="mt-6">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search buyers by name or email..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <div className="flex items-center text-gray-600 mt-4">Loading buyers...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 text-lg mb-2">⚠️</div>
              <div className="flex items-center text-red-600">
                {error}
              </div>
            </div>
          ) : filteredBuyers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages Yet</h3>
              <p className="text-gray-600 mb-4">
                When buyers message you about your crops, they will appear here.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Buyers ({filteredBuyers.length})
              </h2>
              <div className="space-y-6">
                {filteredBuyers.map((buyer, idx) => (
                  <div
                    key={buyer._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-xl font-bold text-green-800">
                        {getInitials(buyer.username, buyer.email)}
                      </div>
                    </div>
                    {/* Buyer Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {buyer.username || buyer.email}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              Buyer
                            </span>
                            {buyer.email && (
                              <span className="ml-2">• {buyer.email}</span>
                            )}
                            {buyer.phone && (
                              <span className="ml-2">• {buyer.phone}</span>
                            )}
                          </div>
                        </div>
                        {/* Demo unread badge (random for now) */}
                        <div className="flex items-center gap-2">
                          {unreadCounts[buyer._id] > 0 && (
                            <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {unreadCounts[buyer._id]} Unread
                            </span>
                          )}
                          <button
                            onClick={() => handleChatClick(buyer._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                      {/* Conversations by Crop */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700">Conversations:</h4>
                        {buyer.conversations && buyer.conversations.length > 0 ? (
                          buyer.conversations.map((conversation, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-green-700">
                                    {conversation.cropName}
                                  </span>
                                  {conversation.cropType && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      {conversation.cropType}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Last message:</span> {conversation.lastMessage}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(conversation.lastMessageTime).toLocaleString()}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 italic">
                            No specific crop conversations
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerMessages; 