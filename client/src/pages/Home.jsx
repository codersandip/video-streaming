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
    useTheme,
    alpha
} from '@mui/material';
import {
    Search as SearchIcon,
    PlayArrow as PlayIcon,
    LocalFireDepartment as FlameIcon,
    AccessTime as ClockIcon,
    TrendingUp as TrendingIcon,
    Add as AddIcon,
    InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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
        <Box sx={{ minHeight: '100vh', pb: 10 }}>
            {/* Cinematic Hero */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '60vh', md: '75vh' },
                    width: '100%',
                    mb: 8,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {/* Hero Background Image with Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `linear-gradient(to right, ${theme.palette.background.default} 10%, rgba(2, 6, 23, 0.4) 50%, ${theme.palette.background.default} 90%), linear-gradient(to top, ${theme.palette.background.default} 0%, transparent 40%), url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 1
                    }}
                />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Stack spacing={3} sx={{ maxWidth: '800px' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ bgcolor: 'secondary.main', p: 0.5, borderRadius: 1.5, display: 'flex' }}>
                                    <FlameIcon sx={{ color: 'white', fontSize: 20 }} />
                                </Box>
                                <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 3, color: 'secondary.light' }}>
                                    EXCLUSIVE PREMIERE
                                </Typography>
                            </Stack>

                            <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '5rem' }, color: 'white', lineHeight: 1 }}>
                                The Future of <br />
                                <Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 900
                                }}>
                                    Cloud Streaming
                                </Box>
                            </Typography>

                            <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: '600px', lineHeight: 1.6 }}>
                                High-bitrate 4K streaming powered by HLS. Experience your media library like never before with StreamVault's premium adaptive engine.
                            </Typography>

                            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PlayIcon sx={{ fontSize: 28 }} />}
                                    component={Link}
                                    to={videos[0] ? `/watch/${videos[0]._id}` : '#'}
                                    sx={{
                                        px: 5,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        borderRadius: 4,
                                        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
                                    }}
                                >
                                    Start Watching
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<InfoIcon />}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        borderRadius: 4,
                                        backdropFilter: 'blur(10px)',
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                >
                                    Learn More
                                </Button>
                            </Stack>
                        </Stack>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="xl">
                {/* Navigation & Search Bar */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    spacing={4}
                    sx={{ mb: 6 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            overflowX: 'auto',
                            pb: 2,
                            '::-webkit-scrollbar': { display: 'none' }
                        }}
                    >
                        {genres.map(genre => (
                            <Chip
                                key={genre}
                                label={genre.toUpperCase()}
                                onClick={() => setSelectedGenre(genre)}
                                sx={{
                                    px: 2,
                                    py: 2.5,
                                    fontWeight: 800,
                                    borderRadius: 3,
                                    bgcolor: selectedGenre === genre
                                        ? 'primary.main'
                                        : alpha(theme.palette.text.primary, 0.05),
                                    color: selectedGenre === genre ? 'white' : 'text.secondary',
                                    border: '1px solid',
                                    borderColor: selectedGenre === genre
                                        ? 'primary.main'
                                        : alpha(theme.palette.text.primary, 0.1),
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: selectedGenre === genre ? 'primary.dark' : alpha(theme.palette.text.primary, 0.1),
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            />
                        ))}
                    </Box>

                    <TextField
                        placeholder="Search your library..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        variant="outlined"
                        sx={{ width: { xs: '100%', md: '400px' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 4,
                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                '& fieldset': { borderColor: alpha(theme.palette.text.primary, 0.1) },
                                '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.5) },
                                '&.Mui-focused fieldset': { borderWidth: '2px' }
                            }
                        }}
                    />
                </Stack>

                {/* Content Sections */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                        <TrendingIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={800}>
                            {selectedGenre === 'all' ? 'Featured Content' : `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Highlights`}
                        </Typography>
                    </Stack>

                    <Grid container spacing={4}>
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                Array.from(new Array(8)).map((_, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                                        <Box sx={{ borderRadius: 6, overflow: 'hidden' }}>
                                            <Skeleton variant="rectangular" height={200} sx={{ bgcolor: alpha('#fff', 0.05) }} />
                                            <Box sx={{ pt: 2 }}>
                                                <Skeleton width="90%" height={30} sx={{ bgcolor: alpha('#fff', 0.05) }} />
                                                <Skeleton width="60%" height={20} sx={{ bgcolor: alpha('#fff', 0.05) }} />
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))
                            ) : videos.length > 0 ? (
                                videos.map((video, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
                                        >
                                            <Card
                                                component={Link}
                                                to={`/watch/${video._id}`}
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    textDecoration: 'none',
                                                    position: 'relative',
                                                    bgcolor: alpha(theme.palette.background.paper, 0.4),
                                                    border: `1px solid ${alpha(theme.palette.text.primary, 0.05)}`,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                                                        borderColor: alpha(theme.palette.primary.main, 0.3)
                                                    }
                                                }}
                                            >
                                                <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={video.thumbnail ? `http://localhost:5000/api/stream/thumbnail/${video.thumbnail.split('/').pop()}` : 'https://placehold.co/600x400/1e293b/f8fafc?text=Video'}
                                                        alt={video.title}
                                                        sx={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', objectFit: 'cover' }}
                                                        className="card-media"
                                                    />

                                                    {video.requiresSubscription && (
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            p: 2,
                                                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, transparent 100%)',
                                                            color: 'white',
                                                            zIndex: 2
                                                        }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 1.5 }}>PREMIUM</Typography>
                                                        </Box>
                                                    )}

                                                    <Box sx={{
                                                        position: 'absolute',
                                                        bottom: 12,
                                                        right: 12,
                                                        bgcolor: 'rgba(0,0,0,0.7)',
                                                        backdropFilter: 'blur(4px)',
                                                        color: 'white',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: 2,
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        zIndex: 2,
                                                        border: '1px solid rgba(255,255,255,0.1)'
                                                    }}>
                                                        {formatDuration(video.duration)}
                                                    </Box>

                                                    {/* Play Overlay */}
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        bgcolor: 'rgba(99, 102, 241, 0.2)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s ease',
                                                        zIndex: 1,
                                                        '.MuiCard-root:hover &': { opacity: 1 }
                                                    }}>
                                                        <Box sx={{
                                                            bgcolor: 'primary.main',
                                                            p: 1.5,
                                                            borderRadius: '50%',
                                                            boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5)',
                                                            transform: 'scale(0.8)',
                                                            transition: 'transform 0.3s ease',
                                                            '.MuiCard-root:hover &': { transform: 'scale(1)' }
                                                        }}>
                                                            <PlayIcon sx={{ color: 'white', fontSize: 32 }} />
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <CardContent sx={{ flexGrow: 1, pt: 3, px: 3, pb: 2 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 800,
                                                            mb: 1.5,
                                                            lineHeight: 1.3,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {video.title}
                                                    </Typography>

                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <ClockIcon sx={{ fontSize: 16 }} /> {new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </Typography>
                                                        <Chip
                                                            label={video.genre}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.65rem',
                                                                fontWeight: 800,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: 'primary.light'
                                                            }}
                                                        />
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Box sx={{ textAlign: 'center', py: 15, bgcolor: alpha(theme.palette.background.paper, 0.3), borderRadius: 8, border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <Typography variant="h5" color="text.secondary" fontWeight={700}>Oops! No videos match your current selection.</Typography>
                                        <Button variant="outlined" sx={{ mt: 3, px: 4 }} onClick={() => setSelectedGenre('all')}>Clear All Filters</Button>
                                    </Box>
                                </Grid>
                            )}
                        </AnimatePresence>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;
