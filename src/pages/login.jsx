import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { FaPhone, FaLock, FaUser } from 'react-icons/fa';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('phone');
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  if (user) {
    navigate('/home');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginUser = loginType === 'phone' ? phone : uid;
      const result = await login(loginUser, password);
      
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dimond 11</h1>
          <div className="text-3xl">🇺🇸</div>
        </div>

        <div className="bg-purple-800/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
          <p className="text-purple-200 text-sm mb-6">Please log in with your phone number or uid</p>

          {/* Login Type Tabs */}
          <div className="flex gap-4 mb-6 border-b border-purple-500/30">
            <button
              onClick={() => setLoginType('phone')}
              className={`flex items-center gap-2 pb-3 px-4 transition-colors ${
                loginType === 'phone' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-purple-300'
              }`}
            >
              <FaPhone /> Login With Phone
            </button>
            <button
              onClick={() => setLoginType('uid')}
              className={`flex items-center gap-2 pb-3 px-4 transition-colors ${
                loginType === 'uid' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-purple-300'
              }`}
            >
              <FaUser /> UID
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginType === 'phone' ? (
              <div>
                <label className="block text-purple-200 text-sm mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-purple-300">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-12 pr-3 py-3 border border-purple-500/30 rounded-xl bg-purple-900/30 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="9876543210"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-purple-200 text-sm mb-2">UID</label>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="block w-full px-3 py-3 border border-purple-500/30 rounded-xl bg-purple-900/30 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your UID"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-purple-200 text-sm mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-purple-300" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-purple-500/30 rounded-xl bg-purple-900/30 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-yellow-400 hover:text-yellow-300 font-bold">
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;