const ProposalModel = require('../models/proposal.model');
const VendorModel = require('../models/vendor.model');
const RFPModel = require('../models/rfp.model');
const AIService = require('./ai.service');
const EmailService = require('./email.service');
const logger = require('../utils/logger');

const ProposalService = {
    /**
     * Get proposals for an RFP
     */
    getProposalsByRfp: async (rfpId) => {
        try {
            const proposals = await ProposalModel.findByRfpId(rfpId);
            return proposals;
        } catch (error) {
            logger.error('Error fetching proposals:', error.message);
            throw error;
        }
    },

    /**
     * Check emails and process new vendor responses
     */
    checkAndProcessEmails: async () => {
        try {
            logger.info('Checking for new vendor responses...');

            const emails = await EmailService.checkInbox();

            if (emails.length === 0) {
                return { processed: 0, message: 'No new emails found' };
            }

            let processed = 0;

            for (const email of emails) {
                try {
                    // Extract vendor email
                    const vendorEmail = EmailService.extractEmail(email.from);

                    // Find vendor by email
                    const vendor = await VendorModel.findByEmail(vendorEmail);
                    if (!vendor) {
                        logger.warn(`Email from unknown vendor: ${vendorEmail}`);
                        continue;
                    }

                    // Try to match email to RFP (look for "Re: RFP:" in subject)
                    const rfpMatch = email.subject.match(/Re:\s*RFP:\s*(.+)/i);
                    if (!rfpMatch) {
                        logger.warn(`Email subject doesn't match RFP pattern: ${email.subject}`);
                        continue;
                    }

                    const rfpTitle = rfpMatch[1].trim();

                    // Find RFP by title (simple matching)
                    const allRfps = await RFPModel.findAll();
                    const rfp = allRfps.find(r => r.title.toLowerCase().includes(rfpTitle.toLowerCase()));

                    if (!rfp) {
                        logger.warn(`No matching RFP found for: ${rfpTitle}`);
                        continue;
                    }

                    // Check if proposal already exists
                    const existing = await ProposalModel.findByRfpAndVendor(rfp.id, vendor.id);
                    if (existing) {
                        logger.info(`Proposal already exists for RFP ${rfp.id} and vendor ${vendor.id}`);
                        continue;
                    }

                    // Parse email content with AI
                    const parsedData = await AIService.parseVendorResponse(email.text || email.html, rfp);

                    logger.debug('Parsed vendor response:', JSON.stringify(parsedData, null, 2));

                    // Create proposal
                    const proposal = await ProposalModel.create({
                        rfpId: rfp.id,
                        vendorId: vendor.id,
                        rawEmail: email.text || email.html,
                        parsedData,
                        totalPrice: parsedData.totalPrice,
                        deliveryTime: parsedData.deliveryTime,
                        terms: parsedData.terms,
                        status: 'received',
                    });

                    logger.success(`Proposal created with data: Price=${parsedData.totalPrice}, Delivery=${parsedData.deliveryTime}, Terms=${parsedData.terms}`);

                    logger.success(`Proposal created: RFP ${rfp.id}, Vendor ${vendor.id}`);
                    processed++;
                } catch (error) {
                    logger.error('Error processing email:', error.message);
                }
            }

            return {
                processed,
                total: emails.length,
                message: `Processed ${processed} out of ${emails.length} emails`
            };
        } catch (error) {
            logger.error('Error checking emails:', error.message);
            throw error;
        }
    },

    /**
     * Compare proposals for an RFP
     */
    compareProposals: async (rfpId) => {
        try {
            const rfp = await RFPModel.findById(rfpId);
            if (!rfp) {
                throw new Error('RFP not found');
            }

            const proposals = await ProposalModel.findByRfpId(rfpId);

            // Return empty state instead of error when no proposals
            if (proposals.length === 0) {
                logger.info(`No proposals found for RFP ${rfpId}`);
                return {
                    proposals: [],
                    recommendation: 'No proposals have been received yet. Once vendors respond to your RFP, their proposals will appear here for comparison.',
                    topChoice: null,
                    rfp: rfp,
                };
            }

            // Use AI to compare and score proposals
            const comparison = await AIService.compareProposals(proposals, rfp);

            // Update proposal scores in database
            for (const proposal of comparison.proposals) {
                await ProposalModel.update(proposal.id, {
                    score: proposal.calculatedScore,
                    aiSummary: comparison.recommendation,
                });
            }

            logger.success(`Compared ${proposals.length} proposals for RFP ${rfpId}`);

            return {
                ...comparison,
                rfp: rfp,
            };
        } catch (error) {
            logger.error('Error comparing proposals:', error.message);
            throw error;
        }
    },
};

module.exports = ProposalService;
