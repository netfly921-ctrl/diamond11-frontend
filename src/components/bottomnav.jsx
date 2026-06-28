import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaGift, FaWallet, FaUser } from 'react-icons/fa';
import { GiDiamonds } from 'react-icons/gi';

const BottomNav = ({ activeTab }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/home', icon: FaHome },
    { name: 'Activity', path: '/activity', icon: FaGift },
    { name: 'Promotion', path: '/promotion', icon: GiDiamonds, isCenter: true },
    { name: 'Wallet', path: '/wallet', icon: FaWallet },
    { name: 'Account', path: '/account', icon: FaUser },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 max-w-[480px] mx-auto">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          if (item.isCenter) {
            return (
              <Link key={item.name} to={item.path} className="relative -top-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-purple-100 transition-transform ${active ? 'bg-yellow-400 scale-110' : 'bg-purple-600'}`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-purple-700' : 'text-gray-400'}`}
            >
              <Icon className={`text-xl ${active ? 'scale-110 transition-transform' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;