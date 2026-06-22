package com.javalovers.core.auditlog.controller;

import com.javalovers.core.auditlog.domain.dto.AuditLogDTO;
import com.javalovers.core.auditlog.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/audit-log")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/all")
    public ResponseEntity<List<AuditLogDTO>> listAll() {
        return ResponseEntity.ok(auditLogService.findAll());
    }
}
