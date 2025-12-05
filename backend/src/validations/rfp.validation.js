const Joi = require('joi');

const createRFPSchema = Joi.object({
    naturalLanguageInput: Joi.string().required().min(10).max(2000)
        .messages({
            'string.empty': 'Please provide a description of what you want to procure',
            'string.min': 'Description should be at least 10 characters',
            'string.max': 'Description is too long (max 2000 characters)',
        }),
});

const sendRFPSchema = Joi.object({
    vendorIds: Joi.array().items(Joi.number().integer().positive()).min(1).required()
        .messages({
            'array.min': 'Please select at least one vendor',
            'array.base': 'Vendor IDs must be an array',
        }),
});

module.exports = {
    createRFPSchema,
    sendRFPSchema,
};
