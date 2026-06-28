import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import Header from '../components/header';
import BottomNav from '../components/bottomnav';
import { FaCalendarCheck, FaGift } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const DailyBonus = () => {
  const { user, updateUser } = useAuth();
  const [bonusData, setBonusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const bonusConfig = [10, 15, 20, 25, 30, 40, 50, 70, 100, 150];

  useEffect(() => { checkBonus(); }, []);

  const checkBonus = async () => {
    try {
      const res = await axios.get(`${API_URL}/dailybonus/check`);
      if (res.data.success) setBonusData(res.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await axios.post(`${API_URL}/dailybonus/claim`);
      if (res.data.success) {
        alert(`🎉 ${res.data.message}\nStreak: ${res.data.streak} days!`);
        updateUser({ ...user, balance: user.balance + res.data.bonusAmount });
        checkBonus();
      }
    } catch (error) { alert(error.response?.data?.message || 'Error claiming bonus'); }
    finally { setClaiming(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Daily Bonus" backLink="/home" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <FaCalendarCheck className="text-5xl text-purple-900" />
          </div>
          <h2 className="text-2xl font-bold">Daily Check-in</h2>
          <p className="text-purple-300 text-sm mt-2">Claim your daily bonus!</p>
        </div>

        <div className="bg-purple-800/50 rounded-xl p-6 mb-6 border border-purple-600">
          <div className="text-center mb-4">
            <p className="text-purple-300 text-sm">Current Streak</p>
            <p className="text-4xl font-bold text-yellow-400">{bonusData?.streak || 0} 🔥</p>
          </div>

          {bonusData?.canClaim ? (
            <button onClick={handleClaim} disabled={claiming} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 py-4 rounded-xl font-bold text-lg disabled:opacity-50">
              {claiming ? 'Claiming...' : `🎁 Claim ₹${bonusConfig[Math.min(bonusData.streak || 0, 9)]}`}
            </button>
          ) : (
            <button disabled className="w-full bg-gray-600 text-gray-300 py-4 rounded-xl font-bold text-lg cursor-not-allowed">
              ✓ Claimed Today
            </button>
          )}
        </div>

        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-yellow-400 mb-3">📅 Bonus Calendar</h3>
          <div className="grid grid-cols-5 gap-2">
            {bonusConfig.map((bonus, idx) => (
              <div key={idx} className={`p-2 rounded-lg text-center text-xs ${idx === (bonusData?.streak || 0) ? 'bg-yellow-400 text-purple-900 font-bold' : 'bg-purple-900/50 text-purple-300'}`}>
                <p>Day {idx + 1}</p>
                <p className="font-bold">₹{bonus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav activeTab="account" />
    </div>
  );
};

export default DailyBonus;