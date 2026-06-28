import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGift, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaCopy } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const AdminGiftCodes = () => {
  const [giftCodes, setGiftCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '', bonusAmount: 100, bonusType: 'fixed',
    maxUsage: 100, minDeposit: 0, expiryDate: '', description: ''
  });

  useEffect(() => { fetchGiftCodes(); }, []);

  const fetchGiftCodes = async () => {
    try {
      const res = await axios.get(`${API_URL}/giftcode/all`);
      if (res.data.success) setGiftCodes(res.data.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/giftcode/create`, formData);
      alert('🎁 Gift Code Created!');
      setShowModal(false);
      setFormData({ code: '', bonusAmount: 100, bonusType: 'fixed', maxUsage: 100, minDeposit: 0, expiryDate: '', description: '' });
      fetchGiftCodes();
    } catch (error) { alert(error.response?.data?.message || 'Error creating code'); }
  };

  const toggleCode = async (id) => {
    try {
      await axios.put(`${API_URL}/giftcode/${id}/toggle`);
      alert('Gift Code toggled!');
      fetchGiftCodes();
    } catch (error) { alert('Error toggling'); }
  };

  const deleteCode = async (id) => {
    if (!window.confirm('Delete this gift code?')) return;
    try {
      await axios.delete(`${API_URL}/giftcode/${id}`);
      alert('Gift Code Deleted!');
      fetchGiftCodes();
    } catch (error) { alert('Error deleting'); }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <FaGift /> Gift Codes ({giftCodes.length})
        </h2>
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Create Code
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg border border-gray-600 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Create Gift Code</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Code (e.g., WELCOME100)</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full p-2 bg-gray-700 text-white rounded uppercase" placeholder="WELCOME100" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bonus Amount (₹)</label>
                <input type="number" value={formData.bonusAmount} onChange={(e) => setFormData({...formData, bonusAmount: parseInt(e.target.value)})} className="w-full p-2 bg-gray-700 text-white rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bonus Type</label>
                <select value={formData.bonusType} onChange={(e) => setFormData({...formData, bonusType: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded">
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Usage (How many times can be used)</label>
                <input type="number" value={formData.maxUsage} onChange={(e) => setFormData({...formData, maxUsage: parseInt(e.target.value)})} className="w-full p-2 bg-gray-700 text-white rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Min Deposit Required (₹)</label>
                <input type="number" value={formData.minDeposit} onChange={(e) => setFormData({...formData, minDeposit: parseInt(e.target.value)})} className="w-full p-2 bg-gray-700 text-white rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" placeholder="Welcome Bonus" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">Create Code</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-600 text-white py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-gray-300">Code</th>
              <th className="p-4 text-gray-300">Bonus</th>
              <th className="p-4 text-gray-300">Usage</th>
              <th className="p-4 text-gray-300">Status</th>
              <th className="p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {giftCodes.map(code => (
              <tr key={code._id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-yellow-400">{code.code}</span>
                    <button onClick={() => copyCode(code.code)} className="text-gray-400 hover:text-white"><FaCopy /></button>
                  </div>
                  {code.description && <p className="text-xs text-gray-400">{code.description}</p>}
                </td>
                <td className="p-4 text-green-400">₹{code.bonusAmount} {code.bonusType === 'percentage' && '%'}</td>
                <td className="p-4 text-gray-300">{code.usedCount} / {code.maxUsage}</td>
                <td className="p-4">
                  <button onClick={() => toggleCode(code._id)} className={`flex items-center gap-1 ${code.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {code.isActive ? <FaToggleOn size={20}/> : <FaToggleOff size={20}/>}
                    {code.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => deleteCode(code._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGiftCodes;