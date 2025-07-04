import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from './socket';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

// Add a global axios interceptor to always attach the JWT token
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ChatBox = ({ user, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cropContext, setCropContext] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Ensure user._id is always set
  const safeUser = user ? { ...user, _id: user._id || user.id } : null;
  const safeOtherUser = otherUser ? { ...otherUser, _id: otherUser._id || otherUser.id } : null;

  useEffect(() => {
    if (!safeUser || !safeOtherUser || isTokenExpired(safeUser.token)) return;

    // Get crop context from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const cropId = urlParams.get('cropId');
    if (cropId) {
      setCropContext({ cropId });
    }

    socket.emit('join', safeUser._id);

    // Fetch chat history
    const fetchMessages = async () => {
      try {
        setLoading(true);
        if (isTokenExpired(safeUser.token)) {
          setError('Your session has expired. Please log in again.');
          return;
        }
        // Debug log for IDs and roles
        if (import.meta.env.MODE === 'development') console.log('Fetching messages:', { userId: safeUser._id, otherUserId: safeOtherUser._id, userRole: safeUser.role, otherUserRole: safeOtherUser.role });
        const res = await axios.get(`http://localhost:9001/message/${safeUser._id}/${safeOtherUser._id}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        if (import.meta.env.MODE === 'development') console.error('Error fetching messages:', err);
        if (err.response && err.response.status === 403) {
          setError('You are not authorized to view this chat. Please check your login status and roles.');
        } else {
          setError('Could not load chat history. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on('receiveMessage', (msg) => {
      if ((msg.sender === safeOtherUser._id && msg.receiver === safeUser._id) ||
          (msg.sender === safeUser._id && msg.receiver === safeOtherUser._id)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Typing indicator
    socket.on('typing', ({ sender, receiver }) => {
      if (sender === safeOtherUser._id && receiver === safeUser._id) {
        setOtherTyping(true);
        setTimeout(() => setOtherTyping(false), 1500);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
    };
  }, [user, otherUser, location.search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (isTokenExpired(safeUser.token)) {
      setError('Your session has expired. Please log in again.');
      return;
    }

    const msg = { 
      receiver: safeOtherUser._id, 
      content: input.trim(),
      cropId: cropContext?.cropId || null
    };

    try {
      // Emit to socket only (no REST POST)
      socket.emit('sendMessage', { ...msg, sender: safeUser._id });
      setInput('');
    } catch (err) {
      setError('Could not send your message. Please try again.');
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    socket.emit('typing', { sender: safeUser._id, receiver: safeOtherUser._id });
  };

  if (!safeUser || !safeOtherUser) {
    return <div className="text-center p-4">Please login to chat.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Chat with {safeOtherUser.username || safeOtherUser.email || 'User'}
            </h2>
            <p className="text-sm opacity-90">
              {safeOtherUser.role === 'farmer' ? 'Farmer' : 'Buyer'}
              {cropContext && (
                <span className="ml-2">• About specific crop</span>
              )}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-200"
          >
            ← Back
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center text-gray-500">Loading messages...</div>
          ) : error ? (
            <div className="flex items-center justify-center text-red-600">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">
              No messages yet. Start the conversation!
              {cropContext && (
                <div className="text-sm mt-2">
                  This conversation is about a specific crop.
                </div>
              )}
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === safeUser._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === safeUser._id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content}
                  {msg.cropId && (
                    <div className="text-xs opacity-75 mt-1">
                      📦 About crop
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {otherTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              value={input}
              onChange={handleInput}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox; 