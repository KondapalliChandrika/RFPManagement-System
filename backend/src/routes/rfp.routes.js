const express = require('express');
const router = express.Router();
const RFPController = require('../controllers/rfp.controller');
const { validate } = require('../middlewares/validation.middleware');
const { createRFPSchema, sendRFPSchema } = require('../validations/rfp.validation');

// Create RFP from natural language
router.post('/create', validate(createRFPSchema), RFPController.createRFP);

// Get all RFPs
router.get('/', RFPController.getAllRFPs);

// Get RFP by ID
router.get('/:id', RFPController.getRFPById);

// Send RFP to vendors
router.post('/:id/send', validate(sendRFPSchema), RFPController.sendRFP);

module.exports = router;
