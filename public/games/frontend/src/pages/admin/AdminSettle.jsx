import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'https://diamond11-backend.onrender.com';

export default function AdminSettle() {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [winner, setWinner] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => { fetchMatches(); }, []);

    const fetchMatches = async () => {
        try {
            const res = await axios.get(`${API}/sports/matches?status=upcoming,live`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setMatches(res.data.data);
        } catch (e) { console.error(e); }
    };

    const handleSettle = async () => {
        if (!selectedMatch || !winner) return alert('Select match and winner');
        if (!window.confirm(`Declare ${winner === 'A' ? selectedMatch.teamA : winner === 'B' ? selectedMatch.teamB : 'Draw'} as winner?`)) return;

        try {
            const res = await axios.post(`${API}/sports/admin/match/${selectedMatch._id}/settle`, 
                { winner },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert(`✅ Match Settled!\nWinners paid: ${res.data.message}`);
            fetchMatches();
            setSelectedMatch(null);
            setWinner('');
        } catch (e) {
            alert(e.response?.data?.message || 'Error settling match');
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <h2>✅ Settle Match (Declare Winner)</h2>
            
            <div style={{ background: '#fff3cd', padding: 15, borderRadius: 8, marginBottom: 20, borderLeft: '4px solid #ffc107' }}>
                <strong>⚠️ Warning:</strong> Once you declare winner, all bets will be settled automatically and winners will be paid instantly. This action cannot be undone!
            </div>

            <div style={{ background: '#fff', padding: 20, borderRadius: 12, marginBottom: 20 }}>
                <label style={{ fontWeight: 700 }}>Select Match:</label>
                <select 
                    value={selectedMatch?._id || ''} 
                    onChange={e => {
                        const m = matches.find(x => x._id === e.target.value);
                        setSelectedMatch(m);
                    }}
                    style={{ width: '100%', padding: 12, marginTop: 8, borderRadius: 8, border: '1px solid #ddd' }}
                >
                    <option value="">-- Select a Match --</option>
                    {matches.map(m => (
                        <option key={m._id} value={m._id}>
                            {m.teamA} vs {m.teamB} ({m.league})
                        </option>
                    ))}
                </select>

                {selectedMatch && (
                    <div style={{ marginTop: 20 }}>
                        <div style={{ marginBottom: 15 }}>
                            <strong>Match Details:</strong><br/>
                            {selectedMatch.teamA} vs {selectedMatch.teamB}<br/>
                            Date: {new Date(selectedMatch.matchDate).toLocaleString()}<br/>
                            Current Odds: A({selectedMatch.oddsA_back}) | B({selectedMatch.oddsB_back})
                        </div>

                        <label style={{ fontWeight: 700 }}>Select Winner:</label>
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <button 
                                onClick={() => setWinner('A')}
                                style={{ 
                                    flex: 1, padding: 15, borderRadius: 8, border: '2px solid #ddd', 
                                    background: winner === 'A' ? '#28a745' : '#fff', 
                                    color: winner === 'A' ? '#fff' : '#333',
                                    fontWeight: 900, cursor: 'pointer'
                                }}
                            >
                                🏆 {selectedMatch.teamA} (A)
                            </button>
                            <button 
                                onClick={() => setWinner('B')}
                                style={{ 
                                    flex: 1, padding: 15, borderRadius: 8, border: '2px solid #ddd', 
                                    background: winner === 'B' ? '#28a745' : '#fff', 
                                    color: winner === 'B' ? '#fff' : '#333',
                                    fontWeight: 900, cursor: 'pointer'
                                }}
                            >
                                🏆 {selectedMatch.teamB} (B)
                            </button>
                            {selectedMatch.oddsX_back > 0 && (
                                <button 
                                    onClick={() => setWinner('X')}
                                    style={{ 
                                        flex: 1, padding: 15, borderRadius: 8, border: '2px solid #ddd', 
                                        background: winner === 'X' ? '#28a745' : '#fff', 
                                        color: winner === 'X' ? '#fff' : '#333',
                                        fontWeight: 900, cursor: 'pointer'
                                    }}
                                >
                                    🤝 Draw (X)
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={handleSettle}
                            disabled={!winner}
                            style={{ 
                                width: '100%', marginTop: 20, padding: 16, 
                                background: winner ? '#dc3545' : '#ccc', color: '#fff', 
                                border: 'none', borderRadius: 8, fontWeight: 900, fontSize: '1.1rem',
                                cursor: winner ? 'pointer' : 'not-allowed'
                            }}
                        >
                            🎯 CONFIRM & SETTLE MATCH
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}