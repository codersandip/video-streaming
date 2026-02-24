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
    IconButton
} from '@mui/material';
import {
    Visibility as EyeIcon,
    Today as CalendarIcon,
    ThumbUpOffAlt as LikeIcon,
    Share as ShareIcon,
    PlaylistAdd as SaveIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';

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
            const recRes = await api.get('/videos', { params: { limit: 10 } });
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

    const formatDuration = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <Typography variant="h6">Loading content...</Typography>
        </Box>
    );

    if (error) return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h4" color="error" gutterBottom fontWeight={700}>
                Access Restricted
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {error}
            </Typography>
            <Button variant="contained" component={Link} to="/subscriptions" size="large">
                Upgrade Your Plan
            </Button>
        </Container>
    );

    const streamUrl = `http://localhost:5000/api/stream/${id}/index.m3u8`;
    const initialTime = user?.watchHistory?.find(h => h.video === id)?.progress || 0;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Main Content */}
                <Grid item xs={12} lg={8.5}>
                    <Box sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'black', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        <VideoPlayer
                            src={streamUrl}
                            poster={video.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${video.thumbnail.split('/').pop()}` : null}
                            startTime={initialTime}
                            onProgress={updateProgress}
                        />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            {video.tags.map(tag => (
                                <Typography key={tag} variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase' }}>
                                    #{tag}
                                </Typography>
                            ))}
                        </Stack>
                        <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
                            {video.title}
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={2}
                            sx={{ pb: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <Stack direction="row" spacing={3} color="text.secondary">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <EyeIcon fontSize="small" />
                                    <Typography variant="body2">{video.views.toLocaleString()} views</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarIcon fontSize="small" />
                                    <Typography variant="body2">{new Date(video.createdAt).toLocaleDateString()}</Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" startIcon={<LikeIcon />} size="small">Like</Button>
                                <Button variant="outlined" startIcon={<ShareIcon />} size="small">Share</Button>
                                <Button variant="outlined" startIcon={<SaveIcon />} size="small">Save</Button>
                            </Stack>
                        </Stack>

                        <Paper
                            elevation={0}
                            sx={{
                                mt: 4,
                                p: 3,
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Avatar
                                    sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                                    alt={video.createdBy?.name || 'Admin'}
                                >
                                    {(video.createdBy?.name || 'A').charAt(0)}
                                </Avatar>
                                <Box>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {video.createdBy?.name || 'Admin'}
                                        </Typography>
                                        <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        Verified Creator • 12K Subscribers
                                    </Typography>
                                </Box>
                                <Button variant="contained" color="primary" size="small" sx={{ ml: 'auto', px: 3 }}>
                                    Subscribe
                                </Button>
                            </Stack>
                            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                {video.description}
                            </Typography>
                        </Paper>
                    </Box>
                </Grid>

                {/* Recommendations */}
                <Grid item xs={12} lg={3.5}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Up Next</Typography>
                    <Stack spacing={2}>
                        {recommendations.map(rec => (
                            <Box
                                key={rec._id}
                                component={Link}
                                to={`/watch/${rec._id}`}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    '&:hover .rec-thumb': { transform: 'scale(1.05)' }
                                }}
                            >
                                <Box sx={{ width: 160, flexShrink: 0, borderRadius: 2, overflow: 'hidden', height: 90, position: 'relative' }}>
                                    <Box
                                        component="img"
                                        className="rec-thumb"
                                        src={rec.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${rec.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                        alt={rec.title}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 4,
                                        right: 4,
                                        bgcolor: 'rgba(0,0,0,0.8)',
                                        color: 'white',
                                        px: 0.5,
                                        borderRadius: 0.5,
                                        fontSize: '0.65rem'
                                    }}>
                                        {formatDuration(rec.duration)}
                                    </Box>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.2,
                                            mb: 0.5
                                        }}
                                    >
                                        {rec.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {rec.createdBy?.name || 'Admin'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {rec.views.toLocaleString()} views
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Watch;
