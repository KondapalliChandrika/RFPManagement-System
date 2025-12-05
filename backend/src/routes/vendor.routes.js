const express = require('express');
const router = express.Router();
const VendorController = require('../controllers/vendor.controller');
const { validate } = require('../middlewares/validation.middleware');
const { createVendorSchema, updateVendorSchema } = require('../validations/vendor.validation');

// Create vendor
router.post('/', validate(createVendorSchema), VendorController.createVendor);

// Get all vendors
router.get('/', VendorController.getAllVendors);

// Get vendor by ID
router.get('/:id', VendorController.getVendorById);

// Update vendor
router.put('/:id', validate(updateVendorSchema), VendorController.updateVendor);

// Delete vendor
router.delete('/:id', VendorController.deleteVendor);

module.exports = router;
