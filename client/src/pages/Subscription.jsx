import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    Stack,
    Paper,
    Chip,
    Divider
} from '@mui/material';
import {
    Check as CheckIcon,
    VerifiedUser as ShieldIcon,
    Bolt as ZapIcon,
    Star as StarIcon,
    WorkspacePremium as CrownIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Subscription = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
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
            alert('Successfully subscribed! Refreshing your account...');
            await loadUser();
        } catch (err) {
            alert(err.response?.data?.message || 'Subscription failed');
        }
    };

    const getPlanIcon = (index) => {
        switch (index) {
            case 0: return <ZapIcon sx={{ fontSize: 40, color: 'text.secondary' }} />;
            case 1: return <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
            case 2: return <CrownIcon sx={{ fontSize: 40, color: 'secondary.main' }} />;
            default: return <StarIcon sx={{ fontSize: 40 }} />;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Typography variant="h2" component="h1" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                        Choose Your Plan
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
                        Unlock premium features and enjoy unlimited high-quality streaming on all your devices.
                    </Typography>
                </motion.div>
            </Box>

            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {loading ? (
                    <Box sx={{ py: 10 }}>
                        <Typography>Loading plans...</Typography>
                    </Box>
                ) : plans.map((plan, index) => {
                    const isPopular = plan.name === 'Standard';
                    return (
                        <Grid item xs={12} md={4} key={plan._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ height: '100%' }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        borderRadius: 8,
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                                        backdropFilter: 'blur(10px)',
                                        border: isPopular ? '2px solid' : '1px solid',
                                        borderColor: isPopular ? 'primary.main' : 'rgba(255,255,255,0.05)',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: isPopular
                                                ? '0 20px 40px rgba(99, 102, 241, 0.2)'
                                                : '0 20px 40px rgba(0, 0, 0, 0.3)',
                                            bgcolor: 'rgba(30, 41, 59, 0.8)',
                                        }
                                    }}
                                >
                                    {isPopular && (
                                        <Chip
                                            label="MOST POPULAR"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: -12,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                fontWeight: 800,
                                                px: 2,
                                                boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)'
                                            }}
                                        />
                                    )}

                                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                                            <Box sx={{ mb: 2 }}>{getPlanIcon(index)}</Box>
                                            <Typography variant="h4" fontWeight={800} gutterBottom>
                                                {plan.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                                                {plan.description}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                                            <Typography variant="h3" fontWeight={800} sx={{ display: 'inline' }}>
                                                ${plan.price}
                                            </Typography>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'inline' }}>
                                                /mo
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ mb: 4, opacity: 0.1 }} />

                                        <Stack spacing={2} sx={{ flexGrow: 1, mb: 4 }}>
                                            {plan.features.map(feature => (
                                                <Stack key={feature} direction="row" spacing={1.5} alignItems="center">
                                                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                                    <Typography variant="body2">{feature}</Typography>
                                                </Stack>
                                            ))}
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <ShieldIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                                <Typography variant="body2">Up to {plan.maxResolution} quality</Typography>
                                            </Stack>
                                        </Stack>

                                        <Button
                                            fullWidth
                                            variant={isPopular ? "contained" : "outlined"}
                                            size="large"
                                            disabled={currentPlanId === plan._id}
                                            onClick={() => handleSubscribe(plan._id)}
                                            sx={{
                                                py: 2,
                                                borderRadius: 4,
                                                fontWeight: 700,
                                                boxShadow: isPopular ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none'
                                            }}
                                        >
                                            {currentPlanId === plan._id ? 'Current Plan' : 'Get Started'}
                                        </Button>
                                    </CardContent>
                                </Paper>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default Subscription;
