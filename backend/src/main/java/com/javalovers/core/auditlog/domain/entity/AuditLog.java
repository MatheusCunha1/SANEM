package com.javalovers.core.auditlog.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_log_id")
    private Long auditLogId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "performed_by")
    private Integer performedBy;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;
}
