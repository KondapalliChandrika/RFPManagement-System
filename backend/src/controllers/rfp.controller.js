const RFPService = require('../services/rfp.service');
const VendorService = require('../services/vendor.service');
const EmailService = require('../services/email.service');
const response = require('../utils/response');
const logger = require('../utils/logger');

const RFPController = {
    /**
     * Create RFP from natural language
     */
    createRFP: async (req, res, next) => {
        try {
            const { naturalLanguageInput } = req.body;

            const rfp = await RFPService.createFromNaturalLanguage(naturalLanguageInput);

            return response.success(res, rfp, 'RFP created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get all RFPs
     */
    getAllRFPs: async (req, res, next) => {
        try {
            const rfps = await RFPService.getAllRFPs();

            return response.success(res, rfps, 'RFPs fetched successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get RFP by ID
     */
    getRFPById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const rfp = await RFPService.getRFPById(id);

            return response.success(res, rfp, 'RFP fetched successfully');
        } catch (error) {
            if (error.message === 'RFP not found') {
                return response.notFound(res, error.message);
            }
            next(error);
        }
    },

    /**
     * Send RFP to vendors
     */
    sendRFP: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { vendorIds } = req.body;

            // Get RFP
            const rfp = await RFPService.getRFPById(id);

            // Get vendors
            const vendors = await VendorService.getVendorsByIds(vendorIds);

            if (vendors.length === 0) {
                return response.error(res, 'No valid vendors found', 400);
            }

            // Send emails
            const result = await EmailService.sendRFP(rfp, vendors);

            // Record sent vendors
            await RFPService.addSentVendors(id, vendors.map(v => v.id));

            // Update RFP status to 'sent'
            await RFPService.updateStatus(id, 'sent');

            return response.success(res, result, `RFP sent to ${result.count} vendors successfully`);
        } catch (error) {
            if (error.message === 'RFP not found') {
                return response.notFound(res, error.message);
            }
            next(error);
        }
    },
};

module.exports = RFPController;
