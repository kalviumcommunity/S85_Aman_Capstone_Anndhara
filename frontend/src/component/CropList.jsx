import React, { useEffect, useState } from 'react';

const CropList = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:9001/crop/AllCrop')
      .then(res => res.json())
      .then(data => {
        setCrops(data.crops || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading crops...</p>;

  return (
    <div>
      <h2>All Crops</h2>
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
                src={`http://localhost:9001${crop.imageUrl}`}
                alt={crop.name}
                style={{ width: '150px', height: 'auto' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CropList;
