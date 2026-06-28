import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaAngleLeft, FaSyncAlt } from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

const GamePage = () => {
  const { gameCode } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchGame();
  }, [gameCode, user]);

  const fetchGame = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/game/list`);
      const foundGame = res.data.data?.find(g => g.code === gameCode);
      if (foundGame) setGame(foundGame);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  if (!game) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Game not found</div></div>;

  const gameUrl = `${API_URL}${game.gameUrl}?token=${localStorage.getItem('token')}&uid=${user.uid}`;

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="bg-gray-800 p-3 flex items-center justify-between text-white">
        <button onClick={() => navigate('/home')} className="text-xl"><FaAngleLeft /></button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-yellow-400">{game.displayName}</h1>
          <p className="text-xs text-gray-400">₹{user?.balance?.toFixed(2)}</p>
        </div>
        <button onClick={fetchGame} className="text-xl"><FaSyncAlt /></button>
      </div>
      <iframe src={gameUrl} title={game.displayName} className="flex-grow w-full border-0" allow="autoplay; fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
    </div>
  );
};

export default GamePage;