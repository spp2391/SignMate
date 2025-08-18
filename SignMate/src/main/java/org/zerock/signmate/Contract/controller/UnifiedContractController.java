package org.zerock.signmate.Contract.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.dto.UnifiedContractDto;
import org.zerock.signmate.Contract.service.UnifiedContractService;

import java.util.List;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
public class UnifiedContractController {

    private final UnifiedContractService unifiedContractService;

    // 특정 사용자(userId)의 모든 계약서 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UnifiedContractDto>> getUserContracts(@PathVariable Long userId) {
        List<UnifiedContractDto> contracts = unifiedContractService.getAllContractsByUserId(userId);
        return ResponseEntity.ok(contracts);
    }



}
