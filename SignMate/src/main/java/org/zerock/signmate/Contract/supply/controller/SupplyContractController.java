package org.zerock.signmate.Contract.supply.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.supply.dto.SupplyContractDTO;
import org.zerock.signmate.Contract.supply.service.SupplyContractService;

import java.util.Map;

@RestController
@RequestMapping("/api/supplies")
@RequiredArgsConstructor
public class SupplyContractController {

    private final SupplyContractService supplyContractService;

    // 자재/물품 공급계약서 생성 및 수정
    @PostMapping
    public ResponseEntity<?> saveOrUpdateSupply(@RequestBody SupplyContractDTO dto) {
        try {
            SupplyContractDTO savedDto = supplyContractService.addOrUpdateContract(dto);
            return ResponseEntity.ok(savedDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }

    // 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getSupply(@PathVariable Long id) {
        SupplyContractDTO dto = supplyContractService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    // ContractId로 조회
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<?> getByContractId(@PathVariable Long contractId) {
        try {
            SupplyContractDTO dto = supplyContractService.findByContractId(contractId);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupply(@PathVariable Long id) {
        try {
            supplyContractService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "자재/물품 공급계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류가 발생했습니다."));
        }
    }
}
