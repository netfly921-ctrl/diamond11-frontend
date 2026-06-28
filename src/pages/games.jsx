import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGamepad } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => { fetchGames(); }, []);

  const fetchGames = async () => {
    const res = await axios.get(`${API_URL}/game/list`);
    setGames(res.data.data);
  };

  const updateGame = async (id, data) => {
    // Ye admin route ka API call hai
    await axios.put(`${API_URL}/admin/game/${id}`, data, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    alert('Updated!');
    fetchGames();
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><FaGamepad /> Game Control</h2>
      {games.map(game => (
        <div key={game._id} className="bg-gray-800 p-5 rounded-xl mb-4 border border-gray-700 shadow-md">
          <h3 className="font-bold text-lg text-yellow-400 mb-3">{game.displayName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Banner Photo URL</label>
              <input type="text" defaultValue={game.image} onBlur={(e) => updateGame(game._id, {image: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Win % (0-100)</label>
              <input type="number" defaultValue={game.winPercentage} onBlur={(e) => updateGame(game._id, {winPercentage: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Manual Result</label>
              <select defaultValue={game.manualResult} onChange={(e) => updateGame(game._id, {manualResult: e.target.value, isManualActive: e.target.value !== 'none'})} className="w-full bg-gray-700 p-2 rounded mt-1">
                <option value="none">Auto Mode</option>
                <option value="win">Force Win</option>
                <option value="loss">Force Loss</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Games;