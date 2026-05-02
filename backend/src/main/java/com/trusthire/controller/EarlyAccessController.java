package com.trusthire.controller;

import com.trusthire.dto.request.EarlyAccessDto;
import com.trusthire.service.EarlyAccessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/early-access")
@RequiredArgsConstructor
public class EarlyAccessController {

    private final EarlyAccessService earlyAccessService;

    @PostMapping
    public ResponseEntity<Void> requestEarlyAccess(@Valid @RequestBody EarlyAccessDto dto) {
        earlyAccessService.requestEarlyAccess(dto);
        return ResponseEntity.ok().build();
    }
}
