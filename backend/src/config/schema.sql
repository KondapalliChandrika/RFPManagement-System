-- RFP Management System Database Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS rfps CASCADE;

-- RFPs Table
CREATE TABLE rfps (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget VARCHAR(50),
  deadline DATE,
  items JSONB DEFAULT '[]'::jsonb,
  payment_terms VARCHAR(255),
  warranty VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors Table
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  company VARCHAR(255),
  specialization VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proposals Table
CREATE TABLE proposals (
  id SERIAL PRIMARY KEY,
  rfp_id INTEGER NOT NULL REFERENCES rfps(id) ON DELETE CASCADE,
  vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  raw_email TEXT,
  parsed_data JSONB DEFAULT '{}'::jsonb,
  total_price DECIMAL(12, 2),
  delivery_time VARCHAR(100),
  terms TEXT,
  score DECIMAL(5, 2),
  ai_summary TEXT,
  status VARCHAR(50) DEFAULT 'received',
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rfp_id, vendor_id)
);

-- Indexes for better query performance
CREATE INDEX idx_rfps_status ON rfps(status);
CREATE INDEX idx_rfps_created_at ON rfps(created_at DESC);
CREATE INDEX idx_vendors_email ON vendors(email);
CREATE INDEX idx_proposals_rfp_id ON proposals(rfp_id);
CREATE INDEX idx_proposals_vendor_id ON proposals(vendor_id);
CREATE INDEX idx_proposals_received_at ON proposals(received_at DESC);

-- Insert sample vendors for testing
INSERT INTO vendors (name, email, phone, company, specialization) VALUES
  ('TechSupply Co', 'vendor1@techsupply.com', '+1-555-0101', 'TechSupply Corporation', 'Electronics & IT Equipment'),
  ('Office Solutions Inc', 'vendor2@officesolutions.com', '+1-555-0102', 'Office Solutions Inc', 'Office Supplies & Furniture'),
  ('Global Vendors Ltd', 'vendor3@globalvendors.com', '+1-555-0103', 'Global Vendors Limited', 'General Procurement');

-- Success message
SELECT 'Database schema created successfully!' AS message;
