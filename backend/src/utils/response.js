/**
 * Standardized API response formatter
 */

const success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const error = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message,
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

const validationError = (res, errors) => {
    return error(res, 'Validation failed', 400, errors);
};

const notFound = (res, message = 'Resource not found') => {
    return error(res, message, 404);
};

const unauthorized = (res, message = 'Unauthorized access') => {
    return error(res, message, 401);
};

const serverError = (res, message = 'Internal server error') => {
    return error(res, message, 500);
};

module.exports = {
    success,
    error,
    validationError,
    notFound,
    unauthorized,
    serverError,
};
