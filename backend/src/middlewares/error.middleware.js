const logger = require('../utils/logger');
const response = require('../utils/response');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return response.validationError(res, err.details);
    }

    if (err.code === '23505') { // PostgreSQL unique violation
        return response.error(res, 'Duplicate entry. Resource already exists.', 409);
    }

    if (err.code === '23503') { // PostgreSQL foreign key violation
        return response.error(res, 'Referenced resource does not exist.', 400);
    }

    if (err.code === '22P02') { // PostgreSQL invalid input syntax
        return response.error(res, 'Invalid data format.', 400);
    }

    // Default server error
    return response.serverError(res, err.message || 'Internal server error');
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    return response.notFound(res, `Route ${req.method} ${req.path} not found`);
};

module.exports = {
    errorHandler,
    notFoundHandler,
};
