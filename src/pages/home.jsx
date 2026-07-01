import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { FaSyncAlt } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Home = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [banners] = useState([
    { id: 1, text: 'RECHARGE BONUS 100%', sub: 'Deposit now and get double!', color: 'from-pink-500 via-red-500 to-yellow-500', emoji: '🎁' },
    { id: 2, text: 'DAILY BONUS ₹500', sub: 'Login daily and claim!', color: 'from-blue-500 via-purple-500 to-pink-500', emoji: '💰' },
    { id: 3, text: 'REFER & EARN ₹50', sub: 'Invite friends and earn!', color: 'from-green-400 via-teal-500 to-blue-500', emoji: '👥' },
    { id: 4, text: 'VIP REWARDS', sub: 'Level up for better rewards!', color: 'from-yellow-400 via-orange-500 to-red-500', emoji: '👑' }
  ]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetchGames();
    fetchBalance();
    const balanceInterval = setInterval(fetchBalance, 15000);
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 3000);
    return () => {
      clearInterval(balanceInterval);
      clearInterval(bannerInterval);
    };
  }, []);

  // ✅ FETCH GAMES FROM MONGODB
  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/game/list`);
      if (res.data.success) {
        setGames(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      // Fallback - agar API fail ho toh
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/balance`);
      if (res.data.success) {
        updateUser({ ...user, balance: res.data.data.balance });
      }
    } catch (error) {}
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="pb-20 min-h-screen bg-[#4A0E8F]">
      <Header />

      {/* Banner */}
      <div className="px-3 mt-3">
        <div className={`bg-gradient-to-r ${banners[currentBanner].color} rounded-2xl shadow-xl overflow-hidden`} style={{ minHeight: '140px' }}>
          <div className="flex items-center justify-between h-full p-5">
            <div className="flex-1">
              <p className="text-white text-[10px] font-bold opacity-80 mb-1 uppercase tracking-wider">💎 DIAMOND 11</p>
              <h2 className="text-white text-xl font-black leading-tight mb-1">{banners[currentBanner].text}</h2>
              <p className="text-white/80 text-xs mb-3">{banners[currentBanner].sub}</p>
              <button onClick={() => navigate('/wallet')} className="bg-white text-purple-800 px-4 py-1.5 rounded-full text-xs font-black shadow-lg hover:scale-105 transition-transform">
                Play Now →
              </button>
            </div>
            <div className="text-6xl ml-2 drop-shadow-lg">{banners[currentBanner].emoji}</div>
          </div>
        </div>
        <div className="flex justify-center gap-1.5 mt-2 mb-3">
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentBanner(idx)} className={`rounded-full transition-all ${idx === currentBanner ? 'bg-yellow-400 w-4 h-1.5' : 'bg-purple-500 w-1.5 h-1.5'}`} />
          ))}
        </div>
      </div>

      {/* Balance */}
      <div className="px-3 mb-4">
        <div className="bg-[#5B21B6] rounded-xl p-3.5 flex items-center justify-between border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/wallet')}>
            <div className="w-11 h-11 bg-gradient-to-tr from-yellow-300 to-orange-500 rounded-full flex items-center justify-center text-purple-900 font-black text-lg shadow-inner">
              {user?.uid?.charAt(0) || 'D'}
            </div>
            <div>
              <p className="text-purple-300 text-[10px] font-medium">ID: {user?.uid || 'N/A'}</p>
              <p className="text-white font-black text-xl">₹{(user?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <button onClick={handleManualRefresh} className={`bg-white/10 p-2.5 rounded-full text-white hover:bg-white/20 transition-colors ${refreshing ? 'animate-spin' : ''}`}>
            <FaSyncAlt className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-4 pb-10">
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-yellow-400 rounded-full"></span> 🎮 All Games ({games.length})
        </h3>

        {loading ? (
          <div className="text-center text-purple-300 py-12 animate-pulse">
            <div className="text-5xl mb-3">⏳</div>
            <p>Loading Games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center text-purple-300 py-12">
            <div className="text-5xl mb-3">😢</div>
            <p>No Games Available</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-y-4 gap-x-3">
            {games.map((game) => (
              <div
                key={game._id}
                onClick={() => window.location.href = game.path}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform group"
              >
                <div className={`w-[85px] h-[85px] bg-gradient-to-br ${game.gradient || 'from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:border-yellow-300 group-hover:scale-105 transition-all duration-200`}>
                  {game.image ? (
                    <img src={game.image} alt={game.displayName} className="w-full h-full object-contain p-2" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span className="text-4xl select-none">{game.icon || '🎮'}</span>
                  )}
                </div>
                <p className="text-white text-[11px] font-bold mt-2 text-center leading-tight">
                  {game.displayName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
};

export default Home;