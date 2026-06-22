-- =====================================================================
-- Migration: Cria tabela audit_log para rastreabilidade de ações críticas
-- =====================================================================

CREATE TABLE IF NOT EXISTS audit_log (
    audit_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action       VARCHAR(60)  NOT NULL,
    entity_type  VARCHAR(60)  NOT NULL,
    entity_id    BIGINT       NOT NULL,
    performed_by INT          NULL,
    performed_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details      TEXT         NULL,
    CONSTRAINT fk_audit_log_user FOREIGN KEY (performed_by) REFERENCES app_user(user_id) ON DELETE SET NULL
);
