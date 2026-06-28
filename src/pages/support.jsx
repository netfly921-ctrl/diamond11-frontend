import React, { useState } from 'react';
import Header from '../components/header';
import BottomNav from '../components/bottomnav';
import { FaHeadset, FaPhone, FaEnvelope, FaComment } from 'react-icons/fa';

const Support = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Message sent! Support team will contact you soon.');
    setMessage('');
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Support" backLink="/activity" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <FaHeadset className="text-6xl text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Customer Support</h2>
          <p className="text-purple-300 text-sm mt-2">We're here to help you 24/7!</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-600 flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <FaPhone className="text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Phone</p>
              <p className="font-bold text-white">+91 9876543210</p>
            </div>
          </div>

          <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-600 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Email</p>
              <p className="font-bold text-white">support@diamond11.com</p>
            </div>
          </div>

          <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-600 flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <FaComment className="text-purple-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Live Chat</p>
              <p className="font-bold text-green-400">Available Now</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-purple-800/50 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-white mb-3">Send us a message</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue..."
            className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 mb-3"
            rows="4"
            required
          />
          <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 py-3 rounded-xl font-bold">
            Send Message
          </button>
        </form>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default Support;