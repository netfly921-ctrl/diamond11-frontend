import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaRupeeSign, FaChartBar } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
    fetchStats();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await axios.get(`${API_URL}/referral/admin/all`);
      if (res.data.success) setReferrals(res.data.data.referrals || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/referral/stats`);
      if (res.data.success) setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
        <FaUsers /> Referral Reports
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="text-2xl text-blue-400" />
            <p className="text-gray-400">Total Referrals</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.totalReferrals || 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FaRupeeSign className="text-2xl text-green-400" />
            <p className="text-gray-400">Total Commission Paid</p>
          </div>
          <p className="text-3xl font-bold text-green-400">₹{stats?.totalCommission?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FaChartBar className="text-2xl text-yellow-400" />
            <p className="text-gray-400">Pending Commission</p>
          </div>
          <p className="text-3xl font-bold text-yellow-400">₹{stats?.pendingCommission?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Referral Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-gray-300">Referrer</th>
                <th className="p-4 text-gray-300">Referred User</th>
                <th className="p-4 text-gray-300">Deposit Amount</th>
                <th className="p-4 text-gray-300">Commission</th>
                <th className="p-4 text-gray-300">Status</th>
                <th className="p-4 text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(ref => (
                <tr key={ref._id} className="border-t border-gray-700">
                  <td className="p-4 text-white">{ref.referrerId}</td>
                  <td className="p-4 text-gray-300">{ref.referredId}</td>
                  <td className="p-4 text-gray-300">₹{ref.depositAmount?.toFixed(2)}</td>
                  <td className="p-4 text-green-400 font-bold">₹{ref.commissionAmount?.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      ref.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>{ref.status}</span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{new Date(ref.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Referrals;