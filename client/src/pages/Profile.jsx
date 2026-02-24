import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Avatar,
    Stack,
    Divider,
    Button,
    IconButton,
    LinearProgress,
    List,
    ListItem
} from '@mui/material';
import {
    Mail as MailIcon,
    Shield as ShieldIcon,
    History as HistoryIcon,
    Settings as SettingsIcon,
    Launch as ExternalLinkIcon,
    DeleteSweep as TrashIcon,
    PlayArrow as PlayIcon
} from '@mui/icons-material';
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

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Grid container spacing={5}>
                {/* User Info Card */}
                <Grid item xs={12} md={4} lg={3}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                borderRadius: 6,
                                bgcolor: 'rgba(30, 41, 59, 0.5)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    margin: '0 auto 2rem',
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    bgcolor: 'primary.main',
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                {user.name.charAt(0)}
                            </Avatar>

                            <Typography variant="h5" fontWeight={800} gutterBottom>
                                {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Member since {new Date(user.createdAt).getFullYear()}
                            </Typography>

                            <Divider sx={{ mb: 3, opacity: 0.1 }} />

                            <Stack spacing={2} sx={{ textAlign: 'left', mb: 4 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary">
                                    <MailIcon fontSize="small" />
                                    <Typography variant="body2">{user.email}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary">
                                    <ShieldIcon fontSize="small" />
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                        {user.role} Account
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary">
                                    <SettingsIcon fontSize="small" />
                                    <Typography variant="body2">Account Settings</Typography>
                                </Stack>
                            </Stack>

                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(99, 102, 241, 0.08)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)'
                                }}
                            >
                                <Typography variant="caption" fontWeight={800} color="primary" sx={{ letterSpacing: 1.5, display: 'block', mb: 1 }}>
                                    CURRENT PLAN
                                </Typography>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    {user.subscription?.planName || 'Free'}
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/subscriptions"
                                    size="small"
                                    endIcon={<ExternalLinkIcon />}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    Manage Subscription
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Watch History */}
                <Grid item xs={12} md={8} lg={9}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.primary' }}>
                                <HistoryIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight={800}>Watch History</Typography>
                        </Stack>

                        {history.length > 0 && (
                            <Button
                                color="error"
                                onClick={clearHistory}
                                startIcon={<TrashIcon />}
                                sx={{ fontWeight: 600 }}
                            >
                                Clear All
                            </Button>
                        )}
                    </Box>

                    <Stack spacing={3}>
                        {loading ? (
                            <Box sx={{ py: 10, textAlign: 'center' }}>
                                <Typography color="text.secondary">Loading history...</Typography>
                            </Box>
                        ) : history.length > 0 ? (
                            history.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            gap: 3,
                                            borderRadius: 4,
                                            bgcolor: 'rgba(30, 41, 59, 0.5)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                bgcolor: 'rgba(30, 41, 59, 0.7)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ width: { xs: 120, sm: 200 }, flexShrink: 0, borderRadius: 2, overflow: 'hidden', height: { xs: 70, sm: 110 } }}>
                                            <Box
                                                component="img"
                                                src={item.video?.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${item.video.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                                alt={item.video?.title}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>

                                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                                {item.video?.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Last watched: {new Date(item.lastWatched).toLocaleDateString()}
                                            </Typography>

                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                        Progress: {Math.round((item.progress / (item.video?.duration || 1)) * 100)}%
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTime(item.progress)} / {formatTime(item.video?.duration)}
                                                    </Typography>
                                                </Stack>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(item.progress / (item.video?.duration || 1)) * 100}
                                                    sx={{ height: 4, borderRadius: 2 }}
                                                />
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                                            <Button
                                                variant="contained"
                                                component={Link}
                                                to={`/watch/${item.video?._id}`}
                                                startIcon={<PlayIcon />}
                                                sx={{
                                                    display: { xs: 'none', sm: 'inline-flex' },
                                                    borderRadius: 3,
                                                    px: 3
                                                }}
                                            >
                                                Resume
                                            </Button>
                                            <IconButton
                                                component={Link}
                                                to={`/watch/${item.video?._id}`}
                                                color="primary"
                                                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                                            >
                                                <PlayIcon />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))
                        ) : (
                            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <Typography color="text.secondary">
                                    No watch history yet. Start exploring videos!
                                </Typography>
                                <Button component={Link} to="/" sx={{ mt: 2 }}>Explore Now</Button>
                            </Paper>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
