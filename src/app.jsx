import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authcontext';

// User Pages
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Activity from './pages/activity';
import Promotion from './pages/promotion';
import Wallet from './pages/wallet';
import Account from './pages/account';
import GamePage from './pages/gamepage';
import Deposit from './pages/deposit';
import Withdraw from './pages/withdraw';
import TransactionHistory from './pages/transactionhistory';
import Coupon from './pages/coupon';
import Leaderboard from './pages/leaderboard';
import DailyBonus from './pages/dailybonus';
import LuckySpin from './pages/luckyspin';
import Cashback from './pages/cashback';
import Tasks from './pages/tasks';
import Jackpot from './pages/jackpot';
import Mail from './pages/mail';
import Support from './pages/support';
import VIP from './pages/vip';
import GiftCode from './pages/giftcode';

// Admin Pages
import AdminLogin from './pages/admin/adminlogin';
import AdminDashboard from './pages/admin/dashboard';
import AdminDeposits from './pages/admin/deposits';
import AdminWithdrawals from './pages/admin/withdrawals';
import AdminSettings from './pages/admin/settings';
import AdminGames from './pages/admin/games';
import AdminFinance from './pages/admin/finance';
import AdminReferrals from './pages/admin/referrals';

// ✅ Token-based Protected Route (simple, no loading issues)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ Admin Protected Route
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (adminToken || user?.role === 'admin') ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
          <Route path="/promotion" element={<ProtectedRoute><Promotion /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/game/:gameCode" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
          <Route path="/coupon" element={<ProtectedRoute><Coupon /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/daily-bonus" element={<ProtectedRoute><DailyBonus /></ProtectedRoute>} />
          <Route path="/lucky-spin" element={<ProtectedRoute><LuckySpin /></ProtectedRoute>} />
          <Route path="/cashback" element={<ProtectedRoute><Cashback /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/jackpot" element={<ProtectedRoute><Jackpot /></ProtectedRoute>} />
          <Route path="/mail" element={<ProtectedRoute><Mail /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="/vip" element={<ProtectedRoute><VIP /></ProtectedRoute>} />
          <Route path="/gift-code" element={<ProtectedRoute><GiftCode /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/deposits" element={<AdminProtectedRoute><AdminDeposits /></AdminProtectedRoute>} />
          <Route path="/admin/withdrawals" element={<AdminProtectedRoute><AdminWithdrawals /></AdminProtectedRoute>} />
          <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
          <Route path="/admin/games" element={<AdminProtectedRoute><AdminGames /></AdminProtectedRoute>} />
          <Route path="/admin/finance" element={<AdminProtectedRoute><AdminFinance /></AdminProtectedRoute>} />
          <Route path="/admin/referrals" element={<AdminProtectedRoute><AdminReferrals /></AdminProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;