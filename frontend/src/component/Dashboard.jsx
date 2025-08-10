import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSeedling,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaMapMarkerAlt,
  FaWeight,
  FaGift,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell
} from 'react-icons/fa';
import { useCart } from '../store/cartStore';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  return imageUrl.startsWith('http')
    ? imageUrl
    : `https://anndhara.onrender.com${imageUrl}`;
};

const ProductCard = ({ id, imgSrc, title, description, onViewDetails, onOrder, onAddToCart, showAddToCart, showOrder, sellerId, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Parse description to extract price, quantity, and location
  const descParts = description.split(' | ');
  const type = descParts[0]?.replace('Type: ', '') || '';
  const price = descParts[1] || '';
  const quantity = descParts[2] || '';
  const location = descParts[3] || '';

  return (
    <div 
      className='group relative bg-white/80 backdrop-blur-lg border border-green-200/50 rounded-3xl shadow-lg hover:shadow-2xl p-0 transition-all duration-700 hover:-translate-y-3 overflow-hidden transform-gpu'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.2)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ padding: '2px' }}>
        <div className="w-full h-full bg-white rounded-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Image container with enhanced styling */}
        <div className='relative overflow-hidden rounded-t-3xl h-56'>
          {imgSrc && (
            <div className="relative h-full bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100">
              <img
                src={imgSrc}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                style={{ filter: isHovered ? 'brightness(1.1) saturate(1.2)' : 'brightness(1) saturate(1)' }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 animate-pulse flex items-center justify-center">
                  <FaSeedling className="text-5xl text-green-400 animate-bounce" />
                </div>
              )}
              
              {/* Favorite button with glass effect */}
              {typeof isFavorite !== 'undefined' && (
                <button
                  aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
                  className='absolute top-4 right-4 bg-white/20 backdrop-blur-xl text-red-500 text-xl p-3 rounded-full shadow-2xl hover:bg-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-125 border border-white/30'
                  onClick={onToggleFavorite}
                  style={{ backdropFilter: 'blur(20px)' }}
                >
                  {isFavorite ? <FaHeart className="animate-pulse drop-shadow-lg" /> : <FaRegHeart />}
                </button>
              )}
              
              {/* Type badge with glass effect */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl border border-white/20 animate-pulse" style={{ backdropFilter: 'blur(20px)' }}>
                ✨ {type}
              </div>

              {/* Hover overlay with glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          )}
        </div>

        {/* Content section with glass effect */}
        <div className="p-6 relative z-10 bg-gradient-to-b from-white/90 to-gray-50/90 backdrop-blur-sm" style={{ backdropFilter: 'blur(10px)' }}>
          {/* Title with enhanced styling */}
          <h4 className='font-black text-xl md:text-2xl mb-4 leading-tight'>
            <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
              {title}
            </span>
          </h4>
          
          {/* Enhanced info cards with glass effect */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-lg rounded-2xl p-4 border border-green-200/50 shadow-lg" style={{ backdropFilter: 'blur(15px)' }}>
              <span className="flex items-center gap-3 font-bold text-green-700">
                <FaWeight className="text-orange-500 text-lg drop-shadow" />
                <span className="text-base md:text-lg">{quantity}</span>
              </span>
              <span className="font-black text-green-800 text-lg md:text-2xl bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                {price}
              </span>
            </div>
            
            {location && (
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 shadow-lg" style={{ backdropFilter: 'blur(15px)' }}>
                <FaMapMarkerAlt className="text-orange-500 text-lg drop-shadow" />
                <span className="font-semibold text-sm md:text-base">{location}</span>
              </div>
            )}
          </div>

          {/* Enhanced buttons with glass effects */}
          <div className="space-y-4">
            <button
              aria-label={`View details for ${title}`}
              className='w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 md:py-4 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 border border-gray-700 hover:border-green-500 backdrop-blur-lg'
              onClick={() => onViewDetails(id)}
              style={{ 
                boxShadow: isHovered ? '0 20px 40px -12px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(34, 197, 94, 0.2)' : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span className="flex items-center justify-center gap-3 text-base md:text-lg">
                <FaStar className={isHovered ? "animate-spin" : "animate-pulse"} />
                View Details
              </span>
            </button>

            {/* Message button for buyers only */}
            {(() => {
              const user = JSON.parse(localStorage.getItem('user'));
              return user && user.role === 'buyer' && user.id !== sellerId ? (
                <button
                  className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 md:py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 backdrop-blur-lg border border-blue-500'
                  onClick={() => navigate(`/chat/${sellerId}?cropId=${id}`)}
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <span className="flex items-center justify-center gap-3 text-base md:text-lg">
                    💬 Message Seller
                  </span>
                </button>
              ) : null;
            })()}

            {/* Add to Cart button with enhanced styling */}
            {showAddToCart && (
              <button
                className='w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 md:py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 backdrop-blur-lg border border-orange-400'
                onClick={() => onAddToCart(id)}
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <span className="flex items-center justify-center gap-3 text-base md:text-lg">
                  <FaGift className={isHovered ? "animate-bounce" : ""} />
                  Add to Cart
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

const DashBoard = ({ selectedCategory, searchTerm }) => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));
  const [favorites, setFavorites] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('https://anndhara.onrender.com/crop/AllCrop')
      .then(res => res.json())
      .then(data => {
        setCrops(data.crops || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching crops:", err);
        setLoading(false);
      });

    // Fetch favorites for buyers
    if (user && user.role === 'buyer') {
      fetch('https://anndhara.onrender.com/favorite/my', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setFavorites(data.favorites?.map(f => f.cropId?._id) || []))
        .catch(() => setFavorites([]));
    }
  }, [user]);

  const filteredCrops = selectedCategory === 'Crops'
    ? crops.filter(crop => crop.available !== false && crop.quantityKg > 0 && 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : crops.filter(crop => crop.type.toLowerCase() === selectedCategory.toLowerCase() && 
        crop.available !== false && crop.quantityKg > 0 &&
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleViewDetails = (cropId) => {
    navigate(`/crop-details/${cropId}`);
  };

  const handleOrder = async (cropId) => {
    if (!user || user.role !== 'buyer') {
      alert('You must be logged in as a buyer to place an order.');
      return;
    }
    const crop = crops.find(c => c._id === cropId);
    if (!crop) {
      alert('Crop not found.');
      return;
    }
    const quantity = 1;
    const address = prompt('Enter delivery address:');
    if (!address) return;
    const orderBody = {
      crop: crop._id,
      quantityOrdered: quantity,
      proposedPrice: crop.pricePerKg,
      address
    };
            const res = await fetch('https://anndhara.onrender.com/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(orderBody)
    });
    const data = await res.json();
    if (data.success) {
      alert('Order placed successfully!');
    } else {
      alert(data.error || 'Failed to place order.');
    }
  };

  const handleAddToCart = (cropId) => {
    const crop = crops.find(c => c._id === cropId);
    if (!cart.find(item => item._id === cropId)) {
      addToCart(crop);
      alert('Added to cart!');
    } else {
      alert('Already in cart!');
    }
  };

  const toggleFavorite = async (cropId, isFav) => {
    if (!user || user.role !== 'buyer') return;
            const url = `https://anndhara.onrender.com/favorite/${isFav ? 'remove' : 'add'}`;
    const method = isFav ? 'DELETE' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ cropId })
    });
    if (res.ok) {
      setFavorites(favs => isFav ? favs.filter(id => id !== cropId) : [...favs, cropId]);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 font-sans relative overflow-x-hidden'>
      {/* Enhanced Navbar with ultra-modern glass effect */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <FaSeedling className="text-white text-xl" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Annadhara
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                Home
              </Link>
              <Link to="/crops" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                Crops
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                Contact
              </Link>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors duration-300">
                    <FaShoppingCart className="text-xl" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link to="/profile" className="p-2 text-gray-700 hover:text-green-600 transition-colors duration-300">
                    <FaUser className="text-xl" />
                  </Link>
                  <button className="p-2 text-gray-700 hover:text-green-600 transition-colors duration-300">
                    <FaBell className="text-xl" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors duration-300"
              >
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-green-200/50 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <Link to="/" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                  Home
                </Link>
                <Link to="/crops" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                  Crops
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                  Contact
                </Link>
                {user && (
                  <>
                    <Link to="/cart" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                      Cart ({cart.length})
                    </Link>
                    <Link to="/profile" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">
                      Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Ultra-Enhanced Hero Section */}
      <section className='relative bg-gradient-to-br from-green-100 via-white to-emerald-100 text-center py-20 md:py-32 px-4 overflow-hidden z-10 mt-16'>
        {/* Mega animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-20 md:w-40 h-20 md:h-40 bg-green-300/20 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-40 right-32 w-16 md:w-32 h-16 md:h-32 bg-orange-300/20 rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-12 md:w-24 h-12 md:h-24 bg-emerald-300/20 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-1/4 w-24 md:w-48 h-24 md:h-48 bg-teal-300/20 rounded-full animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <h2 className='text-4xl md:text-6xl lg:text-8xl font-black mb-8 leading-tight drop-shadow-2xl'>
              <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent animate-pulse">
                Bharat's Largest Agricultural Marketplace
              </span>
            </h2>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
                Connect Farmers & Buyers Across India
              </span>
            </h3>
          </div>
          
          <p className='text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed font-semibold px-4'>
            <span className="text-3xl md:text-4xl mb-4 block">🌾</span>
            Connect directly with farmers, suppliers, and buyers across Bharat. 
            <br className="hidden md:block" />
            <span className="font-black text-green-700 text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Get the best prices for quality agricultural products.
            </span>
          </p>
          
          <button className='group relative bg-gradient-to-r from-green-600 via-emerald-700 to-green-800 text-white px-8 md:px-16 py-4 md:py-6 rounded-3xl text-lg md:text-2xl font-black hover:from-green-700 hover:via-emerald-800 hover:to-green-900 transition-all duration-700 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50 border-2 border-green-500 overflow-hidden'>
            <span className="relative z-10 flex items-center gap-4">
              🚀 Start Trading Now
              <FaGift className="group-hover:animate-bounce" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </section>

      {/* Ultra-Enhanced Products Section */}
      <section className='relative px-4 md:px-6 py-16 md:py-20 z-10'>
        <div className="text-center mb-16">
          <h4 className='text-4xl md:text-5xl lg:text-6xl font-black mb-6'>
            <span className="bg-gradient-to-r from-green-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
              Premium Products
            </span>
          </h4>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 font-semibold leading-relaxed px-4">
            Discover fresh, quality agricultural products from verified sellers across India
          </p>
          <div className="flex justify-center">
            <div className="w-32 md:w-48 h-1 md:h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full shadow-lg animate-pulse"></div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative mb-8">
              <div className="w-24 md:w-32 h-24 md:h-32 border-8 border-green-200 border-t-green-600 rounded-full animate-spin shadow-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSeedling className="text-3xl md:text-5xl text-green-600 animate-pulse drop-shadow-lg" />
              </div>
            </div>
            <p className="text-center text-2xl md:text-3xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              🌱 Loading fresh crops...
            </p>
            <p className="text-center text-lg text-gray-600 mt-4 max-w-md">
              Connecting to our network of verified farmers across India
            </p>
            <div className="mt-8 flex gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl md:text-9xl mb-8 animate-bounce">🌾</div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
              No crops available for {selectedCategory}
            </h3>
            <p className="text-lg md:text-xl text-gray-500 font-semibold mb-6">Try a different category or check back later</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setSelectedCategory('Crops')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 md:px-8 py-3 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                🔄 View All Crops
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 md:px-8 py-3 rounded-2xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10'>
            {filteredCrops.map((crop, index) => (
              <div 
                key={crop._id}
                className="animate-fadeInUp"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <ProductCard
                  id={crop._id}
                  imgSrc={getImageUrl(crop.imageUrl)}
                  title={crop.name}
                  description={`Type: ${crop.type} | ₹${crop.pricePerKg}/kg | ${crop.quantityKg} Kg | ${crop.location}`}
                  onViewDetails={handleViewDetails}
                  onOrder={handleOrder}
                  onAddToCart={handleAddToCart}
                  showAddToCart={user && user.role === 'buyer'}
                  showOrder={user && user.role === 'buyer'}
                  sellerId={crop.seller?._id}
                  isFavorite={favorites.includes(crop._id)}
                  onToggleFavorite={() => toggleFavorite(crop._id, favorites.includes(crop._id))}
                />
              </div>
            ))}
          </div>
          
          )}
        </section>
        
        {/* Floating Action Button */}
        {user && user.role === 'buyer' && (
          <div className="fixed bottom-8 right-8 z-40">
            <div className="relative group">
              <button 
                onClick={() => navigate('/cart')}
                className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 border-2 border-white"
              >
                <FaShoppingCart className="text-2xl mx-auto" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/80 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm">
                  View Cart ({cart.length} items)
                </div>
                <div className="w-2 h-2 bg-black/80 transform rotate-45 absolute top-full right-6"></div>
              </div>
            </div>
          </div>
        )}

      {/* Ultra-Enhanced Footer */}
      <footer className='relative bg-gradient-to-r from-green-800 via-emerald-700 to-green-900 text-white py-16 md:py-20 mt-32 shadow-2xl overflow-hidden z-10' style={{ backdropFilter: 'blur(20px)' }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 md:w-40 h-20 md:h-40 bg-white rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute top-20 right-20 w-16 md:w-32 h-16 md:h-32 bg-orange-300 rounded-full animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-14 md:w-28 h-14 md:h-28 bg-white rounded-full animate-pulse" style={{ animationDuration: '7s', animationDelay: '4s' }}></div>
          <div className="absolute bottom-10 right-1/3 w-18 md:w-36 h-18 md:h-36 bg-orange-200 rounded-full animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
        </div>
        
        <div className='relative z-10 max-w-7xl mx-auto px-4 md:px-6'>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent drop-shadow-lg">
                  Anna
                </span>
                <span className="bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
                  dhara
                </span>
              </h3>
              <p className="text-green-200 leading-relaxed text-base md:text-lg font-semibold">
                🌱 Empowering farmers and connecting communities across Bharat through sustainable agriculture and innovative technology.
              </p>
              <div className="mt-6 flex justify-center md:justify-start gap-4">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <span className="text-xl md:text-2xl">📧</span>
                </div>
                <div className="w-10 md:w-12 h-10 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <span className="text-xl md:text-2xl">📱</span>
                </div>
                <div className="w-10 md:w-12 h-10 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <span className="text-xl md:text-2xl">🌐</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-2xl md:text-3xl font-black mb-6 bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <span className="text-green-200 font-bold text-base md:text-lg">🌱 Buy Fresh Crops</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <span className="text-green-200 font-bold text-base md:text-lg">📦 Sell Your Harvest</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <span className="text-green-200 font-bold text-base md:text-lg">🤝 Connect with Farmers</span>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h4 className="text-2xl md:text-3xl font-black mb-6 bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="text-green-200 font-bold text-base md:text-lg">📧 support@annadhara.com</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="text-green-200 font-bold text-base md:text-lg">📱 +91 98765 43210</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="text-green-200 font-bold text-base md:text-lg">🏢 Delhi, India</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className='border-t border-green-600/50 pt-12 text-center'>
            <div className='flex flex-col md:flex-row items-center justify-center gap-6'>
              <span className='text-lg md:text-2xl font-bold text-green-200'>
                &copy; 2025. All rights reserved.
              </span>
              <span className='bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent font-black text-lg md:text-2xl'>
                Empowering Rural India 🌾
              </span>
            </div>
            <div className="mt-8 text-base md:text-lg text-green-300 font-semibold">
              🚀 Made with ❤️ for Indian Farmers
            </div>
          </div>
        </div>

        {/* Animated gradient border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 animate-pulse"></div>
      </footer>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `
      }} />
    </div>
  );
};

export default DashBoard;
