import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaMoneyBillWave } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/admin';

const Withdrawals = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchWithdraws();
  }, [filter]);

  const fetchWithdraws = async () => {
    try {
      const res = await axios.get(`${API_URL}/withdraws/all?status=${filter}`);
      if (res.data.success) {
        setWithdraws(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching withdraws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawId) => {
    if (!window.confirm('Approve this withdrawal? Balance was already deducted.')) return;
    
    try {
      const res = await axios.put(`${API_URL}/withdraws/approve`, { withdrawId });
      if (res.data.success) {
        alert('Withdrawal approved successfully!');
        fetchWithdraws();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (withdrawId) => {
    const remark = prompt('Enter rejection reason (optional):');
    try {
      const res = await axios.put(`${API_URL}/withdraws/reject`, { withdrawId, remark });
      if (res.data.success) {
        alert('Withdrawal rejected. Amount refunded to user.');
        fetchWithdraws();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject');
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
        <FaMoneyBillWave /> Withdrawal Requests
      </h2>

      <div className="flex gap-2 mb-4">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              filter === f 
                ? 'bg-yellow-400 text-gray-900' 
                : 'bg-gray-700 text-white'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {withdraws.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <FaMoneyBillWave className="text-6xl mx-auto mb-4" />
          <p>No {filter} withdrawal requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withdraws.map(withdraw => (
            <div key={withdraw._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">User</p>
                  <p className="text-white font-bold">{withdraw.uid}</p>
                  <p className="text-xs text-gray-500">{withdraw.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="text-yellow-400 font-bold text-xl">₹{withdraw.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Account</p>
                  <p className="text-white text-sm">{withdraw.accountName}</p>
                  <p className="text-xs text-gray-500">{withdraw.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={`font-bold ${
                    withdraw.status === 'approved' ? 'text-green-400' : 
                    withdraw.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                  }`}>{withdraw.status.toUpperCase()}</p>
                </div>
              </div>
              {withdraw.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(withdraw._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(withdraw._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Withdrawals;