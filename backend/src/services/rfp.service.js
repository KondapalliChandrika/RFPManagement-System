const RFPModel = require('../models/rfp.model');
const AIService = require('./ai.service');
const logger = require('../utils/logger');

const RFPService = {
    /**
     * Create RFP from natural language
     */
    createFromNaturalLanguage: async (naturalLanguageInput) => {
        try {
            // Parse natural language using AI
            const parsedRFP = await AIService.parseRFPFromNaturalLanguage(naturalLanguageInput);

            // Save to database
            const rfp = await RFPModel.create(parsedRFP);

            logger.success('RFP created:', rfp.id);
            return rfp;
        } catch (error) {
            logger.error('Error creating RFP:', error.message);
            throw error;
        }
    },

    /**
     * Get all RFPs
     */
    getAllRFPs: async () => {
        try {
            const rfps = await RFPModel.findAll();
            return rfps;
        } catch (error) {
            logger.error('Error fetching RFPs:', error.message);
            throw error;
        }
    },

    /**
     * Get RFP by ID
     */
    getRFPById: async (id) => {
        try {
            const rfp = await RFPModel.findById(id);
            if (!rfp) {
                throw new Error('RFP not found');
            }
            return rfp;
        } catch (error) {
            logger.error('Error fetching RFP:', error.message);
            throw error;
        }
    },

    /**
     * Update RFP status
     */
    updateStatus: async (id, status) => {
        try {
            const rfp = await RFPModel.findById(id);
            if (!rfp) {
                throw new Error('RFP not found');
            }

            const updated = await RFPModel.update(id, { ...rfp, status });
            return updated;
        } catch (error) {
            logger.error('Error updating RFP status:', error.message);
            throw error;
        }
    },

    /**
     * Add vendors to sent list
     */
    addSentVendors: async (rfpId, vendorIds) => {
        try {
            await RFPModel.addSentVendors(rfpId, vendorIds);
        } catch (error) {
            logger.error('Error adding sent vendors:', error.message);
            throw error;
        }
    },
};

module.exports = RFPService;
