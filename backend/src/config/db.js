const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('./env');
const logger = require('../utils/logger');


async function createDatabaseIfNotExists() {
    const adminPool = new Pool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: 'postgres', // Connect to default postgres database
    });

    try {
        // Check if database exists
        const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
        const result = await adminPool.query(checkDbQuery, [config.database.database]);

        if (result.rows.length === 0) {
            // Database doesn't exist, create it
            logger.info(`Database '${config.database.database}' does not exist. Creating...`);
            await adminPool.query(`CREATE DATABASE ${config.database.database}`);
            logger.success(`Database '${config.database.database}' created successfully!`);
        } else {
            logger.info(`Database '${config.database.database}' already exists.`);
        }
    } catch (error) {
        logger.error('Error checking/creating database:', error.message);
        throw error;
    } finally {
        await adminPool.end();
    }
}


async function createTablesIfNotExist(pool) {
    try {
        // Check if tables exist
        const checkTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('rfps', 'vendors', 'proposals')
    `;

        const result = await pool.query(checkTablesQuery);
        const existingTables = result.rows.map(row => row.table_name);

        if (existingTables.length === 3) {
            logger.info('All tables already exist.');
            return;
        }

        logger.info('Some tables are missing. Creating tables...');

        // Read and execute schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await pool.query(schema);
        logger.success('Tables created successfully!');
    } catch (error) {
        logger.error('Error creating tables:', error.message);
        throw error;
    }
}


async function initializeDatabase() {
    try {
        // Step 1: Create database if it doesn't exist
        await createDatabaseIfNotExists();

        // Step 2: Create connection pool to our database
        const pool = new Pool({
            host: config.database.host,
            port: config.database.port,
            database: config.database.database,
            user: config.database.user,
            password: config.database.password,
        });

        // Step 3: Create tables if they don't exist
        await createTablesIfNotExist(pool);

        await pool.end();
        logger.success('Database initialization complete!');
    } catch (error) {
        logger.error('Database initialization failed:', error.message);
        throw error;
    }
}

const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
});

pool.on('connect', () => {
    logger.info('Database connected successfully');
});

pool.on('error', (err) => {
    logger.error('Unexpected database error:', err);
    process.exit(-1);
});


const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        logger.debug('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        logger.error('Query error:', error.message);
        throw error;
    }
};


const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    query,
    transaction,
    pool,
    initializeDatabase,
};
