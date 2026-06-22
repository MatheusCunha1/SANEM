-- =====================================================================
-- Migration: Adiciona auth_token na tabela app_user para mapear token → usuário
-- =====================================================================

ALTER TABLE app_user ADD COLUMN IF NOT EXISTS auth_token VARCHAR(100) NULL;
