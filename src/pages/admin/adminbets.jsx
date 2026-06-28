import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'https://diamond11-backend.onrender.com';

export default function AdminBets() {
    const [bets, setBets] = useState([]);
    const [filter, setFilter] = useState('all');
    const token = localStorage.getItem('token');

    useEffect(() => { fetchBets(); }, []);

    const fetchBets = async () => {
        try {
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const res = await axios.get(`${API}/sports/admin/bets${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setBets(res.data.data);
        } catch (e) { console.error(e); }
    };

    const handleCancel = async (betId) => {
        if (!window.confirm('Cancel this bet and refund user?')) return;
        try {
            await axios.post(`${API}/sports/admin/bet/${betId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Bet Cancelled & Refunded');
            fetchBets();
        } catch (e) { alert('Error cancelling bet'); }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
            <h2>📊 All Sports Bets</h2>
            
            <div style={{ marginBottom: 15 }}>
                <select value={filter} onChange={e => { setFilter(e.target.value); fetchBets(); }} style={{ padding: 8, borderRadius: 6 }}>
                    <option value="all">All Bets</option>
                    <option value="pending">Pending</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#1a1a2e', color: '#fff' }}>
                        <tr>
                            <th style={{ padding: 12, textAlign: 'left' }}>User</th>
                            <th style={{ padding: 12 }}>Match</th>
                            <th style={{ padding: 12 }}>Selection</th>
                            <th style={{ padding: 12 }}>Odds</th>
                            <th style={{ padding: 12 }}>Stake</th>
                            <th style={{ padding: 12 }}>Status</th>
                            <th style={{ padding: 12 }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bets.map(b => (
                            <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12 }}>{b.user?.name || b.user?.phone || 'Unknown'}</td>
                                <td style={{ padding: 12, fontSize: '0.85rem' }}>
                                    {b.matchInfo?.teamA} vs {b.matchInfo?.teamB}
                                </td>
                                <td style={{ padding: 12, fontWeight: 700 }}>{b.selectionName}</td>
                                <td style={{ padding: 12 }}>{b.odds}</td>
                                <td style={{ padding: 12 }}>₹{b.stake}</td>
                                <td style={{ padding: 12 }}>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700,
                                        background: b.status === 'won' ? '#d4edda' : b.status === 'lost' ? '#f8d7da' : '#fff3cd',
                                        color: b.status === 'won' ? '#155724' : b.status === 'lost' ? '#721c24' : '#856404'
                                    }}>
                                        {b.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: 12 }}>
                                    {b.status === 'pending' && (
                                        <button onClick={() => handleCancel(b._id)} style={{ padding: '4px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }}>
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bets.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#666' }}>No bets found</div>}
            </div>
        </div>
    );
}