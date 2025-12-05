const { query } = require('../config/db');

const ProposalModel = {
    /**
     * Create a new proposal
     */
    create: async (proposalData) => {
        const {
            rfpId,
            vendorId,
            rawEmail,
            parsedData,
            totalPrice,
            deliveryTime,
            terms,
            score,
            aiSummary,
            status
        } = proposalData;

        const sql = `
      INSERT INTO proposals 
      (rfp_id, vendor_id, raw_email, parsed_data, total_price, delivery_time, terms, score, ai_summary, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

        const values = [
            rfpId,
            vendorId,
            rawEmail,
            JSON.stringify(parsedData),
            totalPrice,
            deliveryTime,
            terms,
            score,
            aiSummary,
            status || 'received'
        ];

        const result = await query(sql, values);
        return result.rows[0];
    },

    /**
     * Find all proposals for an RFP
     */
    findByRfpId: async (rfpId) => {
        const sql = `
      SELECT p.*, v.name as vendor_name, v.email as vendor_email, v.company as vendor_company
      FROM proposals p
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.rfp_id = $1
      ORDER BY p.received_at DESC
    `;
        const result = await query(sql, [rfpId]);
        return result.rows;
    },

    /**
     * Find proposal by ID
     */
    findById: async (id) => {
        const sql = `
      SELECT p.*, v.name as vendor_name, v.email as vendor_email, v.company as vendor_company
      FROM proposals p
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = $1
    `;
        const result = await query(sql, [id]);
        return result.rows[0];
    },

    /**
     * Find proposal by RFP and Vendor
     */
    findByRfpAndVendor: async (rfpId, vendorId) => {
        const sql = 'SELECT * FROM proposals WHERE rfp_id = $1 AND vendor_id = $2';
        const result = await query(sql, [rfpId, vendorId]);
        return result.rows[0];
    },

    /**
     * Update proposal
     */
    update: async (id, proposalData) => {
        const { parsedData, totalPrice, deliveryTime, terms, score, aiSummary, status } = proposalData;

        // Build dynamic update query to only update provided fields
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (parsedData !== undefined) {
            updates.push(`parsed_data = $${paramIndex++}`);
            values.push(JSON.stringify(parsedData));
        }
        if (totalPrice !== undefined) {
            updates.push(`total_price = $${paramIndex++}`);
            values.push(totalPrice);
        }
        if (deliveryTime !== undefined) {
            updates.push(`delivery_time = $${paramIndex++}`);
            values.push(deliveryTime);
        }
        if (terms !== undefined) {
            updates.push(`terms = $${paramIndex++}`);
            values.push(terms);
        }
        if (score !== undefined) {
            updates.push(`score = $${paramIndex++}`);
            values.push(score);
        }
        if (aiSummary !== undefined) {
            updates.push(`ai_summary = $${paramIndex++}`);
            values.push(aiSummary);
        }
        if (status !== undefined) {
            updates.push(`status = $${paramIndex++}`);
            values.push(status);
        }

        if (updates.length === 0) {
            throw new Error('No fields to update');
        }

        const sql = `
      UPDATE proposals
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

        values.push(id);

        const result = await query(sql, values);
        return result.rows[0];
    },

    /**
     * Delete proposal
     */
    delete: async (id) => {
        const sql = 'DELETE FROM proposals WHERE id = $1 RETURNING *';
        const result = await query(sql, [id]);
        return result.rows[0];
    },
};

module.exports = ProposalModel;
