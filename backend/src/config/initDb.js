const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
const logger = require('../utils/logger');

const initDatabase = async () => {
    try {
        logger.info('Initializing database...');

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        await pool.query(schema);

        logger.info('✓ Database initialized successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Database initialization failed:', error);
        process.exit(1);
    }
};

initDatabase();
