const { query } = require('./db');
const logger = require('../utils/logger');

/**
 * Migration script to convert budget from DECIMAL to VARCHAR with currency
 */
async function migrateBudgetToCurrency() {
    try {
        logger.info('Starting budget currency migration...');

        // Step 1: Get all existing RFPs with numeric budgets
        const rfpsResult = await query('SELECT id, budget FROM rfps WHERE budget IS NOT NULL');
        const rfps = rfpsResult.rows;

        logger.info(`Found ${rfps.length} RFPs with budgets to migrate`);

        // Step 2: Alter the column type (PostgreSQL will auto-convert)
        await query('ALTER TABLE rfps ALTER COLUMN budget TYPE VARCHAR(50)');
        logger.success('Column type changed to VARCHAR(50)');

        // Step 3: Update existing budgets to include ₹ symbol
        for (const rfp of rfps) {
            if (rfp.budget && !isNaN(rfp.budget)) {
                const budgetWithCurrency = `₹${rfp.budget}`;
                await query('UPDATE rfps SET budget = $1 WHERE id = $2', [budgetWithCurrency, rfp.id]);
                logger.debug(`Updated RFP ${rfp.id}: ${rfp.budget} → ${budgetWithCurrency}`);
            }
        }

        logger.success(`Migration completed! Updated ${rfps.length} RFPs with ₹ currency symbol`);
        return { success: true, updated: rfps.length };
    } catch (error) {
        logger.error('Migration failed:', error.message);
        throw error;
    }
}

// Run migration if called directly
if (require.main === module) {
    migrateBudgetToCurrency()
        .then(result => {
            console.log('Migration result:', result);
            process.exit(0);
        })
        .catch(error => {
            console.error('Migration error:', error);
            process.exit(1);
        });
}

module.exports = migrateBudgetToCurrency;
