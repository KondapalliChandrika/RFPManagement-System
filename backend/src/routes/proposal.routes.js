const express = require('express');
const router = express.Router();
const ProposalController = require('../controllers/proposal.controller');

// Get proposals for an RFP
router.get('/rfp/:rfpId', ProposalController.getProposalsByRfp);

// Manually trigger email check
router.post('/check', ProposalController.checkEmails);

// Compare proposals for an RFP
router.get('/:rfpId/compare', ProposalController.compareProposals);

module.exports = router;
