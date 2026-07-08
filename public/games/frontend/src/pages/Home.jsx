import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { FaSyncAlt, FaGamepad, FaDice, FaAirFreshener } from 'react-icons/fa';

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
    // Yahi hai magic function - Backend se independent
    loadStaticGames();
    
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

  // ✅ STATIC GAMES WITH REAL ICONS & IMAGES
  const loadStaticGames = () => {
    const gameList = [
      { 
        _id: '1', 
        name: 'Aviator', 
        path: '/games/aviator/', 
        icon: '✈️',
        // Ye image path check karta hai /public/games/aviator/ ke andar
        img: '/games/aviator/icon.png',
        bg: 'from-blue-500 to-cyan-400'
      },
      { 
        _id: '2', 
        name: 'Andar Bahar', 
        path: '/games/andarbahar/', 
        icon: '🃏',
        img: '/games/andarbahar/icon.png',
        bg: 'from-purple-600 to-pink-500'
      },
      { 
        _id: '3', 
        name: 'Wingo', 
        path: '/games/wingo/', 
        icon: '🎡',
        img: '/games/wingo/icon.png',
        bg: 'from-orange-500 to-red-500'
      },
      { 
        _id: '4', 
        name: 'Coin Flip', 
        path: '/games/coinflip/', 
        icon: '🪙',
        img: '/games/coinflip/icon.png',
        bg: 'from-yellow-400 to-amber-600'
      },
      { 
        _id: '5', 
        name: 'Dragon Tiger', 
        path: '/games/dragontiger/', 
        icon: '🐉',
        img: '/games/dragontiger/icon.png',
        bg: 'from-red-600 to-orange-600'
      },
      { 
        _id: '6', 
        name: 'Color Prediction', 
        path: '/games/colorprediction/', 
        icon: '🎨',
        img: '/games/colorprediction/icon.png',
        bg: 'from-violet-500 to-indigo-500'
      },
      { 
        _id: '7', 
        name: 'Teen Patti', 
        path: '/games/teenpatti/', 
        icon: '♠️',
        img: '/games/teenpatti/icon.png',
        bg: 'from-emerald-500 to-teal-700'
      },
      { 
        _id: '8', 
        name: 'Mines', 
        path: '/games/mines/', 
        icon: '💣',
        img: '/games/mines/icon.png',
        bg: 'from-gray-700 to-slate-900'
      },
      { 
        _id: '9', 
        name: 'Limbo', 
        path: '/games/limbo/', 
        icon: '🚀',
        img: '/games/limbo/icon.png',
        bg: 'from-indigo-500 to-purple-900'
      },
      { 
        _id: '10', 
        name: 'Roulette', 
        path: '/games/roulette/', 
        icon: '🎯',
        img: '/games/roulette/icon.png',
        bg: 'from-red-700 to-black'
      },
      { 
        _id: '11', 
        name: 'Plinko', 
        path: '/games/plinko/', 
        icon: '⚪',
        img: '/games/plinko/icon.png',
        bg: 'from-blue-400 to-blue-800'
      },
      { 
        _id: '12', 
        name: 'Chicken Pro', 
        path: '/games/CHICKEN PRO/', 
        icon: '🐔',
        img: '/games/CHICKEN PRO/icon.png',
        bg: 'from-yellow-400 to-orange-600'
      },
      { 
        _id: '13', 
        name: 'Hilo', 
        path: '/games/hilo/', 
        icon: '🔢',
        img: '/games/hilo/icon.png',
        bg: 'from-green-600 to-lime-500'
      },
      { 
        _id: '14', 
        name: 'Wheel', 
        path: '/games/wheel/', 
        icon: '🎡',
        img: '/games/wheel/icon.png',
        bg: 'from-fuchsia-500 to-pink-700'
      },
      { 
        _id: '15', 
        name: 'Dice', 
        path: '/games/dice/', 
        icon: '🎲',
        img: '/games/dice/icon.png',
        bg: 'from-rose-500 to-red-800'
      },
    ];
    
    setGames(gameList);
    console.log('✅ Games loaded:', gameList.length, 'items');
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

  // ✅ Game Open Function - Naya tab/open karega
  const openGame = (game) => {
    window.open(game.path, '_blank');
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

      {/* GAMES GRID */}
      <div className="px-4 pb-10">
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-yellow-400 rounded-full"></span> 🎮 All Games ({games.length})
        </h3>

        {games.length === 0 ? (
          <div className="text-center text-purple-300 py-12 animate-pulse">
            <div className="text-5xl mb-3">⏳</div>
            <p>Loading Games...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-y-4 gap-x-3">
            {games.map((game) => (
              <div
                key={game._id}
                onClick={() => openGame(game)}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform duration-200 group"
              >
                {/* Game Icon Box - Professional Look */}
                <div className={`w-[85px] h-[85px] bg-gradient-to-br ${game.bg} rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-lg relative group-hover:border-yellow-300 group-hover:scale-105 transition-all duration-200`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  {/* Try Image First */}
                  {!imgErrors[game._id] && game.img ? (
                    <img
                      src={game.img}
                      alt={game.name}
                      className="relative z-10 w-full h-full object-contain p-2 drop-shadow-lg"
                      onError={() => handleImageError(game._id)}
                    />
                  ) : (
                    /* Fallback Emoji if no image */
                    <span className="relative z-10 text-4xl drop-shadow-md select-none">
                      {game.icon}
                    </span>
                  )}
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                </div>

                {/* Game Name */}
                <p className="text-white text-[11px] font-bold mt-2 text-center leading-tight max-w-[90px] capitalize shadow-text">
                  {game.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .shadow-text {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
      `}</style>

      <BottomNav activeTab="home" />
    </div>
  );
};

export default Home;