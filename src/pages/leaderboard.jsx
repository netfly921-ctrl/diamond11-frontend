import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header';
import BottomNav from '../components/bottomnav';
import { FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/leaderboard/top?period=${period}`);
      if (res.data.success) setData(res.data.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const getRankIcon = (idx) => {
    if (idx === 0) return <FaCrown className="text-yellow-400 text-xl" />;
    if (idx === 1) return <FaMedal className="text-gray-300 text-xl" />;
    if (idx === 2) return <FaMedal className="text-orange-400 text-xl" />;
    return <span className="text-purple-400 font-bold">#{idx + 1}</span>;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Leaderboard" backLink="/home" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <FaTrophy className="text-5xl text-yellow-400 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Top Players</h2>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['today', 'week', 'month'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${period === p ? 'bg-yellow-400 text-purple-900' : 'bg-purple-800/50 text-white'}`}>
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>

        <div className="bg-purple-800/50 rounded-xl p-4 mb-6 border border-purple-600">
          <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2"><FaCrown /> Top Winners</h3>
          <div className="space-y-2">
            {data?.topWinners?.length === 0 ? <p className="text-center text-purple-300 py-4">No winners yet</p> :
              data?.topWinners?.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRankIcon(idx)}
                    <span className="font-bold text-white">{player.username}</span>
                  </div>
                  <span className="text-green-400 font-bold">₹{player.totalWon.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2"><FaTrophy /> Most Active</h3>
          <div className="space-y-2">
            {data?.topPlayers?.length === 0 ? <p className="text-center text-purple-300 py-4">No players yet</p> :
              data?.topPlayers?.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRankIcon(idx)}
                    <span className="font-bold text-white">{player.username}</span>
                  </div>
                  <span className="text-blue-400 font-bold">{player.totalBets} bets</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <BottomNav activeTab="account" />
    </div>
  );
};

export default Leaderboard;