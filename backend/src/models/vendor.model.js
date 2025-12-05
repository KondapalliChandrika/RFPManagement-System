const { query } = require('../config/db');

const VendorModel = {
    /**
     * Create a new vendor
     */
    create: async (vendorData) => {
        const { name, email, phone, company, specialization } = vendorData;

        const sql = `
      INSERT INTO vendors (name, email, phone, company, specialization)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const values = [name, email, phone, company, specialization];
        const result = await query(sql, values);
        return result.rows[0];
    },

    /**
     * Find all vendors
     */
    findAll: async () => {
        const sql = 'SELECT * FROM vendors ORDER BY created_at DESC';
        const result = await query(sql);
        return result.rows;
    },

    /**
     * Find vendor by ID
     */
    findById: async (id) => {
        const sql = 'SELECT * FROM vendors WHERE id = $1';
        const result = await query(sql, [id]);
        return result.rows[0];
    },

    /**
     * Find vendor by email
     */
    findByEmail: async (email) => {
        const sql = 'SELECT * FROM vendors WHERE email = $1';
        const result = await query(sql, [email]);
        return result.rows[0];
    },

    /**
     * Find multiple vendors by IDs
     */
    findByIds: async (ids) => {
        const sql = 'SELECT * FROM vendors WHERE id = ANY($1)';
        const result = await query(sql, [ids]);
        return result.rows;
    },

    /**
     * Update vendor
     */
    update: async (id, vendorData) => {
        const { name, email, phone, company, specialization } = vendorData;

        const sql = `
      UPDATE vendors
      SET name = $1, email = $2, phone = $3, company = $4, specialization = $5
      WHERE id = $6
      RETURNING *
    `;

        const values = [name, email, phone, company, specialization, id];
        const result = await query(sql, values);
        return result.rows[0];
    },

    /**
     * Delete vendor
     */
    delete: async (id) => {
        const sql = 'DELETE FROM vendors WHERE id = $1 RETURNING *';
        const result = await query(sql, [id]);
        return result.rows[0];
    },
};

module.exports = VendorModel;
