import { io } from 'socket.io-client';

// Determine the socket server URL based on environment
const getSocketServerUrl = () => {
  // TEMPORARY: Force production URL to bypass CORS issue
  // TODO: Change back to localhost after backend CORS fix is deployed
  return 'https://anndhara.onrender.com';
  
  // Original logic (uncomment after CORS fix is deployed):
  // if (import.meta.env.DEV) {
  //   return 'http://localhost:9001'; // Your local backend port
  // }
  // return 'https://anndhara.onrender.com';
};

const socket = io(getSocketServerUrl(), {
  autoConnect: false, // Only connect after login
  transports: ['websocket', 'polling'], // Try WebSocket first, then polling
  timeout: 20000, // 20 second timeout
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Add connection event listeners for debugging
socket.on('connect', () => {
  console.log('✅ Socket connected successfully');
  console.log('⚠️  TEMPORARY: Connected to production backend');
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error);
  
  // If localhost fails in development, try production URL
  if (import.meta.env.DEV && error.message.includes('localhost')) {
    console.log('🔄 Retrying with production URL...');
    socket.disconnect();
    socket.io.uri = 'https://anndhara.onrender.com';
    socket.connect();
  }
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Socket disconnected:', reason);
});

// Join the socket server with userId after login
export function joinSocket(userId) {
  if (!socket.connected) {
    console.log('🔌 Connecting socket...');
    socket.connect();
  }
  socket.emit('join', userId);
}

// Listen for new notifications (for farmers)
export function onNewNotification(callback) {
  socket.on('newNotification', callback);
}

// Listen for new chat messages
export function onReceiveMessage(callback) {
  socket.on('receiveMessage', callback);
}

// Emit a message (with cropId/orderId context)
export function sendMessage({ sender, receiver, content, cropId, orderId }) {
  socket.emit('sendMessage', { sender, receiver, content, cropId, orderId });
}

// Emit a notification to a farmer
export function notifyFarmer({ user, crop, order, type, message }) {
  socket.emit('notifyFarmer', { user, crop, order, type, message });
}

export default socket;