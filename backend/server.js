// === server.js ===
const express = require('express');
require('dotenv').config();
const fs = require('fs');
const http = require('http');
const passport = require('./auth.js');
const { Server } = require('socket.io');
const db = require('./db.js');
const Message = require('./model/Message');
const Notification = require('./model/Notification');

const app = express();
const server = http.createServer(app);

// CORS configuration - BULLETPROOF SOLUTION
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://anndhara.netlify.app',
  'https://anndhara.onrender.com'
];

// Add environment variable if it exists and is not already in the list
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Log allowed origins for debugging
console.log('🌐 Allowed CORS origins:', allowedOrigins);

// BULLETPROOF CORS MIDDLEWARE - Set headers at multiple levels
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log the incoming request origin
  console.log(`🌐 Request from origin: ${origin}`);
  console.log(`🌐 Request method: ${req.method}`);
  console.log(`🌐 Request URL: ${req.url}`);
  
  // Check if origin is allowed
  if (!origin || allowedOrigins.includes(origin)) {
    // Set CORS headers at multiple levels to ensure they're not overridden
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.set('Access-Control-Allow-Origin', origin || '*');
    
    console.log(`✅ CORS header set for origin: ${origin || 'no origin'}`);
  } else {
    console.log(`❌ CORS blocked origin: ${origin}`);
    return res.status(403).json({ error: 'CORS not allowed' });
  }
  
  // Set all CORS headers at multiple levels
  const corsHeaders = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
  
  // Apply headers using multiple methods
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
    res.header(key, value);
    res.set(key, value);
  });
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[CORS] Preflight request handled for: ${origin}`);
    console.log(`[CORS] Response headers:`, res.getHeaders());
    return res.status(200).end();
  }
  
  next();
});

// SECONDARY CORS MIDDLEWARE - Backup to ensure headers are set
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Double-check CORS headers are set
  if (origin && allowedOrigins.includes(origin)) {
    if (!res.getHeader('Access-Control-Allow-Origin')) {
      console.log(`🔄 Re-setting CORS header for origin: ${origin}`);
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
  
  next();
});

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      console.log(`🔌 Socket.IO connection attempt from: ${origin}`);
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('🔓 Socket.IO: Allowing request with no origin');
        return callback(null, true);
      }
      
      // In development, allow all localhost origins
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        console.log('🔓 Socket.IO: Development mode: allowing localhost origin:', origin);
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log('✅ Socket.IO CORS allowed for origin:', origin);
        callback(null, true);
      } else {
        console.log('❌ Socket.IO CORS blocked origin:', origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  },
});

// Middlewares
app.use(express.json());

// REMOVED: app.use(cors()) - This was causing conflicts
// REMOVED: app.options('*', cors()) - This was causing conflicts

app.use((req, res, next) => {
  // Log CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[CORS] Preflight request from: ${req.headers.origin}`);
  }
  // console.log(`[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`);
  next();
});

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
app.use('/uploads', express.static('uploads'));

// Auth
app.use(passport.initialize());

// Routes
app.use('/auth', require('./router/auth.js'));
app.use('/user', require('./router/user.js'));
app.use('/crop', require('./router/crop.js'));
app.use('/order', require('./router/order.js'));
app.use('/message', require('./router/Message.js'));
app.use('/rating', require('./router/rating.js'));
app.use('/cart', require('./router/cart.js'));
app.use('/favorite', require('./router/favorite.js'));
app.use('/notification', require('./router/notification.js'));

// Test endpoint to verify CORS
app.get('/test-cors', (req, res) => {
  console.log('🧪 Test CORS endpoint hit');
  console.log('🧪 Request origin:', req.headers.origin);
  console.log('🧪 Request method:', req.method);
  console.log('🧪 Request URL:', req.url);
  console.log('🧪 All response headers:', res.getHeaders());
  
  // Force set CORS headers one more time
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log(`🧪 Forced CORS header set for: ${origin}`);
  }
  
  res.json({ 
    message: 'CORS test successful', 
    request: {
      origin: req.headers.origin,
      method: req.method,
      url: req.url
    },
    corsHeaders: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
    },
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// Additional CORS test endpoint
app.get('/cors-debug', (req, res) => {
  const origin = req.headers.origin;
  console.log('🔍 CORS Debug endpoint hit');
  console.log('🔍 Origin:', origin);
  console.log('🔍 Allowed origins:', allowedOrigins);
  console.log('🔍 Is origin allowed?', !origin || allowedOrigins.includes(origin));
  
  res.json({
    debug: true,
    origin: origin,
    allowedOrigins: allowedOrigins,
    isAllowed: !origin || allowedOrigins.includes(origin),
    headers: res.getHeaders()
  });
});

// Socket.IO map
const users = {}; // userId -> socketId

io.on('connection', (socket) => {
  // console.log('✅ New client connected:', socket.id);

  socket.on('join', (userId) => {
    users[userId] = socket.id;
    // console.log(`👤 User ${userId} connected with socket ID ${socket.id}`);
  });

  socket.on('sendMessage', async ({ sender, receiver, content, cropId, orderId }) => {
    const receiverSocket = users[receiver];
    // Save message to DB
    try {
      const messageData = {
        sender,
        receiver,
        content,
        cropId: cropId || null,
        orderId: orderId || null
      };
      const message = new Message(messageData);
      await message.save();
      // Emit to receiver if online
      if (receiverSocket) {
        io.to(receiverSocket).emit('receiveMessage', {
          sender,
          receiver,
          content,
          cropId: cropId || null,
          orderId: orderId || null,
          createdAt: message.createdAt,
        });
      }
      // Optionally, emit to sender for confirmation
      socket.emit('receiveMessage', {
        sender,
        receiver,
        content,
        cropId: cropId || null,
        orderId: orderId || null,
        createdAt: message.createdAt,
      });
    } catch (err) {
      socket.emit('error', { message: 'Failed to save message', error: err.message });
    }
  });

  // Listen for notification creation and emit to farmer
  socket.on('notifyFarmer', async ({ user, crop, order, type, message }) => {
    try {
      const notification = new Notification({ user, crop, order, type, message });
      await notification.save();
      const farmerSocket = users[user];
      if (farmerSocket) {
        io.to(farmerSocket).emit('newNotification', {
          user,
          crop,
          order,
          type,
          message,
          createdAt: notification.createdAt,
        });
      }
    } catch (err) {
      socket.emit('error', { message: 'Failed to create notification', error: err.message });
    }
  });

  socket.on('typing', ({ sender, receiver }) => {
    const receiverSocket = users[receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit('typing', { sender });
    }
  });

  socket.on('disconnect', () => {
    const user = Object.entries(users).find(([_, id]) => id === socket.id);
    if (user) {
      delete users[user[0]];
      // console.log(`❌ User ${user[0]} disconnected`);
    } else {
      // console.log(`❌ Unknown socket disconnected: ${socket.id}`);
    }
  });
});

const port = process.env.PORT || 9001;
db.connect().then(() => {
  server.listen(port, () => {
    // console.log(`🚀 Socket.IO server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('❌ Database connection failed:', err.message);
});
