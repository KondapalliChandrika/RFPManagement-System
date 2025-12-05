require('dotenv').config();

const config = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV ,

    database: {
        host: process.env.DB_HOST ,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ,
    },

    openai: {
        apiKey: process.env.GEMINI_API_KEY,
    },

    smtp: {
        host: process.env.SMTP_HOST ,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER ,
        pass: process.env.SMTP_PASS ,
    },

    imap: {
        host: process.env.IMAP_HOST ,
        port: parseInt(process.env.IMAP_PORT),
        user: process.env.IMAP_USER ,
        password: process.env.IMAP_PASS ,
        tls: process.env.IMAP_TLS !== 'false',
    },

    email: {
        pollInterval: parseInt(process.env.EMAIL_POLL_INTERVAL) , 
    },
};

// Validate required environment variables
const validateConfig = () => {
    const required = [
        'GEMINI_API_KEY',
        'SMTP_USER',
        'SMTP_PASS',
        'IMAP_USER',
        'IMAP_PASS',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.warn(`⚠️  Warning: Missing environment variables: ${missing.join(', ')}`);
        console.warn('⚠️  Some features may not work properly. Please check .env file.');
    }
};

validateConfig();

module.exports = config;
