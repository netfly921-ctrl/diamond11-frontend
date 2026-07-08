import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// User Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Activity from './pages/Activity';
import Promotion from './pages/Promotion';
import Wallet from './pages/Wallet';
import Account from './pages/Account';
import GamePage from './pages/GamePage';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import TransactionHistory from './pages/TransactionHistory';
import Coupon from './pages/Coupon';
import Leaderboard from './pages/Leaderboard';
import DailyBonus from './pages/DailyBonus';
import LuckySpin from './pages/LuckySpin';
import Cashback from './pages/Cashback';
import Tasks from './pages/Tasks';
import Jackpot from './pages/Jackpot';
import Mail from './pages/Mail';
import Support from './pages/Support';
import VIP from './pages/VIP';
import GiftCode from './pages/GiftCode';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDeposits from './pages/admin/Deposits';
import AdminWithdrawals from './pages/admin/Withdrawals';
import AdminSettings from './pages/admin/Settings';
import AdminGames from './pages/admin/Games';
import AdminFinance from './pages/admin/Finance';
import AdminReferrals from './pages/admin/Referrals';

// User Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Admin Protected Route
const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'admin' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
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

          {/* User Routes */}
          <Route
            path="/*"
            element={
              <div className="app-container">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

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

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;