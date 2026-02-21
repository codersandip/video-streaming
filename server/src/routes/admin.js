const express = require('express');
const router = express.Router();
const { getStats, getUsers, toggleUserStatus, setUserSubscription, getAnalytics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id/subscription', setUserSubscription);
router.get('/analytics', getAnalytics);

module.exports = router;
