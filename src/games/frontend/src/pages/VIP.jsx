import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaCrown, FaGift, FaPercent, FaArrowUp } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const VIP = () => {
  const { user } = useAuth();
  const [vipInfo, setVipInfo] = useState(null);

  useEffect(() => { fetchVIP(); }, []);

  const fetchVIP = async () => {
    try {
      const res = await axios.get(`${API_URL}/vip/my`);
      if (res.data.success) setVipInfo(res.data.data);
    } catch (error) { console.error('Error:', error); }
  };

  const vipLevels = [
    { level: 1, name: 'Bronze', withdrawalLimit: 10000, bonusPercent: 0, color: 'from-orange-600 to-orange-800' },
    { level: 2, name: 'Silver', withdrawalLimit: 20000, bonusPercent: 1, color: 'from-gray-400 to-gray-600' },
    { level: 3, name: 'Gold', withdrawalLimit: 50000, bonusPercent: 3, color: 'from-yellow-400 to-yellow-600' },
    { level: 4, name: 'Platinum', withdrawalLimit: 100000, bonusPercent: 5, color: 'from-blue-400 to-blue-600' },
    { level: 5, name: 'Diamond', withdrawalLimit: 500000, bonusPercent: 10, color: 'from-purple-400 to-purple-600' }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="VIP Benefits" backLink="/activity" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <FaCrown className="text-6xl text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">VIP Club</h2>
          <p className="text-purple-300 text-sm mt-2">Level up to unlock exclusive benefits!</p>
        </div>

        {vipInfo && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 mb-6 text-center">
            <p className="text-purple-900 text-sm">Your Current Level</p>
            <p className="text-4xl font-bold text-purple-900">VIP {vipInfo.vipLevel}</p>
            <p className="text-purple-900 text-sm mt-2">Withdrawal Limit: ₹{vipInfo.withdrawalLimit?.toLocaleString()}</p>
            <p className="text-purple-900 text-sm">Bonus: {vipInfo.bonusPercent}%</p>
          </div>
        )}

        <h3 className="font-bold text-white mb-4">VIP Levels</h3>
        <div className="space-y-3">
          {vipLevels.map((vip) => (
            <div key={vip.level} className={`bg-gradient-to-r ${vip.color} rounded-xl p-4 ${user?.vipLevel >= vip.level ? 'opacity-100' : 'opacity-60'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">VIP {vip.level} - {vip.name}</p>
                  <p className="text-white/80 text-sm">Limit: ₹{vip.withdrawalLimit.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{vip.bonusPercent}% Bonus</p>
                  {user?.vipLevel >= vip.level ? (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">✓ Active</span>
                  ) : (
                    <span className="text-xs bg-black/20 px-2 py-1 rounded">Locked</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-purple-800/30 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><FaArrowUp /> How to Level Up?</h3>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Play more games to earn VIP EXP</li>
            <li>Deposit regularly for bonus EXP</li>
            <li>Higher bets = More EXP</li>
            <li>Each level unlocks better rewards!</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default VIP;