const app = require('./app');
const config = require('./config/env');
const { pool, initializeDatabase } = require('./config/db');
const logger = require('./utils/logger');
const emailJob = require('./jobs/email.job');

const PORT = config.port;

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
    try {
        // Initialize database and tables automatically
        logger.info('Initializing database...');
        await initializeDatabase();

        // Start the server
        app.listen(PORT, () => {
            logger.success(`Server is running on port ${PORT}`);
            logger.info(`Environment: ${config.nodeEnv}`);
            logger.info(`API: http://localhost:${PORT}/api`);

            // Start email polling job
            emailJob.startEmailPolling();
        });
    } catch (error) {
        logger.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
