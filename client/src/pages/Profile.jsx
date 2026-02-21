import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, Shield, History, Settings, ExternalLink, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/users/watch-history');
            setHistory(res.data.history);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear your entire watch history?')) return;
        try {
            await api.delete('/users/watch-history');
            setHistory([]);
        } catch (err) {
            alert('Failed to clear history');
        }
    };

    return (
        <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                {/* User Info Card */}
                <aside>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass"
                        style={{ padding: '2.5rem', textAlign: 'center' }}
                    >
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            margin: '0 auto 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            color: 'white',
                            fontWeight: 700
                        }}>
                            {user.name.charAt(0)}
                        </div>

                        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Member since {new Date(user.createdAt).getFullYear()}</p>

                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Mail size={18} />
                                <span>{user.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Shield size={18} />
                                <span style={{ textTransform: 'capitalize' }}>{user.role} Account</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Settings size={18} />
                                <span>Account Settings</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>CURRENT PLAN</p>
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{user.subscription?.planName || 'Free'}</h4>
                            <Link to="/subscriptions" style={{ fontSize: '0.85rem', color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 600 }}>
                                Manage Subscription <ExternalLink size={14} />
                            </Link>
                        </div>
                    </motion.div>
                </aside>

                {/* Watch History */}
                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <History size={24} /> Watch History
                        </h2>
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}
                            >
                                <Trash2 size={16} /> Clear All
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {loading ? (
                            <p>Loading history...</p>
                        ) : history.length > 0 ? (
                            history.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass"
                                    style={{ display: 'flex', gap: '1.5rem', padding: '1rem', overflow: 'hidden' }}
                                >
                                    <div style={{ width: '200px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', height: '110px' }}>
                                        <img
                                            src={item.video?.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${item.video.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                            alt={item.video?.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.video?.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                            Last watched: {new Date(item.lastWatched).toLocaleDateString()}
                                        </p>

                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                                <span>Progress: {Math.round((item.progress / (item.video?.duration || 1)) * 100)}%</span>
                                                <span>{formatTime(item.progress)} / {formatTime(item.video?.duration)}</span>
                                            </div>
                                            <div style={{ height: '4px', background: 'var(--surface-light)', borderRadius: '10px' }}>
                                                <div style={{ width: `${(item.progress / (item.video?.duration || 1)) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Link to={`/watch/${item.video?._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Resume</Link>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>No watch history yet. Start exploring videos!</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default Profile;
