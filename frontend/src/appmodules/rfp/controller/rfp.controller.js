import NetworkHelper from '../../../basemodules/network/NetworkHelper';
import API_URLS from '../../../basemodules/network/urls';

const RFPController = {
    /**
     * Create RFP from natural language
     */
    createRFP: async (naturalLanguageInput) => {
        return await NetworkHelper.post(API_URLS.RFP.CREATE, { naturalLanguageInput });
    },

    /**
     * Fetch all RFPs
     */
    fetchRFPs: async () => {
        return await NetworkHelper.get(API_URLS.RFP.LIST);
    },

    /**
     * Fetch RFP by ID
     */
    fetchRFPById: async (id) => {
        return await NetworkHelper.get(API_URLS.RFP.GET_BY_ID(id));
    },

    /**
     * Send RFP to vendors
     */
    sendRFP: async (id, vendorIds) => {
        return await NetworkHelper.post(API_URLS.RFP.SEND(id), { vendorIds });
    },
};

export default RFPController;
