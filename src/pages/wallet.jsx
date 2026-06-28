import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import axios from 'axios';
import BottomNav from '../components/bottomnav';
import Header from '../components/header';
import { FaArrowDown, FaArrowUp, FaHistory, FaClock, FaExchangeAlt, FaGamepad, FaSyncAlt } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const Wallet = () => {
 const { user, updateUser } = useAuth(); 
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ main: 0, thirdParty: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(() => {
      fetchBalance();
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchBalance = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_URL}/wallet/balance`);
      if (res.data.success) {
        const bal = res.data.data.balance || 0;
        setBalance({ main: bal, thirdParty: 0 });
        updateUser({ ...user, balance: bal });
        console.log('💰 Wallet Balance Update:', bal);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
  setRefreshing(true);
  await fetchBalance();
  setRefreshing(false);
};

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Wallet" backLink="/home" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-purple-800/50 rounded-full border-4 border-yellow-400 flex flex-col items-center justify-center mb-2">
            <span className="text-xs text-purple-300">Balance</span>
            <span className="text-2xl font-bold text-yellow-400">₹{balance.main.toFixed(2)}</span>
          </div>
          <p className="text-purple-300 text-sm">Total Balance</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-800/50 p-4 rounded-xl text-center border border-purple-600">
            <div className="w-10 h-10 mx-auto bg-yellow-400/20 rounded-full flex items-center justify-center mb-2"><FaExchangeAlt className="text-yellow-400" /></div>
            <p className="text-sm text-purple-300 mb-1">Main Wallet</p>
            <p className="font-bold text-lg text-white">₹{balance.main.toFixed(2)}</p>
            <div className="w-full bg-purple-700 rounded-full h-2 mt-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: '100%' }}></div></div>
          </div>
          <div className="bg-purple-800/50 p-4 rounded-xl text-center border border-purple-600">
            <div className="w-10 h-10 mx-auto bg-blue-400/20 rounded-full flex items-center justify-center mb-2"><FaGamepad className="text-blue-400" /></div>
            <p className="text-sm text-purple-300 mb-1">Third Party</p>
            <p className="font-bold text-lg text-white">₹{balance.thirdParty.toFixed(2)}</p>
            <div className="w-full bg-purple-700 rounded-full h-2 mt-2"><div className="bg-blue-400 h-2 rounded-full" style={{ width: '0%' }}></div></div>
          </div>
        </div>
        <button onClick={() => alert('Transfer feature coming soon!')} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 py-3 rounded-xl font-bold text-purple-900 shadow-lg text-lg mb-6 flex items-center justify-center gap-2">
          <FaExchangeAlt /> Main Wallet Transfer
        </button>
        <div className="grid grid-cols-4 gap-3 mb-8">
          <button onClick={() => navigate('/deposit')} className="flex flex-col items-center p-3 bg-purple-800/50 rounded-xl hover:bg-purple-700/50 transition-colors active:scale-95">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2"><FaArrowDown className="text-green-400 text-xl" /></div>
            <span className="text-xs text-white">Deposit</span>
          </button>
          <button onClick={() => navigate('/withdraw')} className="flex flex-col items-center p-3 bg-purple-800/50 rounded-xl hover:bg-purple-700/50 transition-colors active:scale-95">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2"><FaArrowUp className="text-red-400 text-xl" /></div>
            <span className="text-xs text-white">Withdraw</span>
          </button>
          <button onClick={() => navigate('/transactions')} className="flex flex-col items-center p-3 bg-purple-800/50 rounded-xl hover:bg-purple-700/50 transition-colors active:scale-95">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-2"><FaHistory className="text-blue-400 text-xl" /></div>
            <span className="text-xs text-white">Dep History</span>
          </button>
          <button onClick={() => navigate('/transactions')} className="flex flex-col items-center p-3 bg-purple-800/50 rounded-xl hover:bg-purple-700/50 transition-colors active:scale-95">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2"><FaClock className="text-yellow-400 text-xl" /></div>
            <span className="text-xs text-white">Wdr History</span>
          </button>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaGamepad /> Game Wallets</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-yellow-400 p-3 rounded-xl text-purple-900 text-center cursor-pointer hover:scale-105 transition-transform">
              <p className="text-xs font-semibold mb-1">Lottery</p>
              <p className="font-bold text-lg">₹{balance.main.toFixed(2)}</p>
            </div>
            <div className="bg-purple-800/50 p-3 rounded-xl text-center border border-purple-600 cursor-pointer hover:bg-purple-700/50 transition-colors">
              <p className="text-xs text-purple-300 mb-1">EZUGI</p>
              <p className="font-bold text-lg text-white">₹0.00</p>
            </div>
            <div className="bg-purple-800/50 p-3 rounded-xl text-center border border-purple-600 cursor-pointer hover:bg-purple-700/50 transition-colors">
              <p className="text-xs text-purple-300 mb-1">LUDO</p>
              <p className="font-bold text-lg text-white">₹0.00</p>
            </div>
          </div>
        </div>
        <button onClick={handleManualRefresh} className={`w-full mt-6 bg-purple-700 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${refreshing ? 'animate-pulse' : ''}`}>
          <FaSyncAlt className={refreshing ? 'animate-spin' : ''} /> Refresh Balance
        </button>
      </div>
      <BottomNav activeTab="wallet" />
    </div>
  );
};

export default Wallet;