import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaHistory, FaArrowDown, FaArrowUp, FaGamepad, FaGift } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const TransactionHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const url = filter === 'all' 
        ? `${API_URL}/game/transactions?limit=50`
        : `${API_URL}/game/transactions?type=${filter}&limit=50`;
      
      const res = await axios.get(url);
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'deposit': return <FaArrowDown className="text-green-400" />;
      case 'withdraw': return <FaArrowUp className="text-red-400" />;
      case 'game_win': return <FaGamepad className="text-yellow-400" />;
      case 'game_loss': return <FaGamepad className="text-gray-400" />;
      case 'bonus': return <FaGift className="text-pink-400" />;
      default: return <FaHistory className="text-gray-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'deposit': case 'game_win': case 'bonus': return 'text-green-400';
      case 'withdraw': case 'game_loss': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypePrefix = (type) => {
    switch(type) {
      case 'deposit': case 'game_win': case 'bonus': return '+';
      case 'withdraw': case 'game_loss': return '-';
      default: return '';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Transaction History" backLink="/home" />
      <div className="p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['all', 'game_win', 'game_loss', 'deposit', 'withdraw', 'bonus'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                filter === f 
                  ? 'bg-yellow-400 text-purple-900' 
                  : 'bg-purple-800/50 text-white'
              }`}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className="text-center text-purple-300 py-8">
              <FaHistory className="text-4xl mx-auto mb-2" />
              <p>No transactions found</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className="bg-purple-800/50 rounded-xl p-4 flex items-center justify-between border border-purple-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm capitalize">{tx.type.replace('_', ' ')}</p>
                    <p className="text-purple-300 text-xs">{new Date(tx.createdAt).toLocaleString()}</p>
                    {tx.gameCode && <p className="text-yellow-400 text-xs">Game: {tx.gameCode}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getTypeColor(tx.type)}`}>
                    {getTypePrefix(tx.type)}₹{tx.amount.toFixed(2)}
                  </p>
                  <p className="text-purple-300 text-xs">Bal: ₹{tx.balanceAfter?.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav activeTab="account" />
    </div>
  );
};

export default TransactionHistory;