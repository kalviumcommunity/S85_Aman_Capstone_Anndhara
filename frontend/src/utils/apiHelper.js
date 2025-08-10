// Common API helper functions
const getApiBaseUrl = () => {
  // TEMPORARY: Force production URL to bypass CORS issue
  // TODO: Change back to localhost after backend CORS fix is deployed
  return 'https://anndhara.onrender.com';
  
  // Original logic (uncomment after CORS fix is deployed):
  // if (import.meta.env.DEV) {
  //   return 'http://localhost:9001'; // Your local backend port
  // }
  // return 'https://anndhara.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API base URL for debugging
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('⚠️  TEMPORARY: Using production URL to bypass CORS');

// Get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    'Content-Type': 'application/json',
    ...(user?.token && { Authorization: `Bearer ${user.token}` })
  };
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: getAuthHeaders(),
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// GET request
const apiGet = (endpoint) => apiCall(endpoint);

// POST request
const apiPost = (endpoint, body) => apiCall(endpoint, {
  method: 'POST',
  body: JSON.stringify(body)
});

// PUT request
const apiPut = (endpoint, body) => apiCall(endpoint, {
  method: 'PUT',
  body: JSON.stringify(body)
});

// DELETE request
const apiDelete = (endpoint) => apiCall(endpoint, {
  method: 'DELETE'
});

// Cart operations
export const cartAPI = {
  addToCart: (cropId, quantity, proposedPrice) => 
    apiPost('/cart/add', { cropId, quantity, proposedPrice }),
  
  getCart: () => apiGet('/cart'),
  
  removeFromCart: (cropId) => apiDelete(`/cart/remove/${cropId}`),
  
  clearCart: () => apiDelete('/cart/clear')
};

// Order operations
export const orderAPI = {
  createOrder: (orderData) => apiPost('/order/result', orderData),
  
  getOrders: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiGet(`/order/getResult?${params}`);
  },
  
  updateOrder: (orderId, updateData) => apiPut(`/order/update/${orderId}`, updateData),
  
  getFarmerOrders: (farmerId) => apiGet(`/order/farmer/${farmerId}`)
};

// Crop operations
export const cropAPI = {
  getAllCrops: () => apiGet('/crop/AllCrop'),
  
  getCropById: (id) => apiGet(`/crop/${id}`),
  
  createCrop: (cropData) => apiPost('/crop/crop', cropData),
  
  updateCrop: (id, updateData) => apiPut(`/crop/update/${id}`, updateData)
};

// User operations
export const userAPI = {
  getUsers: () => apiGet('/user'),
  
  getUserById: (id) => apiGet(`/user/${id}`),
  
  updateUser: (id, updateData) => apiPut(`/user/update/${id}`, updateData),
  
  updateRole: (id, role) => apiPut(`/user/update/${id}`, { role }),
  
  getCurrentUser: () => apiGet('/user/me')
};

// Rating operations
export const ratingAPI = {
  createReview: (reviewData) => apiPost('/rating/Review', reviewData),
  
  getReviews: () => apiGet('/rating/getReview'),
  
  updateReview: (id, updateData) => apiPut(`/rating/update/${id}`, updateData)
};

// Favorite operations
export const favoriteAPI = {
  addFavorite: (cropId) => apiPost('/favorite/add', { cropId }),
  
  removeFavorite: (cropId) => apiPost('/favorite/remove', { cropId }),
  
  getFavorites: () => apiGet('/favorite/buyer')
};

// Message operations
export const messageAPI = {
  sendMessage: (messageData) => apiPost('/Message/chat', messageData),
  
  getMessages: (params) => {
    const queryParams = new URLSearchParams(params);
    return apiGet(`/Message?${queryParams}`);
  },
  
  updateMessage: (id, updateData) => apiPut(`/Message/update/${id}`, updateData)
};

// Notification operations
export const notificationAPI = {
  getNotifications: () => apiGet('/notification'),
  
  markAsRead: (id) => apiPut(`/notification/${id}/read`)
};

// Utility functions
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!(user && user.token);
};

export const isBuyer = () => {
  const user = getCurrentUser();
  return user?.role === 'buyer';
};

export const isFarmer = () => {
  const user = getCurrentUser();
  return user?.role === 'farmer';
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
};

export default {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  cartAPI,
  orderAPI,
  cropAPI,
  userAPI,
  ratingAPI,
  favoriteAPI,
  messageAPI,
  notificationAPI,
  getCurrentUser,
  isAuthenticated,
  isBuyer,
  isFarmer,
  getImageUrl
}; 