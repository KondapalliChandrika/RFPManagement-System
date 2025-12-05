/**
 * Validate email address
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone);
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 */
export const minLength = (value, min) => {
    if (typeof value === 'string') {
        return value.length >= min;
    }
    return false;
};

/**
 * Validate number
 */
export const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value) => {
    return isNumber(value) && parseFloat(value) > 0;
};
