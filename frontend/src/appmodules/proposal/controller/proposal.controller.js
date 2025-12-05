import NetworkHelper from '../../../basemodules/network/NetworkHelper';
import API_URLS from '../../../basemodules/network/urls';

const ProposalController = {
    fetchProposals: async (rfpId) => {
        return await NetworkHelper.get(API_URLS.PROPOSAL.GET_BY_RFP(rfpId));
    },

    checkEmails: async () => {
        return await NetworkHelper.post(API_URLS.PROPOSAL.CHECK_EMAILS);
    },

    compareProposals: async (rfpId) => {
        return await NetworkHelper.get(API_URLS.PROPOSAL.COMPARE(rfpId));
    },
};

export default ProposalController;
