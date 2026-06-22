package com.javalovers.core.auditlog.repository;

import com.javalovers.core.auditlog.domain.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByPerformedAtDesc();
}
