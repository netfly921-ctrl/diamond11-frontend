import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGamepad, FaToggleOn, FaToggleOff, FaPercent, FaImage, FaTrophy } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/admin';

const GameControl = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API_URL}/game-control/all`);
      setGames(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateGame = async (gameCode, field, value) => {
    try {
      setGames(prev => prev.map(g => g.gameCode === gameCode ? { ...g, [field]: value } : g));
      await axios.put(`${API_URL}/game-control/${gameCode}`, { [field]: value });
    } catch (error) {
      alert('Update failed');
      fetchGames();
    }
  };

  if (loading) return <div className="text-white p-6">Loading Game Control...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
        <FaGamepad /> Game Master Control
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map(game => (
          <div key={game.gameCode} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{game.gameName}</h3>
              <button 
                onClick={() => updateGame(game.gameCode, 'isActive', !game.isActive)}
                className={`px-4 py-1 rounded text-xs font-bold ${game.isActive ? 'bg-green-600' : 'bg-red-600'}`}
              >
                {game.isActive ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Banner */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-1">Banner Image URL</label>
              <input 
                type="text" 
                value={game.bannerImage || ''} 
                onChange={(e) => updateGame(game.gameCode, 'bannerImage', e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
              />
            </div>

            {/* Win Percentage */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-1">Win Percentage ({game.winPercentage}%)</label>
              <input 
                type="range" 
                min="10" 
                max="90" 
                value={game.winPercentage} 
                onChange={(e) => updateGame(game.gameCode, 'winPercentage', parseInt(e.target.value))}
                className="w-full accent-yellow-400"
              />
            </div>

            {/* Force Next Result */}
            <div className="bg-yellow-500/10 p-3 rounded-lg">
              <label className="text-xs text-yellow-400 block mb-2">Force Next Round</label>
              <div className="flex gap-2">
                <button onClick={() => updateGame(game.gameCode, 'nextRoundResult', 'auto')} className={`flex-1 py-2 text-xs rounded ${game.nextRoundResult === 'auto' ? 'bg-purple-600' : 'bg-gray-700'}`}>Auto</button>
                <button onClick={() => updateGame(game.gameCode, 'nextRoundResult', 'win')} className={`flex-1 py-2 text-xs rounded ${game.nextRoundResult === 'win' ? 'bg-green-600' : 'bg-gray-700'}`}>Force Win</button>
                <button onClick={() => updateGame(game.gameCode, 'nextRoundResult', 'loss')} className={`flex-1 py-2 text-xs rounded ${game.nextRoundResult === 'loss' ? 'bg-red-600' : 'bg-gray-700'}`}>Force Loss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameControl;