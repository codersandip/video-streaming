import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Skeleton,
    Stack,
    useTheme
} from '@mui/material';
import {
    Search as SearchIcon,
    PlayArrow as PlayIcon,
    LocalFireDepartment as FlameIcon,
    AccessTime as ClockIcon,
    TrendingUp as TrendingIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [search, setSearch] = useState('');
    const theme = useTheme();

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

    const formatDuration = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <Container maxWidth="xl" sx={{ pb: 8 }}>
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box
                    sx={{
                        height: { xs: 'auto', md: '450px' },
                        borderRadius: 6,
                        background: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4)), url("https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        px: { xs: 4, md: 8 },
                        py: { xs: 8, md: 0 },
                        mb: 6,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'secondary.main', mb: 2 }}>
                            <FlameIcon fontSize="small" />
                            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                                TRENDING THIS WEEK
                            </Typography>
                        </Stack>
                        <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                            Unleash the Power of <Box component="span" sx={{ color: 'primary.main' }}>Self-Hosted</Box> Streaming
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, fontWeight: 400, maxWidth: '500px' }}>
                            Experience lightning fast playback with HLS technology. No third-party tracking, no limits.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PlayIcon />}
                                component={Link}
                                to={videos[0] ? `/watch/${videos[0]._id}` : '#'}
                                sx={{ px: 4, py: 1.5 }}
                            >
                                Watch Now
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<AddIcon />}
                                sx={{ px: 4, py: 1.5, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            >
                                Add to List
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </motion.div>

            {/* Filter & Search */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', md: 'center' }}
                spacing={3}
                sx={{ mb: 6 }}
            >
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                    {genres.map(genre => (
                        <Chip
                            key={genre}
                            label={genre.toUpperCase()}
                            onClick={() => setSelectedGenre(genre)}
                            color={selectedGenre === genre ? "primary" : "default"}
                            variant={selectedGenre === genre ? "filled" : "outlined"}
                            sx={{
                                px: 1,
                                fontWeight: 700,
                                py: 2,
                                borderRadius: 2,
                                background: selectedGenre === genre ? undefined : 'rgba(255,255,255,0.05)',
                                borderColor: selectedGenre === genre ? undefined : 'rgba(255,255,255,0.1)'
                            }}
                        />
                    ))}
                </Box>

                <TextField
                    placeholder="Search videos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    variant="outlined"
                    size="small"
                    sx={{ width: { xs: '100%', md: '350px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: 3,
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                        }
                    }}
                />
            </Stack>

            {/* Video Grid */}
            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(8)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Box sx={{ borderRadius: 4, overflow: 'hidden' }}>
                                <Skeleton variant="rectangular" height={180} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                <Box sx={{ pt: 2 }}>
                                    <Skeleton width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                    <Skeleton width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                </Box>
                            </Box>
                        </Grid>
                    ))
                ) : videos.length > 0 ? (
                    videos.map((video, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    component={Link}
                                    to={`/watch/${video._id}`}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                                            '& .card-media': { transform: 'scale(1.1)' }
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
                                        <CardMedia
                                            className="card-media"
                                            component="img"
                                            image={video.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${video.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                            alt={video.title}
                                            sx={{ transition: 'transform 0.5s ease', objectFit: 'cover', height: '100%' }}
                                        />
                                        {video.requiresSubscription && (
                                            <Chip
                                                label="PREMIUM"
                                                size="small"
                                                color="secondary"
                                                sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 800, fontSize: '0.65rem' }}
                                            />
                                        )}
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.8)',
                                            color: 'white',
                                            px: 1,
                                            borderRadius: 1,
                                            fontSize: '0.75rem'
                                        }}>
                                            {formatDuration(video.duration)}
                                        </Box>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                        <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {video.title}
                                        </Typography>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ClockIcon sx={{ fontSize: 14 }} /> {new Date(video.createdAt).toLocaleDateString()}
                                            </Typography>
                                            <TrendingIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h5" color="text.secondary">No videos found matching your criteria.</Typography>
                            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSelectedGenre('all')}>Reset Filters</Button>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Home;
