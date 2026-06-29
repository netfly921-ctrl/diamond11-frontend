import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { FaSyncAlt, FaGamepad } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Home = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
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
    const balanceInterval = setInterval(fetchBalance, 10000);
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 3000);
    return () => {
      clearInterval(balanceInterval);
      clearInterval(bannerInterval);
    };
  }, []);

  // ✅ STATIC GAMES LIST - Backend ki zaroorat nahi
  const fetchGames = () => {
    const gamesList = [
      { _id: '1', name: 'Aviator', displayName: 'Aviator', path: '/games/aviator/', emoji: '✈️' },
      { _id: '2', name: 'Coin Flip', displayName: 'Coin Flip', path: '/games/coinflip/', emoji: '🪙' },
      { _id: '3', name: 'Wingo', displayName: 'Wingo', path: '/games/wingo/', emoji: '🎡' },
      { _id: '4', name: 'Andar Bahar', displayName: 'Andar Bahar', path: '/games/andarbahar/', emoji: '🃏' },
      { _id: '5', name: 'Color Prediction', displayName: 'Color', path: '/games/colorprediction/', emoji: '🎨' },
      { _id: '6', name: 'Dice', displayName: 'Dice', path: '/games/dice/', emoji: '🎲' },
      { _id: '7', name: 'Dragon Tiger', displayName: 'Dragon Tiger', path: '/games/dragontiger/', emoji: '🐉' },
      { _id: '8', name: 'Teen Patti', displayName: 'Teen Patti', path: '/games/teenpatti/', emoji: '♠️' },
      { _id: '9', name: 'Hilo', displayName: 'Hilo', path: '/games/hilo/', emoji: '🔢' },
      { _id: '10', name: 'Limbo', displayName: 'Limbo', path: '/games/limbo/', emoji: '🚀' },
      { _id: '11', name: 'Mines', displayName: 'Mines', path: '/games/mines/', emoji: '💣' },
      { _id: '12', name: 'Plinko', displayName: 'Plinko', path: '/games/plinko/', emoji: '⚪' },
      { _id: '13', name: 'Roulette', displayName: 'Roulette', path: '/games/roulette/', emoji: '🎯' },
      { _id: '14', name: 'Chicken Pro', displayName: 'Chicken Pro', path: '/games/CHICKEN PRO/', emoji: '🐔' },
      { _id: '15', name: 'Wheel', displayName: 'Wheel', path: '/games/wheel/', emoji: '🎡' },
    ];
    setGames(gamesList);
    console.log('🎮 Games loaded:', gamesList.length);
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallet/balance`);
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

  const handleImageError = (gameId) => {
    setImgErrors(prev => ({ ...prev, [gameId]: true }));
  };

  // ✅ Game open karne ke liye - direct URL open hoga
  const openGame = (game) => {
    window.location.href = game.path;
  };

  return (
    <div className="pb-20 min-h-screen bg-[#4A0E8F]">
      <Header />

      {/* Banner Slider */}
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

      {/* Balance Card */}
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
          <span className="w-1 h-5 bg-yellow-400 rounded-full"></span> 🎮 All Games
        </h3>

        {games.length === 0 ? (
          <div className="text-center text-purple-300 py-12">
            <div className="text-5xl mb-3 animate-bounce">🎮</div>
            <p>Loading Games...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-y-5 gap-x-3">
            {games.map((game) => (
              <div
                key={game._id}
                onClick={() => openGame(game)}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform group"
              >
                {/* Game Icon Box */}
                <div className="w-[82px] h-[82px] bg-gradient-to-b from-[#FFB533] to-[#FF7A00] rounded-2xl flex items-center justify-center overflow-hidden border-2 border-orange-300/30 shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl">{game.emoji}</div>
                </div>

                {/* Game Name */}
                <p className="text-white text-[11px] font-semibold mt-1.5 text-center leading-tight max-w-[85px] truncate">
                  {game.displayName || game.name}
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