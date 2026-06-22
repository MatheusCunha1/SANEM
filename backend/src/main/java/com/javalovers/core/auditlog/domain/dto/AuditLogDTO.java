package com.javalovers.core.auditlog.domain.dto;

import java.time.LocalDateTime;

public record AuditLogDTO(
    Long auditLogId,
    String action,
    String entityType,
    Long entityId,
    Integer performedBy,
    LocalDateTime performedAt,
    String details
) {}
