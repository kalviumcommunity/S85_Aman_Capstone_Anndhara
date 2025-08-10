import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, getCurrentUser } from '../utils/apiHelper';

const ROLE_OPTIONS = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'farmer', label: 'Farmer' },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [roleSelectionMode, setRoleSelectionMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', location: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData || !userData.token) {
      setUser(null);
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const data = await userAPI.getCurrentUser();
        if (data.success && data.data) {
          setUser(data.data);
          setForm({
            name: data.data.username || data.data.name || '',
            email: data.data.email || '',
            phone: data.data.phone || '',
            role: data.data.role || '',
            location: data.data.location || '',
          });
          // Check if user needs to select role
          if (!data.data.role || data.data.role === '') {
            setRoleSelectionMode(true);
          }
        } else {
          // Fallback to localStorage data
          setUser(userData);
          setForm({
            name: userData.username || userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || '',
            location: userData.location || '',
          });
          if (!userData.role || userData.role === '') {
            setRoleSelectionMode(true);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Fallback to localStorage data
        setUser(userData);
        setForm({
          name: userData.username || userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || '',
          location: userData.location || '',
        });
        if (!userData.role || userData.role === '') {
          setRoleSelectionMode(true);
        }
      }
    };
    
    fetchUserData();
  }, []);

  if (!user) {
    return <div className="p-4 text-center">No user logged in. Please login first.</div>;
  }

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    if (!name) return '👤';
    const parts = name.split(' ');
    return parts.length > 1
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user.username || user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      location: user.location || '',
    });
    setMessage('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    const userData = getCurrentUser();
    try {
      const data = await userAPI.updateUser(user._id || user.id, {
        user: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        location: form.location,
      });
      
      if (data.success) {
        setUser(data.data);
        setEditMode(false);
        setRoleSelectionMode(false); // Exit role selection mode
        setMessage('Profile updated successfully!');
        
        // Update localStorage with new user data
        const updatedUserData = {
          ...userData,
          username: data.data.username || data.data.name,
          email: data.data.email,
          role: data.data.role,
          phone: data.data.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      } else {
        setMessage(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  const handleRoleSelect = async (selectedRole) => {
    setMessage('');
    const userData = getCurrentUser();
    try {
      const data = await userAPI.updateRole(user._id || user.id, selectedRole);
      
      if (data.success) {
        setUser(data.data);
        setRoleSelectionMode(false);
        setMessage('Role selected successfully!');
        
        // Update localStorage with new role
        const updatedUserData = {
          ...userData,
          role: data.data.role
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      } else {
        setMessage(data.message || 'Failed to select role.');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="bg-white shadow-xl rounded-lg max-w-md w-full p-6 border">
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl font-bold text-green-700 mb-2 border-2 border-green-400">
            {getInitials(user.username || user.name)}
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-1 text-center">{user.username || user.name}</h2>
          <span className="text-gray-500 text-sm">{user.email}</span>
        </div>

        {/* Role Selection Interface */}
        {roleSelectionMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 text-center">Select Your Role</h3>
            <p className="text-yellow-700 text-sm mb-4 text-center">
              Please select your role to continue using the platform
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect('buyer')}
                className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="font-semibold text-blue-800">Buyer</div>
                  <div className="text-sm text-blue-600">I want to buy crops and products</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect('farmer')}
                className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌾</div>
                  <div className="font-semibold text-green-800">Farmer</div>
                  <div className="text-sm text-green-600">I want to sell my crops and products</div>
                </div>
              </button>
            </div>
            {message && <div className="mt-3 text-center text-green-700 font-semibold">{message}</div>}
          </div>
        )}
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-3 text-gray-700 mt-4">
            <div>
              <label className="block font-semibold mb-1">Name:</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email:</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone:</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Role:</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                <option value="">Select Role</option>
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Location:</label>
              <div className="flex gap-2">
                <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Location" />
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={async () => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        async (position) => {
                          const { latitude, longitude } = position.coords;
                          try {
                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                            const data = await response.json();
                            const address = data.display_name || `${latitude}, ${longitude}`;
                            setForm((prev) => ({
                              ...prev,
                              location: address
                            }));
                          } catch (err) {
                            setForm((prev) => ({
                              ...prev,
                              location: `${latitude}, ${longitude}`
                            }));
                          }
                        },
                        (error) => {
                          alert('Unable to retrieve your location.');
                        }
                      );
                    } else {
                      alert('Geolocation is not supported by your browser.');
                    }
                  }}
                >
                  Use My Location
                </button>
              </div>
            </div>
            {message && <div className="text-green-700 font-semibold">{message}</div>}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold">Save</button>
              <button type="button" onClick={handleCancel} className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-semibold">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-gray-700 mt-4">
            <div><strong>Name:</strong> {user.username || user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Role:</strong> {user.role || 'Not selected'}</div>
            {!user.role && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm text-center">
                  ⚠️ Please select a role to access all features
                </p>
              </div>
            )}
            <div><strong>Phone:</strong> {user.phone}</div>
            <div><strong>Location:</strong> {user.location || 'Not set'}</div>
            {message && <div className="text-green-700 font-semibold">{message}</div>}
            <button onClick={handleEdit} className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold">Edit Profile</button>
            
            {/* Change Role button */}
            {user.role && (
              <button 
                onClick={() => setRoleSelectionMode(true)} 
                className="mt-2 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold"
              >
                Change Role
              </button>
            )}
            
            {/* View My Orders button for buyers */}
            {user.role === 'buyer' && (
              <button
                className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                onClick={() => navigate('/buyer-orders')}
              >
                View My Orders
              </button>
            )}
          </div>
        )}
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
