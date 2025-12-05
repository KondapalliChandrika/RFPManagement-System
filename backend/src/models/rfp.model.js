const { query } = require('../config/db');

const RFPModel = {
    /**
     * Create a new RFP
     */
    create: async (rfpData) => {
        const { title, description, budget, deadline, items, paymentTerms, warranty, status } = rfpData;

        const sql = `
      INSERT INTO rfps (title, description, budget, deadline, items, payment_terms, warranty, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

        const values = [title, description, budget, deadline, JSON.stringify(items), paymentTerms, warranty, status || 'draft'];
        const result = await query(sql, values);
        return result.rows[0];
    },

    /**
     * Find all RFPs
     */
    findAll: async () => {
        const sql = `
            SELECT r.*, 
                   COALESCE(json_agg(rv.vendor_id) FILTER (WHERE rv.vendor_id IS NOT NULL), '[]') as sent_vendor_ids
            FROM rfps r
            LEFT JOIN rfp_vendors rv ON r.id = rv.rfp_id
            GROUP BY r.id
            ORDER BY r.created_at DESC
        `;
        const result = await query(sql);
        return result.rows;
    },

    /**
     * Find RFP by ID
     */
    findById: async (id) => {
        const sql = `
            SELECT r.*, 
                   COALESCE(json_agg(rv.vendor_id) FILTER (WHERE rv.vendor_id IS NOT NULL), '[]') as sent_vendor_ids
            FROM rfps r
            LEFT JOIN rfp_vendors rv ON r.id = rv.rfp_id
            WHERE r.id = $1
            GROUP BY r.id
        `;
        const result = await query(sql, [id]);
        return result.rows[0];
    },

    /**
     * Update RFP
     */
    update: async (id, rfpData) => {
        const { title, description, budget, deadline, items, paymentTerms, warranty, status } = rfpData;

        const sql = `
      UPDATE rfps
      SET title = $1, description = $2, budget = $3, deadline = $4, 
          items = $5, payment_terms = $6, warranty = $7, status = $8
      WHERE id = $9
      RETURNING *
    `;

        const values = [title, description, budget, deadline, JSON.stringify(items), paymentTerms, warranty, status, id];
        const result = await query(sql, values);
        return result.rows[0];
    },

    /**
     * Delete RFP
     */
    delete: async (id) => {
        const sql = 'DELETE FROM rfps WHERE id = $1 RETURNING *';
        const result = await query(sql, [id]);
        return result.rows[0];
    },

    /**
     * Add vendors to sent list
     */
    addSentVendors: async (rfpId, vendorIds) => {
        for (const vendorId of vendorIds) {
            const sql = `
                INSERT INTO rfp_vendors (rfp_id, vendor_id)
                VALUES ($1, $2)
                ON CONFLICT (rfp_id, vendor_id) DO NOTHING
            `;
            await query(sql, [rfpId, vendorId]);
        }
    },

    /**
     * Get IDs of vendors who received this RFP
     */
    getSentVendorIds: async (rfpId) => {
        const sql = 'SELECT vendor_id FROM rfp_vendors WHERE rfp_id = $1';
        const result = await query(sql, [rfpId]);
        return result.rows.map(row => row.vendor_id);
    },
};

module.exports = RFPModel;
