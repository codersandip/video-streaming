import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import { Clock, Eye, Calendar, User, Info, ThumbsUp, Share2, List } from 'lucide-react';

const Watch = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetchVideo();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchVideo = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/videos/${id}`);
            setVideo(res.data.video);

            // Fetch recommendations (just other videos for now)
            const recRes = await api.get('/videos', { params: { limit: 5 } });
            setRecommendations(recRes.data.videos.filter(v => v._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Error loading video');
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (progress) => {
        try {
            await api.post(`/videos/${id}/progress`, { progress });
        } catch (err) {
            console.warn('Silent: Progress update failed');
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading content...</div>;
    if (error) return (
        <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
            <Link to="/subscriptions" className="btn btn-primary">Upgrade Your Plan</Link>
        </div>
    );

    const streamUrl = `http://localhost:5000/api/stream/${id}/index.m3u8`;
    const initialTime = user?.watchHistory?.find(h => h.video === id)?.progress || 0;

    return (
        <div className="watch-page" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            <div className="video-main">
                <VideoPlayer
                    src={streamUrl}
                    poster={video.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${video.thumbnail.split('/').pop()}` : null}
                    startTime={initialTime}
                    onProgress={updateProgress}
                />

                <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {video.tags.map(tag => (
                            <span key={tag} style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>#{tag}</span>
                        ))}
                    </div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{video.title}</h1>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={18} /> {video.views} views</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={18} /> {new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}><ThumbsUp size={18} /> Like</button>
                            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}><Share2 size={18} /> Share</button>
                            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}><List size={18} /> Save</button>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User color="white" />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 600 }}>{video.createdBy?.name || 'Admin'}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Creator</span>
                            </div>
                        </div>
                        <p style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>{video.description}</p>
                    </div>
                </div>
            </div>

            <aside className="recommendations">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Up Next</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recommendations.map(rec => (
                        <Link key={rec._id} to={`/watch/${rec._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '0.75rem' }}>
                            <div style={{ width: '140px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', height: '80px', position: 'relative' }}>
                                <img
                                    src={rec.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${rec.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                    alt={rec.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', fontSize: '0.7rem', padding: '1px 4px', borderRadius: '2px' }}>
                                    {formatDuration(rec.duration)}
                                </span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rec.title}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{rec.createdBy?.name || 'Admin'}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.views} views</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </aside>
        </div>
    );
};

const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default Watch;
