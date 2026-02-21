import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Play, Flame, Clock, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchVideos();
        fetchGenres();
    }, [selectedGenre]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const res = await api.get('/videos', {
                params: { genre: selectedGenre, search: search || undefined }
            });
            setVideos(res.data.videos);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const res = await api.get('/videos/genres/list');
            setGenres(['all', ...res.data.genres]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchVideos();
        }
    };

    return (
        <div className="home-page" style={{ padding: '2rem' }}>
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero"
                style={{
                    height: '400px',
                    borderRadius: '24px',
                    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)), url("https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 4rem',
                    marginBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                        <Flame size={20} />
                        <span>TRENDING THIS WEEK</span>
                    </div>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '600px' }}>
                        Unleash the Power of <span style={{ color: 'var(--primary)' }}>Self-Hosted</span> Streaming
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px' }}>
                        Experience lightning fast playback with HLS technology. No third-party tracking, no limits.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to={videos[0] ? `/watch/${videos[0]._id}` : '#'} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                            <Play size={20} fill="white" />
                            Watch Now
                        </Link>
                        <button className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
                            Add to List
                        </button>
                    </div>
                </div>
            </motion.section >

            {/* Filter & Search */}
            < div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`btn ${selectedGenre === genre ? 'btn-primary' : 'btn-outline'}`}
                            style={{ textTransform: 'capitalize', padding: '0.5rem 1.25rem' }}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', width: '300px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.5rem', width: '100%', outline: 'none' }}
                    />
                </div>
            </div >

            {/* Video Grid */}
            < div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {
                    loading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} style={{ borderRadius: '12px', background: 'var(--surface)', height: '220px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                        ))
                    ) : videos.length > 0 ? (
                        videos.map((video, index) => (
                            <motion.div
                                key={video._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="video-card"
                            >
                                <Link to={`/watch/${video._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <img
                                        src={video.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${video.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                        alt={video.title}
                                        className="thumbnail"
                                    />
                                    <div className="content">
                                        <h3 className="title">{video.title}</h3>
                                        <div className="meta">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} /> {formatDuration(video.duration)}
                                            </span>
                                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {video.requiresSubscription && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'var(--secondary)',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700
                                        }}>PREMIUM</div>
                                    )}
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <h3>No videos found matching your criteria.</h3>
                        </div>
                    )
                }
            </div >

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}} />
        </div >
    );
};

const formatDuration = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default Home;
