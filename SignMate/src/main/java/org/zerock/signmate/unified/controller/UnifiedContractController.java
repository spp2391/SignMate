// src/main/java/org/zerock/signmate/Contract/controller/UnifiedContractController.java
package org.zerock.signmate.unified.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.unified.dto.UnifiedContractDto;
import org.zerock.signmate.Contract.dto.UserDashboardDTO;
import org.zerock.signmate.unified.service.UnifiedContractService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
public class UnifiedContractController {

    private final UnifiedContractService unifiedContractService;
    // 📌 유저별 계약 리스트 조회
    @GetMapping("/user/{userId}/list")
    public ResponseEntity<List<UnifiedContractDto>> getUserContracts(@PathVariable Long userId) {
        return ResponseEntity.ok(unifiedContractService.getAllContractsForUser(userId));
    }
//
//    // 📌 유저 대시보드 데이터 조회
    @GetMapping("/user/{userId}/dashboard")
    public ResponseEntity<UserDashboardDTO> getUserDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(unifiedContractService.getUserDashboard(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserContractsAndDashboard(@PathVariable Long userId) {
        List<UnifiedContractDto> contracts = unifiedContractService.getAllContractsForUser(userId);
        UserDashboardDTO dashboard = unifiedContractService.getUserDashboard(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("contracts", contracts);
        result.put("dashboard", dashboard);

        return ResponseEntity.ok(result);
    }

}
