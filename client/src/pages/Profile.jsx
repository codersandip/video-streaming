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
    ListItem,
    alpha,
    useTheme
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
    const theme = useTheme();

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
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Grid container spacing={5}>
                {/* User Info Card */}
                <Grid item xs={12} md={4} lg={3.5}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 5,
                                textAlign: 'center',
                                borderRadius: 8,
                                bgcolor: alpha(theme.palette.background.paper, 0.4),
                                border: `1px solid ${alpha(theme.palette.text.primary, 0.05)}`,
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '120px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                opacity: 0.15,
                                zIndex: 0
                            }} />

                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto 2.5rem',
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    bgcolor: 'primary.main',
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                                    position: 'relative',
                                    zIndex: 1,
                                    border: '4px solid',
                                    borderColor: theme.palette.background.paper
                                }}
                            >
                                {user.name.charAt(0)}
                            </Avatar>

                            <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.5px' }}>
                                {user.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                                Professional Member • {new Date(user.createdAt).getFullYear()}
                            </Typography>

                            <Divider sx={{ mb: 4, opacity: 0.1 }} />

                            <Stack spacing={3} sx={{ textAlign: 'left', mb: 5 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), p: 1, borderRadius: 2 }}>
                                        <MailIcon sx={{ fontSize: 20, color: 'primary.light' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Email</Typography>
                                        <Typography variant="body1" fontWeight={600}>{user.email}</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), p: 1, borderRadius: 2 }}>
                                        <ShieldIcon sx={{ fontSize: 20, color: 'secondary.light' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Account Role</Typography>
                                        <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
                                    </Box>
                                </Stack>
                            </Stack>

                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 6,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    textAlign: 'left'
                                }}
                            >
                                <Typography variant="caption" fontWeight={900} color="primary" sx={{ letterSpacing: 2, display: 'block', mb: 1 }}>
                                    ACTIVE SUBSCRIPTION
                                </Typography>
                                <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                                    {user.subscription?.planName || 'Free Plan'}
                                </Typography>
                                <Button
                                    fullWidth
                                    component={Link}
                                    to="/subscriptions"
                                    variant="contained"
                                    size="small"
                                    endIcon={<ExternalLinkIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        py: 1.2,
                                        borderRadius: 3
                                    }}
                                >
                                    Modify Plan
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Watch History */}
                <Grid item xs={12} md={8} lg={8.5}>
                    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={2.5} alignItems="center">
                            <Box sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                p: 1.5,
                                borderRadius: 3,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            }}>
                                <HistoryIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={900}>History</Typography>
                                <Typography variant="body2" color="text.secondary">Review your recent activity</Typography>
                            </Box>
                        </Stack>

                        {history.length > 0 && (
                            <Button
                                color="error"
                                onClick={clearHistory}
                                startIcon={<TrashIcon />}
                                sx={{
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    bgcolor: alpha(theme.palette.error.main, 0.05),
                                    px: 3,
                                    py: 1,
                                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                                }}
                            >
                                Clear History
                            </Button>
                        )}
                    </Box>

                    <Stack spacing={3}>
                        {loading ? (
                            <Box sx={{ py: 10, textAlign: 'center' }}>
                                <Typography color="text.secondary">Loading activity...</Typography>
                            </Box>
                        ) : history.length > 0 ? (
                            history.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: 4,
                                            borderRadius: 6,
                                            bgcolor: alpha(theme.palette.background.paper, 0.4),
                                            border: `1px solid ${alpha(theme.palette.text.primary, 0.05)}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                                                borderColor: alpha(theme.palette.primary.main, 0.3)
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            width: { xs: '100%', sm: 240 },
                                            flexShrink: 0,
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            aspectRatio: '16/9',
                                            position: 'relative',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                                        }}>
                                            <Box
                                                component="img"
                                                src={item.video?.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${item.video.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                                alt={item.video?.title}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <Box sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                bgcolor: 'rgba(0,0,0,0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                '&:hover': { opacity: 1 }
                                            }}>
                                                <PlayIcon sx={{ color: 'white', fontSize: 40 }} />
                                            </Box>
                                        </Box>

                                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography variant="h5" fontWeight={800} sx={{ mb: 1, lineHeight: 1.2 }}>
                                                {item.video?.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 3 }}>
                                                Watched on {new Date(item.lastWatched).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </Typography>

                                            <Box sx={{ mb: 2 }}>
                                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                                    <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 900 }}>
                                                        COMPLETED {Math.round((item.progress / (item.video?.duration || 1)) * 100)}%
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                                                        {formatTime(item.progress)} / {formatTime(item.video?.duration)}
                                                    </Typography>
                                                </Stack>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(item.progress / (item.video?.duration || 1)) * 100}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 4,
                                                            background: 'linear-gradient(to right, #6366f1, #ec4899)'
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', ml: { sm: 2 } }}>
                                            <Button
                                                variant="contained"
                                                component={Link}
                                                to={`/watch/${item.video?._id}`}
                                                startIcon={<PlayIcon />}
                                                size="large"
                                                sx={{
                                                    borderRadius: 4,
                                                    px: 4,
                                                    py: 1.5,
                                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
                                                }}
                                            >
                                                Resume
                                            </Button>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))
                        ) : (
                            <Paper sx={{
                                p: 10,
                                textAlign: 'center',
                                borderRadius: 8,
                                bgcolor: alpha(theme.palette.background.paper, 0.2),
                                border: '2px dashed rgba(255,255,255,0.08)'
                            }}>
                                <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 3, opacity: 0.3 }} />
                                <Typography variant="h5" color="text.secondary" fontWeight={700} gutterBottom>
                                    No history recorded yet
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 4 }}>
                                    Start watching some videos to see them appear here!
                                </Typography>
                                <Button component={Link} to="/" variant="outlined" size="large" sx={{ px: 5, borderRadius: 4 }}>
                                    Discover Content
                                </Button>
                            </Paper>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
