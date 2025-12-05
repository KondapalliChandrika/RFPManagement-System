const ProposalService = require('../services/proposal.service');
const response = require('../utils/response');

const ProposalController = {
    /**
     * Get proposals for an RFP
     */
    getProposalsByRfp: async (req, res, next) => {
        try {
            const { rfpId } = req.params;

            const proposals = await ProposalService.getProposalsByRfp(rfpId);

            return response.success(res, proposals, 'Proposals fetched successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * Manually trigger email check
     */
    checkEmails: async (req, res, next) => {
        try {
            const result = await ProposalService.checkAndProcessEmails();

            return response.success(res, result, result.message);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Compare proposals for an RFP
     */
    compareProposals: async (req, res, next) => {
        try {
            const { rfpId } = req.params;

            const comparison = await ProposalService.compareProposals(rfpId);

            return response.success(res, comparison,
                comparison.proposals.length === 0
                    ? 'No proposals received yet'
                    : 'Proposals compared successfully'
            );
        } catch (error) {
            if (error.message === 'RFP not found') {
                return response.notFound(res, error.message);
            }
            next(error);
        }
    },
};

module.exports = ProposalController;
