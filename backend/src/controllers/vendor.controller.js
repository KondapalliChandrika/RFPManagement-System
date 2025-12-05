const VendorService = require('../services/vendor.service');
const response = require('../utils/response');

const VendorController = {
    /**
     * Create new vendor
     */
    createVendor: async (req, res, next) => {
        try {
            const vendor = await VendorService.createVendor(req.body);

            return response.success(res, vendor, 'Vendor created successfully', 201);
        } catch (error) {
            if (error.message.includes('already exists')) {
                return response.error(res, error.message, 409);
            }
            next(error);
        }
    },

    /**
     * Get all vendors
     */
    getAllVendors: async (req, res, next) => {
        try {
            const vendors = await VendorService.getAllVendors();

            return response.success(res, vendors, 'Vendors fetched successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get vendor by ID
     */
    getVendorById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const vendor = await VendorService.getVendorById(id);

            return response.success(res, vendor, 'Vendor fetched successfully');
        } catch (error) {
            if (error.message === 'Vendor not found') {
                return response.notFound(res, error.message);
            }
            next(error);
        }
    },

    /**
     * Update vendor
     */
    updateVendor: async (req, res, next) => {
        try {
            const { id } = req.params;

            const vendor = await VendorService.updateVendor(id, req.body);

            return response.success(res, vendor, 'Vendor updated successfully');
        } catch (error) {
            if (error.message === 'Vendor not found') {
                return response.notFound(res, error.message);
            }
            if (error.message.includes('already exists')) {
                return response.error(res, error.message, 409);
            }
            next(error);
        }
    },

    /**
     * Delete vendor
     */
    deleteVendor: async (req, res, next) => {
        try {
            const { id } = req.params;

            await VendorService.deleteVendor(id);

            return response.success(res, null, 'Vendor deleted successfully');
        } catch (error) {
            if (error.message === 'Vendor not found') {
                return response.notFound(res, error.message);
            }
            next(error);
        }
    },
};

module.exports = VendorController;
