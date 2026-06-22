package com.javalovers.core.auditlog.service;

import com.javalovers.core.auditlog.domain.dto.AuditLogDTO;
import com.javalovers.core.auditlog.domain.entity.AuditLog;
import com.javalovers.core.auditlog.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String action, String entityType, Long entityId, Long performedBy, String details) {
        AuditLog entry = new AuditLog();
        entry.setAction(action);
        entry.setEntityType(entityType);
        entry.setEntityId(entityId);
        entry.setPerformedBy(performedBy != null ? performedBy.intValue() : null);
        entry.setPerformedAt(LocalDateTime.now());
        entry.setDetails(details);
        auditLogRepository.save(entry);
    }

    public List<AuditLogDTO> findAll() {
        return auditLogRepository.findAllByOrderByPerformedAtDesc()
                .stream()
                .map(l -> new AuditLogDTO(
                        l.getAuditLogId(),
                        l.getAction(),
                        l.getEntityType(),
                        l.getEntityId(),
                        l.getPerformedBy(),
                        l.getPerformedAt(),
                        l.getDetails()))
                .toList();
    }
}
