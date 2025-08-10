import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaSeedling,
  FaCarrot,
  FaAppleAlt,
  FaLeaf,
  FaUserCircle,
  FaSearch,
  FaShoppingCart,
  FaBell
} from 'react-icons/fa';
import { GiPeanut } from 'react-icons/gi';
import { useCart } from '../store/cartStore';
import { getCurrentUser, isBuyer, isFarmer } from '../utils/apiHelper';

const categories = [
  "Crops",
  "Vegetable", 
  "Fruits",
  "Nursery & Plants",
  "Dry Fruits",
];

const categoryIcons = [
  <FaSeedling />, // Crops
  <FaCarrot />,   // Vegetable
  <FaAppleAlt />, // Fruits
  <FaLeaf />,     // Nursery & Plants
  <GiPeanut />,   // Dry Fruits
];

const Navbar = ({ selectedCategory, setSelectedCategory, searchTerm, setSearchTerm }) => {
  const { cart } = useCart();
  const user = getCurrentUser();

  return (
    <nav className='relative z-50 backdrop-blur-2xl bg-gradient-to-r from-green-600/90 via-emerald-500/90 to-green-700/90 shadow-2xl px-6 py-6 border-b border-white/20 sticky top-0' 
         style={{ 
           backdropFilter: 'blur(25px)', 
           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(16, 185, 129, 0.95) 50%, rgba(34, 197, 94, 0.95) 100%)',
           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
         }}>
      
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        {/* Logo with ultra-enhanced styling */}
        <Link to="/" className='group relative'>
          <div className="text-5xl font-black drop-shadow-2xl tracking-wide hover:scale-110 transition-all duration-500 cursor-pointer">
            <span className="bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent group-hover:from-orange-200 group-hover:to-yellow-200 transition-all duration-500">
              Anna
            </span>
            <span className="bg-gradient-to-r from-orange-300 via-orange-200 to-yellow-200 bg-clip-text text-transparent group-hover:from-white group-hover:to-green-100 transition-all duration-500">
              dhara
            </span>
          </div>
          <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 group-hover:w-full transition-all duration-500"></div>
        </Link>
        
        {/* Enhanced search bar with glass effect */}
        <div className='flex-grow max-w-2xl mx-8 relative group'>
          <div className="relative">
            <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-green-600 z-10 text-xl group-focus-within:text-emerald-600 transition-colors duration-300" />
            <input
              type="search"
              placeholder='🔍 Search crops, vegetables, fruits...'
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full border-2 border-white/30 rounded-3xl pl-16 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent bg-white/20 backdrop-blur-xl text-white placeholder-green-100 shadow-2xl transition-all duration-500 hover:bg-white/30 text-lg font-semibold'
              style={{ backdropFilter: 'blur(20px)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* User actions - only show relevant elements */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <FaBell className="text-white text-2xl hover:text-orange-300 cursor-pointer transition-colors duration-300 hover:animate-bounce" />
          
          {/* Cart */}
          <Link to="/cart" className='group relative flex items-center justify-center w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl hover:bg-white/30 transition-all duration-500 border border-white/30 hover:border-white/50 transform hover:scale-110 shadow-2xl' style={{ backdropFilter: 'blur(15px)' }}>
            <FaShoppingCart className='text-2xl text-orange-300 drop-shadow group-hover:animate-bounce' />
            {cart && cart.length > 0 && (
              <span className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-2xl animate-pulse border-2 border-white'>
                {cart.length}
              </span>
            )}
          </Link>

          {/* User profile or login/register */}
          {user ? (
            <Link to="/profile" className='flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105' style={{ backdropFilter: 'blur(15px)' }}>
              <FaUserCircle className='text-3xl text-white drop-shadow' />
              <div className="text-white">
                <div className="font-bold text-lg">{user.username}</div>
                <div className="text-green-100 text-sm capitalize">
                  {user.role || 'Select Role'}
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className='bg-gradient-to-r from-white to-orange-50 text-green-700 px-6 py-3 rounded-2xl hover:from-orange-50 hover:to-orange-100 font-bold transition-all duration-500 border-2 border-green-600 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 text-lg backdrop-blur-xl' style={{ backdropFilter: 'blur(10px)' }}>
                🔐 Login
              </Link>
              <Link to="/register" className='bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl hover:from-orange-600 hover:to-orange-700 font-bold transition-all duration-500 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border border-orange-400 text-lg backdrop-blur-xl' style={{ backdropFilter: 'blur(10px)' }}>
                ✨ Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced category buttons */}
      <div className='flex flex-wrap items-center justify-center gap-4 mb-6'>
        {categories.map((item, i) => (
          <button
            key={item}
            onClick={() => setSelectedCategory(item)}
            className={`group relative flex items-center gap-3 px-8 py-4 rounded-3xl transition-all duration-500 font-black shadow-2xl hover:shadow-3xl transform hover:scale-110 border backdrop-blur-xl text-lg ${
              selectedCategory === item 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-300/50 border-orange-300 scale-110' 
                : 'bg-white/20 text-white hover:bg-white/30 border-white/30 hover:border-white/50'
            }`}
            style={{ backdropFilter: 'blur(15px)' }}
          >
            <span className='text-2xl group-hover:animate-bounce'>{categoryIcons[i]}</span>
            <span className="hidden sm:inline group-hover:animate-pulse">{item}</span>
            {selectedCategory === item && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-3xl animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Enhanced user actions - only show relevant buttons */}
      <div className='flex flex-wrap justify-center items-center gap-4'>
        {/* Seller button - always show */}
        <Link to="/crop-upload" className='bg-gradient-to-r from-white to-green-50 text-green-700 px-8 py-3 rounded-3xl hover:from-green-50 hover:to-green-100 font-bold transition-all duration-500 border-2 border-green-600 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 text-lg backdrop-blur-xl' style={{ backdropFilter: 'blur(10px)' }}>
          🌱 Sell
        </Link>
        
        {/* Farmer-specific buttons - only show if user is logged in as farmer */}
        {user && user.role === 'farmer' && (
          <>
            <Link 
              to="/farmer-messages" 
              className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-3xl hover:from-blue-700 hover:to-blue-800 font-bold transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 border border-blue-400 backdrop-blur-xl text-lg'
              style={{ backdropFilter: 'blur(10px)' }}
            >
              💬 Messages
            </Link>
            <Link
              to="/farmer-orders"
              className='bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-3xl hover:from-purple-700 hover:to-purple-800 font-bold transition-all duration-500 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 border border-purple-400 backdrop-blur-xl text-lg'
              style={{ backdropFilter: 'blur(10px)' }}
            >
              📦 Orders
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 