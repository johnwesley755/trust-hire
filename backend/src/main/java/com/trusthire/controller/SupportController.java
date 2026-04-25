package com.trusthire.controller;

import com.trusthire.entity.SupportTicket;
import com.trusthire.repository.SupportTicketRepository;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportTicketRepository ticketRepository;

    @PostMapping("/ticket")
    public ResponseEntity<ApiResponse<SupportTicket>> createTicket(
            Authentication authentication,
            @RequestBody SupportTicket ticket) {
        
        if (authentication != null) {
            ticket.setUserId((String) authentication.getPrincipal());
        }
        
        SupportTicket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(ApiResponse.ok("Ticket created successfully", saved));
    }
}
