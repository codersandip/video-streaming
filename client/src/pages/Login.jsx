import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    Container,
    TextField,
    Button,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Mail as MailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Login as LoginIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%' }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            width: '100%',
                            borderRadius: 6,
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(30, 41, 59, 0.5)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" gutterBottom fontWeight={800}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Login to access your library
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    variant="outlined"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={loading}
                                    sx={{ py: 1.5, mt: 2 }}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </Stack>
                        </form>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                                    Register here
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Box>
        </Container>
    );
};

export default Login;
