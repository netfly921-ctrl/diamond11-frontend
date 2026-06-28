import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaArrowLeft } from 'react-icons/fa';

const Header = ({ title, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-purple-700 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="text-white hover:text-yellow-400">
              <FaArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-6"></div> // Spacer for alignment
          )}
          <h1 className="text-xl font-bold text-white">{title || 'Dimond 11'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <img src="https://flagcdn.com/w40/us.png" alt="US" className="h-5 rounded shadow-sm" />
          {!showBack && (
            <button className="text-white relative">
              <FaBell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;