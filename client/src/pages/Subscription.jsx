import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    Container,
    Grid,
    CardContent,
    Button,
    Stack,
    Paper,
    Chip,
    Divider,
    alpha,
    useTheme
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Security as ShieldIcon,
    ElectricBolt as ZapIcon,
    AutoAwesome as StarIcon,
    CardMembership as CrownIcon,
    SupportAgent as SupportIcon,
    Devices as DevicesIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Subscription = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const { user, loadUser } = useAuth();
    const [currentPlanId, setCurrentPlanId] = useState(null);

    useEffect(() => {
        fetchPlans();
        if (user?.subscription?.plan) {
            setCurrentPlanId(typeof user.subscription.plan === 'object' ? user.subscription.plan._id : user.subscription.plan);
        }
    }, [user]);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/subscriptions');
            setPlans(res.data.plans);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId) => {
        try {
            if (!user) return window.location.href = '/login';
            await api.post(`/subscriptions/subscribe/${planId}`);
            alert('Successfully subscribed! Enjoy your premium access.');
            await loadUser();
        } catch (err) {
            alert(err.response?.data?.message || 'Subscription failed');
        }
    };

    const getPlanIcon = (index) => {
        const sx = { fontSize: 48, filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.4))' };
        switch (index) {
            case 0: return <ZapIcon sx={{ ...sx, color: '#94a3b8' }} />;
            case 1: return <StarIcon sx={{ ...sx, color: '#6366f1' }} />;
            case 2: return <CrownIcon sx={{ ...sx, color: '#ec4899' }} />;
            default: return <StarIcon sx={sx} />;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 12 }}>
            <Box sx={{ textAlign: 'center', mb: 10, position: 'relative' }}>
                <Box sx={{
                    position: 'absolute',
                    top: '-100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    zIndex: -1
                }} />

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Typography
                        variant="h1"
                        fontWeight={900}
                        gutterBottom
                        sx={{
                            fontSize: { xs: '3rem', md: '5rem' },
                            letterSpacing: '-2px',
                            background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.6) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Premium Plans
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', fontWeight: 500, lineHeight: 1.6 }}>
                        Upgrade your entertainment experience with crystal clear resolution and exclusive original content. No hidden fees, cancel anytime.
                    </Typography>
                </motion.div>
            </Box>

            <Grid container spacing={5} justifyContent="center" alignItems="stretch">
                {loading ? (
                    <Box sx={{ py: 10, textAlign: 'center', width: '100%' }}>
                        <Typography variant="h6" color="primary">Loading plans...</Typography>
                    </Box>
                ) : plans.map((plan, index) => {
                    const isPopular = plan.name === 'Standard';
                    return (
                        <Grid item xs={12} sm={6} lg={4} key={plan._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                style={{ height: '100%' }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        height: '100%',
                                        borderRadius: 10,
                                        position: 'relative',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        bgcolor: isPopular ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 0.3),
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid',
                                        borderColor: isPopular ? alpha(theme.palette.primary.main, 0.4) : alpha(theme.palette.text.primary, 0.08),
                                        '&:hover': {
                                            transform: 'translateY(-15px)',
                                            borderColor: isPopular ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
                                            boxShadow: isPopular
                                                ? `0 30px 60px ${alpha(theme.palette.primary.main, 0.2)}`
                                                : `0 30px 60px ${alpha('#000', 0.4)}`,
                                        }
                                    }}
                                >
                                    {isPopular && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -16,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                zIndex: 10
                                            }}
                                        >
                                            <Chip
                                                label="MOST RECOMMENDED"
                                                sx={{
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                                    color: 'white',
                                                    fontWeight: 900,
                                                    fontSize: '0.75rem',
                                                    letterSpacing: 1,
                                                    px: 2,
                                                    height: 32,
                                                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)',
                                                    border: 'none'
                                                }}
                                            />
                                        </Box>
                                    )}

                                    <CardContent sx={{ p: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ mb: 6, textAlign: 'center' }}>
                                            <Box sx={{ mb: 3, display: 'inline-flex', p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.03) }}>
                                                {getPlanIcon(index)}
                                            </Box>
                                            <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: '-1px' }}>
                                                {plan.name}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ minHeight: 48, fontWeight: 500 }}>
                                                {plan.description}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 6, textAlign: 'center' }}>
                                            <Stack direction="row" justifyContent="center" alignItems="baseline" spacing={1}>
                                                <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: '-2px' }}>
                                                    ${plan.price}
                                                </Typography>
                                                <Typography variant="h5" color="text.secondary" fontWeight={500}>
                                                    /mo
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Divider sx={{ mb: 5, opacity: 0.1 }} />

                                        <Stack spacing={2.5} sx={{ flexGrow: 1, mb: 6 }}>
                                            {plan.features.map(feature => (
                                                <Stack key={feature} direction="row" spacing={2} alignItems="center">
                                                    <CheckIcon sx={{ color: 'primary.light', fontSize: 22 }} />
                                                    <Typography variant="body1" fontWeight={500}>{feature}</Typography>
                                                </Stack>
                                            ))}
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <ShieldIcon sx={{ color: 'primary.light', fontSize: 22 }} />
                                                <Typography variant="body1" fontWeight={500}>Up to {plan.maxResolution} Streaming</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <DevicesIcon sx={{ color: 'primary.light', fontSize: 22 }} />
                                                <Typography variant="body1" fontWeight={500}>Watch on Any Device</Typography>
                                            </Stack>
                                        </Stack>

                                        <Button
                                            fullWidth
                                            variant={isPopular ? "contained" : "outlined"}
                                            size="large"
                                            disabled={currentPlanId === plan._id}
                                            onClick={() => handleSubscribe(plan._id)}
                                            sx={{
                                                py: 2.2,
                                                borderRadius: 4,
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                textTransform: 'none',
                                                boxShadow: isPopular ? '0 15px 30px rgba(99, 102, 241, 0.3)' : 'none',
                                                background: isPopular ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                                                borderWidth: 2,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    background: isPopular ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : alpha(theme.palette.primary.main, 0.05),
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {currentPlanId === plan._id ? 'Active Plan' : (index === 0 ? 'Start Free Trial' : 'Upgrade Now')}
                                        </Button>
                                    </CardContent>
                                </Paper>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>

            <Box sx={{ mt: 15, textAlign: 'center' }}>
                <Stack direction="row" justifyContent="center" spacing={8} sx={{ opacity: 0.6 }}>
                    <Stack alignItems="center" spacing={1}>
                        <ShieldIcon sx={{ fontSize: 40 }} />
                        <Typography variant="caption" fontWeight={700}>SECURE PAYMENT</Typography>
                    </Stack>
                    <Stack alignItems="center" spacing={1}>
                        <SupportIcon sx={{ fontSize: 40 }} />
                        <Typography variant="caption" fontWeight={700}>24/7 SUPPORT</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    );
};

export default Subscription;
