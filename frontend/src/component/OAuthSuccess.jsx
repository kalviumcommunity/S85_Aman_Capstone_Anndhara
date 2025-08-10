import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      // Store minimal user data - role will be fetched from backend
      localStorage.setItem('user', JSON.stringify({ token }));
      
      // Redirect to profile to check/set role
      navigate('/profile');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-green-700 font-semibold">Processing login...</p>
      </div>
    </div>
  );
};
export default OAuthSuccess;