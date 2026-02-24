import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import {
    Box,
    Typography,
    Container,
    Grid,
    Avatar,
    Button,
    Divider,
    Stack,
    Paper,
    Chip,
    IconButton,
    alpha,
    useTheme,
    Tooltip
} from '@mui/material';
import {
    Visibility as EyeIcon,
    Today as CalendarIcon,
    ThumbUpOutlined as LikeIcon,
    Share as ShareIcon,
    PlaylistAdd as SaveIcon,
    Verified as VerifiedIcon,
    ArrowBack as BackIcon,
    PlaylistPlay as PlaylistIcon
} from '@mui/icons-material';

const Watch = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const theme = useTheme();
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

            // Fetch recommendations
            const recRes = await api.get('/videos', { params: { limit: 12 } });
            setRecommendations(recRes.data.videos.filter(v => v._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Error loading video');
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (progress) => {
        try {
            await api.post(`/users/watch-history/${id}`, { progress });
        } catch (err) {
            console.warn('Silent: Progress update failed');
        }
    };

    const formatDuration = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return (
        <Container maxWidth="xl" sx={{ py: 10 }}>
            <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: alpha('#fff', 0.05), borderRadius: 6 }} />
            <Box sx={{ mt: 4 }}>
                <Box sx={{ height: 40, width: '60%', bgcolor: alpha('#fff', 0.05), borderRadius: 2, mb: 2 }} />
                <Box sx={{ height: 20, width: '30%', bgcolor: alpha('#fff', 0.05), borderRadius: 1 }} />
            </Box>
        </Container>
    );

    if (error) return (
        <Container sx={{ py: 15, textAlign: 'center' }}>
            <Typography variant="h3" color="error" fontWeight={900} gutterBottom>
                Access Denied
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}>
                {error}
            </Typography>
            <Button
                variant="contained"
                component={Link}
                to="/subscriptions"
                size="large"
                sx={{ px: 6, py: 2, borderRadius: 4, fontWeight: 800 }}
            >
                View Premium Plans
            </Button>
        </Container>
    );

    const streamUrl = `http://localhost:5000/api/stream/${id}/index.m3u8`;
    const watchHistoryItem = user?.watchHistory?.find(h => h.video?._id === id || h.video === id);
    const initialTime = watchHistoryItem?.progress || 0;

    return (
        <Box sx={{ minHeight: '100vh', pb: 10 }}>
            {/* Cinematic Player Environment */}
            <Box sx={{ bgcolor: '#000', width: '100%', pt: { xs: 0, md: 4 }, pb: { xs: 0, md: 6 } }}>
                <Container maxWidth="xl">
                    <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                        <Button
                            component={Link}
                            to="/"
                            startIcon={<BackIcon />}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'white' } }}
                        >
                            Explore Catalog
                        </Button>
                    </Stack>

                    <Box sx={{
                        borderRadius: { xs: 0, md: 6 },
                        overflow: 'hidden',
                        bgcolor: '#000',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                        border: { xs: 'none', md: `1px solid ${alpha('#fff', 0.1)}` },
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <VideoPlayer
                            src={streamUrl}
                            poster={video.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${video.thumbnail.split('/').pop()}` : null}
                            startTime={initialTime}
                            onProgress={updateProgress}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 6 }}>
                <Grid container spacing={6}>
                    {/* Main Content Area */}
                    <Grid item xs={12} lg={8.2}>
                        <Box>
                            <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                                <Chip
                                    label={video.genre.toUpperCase()}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.light',
                                        fontWeight: 800,
                                        borderRadius: 2
                                    }}
                                />
                                {video.requiresSubscription && (
                                    <Chip
                                        label="PREMIUM"
                                        color="secondary"
                                        sx={{ fontWeight: 800, borderRadius: 2 }}
                                    />
                                )}
                            </Stack>

                            <Typography variant="h3" component="h1" fontWeight={900} sx={{ mb: 3, letterSpacing: '-1px' }}>
                                {video.title}
                            </Typography>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="space-between"
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={3}
                                sx={{ pb: 4, mb: 4, borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}` }}
                            >
                                <Stack direction="row" spacing={4} color="text.secondary">
                                    <Stack direction="row" spacing={1.2} alignItems="center">
                                        <EyeIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="body1" fontWeight={600}>
                                            {video.views?.toLocaleString() || 0} plays
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1.2} alignItems="center">
                                        <CalendarIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="body1" fontWeight={600}>
                                            {new Date(video.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Stack direction="row" spacing={1.5}>
                                    <Tooltip title="Like">
                                        <IconButton sx={{ bgcolor: alpha('#fff', 0.03), border: `1px solid ${alpha('#fff', 0.08)}`, p: 1.5 }}>
                                            <LikeIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Share">
                                        <IconButton sx={{ bgcolor: alpha('#fff', 0.03), border: `1px solid ${alpha('#fff', 0.08)}`, p: 1.5 }}>
                                            <ShareIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Save to Library">
                                        <IconButton sx={{ bgcolor: alpha('#fff', 0.03), border: `1px solid ${alpha('#fff', 0.08)}`, p: 1.5 }}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>

                            {/* Creator Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 6,
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    border: `1px solid ${alpha(theme.palette.text.primary, 0.05)}`,
                                    mb: 5
                                }}
                            >
                                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                                    <Avatar
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                                            fontSize: '1.5rem',
                                            fontWeight: 800
                                        }}
                                    >
                                        {(video.createdBy?.name || 'A').charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="h6" fontWeight={800}>
                                                {video.createdBy?.name || 'StreamVault Official'}
                                            </Typography>
                                            <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            Verified Publisher • 12,490 active viewers
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1.2,
                                            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
                                        }}
                                    >
                                        Follow Creator
                                    </Button>
                                </Stack>

                                <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 400 }}>
                                    {video.description || "Indulge in a cinematic journey with this latest release. Our high-bitrate streaming ensures you don't miss a single detail in 4K resolution."}
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Sidebar Area */}
                    <Grid item xs={12} lg={3.8}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                            <PlaylistIcon color="primary" />
                            <Typography variant="h5" fontWeight={900}>Recommendations</Typography>
                        </Stack>

                        <Stack spacing={3}>
                            {recommendations.map(rec => (
                                <Box
                                    key={rec._id}
                                    component={Link}
                                    to={`/watch/${rec._id}`}
                                    sx={{
                                        display: 'flex',
                                        gap: 2.5,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        p: 1.5,
                                        borderRadius: 4,
                                        transition: 'all 0.3s ease',
                                        border: '1px solid transparent',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.background.paper, 0.6),
                                            borderColor: alpha(theme.palette.primary.main, 0.1),
                                            transform: 'translateX(4px)',
                                            '& .rec-play': { opacity: 1 }
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        width: 180,
                                        flexShrink: 0,
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        aspectRatio: '16/9',
                                        position: 'relative',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                                    }}>
                                        <Box
                                            component="img"
                                            src={rec.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${rec.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                            alt={rec.title}
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.8)',
                                            backdropFilter: 'blur(4px)',
                                            color: 'white',
                                            px: 1,
                                            py: 0.2,
                                            borderRadius: 1,
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {formatDuration(rec.duration)}
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 0.5 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={800}
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                lineHeight: 1.25,
                                                mb: 1,
                                                color: 'white'
                                            }}
                                        >
                                            {rec.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, mb: 0.5, textTransform: 'uppercase' }}>
                                            {rec.genre}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            {rec.views?.toLocaleString() || 0} views • {new Date(rec.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Watch;
