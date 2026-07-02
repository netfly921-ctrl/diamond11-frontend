
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

// Protected Route for Normal Users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Protected Route for Admin
const AdminProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ===================== PUBLIC ROUTES ===================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ===================== USER ROUTES ===================== */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

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

          {/* ===================== ADMIN ROUTES ===================== */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="deposits" element={<AdminDeposits />} />
                  <Route path="withdrawals" element={<AdminWithdrawals />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="games" element={<AdminGames />} />
                  <Route path="finance" element={<AdminFinance />} />
                  <Route path="referrals" element={<AdminReferrals />} />
                </Routes>
              </AdminProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;