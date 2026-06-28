import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import Header from '../components/header';
import BottomNav from '../components/bottomnav';
import * as FaIcons from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Tasks = () => {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/list`);
      if (res.data.success) setTasks(res.data.data.tasks);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleClaim = async (taskId, reward) => {
    try {
      const res = await axios.post(`${API_URL}/tasks/claim/${taskId}`);
      if (res.data.success) {
        alert(`🎉 ${res.data.message}`);
        updateUser({ ...user, balance: res.data.newBalance });
        fetchTasks();
      }
    } catch (error) { alert(error.response?.data?.message || 'Error'); }
  };

  const getIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon className="text-2xl" /> : <FaIcons.FaCheck className="text-2xl" />;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Daily Tasks" backLink="/activity" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Complete Tasks & Earn!</h2>
          <p className="text-purple-300 text-sm mt-2">Finish daily tasks to get bonus rewards</p>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className={`bg-purple-800/50 rounded-xl p-4 border ${task.completed ? 'border-green-500/50' : 'border-purple-600'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.completed ? 'bg-green-500/20 text-green-400' : 'bg-purple-700 text-purple-300'}`}>
                    {getIcon(task.icon)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{task.name}</p>
                    <p className="text-xs text-purple-300">{task.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">₹{task.reward}</p>
                  {task.completed ? (
                    <span className="text-xs text-green-400">✓ Completed</span>
                  ) : (
                    <button onClick={() => handleClaim(task.id, task.reward)} className="text-xs bg-yellow-400 text-purple-900 px-3 py-1 rounded font-bold">Claim</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default Tasks;