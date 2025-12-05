const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const config = require('../config/env');
const logger = require('../utils/logger');

// Create SMTP transporter
const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});

const EmailService = {
    /**
     * Send RFP email to vendors
     */
    sendRFP: async (rfp, vendors) => {
        try {
            logger.info(`Sending RFP to ${vendors.length} vendors...`);

            const itemsList = rfp.items && rfp.items.length > 0
                ? rfp.items.map(item => `- ${item.quantity}x ${item.name}${item.specifications ? ` (${item.specifications})` : ''}`).join('\n')
                : 'See description for details';

            const emailPromises = vendors.map(vendor => {
                const mailOptions = {
                    from: config.smtp.user,
                    to: vendor.email,
                    subject: `RFP: ${rfp.title}`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Request for Proposal</h2>
              
              <h3>${rfp.title}</h3>
              
              <p><strong>Description:</strong></p>
              <p>${rfp.description}</p>
              
              <p><strong>Items Required:</strong></p>
              <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${itemsList}</pre>
              
              <p><strong>Budget:</strong> $${rfp.budget || 'To be discussed'}</p>
              <p><strong>Deadline:</strong> ${rfp.deadline || 'To be discussed'}</p>
              <p><strong>Payment Terms:</strong> ${rfp.payment_terms || 'To be discussed'}</p>
              <p><strong>Warranty:</strong> ${rfp.warranty || 'To be discussed'}</p>
              
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
              
              <p><strong>Please reply to this email with your proposal including:</strong></p>
              <ul>
                <li>Total price quote</li>
                <li>Delivery timeframe</li>
                <li>Payment terms</li>
                <li>Warranty details</li>
                <li>Any additional information</li>
              </ul>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                This is an automated email from the RFP Management System.
              </p>
            </div>
          `,
                };

                return transporter.sendMail(mailOptions);
            });

            await Promise.all(emailPromises);
            logger.success(`RFP sent to ${vendors.length} vendors successfully`);

            return { success: true, count: vendors.length };
        } catch (error) {
            logger.error('Error sending RFP emails:', error.message);
            throw new Error('Failed to send RFP emails: ' + error.message);
        }
    },

    /**
     * Check inbox for new vendor responses
     */
    checkInbox: async () => {
        return new Promise((resolve, reject) => {
            try {
                logger.info('Checking inbox for new emails...');

                const imap = new Imap({
                    user: config.imap.user,
                    password: config.imap.password,
                    host: config.imap.host,
                    port: config.imap.port,
                    tls: config.imap.tls,
                    tlsOptions: { rejectUnauthorized: false },
                });

                const emails = [];

                imap.once('ready', () => {
                    imap.openBox('INBOX', false, (err, box) => {
                        if (err) {
                            logger.error('Error opening inbox:', err.message);
                            imap.end();
                            return reject(err);
                        }

                        // Search for unseen emails
                        imap.search(['UNSEEN'], (err, results) => {
                            if (err) {
                                logger.error('Error searching emails:', err.message);
                                imap.end();
                                return reject(err);
                            }

                            if (!results || results.length === 0) {
                                logger.info('No new emails found');
                                imap.end();
                                return resolve([]);
                            }

                            logger.info(`Found ${results.length} new emails`);

                            const fetch = imap.fetch(results, { bodies: '', markSeen: true });

                            fetch.on('message', (msg, seqno) => {
                                msg.on('body', (stream, info) => {
                                    simpleParser(stream, async (err, parsed) => {
                                        if (err) {
                                            logger.error('Error parsing email:', err.message);
                                            return;
                                        }

                                        emails.push({
                                            from: parsed.from.text,
                                            subject: parsed.subject,
                                            text: parsed.text,
                                            html: parsed.html,
                                            date: parsed.date,
                                            messageId: parsed.messageId,
                                        });
                                    });
                                });
                            });

                            fetch.once('error', (err) => {
                                logger.error('Fetch error:', err.message);
                                imap.end();
                                reject(err);
                            });

                            fetch.once('end', () => {
                                logger.success(`Processed ${emails.length} emails`);
                                imap.end();
                            });
                        });
                    });
                });

                imap.once('error', (err) => {
                    logger.error('IMAP connection error:', err.message);
                    reject(err);
                });

                imap.once('end', () => {
                    logger.debug('IMAP connection ended');
                    resolve(emails);
                });

                imap.connect();
            } catch (error) {
                logger.error('Error in checkInbox:', error.message);
                reject(error);
            }
        });
    },

    /**
     * Extract email address from "Name <email@domain.com>" format
     */
    extractEmail: (emailString) => {
        const match = emailString.match(/<(.+?)>/);
        return match ? match[1] : emailString;
    },
};

module.exports = EmailService;
