import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSeedling,
  FaCarrot,
  FaAppleAlt,
  FaLeaf,
  FaUserCircle
} from 'react-icons/fa';
import { GiPeanut } from 'react-icons/gi';

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

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/300x200?text=No+Image';
  return imageUrl.startsWith('http')
    ? imageUrl
    : `http://localhost:9001${imageUrl}`;
};

const ProductCard = ({ id, imgSrc, title, description, onViewDetails }) => (
  <div className='bg-white border rounded-lg shadow hover:shadow-2xl p-4 transform transition-transform duration-200 hover:scale-105'>
    <img
      src={imgSrc}
      alt={title}
      className='rounded mb-3 w-full h-40 object-cover border'
    />
    <h4 className='font-bold text-green-700 text-lg mb-1'>{title}</h4>
    <p className='text-sm text-gray-600'>{description}</p>
    <button
      aria-label={`View details for ${title}`}
      className='mt-3 bg-gray-700 text-white w-full py-1.5 rounded hover:bg-green-600 transition-all duration-200'
      onClick={() => onViewDetails(id)}
    >
      View Details
    </button>
  </div>
);

const DashBoard = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Crops');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:9001/crop/AllCrop')
      .then(res => res.json())
      .then(data => {
        setCrops(data.crops || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching crops:", err);
        setLoading(false);
      });
  }, []);

  const filteredCrops = selectedCategory === 'Crops'
    ? crops
    : crops.filter(crop => crop.type.toLowerCase() === selectedCategory.toLowerCase());

  const handleViewDetails = (cropId) => {
    navigate(`/crop-details/${cropId}`);
  };

  return (
    <div className='min-h-screen bg-white font-sans'>
      {/* Navbar */}
      <nav className='flex flex-wrap items-center justify-between bg-white shadow-md px-6 py-4'>
        <Link to="/" className='text-3xl font-extrabold text-green-700'>Annadhara</Link>
        <form className='flex-grow max-w-xs mx-4'>
          <input
            type="search"
            placeholder='Search Product'
            className='w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500'
          />
        </form>
        <ul className='hidden lg:flex space-x-6 text-sm font-semibold text-orange-600'>
          {categories.map((item, i) => (
            <li key={i}>
              <button
                onClick={() => setSelectedCategory(item)}
                className={`flex items-center gap-1 hover:text-green-700 ${selectedCategory === item ? 'text-green-700 font-bold' : ''}`}
              >
                <span className='text-lg'>{categoryIcons[i]}</span>
                {item}
              </button>
            </li>
          ))}
        </ul>
        <div className='flex space-x-2 items-center'>
          {user && (
            <Link to="/profile" className='flex items-center gap-2 px-3 py-1 rounded-full hover:bg-green-100 transition-all'>
              <FaUserCircle className='text-2xl text-green-700' />
              <span className='hidden md:inline text-green-700 font-semibold'>{user.username}</span>
            </Link>
          )}
          {user && user.role === 'farmer' && (
            <Link 
              to="/farmer-messages" 
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-all'
            >
              💬 Messages
            </Link>
          )}
          <Link to="/crop-upload" className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 font-semibold transition-all'><b>Seller</b></Link>
          <Link to="/login" className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 font-semibold transition-all'><b>Login</b></Link>
          <Link to="/register" className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 font-semibold transition-all'><b>Sign</b></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className='bg-green-50 text-center py-14 px-4'>
        <h2 className='text-4xl font-extrabold text-green-700 mb-4'>
          Annadhara is Bharat's Largest Marketplace <br />
          <span className='text-green-800'>For Selling and Buying <b>Crops</b></span>
        </h2>
        <p className='text-gray-700 max-w-2xl mx-auto mb-6'>
          Connect Directly with Farmers, Suppliers, and Buyers Across Bharat.
          Get the best prices for quality agricultural products.
        </p>
        <button className='bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 hover:text-orange-400 transition-transform duration-200 transform hover:scale-105'>
          <b>Start Trading Now</b>
        </button>
      </section>

      {/* Products */}
      <section className='px-6 py-8'>
        <h4 className='text-2xl font-semibold text-green-800 mb-6 text-center'>
          Products Available for Buy & Sell
        </h4>

        {loading ? (
          <p className="text-center mt-8 text-green-700">Loading crops...</p>
        ) : filteredCrops.length === 0 ? (
          <p className="text-center text-gray-500">No crops available for {selectedCategory}.</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredCrops.map(crop => (
              <ProductCard
                key={crop._id}
                id={crop._id}
                imgSrc={getImageUrl(crop.imageUrl)}
                title={crop.name}
                description={`Type: ${crop.type} | ₹${crop.pricePerKg}/kg | ${crop.quantityKg} Kg | ${crop.location}`}
                  onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className='bg-green-800 text-white text-center py-4 mt-10 shadow-inner'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
          <span className='font-bold text-lg'>Annadhara</span>
          <span className='text-sm'>&copy; 2025. All rights reserved.</span>
          <span className='text-xs text-green-200'>Empowering Rural India 🌾</span>
        </div>
      </footer>
    </div>
  );
};

export default DashBoard;
