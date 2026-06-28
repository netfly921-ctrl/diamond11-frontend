import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminMatches() {
    const [matches, setMatches] = useState([]);
    const [form, setForm] = useState({
        sport: 'cricket', league: '', teamA: '', teamB: '',
        matchDate: '', oddsA_back: 1.5, oddsA_lay: 1.55,
        oddsB_back: 2.0, oddsB_lay: 2.05, oddsX_back: 0, oddsX_lay: 0
    });
    const [editing, setEditing] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => { fetchMatches(); }, []);

    const fetchMatches = async () => {
        try {
            const res = await axios.get(`${API}/sports/matches?limit=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setMatches(res.data.data);
        } catch (e) { alert('Error loading matches'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing ? `${API}/sports/admin/match/${editing}` : `${API}/sports/admin/match`;
            const method = editing ? 'put' : 'post';
            
            await axios[method](url, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert(editing ? 'Match Updated!' : 'Match Created!');
            setEditing(null);
            setForm({ sport: 'cricket', league: '', teamA: '', teamB: '', matchDate: '', oddsA_back: 1.5, oddsA_lay: 1.55, oddsB_back: 2.0, oddsB_lay: 2.05, oddsX_back: 0, oddsX_lay: 0 });
            fetchMatches();
        } catch (e) {
            alert(e.response?.data?.message || 'Error saving match');
        }
    };

    const handleEdit = (m) => {
        setEditing(m._id);
        setForm({
            sport: m.sport, league: m.league, teamA: m.teamA, teamB: m.teamB,
            matchDate: new Date(m.matchDate).toISOString().slice(0, 16),
            oddsA_back: m.oddsA_back, oddsA_lay: m.oddsA_lay,
            oddsB_back: m.oddsB_back, oddsB_lay: m.oddsB_lay,
            oddsX_back: m.oddsX_back, oddsX_lay: m.oddsX_lay
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this match?')) return;
        try {
            await axios.delete(`${API}/sports/admin/match/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Deleted!'); fetchMatches();
        } catch (e) { alert('Error deleting'); }
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
            <h2 style={{ marginBottom: 20 }}>📝 {editing ? 'Edit Match' : 'Add New Match'}</h2>
            
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 20, borderRadius: 12, marginBottom: 30 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <select value={form.sport} onChange={e => setForm({...form, sport: e.target.value})} style={inputStyle}>
                        <option value="cricket">🏏 Cricket</option>
                        <option value="football">⚽ Football</option>
                        <option value="tennis">🎾 Tennis</option>
                    </select>
                    <input placeholder="League Name (IPL, FIFA...)" value={form.league} onChange={e => setForm({...form, league: e.target.value})} style={inputStyle} required />
                    <input placeholder="Team A Name" value={form.teamA} onChange={e => setForm({...form, teamA: e.target.value})} style={inputStyle} required />
                    <input placeholder="Team B Name" value={form.teamB} onChange={e => setForm({...form, teamB: e.target.value})} style={inputStyle} required />
                    <input type="datetime-local" value={form.matchDate} onChange={e => setForm({...form, matchDate: e.target.value})} style={inputStyle} required />
                </div>

                <h4 style={{ margin: '15px 0 10px' }}>Odds Settings</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 15 }}>
                    <div>
                        <label style={{fontSize:'0.75rem'}}>Team A Back</label>
                        <input type="number" step="0.01" value={form.oddsA_back} onChange={e => setForm({...form, oddsA_back: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{fontSize:'0.75rem'}}>Team A Lay</label>
                        <input type="number" step="0.01" value={form.oddsA_lay} onChange={e => setForm({...form, oddsA_lay: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{fontSize:'0.75rem'}}>Team B Back</label>
                        <input type="number" step="0.01" value={form.oddsB_back} onChange={e => setForm({...form, oddsB_back: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{fontSize:'0.75rem'}}>Team B Lay</label>
                        <input type="number" step="0.01" value={form.oddsB_lay} onChange={e => setForm({...form, oddsB_lay: e.target.value})} style={inputStyle} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ flex: 1, padding: 12, background: '#28a745', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, cursor: 'pointer' }}>
                        {editing ? '💾 Update Match' : '➕ Create Match'}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm({ sport: 'cricket', league: '', teamA: '', teamB: '', matchDate: '', oddsA_back: 1.5, oddsA_lay: 1.55, oddsB_back: 2.0, oddsB_lay: 2.05, oddsX_back: 0, oddsX_lay: 0 }); }} 
                        style={{ padding: '12px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <h3>📋 All Matches</h3>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
                {matches.map(m => (
                    <div key={m._id} style={{ padding: 15, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>{m.teamA} vs {m.teamB}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{m.league} | {new Date(m.matchDate).toLocaleString()} | Status: {m.status}</div>
                            <div style={{ fontSize: '0.75rem', color: '#28a745' }}>Odds: A({m.oddsA_back}) | B({m.oddsB_back})</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleEdit(m)} style={{ padding: '6px 12px', background: '#ffc107', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Edit</button>
                            <button onClick={() => handleDelete(m._id)} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const inputStyle = { padding: 10, border: '1px solid #ddd', borderRadius: 8, outline: 'none', width: '100%' };