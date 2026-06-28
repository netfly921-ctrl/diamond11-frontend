import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaTrophy, FaClock } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Jackpot = () => {
  const [jackpot, setJackpot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJackpot(); }, []);

  const fetchJackpot = async () => {
    try {
      const res = await axios.get(`${API_URL}/jackpot/info`);
      if (res.data.success) setJackpot(res.data.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Jackpot" backLink="/activity" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Mega Jackpot</h2>
          <p className="text-purple-300 text-sm mt-2">Win big in our daily jackpot draw!</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-8 mb-6 text-center">
          <p className="text-purple-900 text-sm font-bold mb-2">CURRENT JACKPOT</p>
          <p className="text-5xl font-bold text-purple-900">₹{jackpot?.currentJackpot?.toLocaleString()}</p>
        </div>

        <div className="bg-purple-800/50 rounded-xl p-6 border border-purple-600">
          <div className="flex items-center gap-3 mb-4">
            <FaClock className="text-yellow-400 text-xl" />
            <div>
              <p className="text-purple-300 text-sm">Next Draw In</p>
              <p className="text-white font-bold">24 Hours</p>
            </div>
          </div>
          <button disabled className="w-full bg-gray-600 text-gray-300 py-4 rounded-xl font-bold text-lg cursor-not-allowed">
            🚧 Coming Soon
          </button>
        </div>

        <div className="mt-6 bg-purple-800/30 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-yellow-400 mb-2">🎯 How to participate?</h3>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Play any game to earn jackpot tickets</li>
            <li>More bets = More tickets</li>
            <li>Winner selected randomly every 24 hours</li>
            <li>Winner gets 50% of jackpot pool!</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default Jackpot;