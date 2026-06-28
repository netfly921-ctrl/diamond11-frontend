import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGamepad, FaPlus, FaSave } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => { fetchGames(); }, []);

  const fetchGames = async () => {
    const res = await axios.get(`${API_URL}/game/list`);
    setGames(res.data.data);
  };

  const updateGame = async (id, data) => {
    await axios.put(`${API_URL}/admin/game/${id}`, data);
    alert('Updated!');
    fetchGames();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Games</h2>
      {games.map(game => (
        <div key={game._id} className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-600">
          <h3 className="font-bold">{game.displayName}</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <input type="text" placeholder="Banner Photo URL" defaultValue={game.image} onBlur={(e) => updateGame(game._id, {image: e.target.value})} className="bg-gray-700 p-2 rounded" />
            <input type="number" placeholder="Win % (0-100)" defaultValue={game.winPercentage} onBlur={(e) => updateGame(game._id, {winPercentage: e.target.value})} className="bg-gray-700 p-2 rounded" />
            <select defaultValue={game.manualResult} onChange={(e) => updateGame(game._id, {manualResult: e.target.value, isManualActive: e.target.value !== 'none'})} className="bg-gray-700 p-2 rounded">
              <option value="none">Auto Mode</option>
              <option value="win">Force Win</option>
              <option value="loss">Force Loss</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Games;