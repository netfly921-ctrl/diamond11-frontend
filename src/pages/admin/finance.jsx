import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartLine, FaRupeeSign, FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Finance = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/finance/stats`);
      if (res.data.success) setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/finance/transactions?limit=50`);
      if (res.data.success) setTransactions(res.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  const cards = [
    { title: 'Total Deposits', value: `₹${stats?.totalDeposits?.toFixed(2) || '0.00'}`, icon: FaArrowDown, color: 'bg-green-500' },
    { title: 'Total Withdrawals', value: `₹${stats?.totalWithdrawals?.toFixed(2) || '0.00'}`, icon: FaArrowUp, color: 'bg-red-500' },
    { title: 'Net Profit', value: `₹${stats?.netProfit?.toFixed(2) || '0.00'}`, icon: FaChartLine, color: stats?.netProfit >= 0 ? 'bg-green-500' : 'bg-red-500' },
    { title: 'Total Users Balance', value: `₹${stats?.totalUserBalance?.toFixed(2) || '0.00'}`, icon: FaWallet, color: 'bg-blue-500' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
        <FaChartLine /> Finance Reports
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="text-white text-xl" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">{card.title}</p>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-gray-300">User</th>
                <th className="p-4 text-gray-300">Type</th>
                <th className="p-4 text-gray-300">Amount</th>
                <th className="p-4 text-gray-300">Balance After</th>
                <th className="p-4 text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} className="border-t border-gray-700">
                  <td className="p-4 text-white">{tx.uid}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                      tx.type === 'withdraw' ? 'bg-red-500/20 text-red-400' :
                      tx.type === 'game_win' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>{tx.type}</span>
                  </td>
                  <td className={`p-4 font-bold ${tx.type === 'deposit' || tx.type === 'game_win' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'deposit' || tx.type === 'game_win' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-gray-300">₹{tx.balanceAfter?.toFixed(2)}</td>
                  <td className="p-4 text-gray-400 text-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;