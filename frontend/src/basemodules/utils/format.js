/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Format currency
 * Handles both:
 * - String budgets with currency (e.g., "₹50000", "$50000") - displays as-is
 * - Numeric proposal prices - formats with currency symbol
 */
export const formatCurrency = (amount, currencyContext = null) => {
    if (!amount && amount !== 0) return 'N/A';

    // If amount is a string (budget with currency), display as-is
    if (typeof amount === 'string') {
        return amount;
    }

    // If amount is a number (proposal price), format with currency
    // Extract currency from context if provided (e.g., from RFP budget)
    let currency = 'INR';
    let currencySymbol = '₹';

    if (currencyContext && typeof currencyContext === 'string') {
        // Extract currency symbol from budget string (e.g., "₹50000" -> "₹")
        const match = currencyContext.match(/^([^\d]+)/);
        if (match) {
            currencySymbol = match[1];
            // Map symbols to currency codes for Intl.NumberFormat
            const symbolMap = {
                '₹': 'INR',
                '$': 'USD',
                '€': 'EUR',
                '£': 'GBP',
                '¥': 'JPY',
            };
            currency = symbolMap[currencySymbol] || 'INR';
        }
    }

    // Format the number with the appropriate currency
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
