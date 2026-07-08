import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCog, FaToggleOn, FaToggleOff, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', displayName: '', icon: 'FaGift', route: '/',
    color: 'text-pink-400', bgColor: 'bg-pink-500/20',
    isEnabled: false, sortOrder: 0, description: ''
  });

  useEffect(() => {
    fetchFeatures();
    initDefaultFeatures();
  }, []);

  const initDefaultFeatures = async () => {
    try {
      await axios.post(`${API_URL}/features/init`);
    } catch (error) {}
  };

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${API_URL}/features`);
      if (res.data.success) setFeatures(res.data.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      name: '', displayName: '', icon: 'FaGift', route: '/',
      color: 'text-pink-400', bgColor: 'bg-pink-500/20',
      isEnabled: false, sortOrder: features.length + 1, description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (feature) => {
    setEditMode(true);
    setFormData({ ...feature });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API_URL}/features/${formData._id}`, formData);
        alert('Feature updated!');
      } else {
        await axios.post(`${API_URL}/features/create`, formData);
        alert('Feature created!');
      }
      setShowModal(false);
      fetchFeatures();
    } catch (error) { alert(error.response?.data?.message || 'Error'); }
  };

  const toggleFeature = async (id) => {
    try {
      await axios.put(`${API_URL}/features/${id}/toggle`);
      alert('Feature toggled!');
      fetchFeatures();
    } catch (error) { alert('Error toggling'); }
  };

  const deleteFeature = async (id) => {
    if (!window.confirm('Delete this feature?')) return;
    try {
      await axios.delete(`${API_URL}/features/${id}`);
      alert('Feature deleted!');
      fetchFeatures();
    } catch (error) { alert('Error deleting'); }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <FaCog /> Activity Features Management
        </h2>
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add Feature
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg border border-gray-600 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">{editMode ? 'Edit' : 'Add'} Feature</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name (Internal)</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                <input type="text" value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Icon (React Icon name)</label>
                <input type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="FaGift" className="w-full p-2 bg-gray-700 text-white rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Route</label>
                <input type="text" value={formData.route} onChange={(e) => setFormData({...formData, route: e.target.value})} placeholder="/feature" className="w-full p-2 bg-gray-700 text-white rounded" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Color Class</label>
                  <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">BG Color Class</label>
                  <input type="text" value={formData.bgColor} onChange={(e) => setFormData({...formData, bgColor: e.target.value})} className="w-full p-2 bg-gray-700 text-white rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sort Order</label>
                <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})} className="w-full p-2 bg-gray-700 text-white rounded" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isEnabled} onChange={(e) => setFormData({...formData, isEnabled: e.target.checked})} />
                <label className="text-white">Enabled (Show to users)</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">{editMode ? 'Update' : 'Add'}</button>
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
              <th className="p-4 text-gray-300">Feature</th>
              <th className="p-4 text-gray-300">Route</th>
              <th className="p-4 text-gray-300">Status</th>
              <th className="p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr key={feature._id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4 text-white">
                  <p className="font-bold">{feature.displayName}</p>
                  <p className="text-xs text-gray-400">{feature.name}</p>
                </td>
                <td className="p-4 text-gray-300 text-sm">{feature.route}</td>
                <td className="p-4">
                  <button onClick={() => toggleFeature(feature._id)} className={`flex items-center gap-1 ${feature.isEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {feature.isEnabled ? <FaToggleOn size={20}/> : <FaToggleOff size={20}/>}
                    {feature.isEnabled ? 'Enabled' : 'Coming Soon'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(feature)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">Edit</button>
                    <button onClick={() => deleteFeature(feature._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Features;