import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  if (!user) {
    return <div className="p-4 text-center">No user logged in. Please login first.</div>;
  }

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '👤';
    const parts = name.split(' ');
    return parts.length > 1
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="bg-white shadow-xl rounded-lg max-w-md w-full p-6 border">
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl font-bold text-green-700 mb-2 border-2 border-green-400">
            {getInitials(user.username)}
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-1 text-center">{user.username}</h2>
          <span className="text-gray-500 text-sm">{user.email}</span>
        </div>
        <div className="space-y-3 text-gray-700 mt-4">
          <div><strong>Role:</strong> {user.role}</div>
          <div><strong>Phone:</strong> {user.phone}</div>
        </div>
        <button
          onClick={logout}
          className="mt-6 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
