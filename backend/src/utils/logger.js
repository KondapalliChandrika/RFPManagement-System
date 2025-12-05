const config = require('../config/env');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

const logger = {
    info: (...args) => {
        console.log(`${colors.green}[INFO]${colors.reset}`, ...args);
    },

    error: (...args) => {
        console.error(`${colors.red}[ERROR]${colors.reset}`, ...args);
    },

    warn: (...args) => {
        console.warn(`${colors.yellow}[WARN]${colors.reset}`, ...args);
    },

    debug: (...args) => {
        if (config.nodeEnv === 'development') {
            console.log(`${colors.cyan}[DEBUG]${colors.reset}`, ...args);
        }
    },

    success: (...args) => {
        console.log(`${colors.green}${colors.bright}[SUCCESS]${colors.reset}`, ...args);
    },
};

module.exports = logger;
