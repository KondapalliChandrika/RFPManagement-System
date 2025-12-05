const API_URLS = {
    // RFP endpoints
    RFP: {
        CREATE: '/rfps/create',
        LIST: '/rfps',
        GET_BY_ID: (id) => `/rfps/${id}`,
        SEND: (id) => `/rfps/${id}/send`,
    },

    // Vendor endpoints
    VENDOR: {
        CREATE: '/vendors',
        LIST: '/vendors',
        GET_BY_ID: (id) => `/vendors/${id}`,
        UPDATE: (id) => `/vendors/${id}`,
        DELETE: (id) => `/vendors/${id}`,
    },

    // Proposal endpoints
    PROPOSAL: {
        GET_BY_RFP: (rfpId) => `/proposals/rfp/${rfpId}`,
        CHECK_EMAILS: '/proposals/check',
        COMPARE: (rfpId) => `/proposals/${rfpId}/compare`,
    },

    // Health check
    HEALTH: '/health',
};

export default API_URLS;
