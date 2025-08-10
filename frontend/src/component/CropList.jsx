import React, { useEffect, useState } from 'react';
import { cropAPI, cartAPI, getCurrentUser, isBuyer, getImageUrl } from '../utils/apiHelper';

const CropList = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const user = getCurrentUser();

  const handleAddToCart = async (crop) => {
    if (!user || !isBuyer()) {
      setMessage('You must be logged in as a buyer to add to cart.');
      return;
    }
    try {
      const data = await cartAPI.addToCart(crop._id, 1, crop.pricePerKg);
      if (data.success) {
        setMessage('Added to cart!');
      } else {
        setMessage(data.error || 'Failed to add to cart.');
      }
    } catch (err) {
      setMessage('Failed to add to cart.');
      console.error('Add to cart error:', err);
    }
    setTimeout(() => setMessage(''), 2000);
  };

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await cropAPI.getAllCrops();
        setCrops(data.crops || []);
      } catch (err) {
        console.error('Failed to fetch crops:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCrops();
  }, []);

  if (loading) return <p>Loading crops...</p>;

  return (
    <div>
      <h2>All Crops</h2>
      {message && <div className="text-green-700 font-semibold mb-2">{message}</div>}
      {crops.length === 0 && <p>No crops found.</p>}
      <ul>
        {crops.map(crop => (
          <li key={crop._id} style={{ marginBottom: '20px' }}>
            <h3>{crop.name} ({crop.type})</h3>
            <p>Price per Kg: {crop.pricePerKg}</p>
            <p>Quantity: {crop.quantityKg} Kg</p>
            <p>Location: {crop.location}</p>
            {crop.imageUrl && (
              <img
                src={getImageUrl(crop.imageUrl)}
                alt={crop.name}
                style={{ width: '150px', height: 'auto' }}
              />
            )}
            {user && isBuyer() && (
              <button
                onClick={() => handleAddToCart(crop)}
                className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
              >
                Add to Cart
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CropList;
