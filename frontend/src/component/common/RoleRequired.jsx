import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleRequired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-lg max-w-md w-full p-6 border text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Role Selection Required</h2>
          <p className="text-gray-600">
            To continue using FarmConnect, please select your role in your profile.
          </p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-semibold text-blue-800">Buyer</div>
            <div className="text-sm text-blue-600">Browse and purchase crops</div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl mb-2">🌾</div>
            <div className="font-semibold text-green-800">Farmer</div>
            <div className="text-sm text-green-600">Sell your crops and products</div>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/profile')}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Profile to Select Role
        </button>
      </div>
    </div>
  );
};

export default RoleRequired; 