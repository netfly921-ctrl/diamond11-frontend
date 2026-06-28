import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaEnvelope, FaGift } from 'react-icons/fa';

const Mail = () => {
  const [mails] = useState([
    { id: 1, title: 'Welcome to Diamond 11!', content: 'Thank you for joining. Get ₹10 welcome bonus!', date: '2024-01-15', read: false, hasAttachment: true },
    { id: 2, title: 'Weekly Cashback Available', content: 'You have ₹50 cashback waiting. Claim now!', date: '2024-01-14', read: true, hasAttachment: false },
    { id: 3, title: 'New Game Added: Roulette', content: 'Try our new Roulette game now!', date: '2024-01-13', read: true, hasAttachment: false }
  ]);

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Mail Box" backLink="/activity" />
      <div className="p-4 text-white">
        <div className="space-y-3">
          {mails.map((mail) => (
            <div key={mail.id} className={`bg-purple-800/50 rounded-xl p-4 border ${mail.read ? 'border-purple-600' : 'border-yellow-400'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaEnvelope className={mail.read ? 'text-purple-400' : 'text-yellow-400'} />
                  <p className={`font-bold ${mail.read ? 'text-purple-300' : 'text-white'}`}>{mail.title}</p>
                </div>
                <span className="text-xs text-purple-400">{mail.date}</span>
              </div>
              <p className="text-sm text-purple-200 mb-2">{mail.content}</p>
              {mail.hasAttachment && (
                <button className="text-xs bg-yellow-400 text-purple-900 px-3 py-1 rounded font-bold flex items-center gap-1">
                  <FaGift /> Claim Reward
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default Mail;