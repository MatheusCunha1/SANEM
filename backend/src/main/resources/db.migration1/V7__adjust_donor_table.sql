-- =====================================================================
-- Migration: Adjust and expand donor table with full address fields
-- =====================================================================
-- Description: 
-- 1. Make required fields NOT NULL (name, email/contact, phone, cpfCnpj)
-- 2. Add address fields (address, number, complement, neighborhood, reference_point)
-- 3. Increase column sizes for consistency with other tables

-- Step 1: Update existing null values to defaults
UPDATE donor SET contact = 'email@example.com' WHERE contact IS NULL;

-- Step 2: Add new address columns
ALTER TABLE donor
ADD COLUMN phone VARCHAR(20) AFTER contact,
ADD COLUMN address VARCHAR(255) AFTER phone,
ADD COLUMN number VARCHAR(10) AFTER address,
ADD COLUMN complement VARCHAR(255) AFTER number,
ADD COLUMN neighborhood VARCHAR(100) AFTER complement,
ADD COLUMN reference_point VARCHAR(255) AFTER neighborhood;

-- Step 3: Increase varchar sizes and make required fields NOT NULL
ALTER TABLE donor
MODIFY COLUMN name VARCHAR(255) NOT NULL,
MODIFY COLUMN cpf_cnpj VARCHAR(14),
MODIFY COLUMN contact VARCHAR(255) NOT NULL,
MODIFY COLUMN phone VARCHAR(20) NOT NULL;
