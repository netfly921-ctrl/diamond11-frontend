import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaGamepad, FaWallet, FaCog, FaSignOutAlt, FaChartBar, FaUserCog, FaMoneyBillWave, FaList, FaPlus, FaMinus, FaCheck, FaTimes, FaChartLine, FaGift } from 'react-icons/fa';
import AdminDeposits from './Deposits';
import AdminWithdrawals from './Withdrawals';
import AdminSettings from './Settings';
import Games from './Games';
import Finance from './Finance';
import Referrals from './Referrals';
import AdminFeatures from './Features';
import AdminGiftCodes from './GiftCodes';
import GameControl from './GameControl';

const API_URL = 'http://localhost:5000/api/admin';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { adminLogout } = useAuth();
  
  const tabs = [
    { name: 'Dashboard', icon: FaChartBar },
    { name: 'Users', icon: FaUsers },
    { name: 'Games', icon: FaGamepad },
    { name: 'Deposits', icon: FaMoneyBillWave },
    { name: 'Withdrawals', icon: FaWallet },
    { name: 'Finance', icon: FaChartLine },
    { name: 'Referrals', icon: FaUsers },
    { name: 'Settings', icon: FaCog },
    { name: 'Activity Features', icon: FaCog },
    { name: 'Gift Codes', icon: FaGift },
    { name: 'Game Control', icon: FaGamepad },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 text-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-yellow-400">Admin Panel</h1>
        <p className="text-xs text-gray-400 mt-1">Diamond 11</p>
      </div>
      <nav className="flex-grow mt-4">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
              activeTab === tab.name ? 'bg-yellow-500 text-gray-900 font-bold' : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <tab.icon className="mr-3" />
            {tab.name}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={adminLogout}
          className="w-full flex items-center px-4 py-3 text-left text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard`);
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Active Today', value: stats?.activeUsers || 0, icon: FaUserCog, color: 'bg-green-500' },
    { title: 'Total Deposit', value: `₹${stats?.totalDeposit?.toFixed(2) || '0.00'}`, icon: FaMoneyBillWave, color: 'bg-yellow-500' },
    { title: 'Total Withdraw', value: `₹${stats?.totalWithdraw?.toFixed(2) || '0.00'}`, icon: FaMoneyBillWave, color: 'bg-red-500' },
    { title: 'Net Profit', value: `₹${stats?.netProfit?.toFixed(2) || '0.00'}`, icon: FaChartBar, color: 'bg-purple-500' },
    { title: 'Pending Withdrawals', value: stats?.pendingWithdraws || 0, icon: FaWallet, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map(card => (
          <div key={card.title} className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center border border-gray-700">
            <div className={`p-4 rounded-full mr-4 text-white text-2xl ${card.color}`}>
              <card.icon />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceType, setBalanceType] = useState('add');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBalanceModal = (user, type = 'add') => {
    setSelectedUser(user);
    setBalanceType(type);
    setBalanceAmount('');
    setShowModal(true);
  };

  const updateBalance = async () => {
    if (!selectedUser || !balanceAmount) return;
    
    try {
      await axios.put(`${API_URL}/user/balance`, {
        userId: selectedUser._id,
        amount: parseFloat(balanceAmount),
        type: balanceType,
        remark: `Admin ${balanceType} balance`
      });
      alert(`Balance ${balanceType === 'add' ? 'added' : 'deducted'} successfully!`);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert('Error updating balance: ' + (error.response?.data?.message || error.message));
    }
  };

  const blockUser = async (userId, isBlocked) => {
    try {
      await axios.put(`${API_URL}/user/block`, { userId, isBlocked: !isBlocked });
      alert(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully!`);
      fetchUsers();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) return <div className="text-white">Loading users...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Manage Users ({users.length})</h2>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 border border-gray-600">
            <h3 className="text-xl font-bold text-white mb-4">
              {balanceType === 'add' ? 'Add' : 'Deduct'} Balance
            </h3>
            <p className="text-gray-400 mb-4">User: {selectedUser?.phone}</p>
            <input
              type="number"
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 border border-gray-600"
            />
            <div className="flex gap-2">
              <button onClick={updateBalance} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold">
                Confirm
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-600 text-white py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-gray-300">UID</th>
              <th className="p-4 text-gray-300">Phone</th>
              <th className="p-4 text-gray-300">Balance</th>
              <th className="p-4 text-gray-300">Status</th>
              <th className="p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4 text-white font-mono text-sm">{user.uid}</td>
                <td className="p-4 text-white">{user.phone}</td>
                <td className="p-4 text-yellow-400 font-bold">₹{user.balance?.toFixed(2) || '0.00'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openBalanceModal(user, 'add')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                      <FaPlus /> Add
                    </button>
                    <button onClick={() => openBalanceModal(user, 'deduct')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                      <FaMinus /> Deduct
                    </button>
                    <button onClick={() => blockUser(user._id, user.isBlocked)} className={`px-3 py-1 rounded text-xs ${user.isBlocked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'} text-white`}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
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

const GamesContent = () => <h2 className="text-3xl font-bold mb-6 text-white">Manage Games (Coming Soon)</h2>;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardContent />;
      case 'Users': return <UsersContent />;
      case 'Games': return <GamesContent />;
      case 'Deposits': return <AdminDeposits />;
      case 'Withdrawals': return <AdminWithdrawals />;
      case 'Finance': return <Finance />;
      case 'Referrals': return <Referrals />;
      case 'Settings': return <AdminSettings />;
      default: return <DashboardContent />;
      case 'Activity Features': return <AdminFeatures />;
      case 'Gift Codes': return <AdminGiftCodes />;
      case 'Game Control': return <GameControl />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow ml-64 p-8 bg-gray-800 min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;