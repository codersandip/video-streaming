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
    Stack,
    alpha,
    useTheme
} from '@mui/material';
import {
    Mail as MailIcon,
    Lock as LockIcon,
    Person as UserIcon,
    Visibility,
    VisibilityOff,
    PersonAdd as RegisterIcon,
    PlayCircleOutline as LogoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '95vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 6,
                    position: 'relative'
                }}
            >
                {/* Background Glow */}
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
                    zIndex: -1,
                    filter: 'blur(60px)'
                }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%' }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 8 },
                            width: '100%',
                            borderRadius: 10,
                            textAlign: 'center',
                            border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                            background: alpha(theme.palette.background.paper, 0.4),
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
                        }}
                    >
                        <Box sx={{ mb: 6 }}>
                            <Box sx={{
                                display: 'inline-flex',
                                p: 1.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #ec4899 0%, #6366f1 100%)',
                                mb: 3,
                                boxShadow: '0 8px 16px rgba(236, 72, 153, 0.3)'
                            }}>
                                <LogoIcon sx={{ color: 'white', fontSize: 40 }} />
                            </Box>
                            <Typography variant="h3" gutterBottom fontWeight={900} sx={{ letterSpacing: '-1px' }}>
                                Register
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Start your cinematic adventure today
                            </Typography>
                        </Box>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 4,
                                        borderRadius: 4,
                                        fontWeight: 600,
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                                    }}
                                >
                                    {error}
                                </Alert>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3.5}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    type="text"
                                    variant="outlined"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <UserIcon sx={{ color: 'secondary.light', mr: 1 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 4,
                                            bgcolor: alpha('#fff', 0.02)
                                        }
                                    }}
                                />

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
                                                <MailIcon sx={{ color: 'secondary.light', mr: 1 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 4,
                                            bgcolor: alpha('#fff', 0.02)
                                        }
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
                                    inputProps={{ minLength: 6 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: 'secondary.light', mr: 1 }} />
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 4,
                                            bgcolor: alpha('#fff', 0.02)
                                        }
                                    }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={loading}
                                    sx={{
                                        py: 2,
                                        mt: 2,
                                        borderRadius: 4,
                                        fontSize: '1.1rem',
                                        fontWeight: 800,
                                        boxShadow: '0 12px 24px rgba(236, 72, 153, 0.2)',
                                        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                                        }
                                    }}
                                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <RegisterIcon />}
                                >
                                    {loading ? 'Processing...' : 'Create Account'}
                                </Button>
                            </Stack>
                        </form>

                        <Box sx={{ mt: 6 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Member already?{' '}
                                <Link to="/login" style={{
                                    color: theme.palette.secondary.main,
                                    textDecoration: 'none',
                                    fontWeight: 800,
                                    marginLeft: '4px'
                                }}>
                                    Sign In here
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Box>
        </Container>
    );
};

export default Register;
