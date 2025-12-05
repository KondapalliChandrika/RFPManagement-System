const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const logger = require('../utils/logger');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.openai.apiKey); 

const AIService = {
 
    parseRFPFromNaturalLanguage: async (naturalLanguageInput) => {
        try {
            logger.info('Parsing RFP from natural language with Gemini...');

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            // Calculate deadline if relative date is mentioned
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

            const prompt = `You are an AI assistant that helps parse procurement requests into structured RFP data.

Today's date is: ${todayStr}

Given the following natural language description of a procurement need, extract and structure the information into a JSON object with these fields:
- title: A concise title for the RFP (string)
- description: Full description of what needs to be procured (string)
- budget: Budget as a STRING with currency symbol. Rules:
  * If user includes currency symbol ($, ₹, €, £, ¥, etc.), preserve it exactly (e.g., "$50000", "€50000")
  * If user mentions currency name (e.g., "50000 dollars", "50000 rupees"), convert to symbol (e.g., "$50000", "₹50000")
  * If ONLY a number is provided (e.g., "50000"), default to ₹ (Indian Rupees): "₹50000"
  * Keep the format as "SYMBOL+NUMBER" (e.g., "₹50000", "$50000")
  * Do NOT use spaces between symbol and number
- deadline: Deadline in YYYY-MM-DD format. Handle ALL these formats:
  * Relative dates: "within 30 days", "in 2 weeks", "in 3 months", "in 1 year" → calculate from today (${todayStr})
  * Specific dates: "January 15, 2026", "15th Jan 2026", "2026-01-15" → convert to YYYY-MM-DD
  * Month/Year: "by end of January 2026" → use last day of that month
  * Days only: "in 45 days" → calculate from today
  * Weeks: "in 2 weeks" → calculate from today (14 days)
  * Months: "in 3 months" → calculate from today
  * Years: "in 1 year" → calculate from today
  If no deadline mentioned, return null.
- items: Array of items needed, each with { name, quantity, specifications } if mentioned
- paymentTerms: Payment terms if mentioned (e.g., "net 30", "net 60"), otherwise null
- warranty: Warranty requirements if mentioned, otherwise null

User input: "${naturalLanguageInput}"

Return ONLY valid JSON, no additional text or explanation. Do not wrap it in markdown code blocks.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let content = response.text().trim();

            // Remove markdown code blocks if present
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');

            logger.debug('Gemini Response:', content);

            // Parse JSON response
            const parsedData = JSON.parse(content);

            logger.success('RFP parsed successfully with Gemini');
            return {
                ...parsedData,
                status: 'draft',
            };
        } catch (error) {
            logger.error('Error parsing RFP:', error.message);
            throw new Error('Failed to parse RFP from natural language: ' + error.message);
        }
    },

    /**
     * Parse vendor email response into structured proposal data
     */
    parseVendorResponse: async (emailContent, rfpDetails) => {
        try {
            logger.info('Parsing vendor response with Gemini...');

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const prompt = `You are an AI assistant that extracts structured proposal data from vendor email responses.

RFP Details:
Title: ${rfpDetails.title}
Description: ${rfpDetails.description}
Items Requested: ${JSON.stringify(rfpDetails.items)}

Vendor Email Response:
${emailContent}

Extract the following information from the vendor's response and return as JSON. Look for these patterns:
- totalPrice: Look for labels like "Total Price Quote:", "Total Price:", "Price:", "Quote:", "Total Cost:", etc. Extract ONLY the numeric value (e.g., if you see "1 lakh" or "100000", return 100000 as a number)
- deliveryTime: Look for labels like "Delivery Timeframe:", "Delivery Time:", "Timeline:", "Delivery:", etc. Return the exact text (e.g., "20 jan", "2 weeks", "30 days")
- terms: Look for labels like "Payment Terms:", "Terms:", "Detailed Payment Terms:", etc. Return the exact text or number mentioned
- warranty: Look for labels like "Warranty Information:", "Warranty:", etc. Return the exact text (e.g., "2 year warranty", "1 year")
- itemBreakdown: Array of items with individual prices if mentioned (can be empty array if not found)
- additionalNotes: Any other important information from the email

IMPORTANT PARSING RULES:
1. Look for data in bullet points (lines starting with -, •, or similar)
2. Look for data in "Label: Value" format
3. For "lakh" convert to numeric: 1 lakh = 100000
4. Extract dates as-is (e.g., "20 jan", "January 20")
5. If a field is not found, set it to null (NOT "N/A" or empty string)
6. Be flexible with label variations (e.g., "Total Price Quote" and "Total Price" both mean totalPrice)

Return ONLY valid JSON with these exact field names: totalPrice, deliveryTime, terms, warranty, itemBreakdown, additionalNotes
Do not wrap it in markdown code blocks.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let content = response.text().trim();

            // Remove markdown code blocks if present
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');

            logger.debug('Gemini Response:', content);

            const parsedData = JSON.parse(content);

            logger.success('Vendor response parsed successfully with Gemini');
            return parsedData;
        } catch (error) {
            logger.error('Error parsing vendor response:', error.message);
            throw new Error('Failed to parse vendor response: ' + error.message);
        }
    },

    /**
     * Compare proposals and generate recommendations
     */
    compareProposals: async (proposals, rfpDetails) => {
        try {
            logger.info('Comparing proposals with Gemini...');

            // Extract currency symbol from budget (e.g., "₹50000" -> "₹", "$50000" -> "$")
            const currencyMatch = rfpDetails.budget ? rfpDetails.budget.match(/^([^\d]+)/) : null;
            const currencySymbol = currencyMatch ? currencyMatch[1] : '₹';

            // Extract numeric budget value for calculations
            const budgetNumber = rfpDetails.budget ? parseFloat(rfpDetails.budget.replace(/[^\d.]/g, '')) : null;

            // Calculate scores for each proposal
            const scoredProposals = proposals.map(proposal => {
                let score = 0;
                const factors = {};

                // Price factor (40%)
                // Lower price = higher score
                // At or below budget = full 40 points
                // Above budget = penalty based on how much over
                if (proposal.total_price && budgetNumber) {
                    const priceRatio = proposal.total_price / budgetNumber;
                    if (priceRatio <= 1) {
                        // Price is at or below budget: award full points
                        factors.price = 40;
                    } else {
                        // Price is above budget: linear penalty
                        // 100% over (ratio=2.0): 0 points
                        factors.price = Math.max(0, 40 * (2 - priceRatio));
                    }
                    score += factors.price;
                }

                // Delivery time factor (25%)
                // Compare proposal delivery against RFP deadline
                if (proposal.delivery_time && rfpDetails.deadline) {
                    const today = new Date();
                    const deadline = new Date(rfpDetails.deadline);
                    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

                    // Parse delivery time from proposal (could be "20 jan", "2 weeks", "30 days", etc.)
                    let proposalDeliveryDays = null;

                    // Try to extract number of days
                    const daysMatch = proposal.delivery_time.match(/(\d+)\s*(day|days)/i);
                    const weeksMatch = proposal.delivery_time.match(/(\d+)\s*(week|weeks)/i);
                    const monthsMatch = proposal.delivery_time.match(/(\d+)\s*(month|months)/i);

                    if (daysMatch) {
                        proposalDeliveryDays = parseInt(daysMatch[1]);
                    } else if (weeksMatch) {
                        proposalDeliveryDays = parseInt(weeksMatch[1]) * 7;
                    } else if (monthsMatch) {
                        proposalDeliveryDays = parseInt(monthsMatch[1]) * 30;
                    } else {
                        // Try to parse as a date (e.g., "20 jan", "5 jan")
                        const dateMatch = proposal.delivery_time.match(/(\d+)\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
                        if (dateMatch) {
                            const day = parseInt(dateMatch[1]);
                            const monthMap = {
                                'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
                                'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
                            };
                            const month = monthMap[dateMatch[2].toLowerCase()];
                            const year = today.getFullYear() + (month < today.getMonth() ? 1 : 0);
                            const deliveryDate = new Date(year, month, day);
                            proposalDeliveryDays = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
                        } else {
                            // Fallback: try to parse as number
                            proposalDeliveryDays = parseInt(proposal.delivery_time);
                        }
                    }

                    if (proposalDeliveryDays && !isNaN(proposalDeliveryDays)) {
                        if (proposalDeliveryDays <= daysUntilDeadline) {
                            // Meets deadline: award points based on how early
                            // Immediate delivery: 25 points
                            // Just before deadline: 20 points
                            const earlyRatio = 1 - (proposalDeliveryDays / daysUntilDeadline);
                            factors.delivery = 20 + (earlyRatio * 5);
                        } else {
                            // Misses deadline: penalty based on how late
                            const lateRatio = (proposalDeliveryDays - daysUntilDeadline) / daysUntilDeadline;
                            factors.delivery = Math.max(0, 20 - (lateRatio * 20));
                        }
                        score += factors.delivery;
                    }
                }

                // Payment Terms factor (20%)
                // Compare proposal terms against RFP payment terms
                if (proposal.terms && rfpDetails.payment_terms) {
                    const proposalTermsNum = parseInt(proposal.terms);
                    const rfpTermsNum = parseInt(rfpDetails.payment_terms.match(/\d+/)?.[0] || '30');

                    if (!isNaN(proposalTermsNum) && !isNaN(rfpTermsNum)) {
                        if (proposalTermsNum <= rfpTermsNum) {
                            // Better or equal terms: full points
                            factors.terms = 20;
                        } else {
                            // Worse terms: penalty
                            const termsRatio = (proposalTermsNum - rfpTermsNum) / rfpTermsNum;
                            factors.terms = Math.max(0, 20 - (termsRatio * 20));
                        }
                        score += factors.terms;
                    } else if (proposal.terms.toLowerCase().includes(rfpDetails.payment_terms.toLowerCase())) {
                        // Exact match on text
                        factors.terms = 20;
                        score += factors.terms;
                    } else if (proposal.terms) {
                        // Has terms but doesn't match: partial credit
                        factors.terms = 10;
                        score += factors.terms;
                    }
                } else if (proposal.terms) {
                    // No RFP terms specified, give credit for having terms
                    factors.terms = 15;
                    score += factors.terms;
                }

                // Completeness factor (20%)
                const hasPrice = !!proposal.total_price;
                const hasDelivery = !!proposal.delivery_time;
                const hasTerms = !!proposal.terms;
                const completeness = (hasPrice + hasDelivery + hasTerms) / 3;
                factors.completeness = completeness * 20;
                score += factors.completeness;

                return {
                    ...proposal,
                    calculatedScore: Math.round(score * 100) / 100,
                    scoreFactors: factors,
                };
            });

            // Sort by score
            scoredProposals.sort((a, b) => b.calculatedScore - a.calculatedScore);

            // Generate AI recommendation
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const proposalSummaries = scoredProposals.map((p, idx) =>
                `Proposal ${idx + 1} (${p.vendor_name}):
- Price: ${currencySymbol}${p.total_price || 'Not specified'}
- Delivery: ${p.delivery_time || 'Not specified'}
- Terms: ${p.terms || 'Not specified'}
- Score: ${p.calculatedScore}/100`
            ).join('\n\n');

            const recommendationPrompt = `You are a procurement expert. Analyze these vendor proposals and provide a recommendation.

RFP: ${rfpDetails.title}
Budget: ${rfpDetails.budget}

Proposals:
${proposalSummaries}

Provide a concise recommendation (2-3 sentences) on which vendor to choose and why. Consider price, delivery time, terms, and overall value.`;

            const result = await model.generateContent(recommendationPrompt);
            const response = await result.response;
            const recommendation = response.text().trim();

            logger.success('Proposals compared successfully with Gemini');

            return {
                proposals: scoredProposals,
                recommendation,
                topChoice: scoredProposals[0],
            };
        } catch (error) {
            logger.error('Error comparing proposals:', error.message);
            throw new Error('Failed to compare proposals: ' + error.message);
        }
    },
};

module.exports = AIService;
