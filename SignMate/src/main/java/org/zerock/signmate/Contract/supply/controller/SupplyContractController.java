package org.zerock.signmate.Contract.supply.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.supply.dto.SupplyContractDTO;
import org.zerock.signmate.Contract.supply.service.SupplyContractService;
import org.zerock.signmate.notification.service.NotificationService;

import java.util.Map;

@RestController
@RequestMapping("/api/supply")
@RequiredArgsConstructor
public class SupplyContractController {

    private final SupplyContractService supplyContractService;
    private final NotificationService notificationService;
    // Contract 기준 저장 (POST = 새 작성, PUT = 수정)
    @PostMapping
    public ResponseEntity<?> createOrUpdateSupply(@RequestBody SupplyContractDTO dto) {
        try {
            SupplyContractDTO savedDto = supplyContractService.addOrUpdateContract(dto);
            return ResponseEntity.ok(savedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateSupply(@PathVariable Long contractId, @RequestBody SupplyContractDTO dto) {
        try {
            dto.setContractId(contractId); // URL의 contractId 적용
            SupplyContractDTO updatedDto = supplyContractService.addOrUpdateContract(dto);
            return ResponseEntity.ok(updatedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    // ContractId 기준 조회
    @GetMapping("/{contractId}")
    public ResponseEntity<SupplyContractDTO> getSupply(@PathVariable Long contractId) {
        SupplyContractDTO dto = supplyContractService.findByContractId(contractId);
        return ResponseEntity.ok(dto);
    }


    @DeleteMapping("/{contractId}")
    public ResponseEntity<?> deleteSupply(@PathVariable Long contractId, Authentication authentication) {
        try {
            SupplyContractDTO dto= supplyContractService.findByContractId(contractId);
            supplyContractService.deleteByContractId(dto.getId() , authentication);
            notificationService.deleteNotificationsByContractId(contractId);
            return ResponseEntity.ok(Map.of("message", "자재/물품 공급계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류: " + e.getMessage()));
        }
    }
}
