import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ matches: 0, bets: 0, pendingBets: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API}/sports/admin/bets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setStats({
                    bets: res.data.data.length,
                    pendingBets: res.data.data.filter(b => b.status === 'pending').length
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ color: '#fff', margin: 0 }}>🏆 Diamond 11 Admin</h1>
                <button onClick={() => navigate('/')} style={styles.logoutBtn}>Logout</button>
            </div>

            <div style={styles.grid}>
                <Link to="/admin/sports/matches" style={styles.card}>
                    <div style={styles.cardIcon}>🏏</div>
                    <div style={styles.cardTitle}>Manage Matches</div>
                    <div style={styles.cardDesc}>Add, Edit, Delete Matches & Odds</div>
                </Link>

                <Link to="/admin/sports/settle" style={styles.card}>
                    <div style={styles.cardIcon}>✅</div>
                    <div style={styles.cardTitle}>Settle Matches</div>
                    <div style={styles.cardDesc}>Declare Winner & Auto-Pay Users</div>
                </Link>

                <Link to="/admin/sports/bets" style={styles.card}>
                    <div style={styles.cardIcon}>📊</div>
                    <div style={styles.cardTitle}>View All Bets</div>
                    <div style={styles.cardDesc}>Pending: {stats.pendingBets} | Total: {stats.bets}</div>
                </Link>
            </div>

            <div style={styles.infoBox}>
                <h3 style={{ margin: '0 0 10px 0' }}>⚡ Quick Actions</h3>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Add Cricket/Football matches</li>
                    <li>Change odds anytime before match starts</li>
                    <li>Settle match after completion - winners get auto-paid</li>
                    <li>Cancel any bet if needed (refund user)</li>
                </ul>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: 900, margin: '0 auto', padding: 20, background: '#f5f5f5', minHeight: '100vh' },
    header: { background: '#1a1a2e', padding: '15px 20px', borderRadius: 12, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoutBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 20 },
    card: { background: '#fff', padding: 25, borderRadius: 12, textDecoration: 'none', color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center', transition: 'transform 0.2s' },
    cardIcon: { fontSize: '2.5rem', marginBottom: 10 },
    cardTitle: { fontSize: '1.2rem', fontWeight: 900, marginBottom: 5, color: '#1a1a2e' },
    cardDesc: { fontSize: '0.85rem', color: '#666' },
    infoBox: { background: '#fff', padding: 20, borderRadius: 12, borderLeft: '4px solid #ffd700' }
};