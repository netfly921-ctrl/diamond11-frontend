import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import BottomNav from '../components/bottomnav';
import * as FaIcons from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const Activity = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${API_URL}/features`);
      if (res.data.success) {
        setFeatures(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon className="text-2xl" /> : <FaIcons.FaGift className="text-2xl" />;
  };

  const handleFeatureClick = (feature) => {
    if (feature.isEnabled && feature.route && feature.route !== '#') {
      navigate(feature.route);
    } else {
      alert('🚧 Coming Soon!\n\nThis feature is under development.\nStay tuned!');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Activity" backLink="/home" />
      <div className="p-4 text-white">
        <div className="bg-purple-800/50 rounded-xl p-4 mb-6 border border-purple-600">
          <h2 className="text-xl font-bold mb-2">🎉 Activities & Rewards</h2>
          <p className="text-purple-300 text-sm">Participate in activities to earn bonuses and rewards!</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => (
            <button
              key={feature._id}
              onClick={() => handleFeatureClick(feature)}
              className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                feature.isEnabled 
                  ? `${feature.bgColor} border-purple-500/30 hover:scale-105 cursor-pointer` 
                  : 'bg-gray-800/50 border-gray-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${feature.isEnabled ? feature.bgColor : 'bg-gray-700'}`}>
                <div className={feature.isEnabled ? feature.color : 'text-gray-400'}>
                  {getIcon(feature.icon)}
                </div>
              </div>
              <span className={`text-sm font-medium ${feature.isEnabled ? 'text-white' : 'text-gray-400'}`}>
                {feature.displayName}
              </span>
              {!feature.isEnabled && (
                <span className="text-xs text-gray-500 mt-1">Coming Soon</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 bg-purple-800/30 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-yellow-400 mb-2">💡 How to earn rewards?</h3>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Complete daily tasks</li>
            <li>Refer friends to earn commission</li>
            <li>Level up your VIP status</li>
            <li>Participate in special events</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default Activity;