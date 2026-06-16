-- =====================================================================
-- Migration: Make phone field nullable
-- =====================================================================
-- Description: Make phone field nullable to support legacy data and optional input

ALTER TABLE donor
MODIFY COLUMN phone VARCHAR(20) NULL;
