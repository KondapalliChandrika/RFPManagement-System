const Joi = require('joi');

const createVendorSchema = Joi.object({
    name: Joi.string().required().min(2).max(255)
        .messages({
            'string.empty': 'Vendor name is required',
            'string.min': 'Vendor name should be at least 2 characters',
        }),

    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
        }),

    phone: Joi.string().optional().allow('').max(50),

    company: Joi.string().optional().allow('').max(255),

    specialization: Joi.string().optional().allow('').max(255),
});

const updateVendorSchema = Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().email(),
    phone: Joi.string().allow('').max(50),
    company: Joi.string().allow('').max(255),
    specialization: Joi.string().allow('').max(255),
}).min(1); // At least one field must be provided

module.exports = {
    createVendorSchema,
    updateVendorSchema,
};
