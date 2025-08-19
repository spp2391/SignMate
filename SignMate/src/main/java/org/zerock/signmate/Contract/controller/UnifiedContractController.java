// src/main/java/org/zerock/signmate/Contract/controller/UnifiedContractController.java
package org.zerock.signmate.Contract.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.dto.UnifiedContractDto;
import org.zerock.signmate.Contract.dto.UserDashboardDTO;
import org.zerock.signmate.Contract.service.UnifiedContractService;

import java.util.List;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
public class UnifiedContractController {

    private final UnifiedContractService unifiedContractService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UnifiedContractDto>> getUserContracts(@PathVariable Long userId) {
        return ResponseEntity.ok(unifiedContractService.getAllContractsForUser(userId));
    }

    // ✅ 대시보드 데이터
    @GetMapping("/user/{userId}/dashboard")
    public ResponseEntity<UserDashboardDTO> getUserDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(unifiedContractService.getUserDashboard(userId));
    }
}
