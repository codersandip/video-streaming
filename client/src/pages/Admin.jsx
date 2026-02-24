import { useState, useRef } from 'react';
import api from '../api/axios';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Tabs,
    Tab,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    Alert,
    Stack,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    VideoFile as FileVideoIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    BarChart as DashboardIcon,
    People as UsersIcon,
    Movie as FilmIcon,
    Settings as SettingsIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Admin = () => {
    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: '-2px', mb: 1 }}>
                    Admin <Box component="span" sx={{ color: 'primary.main' }}>Dashboard</Box>
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight={500}>
                    Manage your content, monitor uploads, and control user access.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={3.5} lg={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 6,
                            bgcolor: alpha(theme.palette.background.paper, 0.4),
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                            position: 'sticky',
                            top: 100
                        }}
                    >
                        <List component="nav" sx={{ p: 1 }}>
                            <AdminMenuItem
                                active={activeTab === 0}
                                onClick={() => setActiveTab(0)}
                                icon={<DashboardIcon />}
                                label="Overview"
                            />
                            <AdminMenuItem
                                active={activeTab === 1}
                                onClick={() => setActiveTab(1)}
                                icon={<UploadIcon />}
                                label="Upload Stream"
                            />
                            <Divider sx={{ my: 2, opacity: 0.1 }} />
                            <AdminMenuItem
                                active={activeTab === 2}
                                onClick={() => setActiveTab(2)}
                                icon={<FilmIcon />}
                                label="Library"
                            />
                            <AdminMenuItem
                                active={activeTab === 3}
                                onClick={() => setActiveTab(3)}
                                icon={<UsersIcon />}
                                label="Members"
                            />
                            <AdminMenuItem
                                active={activeTab === 4}
                                onClick={() => setActiveTab(4)}
                                icon={<SettingsIcon />}
                                label="System"
                            />
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8.5} lg={9}>
                    <Box component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {activeTab === 1 && <UploadView />}
                        {activeTab === 0 && (
                            <Paper sx={{
                                p: 10,
                                borderRadius: 8,
                                textAlign: 'center',
                                bgcolor: alpha(theme.palette.background.paper, 0.4),
                                border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`
                            }}>
                                <DashboardIcon sx={{ fontSize: 80, color: alpha(theme.palette.text.secondary, 0.3), mb: 3 }} />
                                <Typography variant="h4" fontWeight={800} gutterBottom>Insights Coming Soon</Typography>
                                <Typography variant="body1" color="text.secondary">We're building a powerful analytics engine to help you track performance.</Typography>
                            </Paper>
                        )}
                        {activeTab !== 0 && activeTab !== 1 && (
                            <Paper sx={{
                                p: 10,
                                borderRadius: 8,
                                textAlign: 'center',
                                bgcolor: alpha(theme.palette.background.paper, 0.4),
                                border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`
                            }}>
                                <Typography variant="h4" fontWeight={800} gutterBottom>Under Construction</Typography>
                                <Typography variant="body1" color="text.secondary">This section is currently being developed for the ultimate admin experience.</Typography>
                            </Paper>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

const AdminMenuItem = ({ active, onClick, icon, label }) => {
    const theme = useTheme();
    return (
        <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 3,
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: active ? 'primary.main' : 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: active ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.text.primary, 0.05),
                        color: active ? 'primary.main' : 'text.primary',
                        transform: 'translateX(4px)'
                    }
                }}
            >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 42 }}>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontWeight: active ? 800 : 600, fontSize: '0.95rem' }} />
                {active && (
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', ml: 1 }} />
                )}
            </ListItemButton>
        </ListItem>
    );
};

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
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                bgcolor: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 4 }}>
                Upload New Video
            </Typography>

            {status === 'success' && (
                <Alert
                    severity="success"
                    icon={<SuccessIcon />}
                    sx={{ mb: 4, borderRadius: 2 }}
                    action={
                        <IconButton size="small" onClick={() => setStatus('idle')}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    Upload complete! Video is now being processed into HLS format.
                </Alert>
            )}

            {status === 'error' && (
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    sx={{ mb: 4, borderRadius: 2 }}
                    action={
                        <Button color="inherit" size="small" onClick={() => setStatus('idle')}>
                            RETRY
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            <form onSubmit={handleUpload}>
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                        <Box
                            onClick={() => fileInputRef.current.click()}
                            sx={{
                                border: '2px dashed rgba(255,255,255,0.1)',
                                borderRadius: 4,
                                p: 6,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                bgcolor: file ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'rgba(99, 102, 241, 0.02)'
                                }
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                setFile(e.dataTransfer.files[0]);
                            }}
                        >
                            <input type="file" ref={fileInputRef} hidden onChange={(e) => setFile(e.target.files[0])} accept="video/*" />
                            {file ? (
                                <Stack alignItems="center" spacing={2}>
                                    <FileVideoIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700}>{file.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </Typography>
                                    </Box>
                                </Stack>
                            ) : (
                                <Stack alignItems="center" spacing={2} color="text.secondary">
                                    <UploadIcon sx={{ fontSize: 60 }} />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                            Click or drag video to upload
                                        </Typography>
                                        <Typography variant="caption">
                                            MP4, MKV, MOV (Max 5GB)
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Box>

                        <FormControl fullWidth sx={{ mt: 3 }}>
                            <InputLabel>Genre</InputLabel>
                            <Select
                                value={formData.genre}
                                label="Genre"
                                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                            >
                                <MenuItem value="Movies">Movies</MenuItem>
                                <MenuItem value="TV Shows">TV Shows</MenuItem>
                                <MenuItem value="Documentaries">Documentaries</MenuItem>
                                <MenuItem value="Animation">Animation</MenuItem>
                                <MenuItem value="Education">Education</MenuItem>
                                <MenuItem value="Music">Music</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Video Title"
                                placeholder="Enter a catchy title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                placeholder="What is this video about?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />

                            <Stack direction="row" spacing={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Visibility</InputLabel>
                                    <Select
                                        value={formData.isPublic}
                                        label="Visibility"
                                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.value })}
                                    >
                                        <MenuItem value="true">Public</MenuItem>
                                        <MenuItem value="false">Private</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Subscription</InputLabel>
                                    <Select
                                        value={formData.requiresSubscription}
                                        label="Subscription"
                                        onChange={(e) => setFormData({ ...formData, requiresSubscription: e.target.value })}
                                    >
                                        <MenuItem value="true">Premium Only</MenuItem>
                                        <MenuItem value="false">Free Access</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>

                            <Box sx={{ pt: 2 }}>
                                {status === 'uploading' ? (
                                    <Stack spacing={1}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" fontWeight={600}>Uploading...</Typography>
                                            <Typography variant="body2" fontWeight={700}>{progress}%</Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Stack>
                                ) : (
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        disabled={!file}
                                        sx={{ py: 1.8, fontSize: '1rem' }}
                                    >
                                        Start Processing
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default Admin;
