-- =====================================================================
-- Migration: Remove tabela category (órfã)
-- O campo category_id foi removido de item na V5, tornando esta tabela sem uso.
-- =====================================================================

DROP TABLE IF EXISTS category;
