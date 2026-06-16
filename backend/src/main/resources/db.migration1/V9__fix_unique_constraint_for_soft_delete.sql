-- =====================================================================
-- Migration: Fix UNIQUE constraint for soft delete
-- =====================================================================
-- Description: 
-- Remove UNIQUE constraints that block reuse of CPF/CNPJ for deleted records
-- Add conditional UNIQUE indexes that only apply to non-deleted records

-- For Donor table
ALTER TABLE donor
DROP CONSTRAINT donor_cpf_cnpj_key;

CREATE UNIQUE INDEX uk_donor_cpf_cnpj_not_deleted 
ON donor(cpf_cnpj) 
WHERE deleted_at IS NULL;

-- For Beneficiary table
ALTER TABLE beneficiary
DROP CONSTRAINT beneficiary_cpf_key;

CREATE UNIQUE INDEX uk_beneficiary_cpf_not_deleted 
ON beneficiary(cpf) 
WHERE deleted_at IS NULL;
