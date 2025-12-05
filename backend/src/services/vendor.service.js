const VendorModel = require('../models/vendor.model');
const logger = require('../utils/logger');

const VendorService = {
    /**
     * Create new vendor
     */
    createVendor: async (vendorData) => {
        try {
            // Check if vendor with email already exists
            const existing = await VendorModel.findByEmail(vendorData.email);
            if (existing) {
                throw new Error('Vendor with this email already exists');
            }

            const vendor = await VendorModel.create(vendorData);
            logger.success('Vendor created:', vendor.id);
            return vendor;
        } catch (error) {
            logger.error('Error creating vendor:', error.message);
            throw error;
        }
    },

    /**
     * Get all vendors
     */
    getAllVendors: async () => {
        try {
            const vendors = await VendorModel.findAll();
            return vendors;
        } catch (error) {
            logger.error('Error fetching vendors:', error.message);
            throw error;
        }
    },

    /**
     * Get vendor by ID
     */
    getVendorById: async (id) => {
        try {
            const vendor = await VendorModel.findById(id);
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            return vendor;
        } catch (error) {
            logger.error('Error fetching vendor:', error.message);
            throw error;
        }
    },

    /**
     * Update vendor
     */
    updateVendor: async (id, vendorData) => {
        try {
            const vendor = await VendorModel.findById(id);
            if (!vendor) {
                throw new Error('Vendor not found');
            }

            // Check email uniqueness if email is being updated
            if (vendorData.email && vendorData.email !== vendor.email) {
                const existing = await VendorModel.findByEmail(vendorData.email);
                if (existing) {
                    throw new Error('Another vendor with this email already exists');
                }
            }

            const updated = await VendorModel.update(id, { ...vendor, ...vendorData });
            logger.success('Vendor updated:', id);
            return updated;
        } catch (error) {
            logger.error('Error updating vendor:', error.message);
            throw error;
        }
    },

    /**
     * Delete vendor
     */
    deleteVendor: async (id) => {
        try {
            const vendor = await VendorModel.delete(id);
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            logger.success('Vendor deleted:', id);
            return vendor;
        } catch (error) {
            logger.error('Error deleting vendor:', error.message);
            throw error;
        }
    },

    /**
     * Get vendors by IDs
     */
    getVendorsByIds: async (ids) => {
        try {
            const vendors = await VendorModel.findByIds(ids);
            return vendors;
        } catch (error) {
            logger.error('Error fetching vendors by IDs:', error.message);
            throw error;
        }
    },
};

module.exports = VendorService;
