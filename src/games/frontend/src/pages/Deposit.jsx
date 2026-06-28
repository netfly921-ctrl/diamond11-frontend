import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaQrcode, FaCopy, FaCheckCircle } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const Deposit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upiDetails, setUpiDetails] = useState({ upiId: '', accountName: '', qrCodeImage: '' });
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/settings`);
      if (res.data.success) {
        setUpiDetails({
          upiId: res.data.data.upiId || '',
          accountName: res.data.data.accountName || '',
          accountNumber: res.data.data.accountNumber || '',
          ifsc: res.data.data.ifsc || '',
          bankName: res.data.data.bankName || '',
          qrCodeImage: res.data.data.qrCodeImage || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 100) return alert('Min deposit ₹100');
    if (!transactionId) return alert('Enter transaction ID');

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/deposit/create`, { amount: parseFloat(amount), upiId: upiDetails.upiId, transactionId });
      if (res.data.success) {
        alert('✅ Deposit request submitted! Wait for admin approval.');
        navigate('/wallet');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSettings) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Deposit Money" backLink="/wallet" />
      <div className="p-4 text-white">

        {/* ✅ QR Code Section */}
        {upiDetails.qrCodeImage && (
          <div className="bg-purple-800/50 rounded-xl p-4 mb-6 border border-purple-600 text-center">
            <h3 className="text-lg font-bold mb-3 flex items-center justify-center gap-2">
              <FaQrcode className="text-yellow-400" /> Scan QR Code to Pay
            </h3>
            <div className="bg-white rounded-xl p-3 inline-block mb-3">
              <img
                src={upiDetails.qrCodeImage}
                alt="Payment QR Code"
                className="w-48 h-48 object-contain mx-auto"
              />
            </div>
            <p className="text-purple-300 text-sm">Scan this QR code from any UPI app</p>
          </div>
        )}

        {/* UPI Details */}
        <div className="bg-purple-800/50 rounded-xl p-4 mb-6 border border-purple-600">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaQrcode className="text-yellow-400" /> Payment Details
          </h3>
          
          {upiDetails.upiId && (
            <div className="space-y-3">
              <div className="bg-purple-900/50 p-3 rounded-lg">
                <p className="text-sm text-purple-300">UPI ID</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-yellow-400">{upiDetails.upiId}</p>
                  <button onClick={() => copyToClipboard(upiDetails.upiId)} className="text-purple-300 hover:text-white"><FaCopy /></button>
                </div>
              </div>
              
              {upiDetails.accountName && (
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <p className="text-sm text-purple-300">Account Name</p>
                  <p className="font-bold">{upiDetails.accountName}</p>
                </div>
              )}

              {upiDetails.accountNumber && (
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <p className="text-sm text-purple-300">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold">{upiDetails.accountNumber}</p>
                    <button onClick={() => copyToClipboard(upiDetails.accountNumber)} className="text-purple-300 hover:text-white"><FaCopy /></button>
                  </div>
                </div>
              )}

              {upiDetails.ifsc && (
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <p className="text-sm text-purple-300">IFSC Code</p>
                  <p className="font-mono font-bold">{upiDetails.ifsc}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 p-3 bg-yellow-400/20 border border-yellow-400 rounded-lg">
            <p className="text-sm text-yellow-300 flex items-center gap-2">
              <FaCheckCircle /> After payment, enter transaction ID below
            </p>
          </div>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleSubmit} className="bg-purple-800/50 rounded-xl p-4 border border-purple-600">
          <h3 className="text-lg font-bold mb-4">Deposit Details</h3>
          
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min ₹100" className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white focus:outline-none focus:border-yellow-400" required min="100" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">Transaction ID / UTR</label>
            <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter transaction ID" className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white focus:outline-none focus:border-yellow-400" required />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 py-3 rounded-xl font-bold text-purple-900 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Deposit Request'}
          </button>
        </form>

        <div className="mt-4 p-4 bg-purple-800/30 rounded-xl border border-purple-600">
          <h4 className="font-bold mb-2 text-yellow-400">Important:</h4>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Min deposit: ₹100</li>
            <li>Credited within 5-30 minutes</li>
            <li>Keep transaction ID safe</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="wallet" />
    </div>
  );
};

export default Deposit;