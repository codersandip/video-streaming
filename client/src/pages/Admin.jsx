import { useState, useRef } from 'react';
import api from '../api/axios';
import { Upload, FileVideo, CheckCircle, XCircle, BarChart3, Users, Film, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [stats, setStats] = useState(null);

    return (
        <div style={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
            <aside className="glass" style={{ width: '250px', padding: '1.5rem', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>Admin Panel</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <AdminLink
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                        icon={<BarChart3 size={18} />}
                        label="Dashboard"
                    />
                    <AdminLink
                        active={activeTab === 'upload'}
                        onClick={() => setActiveTab('upload')}
                        icon={<Upload size={18} />}
                        label="Upload Video"
                    />
                    <AdminLink
                        active={activeTab === 'videos'}
                        onClick={() => setActiveTab('videos')}
                        icon={<Film size={18} />}
                        label="Manage Videos"
                    />
                    <AdminLink
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                        icon={<Users size={18} />}
                        label="User Management"
                    />
                    <AdminLink
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                        icon={<Settings size={18} />}
                        label="Settings"
                    />
                </nav>
            </aside>

            <main style={{ flex: 1 }}>
                {activeTab === 'upload' && <UploadView />}
                {activeTab === 'dashboard' && <div className="glass" style={{ padding: '2rem' }}>Analytics coming soon...</div>}
            </main>
        </div>
    );
};

const AdminLink = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? 'white' : 'var(--text-muted)',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontWeight: active ? 600 : 500,
        transition: 'all 0.2s ease'
    }}>
        {icon}
        {label}
    </button>
);

const UploadView = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: 'Movies',
        isPublic: 'true',
        requiresSubscription: 'true'
    });
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef();

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const data = new FormData();
        data.append('video', file);
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        try {
            setStatus('uploading');
            await api.post('/videos/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const p = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(p);
                }
            });
            setStatus('success');
            setFile(null);
            setFormData({ title: '', description: '', genre: 'Movies', isPublic: 'true', requiresSubscription: 'true' });
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
            setStatus('error');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Upload New Video</h2>

            {status === 'success' && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={20} />
                    <span>Upload complete! Video is now being processed into HLS.</span>
                    <button onClick={() => setStatus('idle')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 600 }}>Dismiss</button>
                </div>
            )}

            {status === 'error' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <XCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setStatus('idle')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
                </div>
            )}

            <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="section-left">
                    <div className="input-group">
                        <label>Video File</label>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                border: '2px dashed var(--glass-border)',
                                borderRadius: '12px',
                                padding: '3rem 1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: file ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                transition: 'border-color 0.2s ease'
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                setFile(e.dataTransfer.files[0]);
                            }}
                        >
                            <input type="file" ref={fileInputRef} hidden onChange={(e) => setFile(e.target.files[0])} accept="video/*" />
                            {file ? (
                                <div style={{ color: 'var(--primary)' }}>
                                    <FileVideo size={48} style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 600 }}>{file.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--text-muted)' }}>
                                    <Upload size={48} style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 500 }}>Click or drag video to upload</p>
                                    <p style={{ fontSize: '0.8rem' }}>MP4, MKV, MOV (Max 5GB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Genre</label>
                        <select value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })}>
                            <option>Movies</option>
                            <option>TV Shows</option>
                            <option>Documentaries</option>
                            <option>Animation</option>
                            <option>Education</option>
                            <option>Music</option>
                        </select>
                    </div>
                </div>

                <div className="section-right">
                    <div className="input-group">
                        <label>Video Title</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter catchtitle"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            rows="5"
                            placeholder="What's this video about?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Visibility</label>
                            <select value={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.value })}>
                                <option value="true">Public</option>
                                <option value="false">Private</option>
                            </select>
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Subscription</label>
                            <select value={formData.requiresSubscription} onChange={(e) => setFormData({ ...formData, requiresSubscription: e.target.value })}>
                                <option value="true">Premium Only</option>
                                <option value="false">Free Access</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        {status === 'uploading' ? (
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--surface-light)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
                                </div>
                            </div>
                        ) : (
                            <button disabled={!file} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                Start Processing
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default Admin;
