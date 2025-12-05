const express = require('express');
const router = express.Router();

const rfpRoutes = require('./rfp.routes');
const vendorRoutes = require('./vendor.routes');
const proposalRoutes = require('./proposal.routes');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'RFP Management API is running' });
});

// Mount routes
router.use('/rfps', rfpRoutes);
router.use('/vendors', vendorRoutes);
router.use('/proposals', proposalRoutes);

module.exports = router;
