import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Check, ShieldCheck, Zap, Star, Crown } from 'lucide-react';
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

    return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <header style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Choose Your Plan</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Select a subscription to unlock premium features and enjoy unlimited high-quality streaming on all your devices.
                </p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
                {loading ? (
                    <p>Loading plans...</p>
                ) : plans.map((plan, index) => (
                    <motion.div
                        key={plan._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass plan-card ${plan.name === 'Standard' ? 'popular' : ''}`}
                        style={{
                            width: '320px',
                            padding: '3rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            border: plan.name === 'Standard' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: plan.name === 'Standard' ? 'rgba(99, 102, 241, 0.05)' : 'var(--glass)'
                        }}
                    >
                        {plan.name === 'Standard' && (
                            <div style={{
                                position: 'absolute',
                                top: '-15px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '4px 16px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                letterSpacing: '1px'
                            }}>MOST POPULAR</div>
                        )}

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{
                                color: index === 0 ? 'var(--text-muted)' : index === 1 ? 'var(--primary)' : 'var(--secondary)',
                                marginBottom: '1rem'
                            }}>
                                {index === 0 ? <Zap size={32} /> : index === 1 ? <Star size={32} /> : <Crown size={32} />}
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', height: '40px' }}>{plan.description}</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 800 }}>${plan.price}</span>
                            <span style={{ color: 'var(--text-muted)' }}>/mo</span>
                        </div>

                        <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '3rem', flex: 1 }}>
                            {plan.features.map(feature => (
                                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '0.95rem' }}>
                                    <ShieldCheck size={18} color="var(--success)" />
                                    {feature}
                                </li>
                            ))}
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '0.95rem' }}>
                                <Check size={18} color="var(--success)" />
                                Up to {plan.maxResolution} quality
                            </li>
                        </ul>

                        <button
                            disabled={currentPlanId === plan._id}
                            onClick={() => handleSubscribe(plan._id)}
                            className={`btn ${plan.name === 'Standard' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            {currentPlanId === plan._id ? 'Current Plan' : 'Get Started'}
                        </button>
                    </motion.div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .plan-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .plan-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5);
        }
      `}} />
        </div>
    );
};

export default Subscription;
