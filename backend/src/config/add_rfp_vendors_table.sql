-- Create table to track which vendors have received which RFPs
CREATE TABLE IF NOT EXISTS rfp_vendors (
    id SERIAL PRIMARY KEY,
    rfp_id INTEGER NOT NULL REFERENCES rfps(id) ON DELETE CASCADE,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rfp_id, vendor_id)
);

-- Index for performance
CREATE INDEX idx_rfp_vendors_rfp_id ON rfp_vendors(rfp_id);
CREATE INDEX idx_rfp_vendors_vendor_id ON rfp_vendors(vendor_id);
