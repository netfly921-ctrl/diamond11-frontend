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
  const [refreshing, setRefreshing] = useState(false);
  const [banners] = useState([
    { id: 1, text: 'RECHARGE BONUS 100%', sub: 'Deposit now and get double!', color: 'from-pink-500 via-red-500 to-yellow-500', emoji: '🎁' },
    { id: 2, text: 'DAILY BONUS ₹500', sub: 'Login daily and claim!', color: 'from-blue-500 via-purple-500 to-pink-500', emoji: '💰' },
    { id: 3, text: 'REFER & EARN ₹50', sub: 'Invite friends and earn!', color: 'from-green-400 via-teal-500 to-blue-500', emoji: '👥' },
    { id: 4, text: 'VIP REWARDS', sub: 'Level up for better rewards!', color: 'from-yellow-400 via-orange-500 to-red-500', emoji: '👑' }
  ]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    loadGames(); // Folder structure ke hisaab se games load kar rahe hain
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

  // ✅ EXACT FOLDER STRUCTURE KE HISAAB SE LIST
  const loadGames = () => {
    const gameList = [
      { id: '1', name: 'Aviator', path: '/games/aviator/', image: '/game-images/aviator.png' },
      { id: '2', name: 'Wingo', path: '/games/wingo/', image: '/game-images/wingo.png' },
      { id: '3', name: 'Coin Flip', path: '/games/coinflip/', image: '/game-images/coinflip.png' },
      { id: '4', name: 'Andar Bahar', path: '/games/andarbahar/', image: '/game-images/andarbahar.png' },
      { id: '5', name: 'Dragon Tiger', path: '/games/dragontiger/', image: '/game-images/dragontiger.png' },
      { id: '6', name: 'Color Prediction', path: '/games/colorprediction/', image: '/game-images/colorprediction.png' },
      { id: '7', name: 'Teen Patti', path: '/games/teenpatti/', image: '/game-images/teenpatti.png' },
      { id: '8', name: 'Mines', path: '/games/mines/', image: '/game-images/mines.png' },
      { id: '9', name: 'Plinko', path: '/games/plinko/', image: '/game-images/plinko.png' },
      { id: '10', name: 'Roulette', path: '/games/roulette/', image: '/game-images/roulette.png' },
      { id: '11', name: 'Wheel', path: '/games/wheel/', image: '/game-images/wheel.png' },
      { id: '12', name: 'Dice', path: '/games/dice/', image: '/game-images/dice.png' },
      // Jinke images nahi hain unke liye default '01.png' use kiya hai
      { id: '13', name: 'Chicken Pro', path: '/games/CHICKEN PRO/', image: '/game-images/01.png' },
      { id: '14', name: 'Hilo', path: '/games/hilo/', image: '/game-images/01.png' },
      { id: '15', name: 'Limbo', path: '/games/limbo/', image: '/game-images/01.png' },
    ];
    setGames(gameList);
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

        <div className="grid grid-cols-3 gap-y-5 gap-x-3">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => window.location.href = game.path}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform group"
            >
              {/* Game Icon Box with Real Image */}
              <div className="w-[90px] h-[90px] bg-white rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg overflow-hidden group-hover:border-yellow-300 group-hover:scale-105 transition-all duration-200">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/90?text=Game"; }} 
                />
              </div>
              
              {/* Game Name */}
              <p className="text-white text-[11px] font-bold mt-2 text-center leading-tight max-w-[90px] truncate">
                {game.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
};

export default Home;