import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaSpinner, FaGift } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const LuckySpin = () => {
  const { user, updateUser } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const handleSpin = async () => {
    if (user?.balance < 20) {
      alert("You need ₹20 to spin the wheel!");
      return;
    }

    setSpinning(true);
    setResult(null);

    try {
      // API Call to Backend
      const res = await axios.post(`${API_URL}/luckyspin/spin`);
      
      if (res.data.success) {
        // Wait 2 seconds for spin animation effect
        setTimeout(() => {
          setResult(res.data.winAmount);
          updateUser({ ...user, balance: res.data.newBalance });
          setSpinning(false);
        }, 2000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Spin Failed");
      setSpinning(false);
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Lucky Spin" backLink="/activity" />
      
      <div className="p-4 text-white text-center mt-10">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">Try Your Luck!</h2>
        <p className="text-purple-200 mb-8">Cost: ₹20 per spin. Win up to ₹500!</p>

        {/* Spin Wheel Animation Box */}
        <div className="w-64 h-64 mx-auto bg-purple-900 rounded-full border-8 border-yellow-400 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)] mb-10 relative overflow-hidden">
          <FaSpinner className={`text-9xl text-yellow-400 ${spinning ? 'animate-spin' : ''}`} />
          <div className="absolute top-0 w-4 h-8 bg-red-500 rounded-b-full z-10"></div>
        </div>

        {/* Result Text */}
        {result !== null && !spinning && (
          <div className={`p-4 rounded-xl mb-6 text-xl font-bold ${result > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {result > 0 ? `🎉 You Won ₹${result}!` : '😔 Better Luck Next Time!'}
          </div>
        )}

        {/* Spin Button */}
        <button 
          onClick={handleSpin} 
          disabled={spinning}
          className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold text-xl rounded-xl shadow-lg disabled:opacity-50"
        >
          {spinning ? 'SPINNING...' : 'SPIN NOW (₹20)'}
        </button>

        <div className="mt-8 bg-purple-800/50 p-4 rounded-xl text-left">
          <h3 className="font-bold text-yellow-400 flex items-center gap-2 mb-2">
            <FaGift /> Prizes you can win:
          </h3>
          <ul className="text-sm text-purple-200 space-y-1">
            <li>💎 Jackpot: ₹500</li>
            <li>🥇 Big Win: ₹100</li>
            <li>🥈 Mega Win: ₹50</li>
            <li>🥉 Small Win: ₹20, ₹10</li>
          </ul>
        </div>
      </div>

      <BottomNav activeTab="activity" />
    </div>
  );
};

export default LuckySpin;