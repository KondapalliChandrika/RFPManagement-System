const cron = require('node-cron');
const ProposalService = require('../services/proposal.service');
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Email polling job
 * Runs every N minutes to check for new vendor responses
 */
const startEmailPolling = () => {
    const interval = config.email.pollInterval;

    // Cron expression: every N minutes
    const cronExpression = `*/${interval} * * * *`;

    logger.info(`Starting email polling job (every ${interval} minutes)...`);

    cron.schedule(cronExpression, async () => {
        try {
            logger.info('Running email polling job...');
            const result = await ProposalService.checkAndProcessEmails();
            logger.info(`Email polling completed: ${result.message}`);
        } catch (error) {
            logger.error('Email polling job failed:', error.message);
        }
    });

    logger.success('Email polling job scheduled successfully');
};

module.exports = { startEmailPolling };
