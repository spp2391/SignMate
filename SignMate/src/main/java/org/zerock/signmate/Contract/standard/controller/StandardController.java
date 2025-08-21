package org.zerock.signmate.Contract.standard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.standard.dto.StandardDTO;
import org.zerock.signmate.Contract.standard.service.StandardService;

import java.util.Map;

@RestController
@RequestMapping("/api/employment")
@RequiredArgsConstructor
public class StandardController {

    private final StandardService standardService;

    // Contract 기준 생성 (POST) / 수정 (PUT)
    @PostMapping
    public ResponseEntity<?> createOrUpdateStandard(@RequestBody StandardDTO dto) {
        try {
            StandardDTO savedDto = standardService.addOrUpdateStandard(dto);
            return ResponseEntity.ok(savedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateStandard(@PathVariable Long contractId, @RequestBody StandardDTO dto) {
        try {
            dto.setContractId(contractId); // URL의 contractId 적용
            StandardDTO updatedDto = standardService.addOrUpdateStandard(dto);
            return ResponseEntity.ok(updatedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    // ContractId 기준 단일 조회
    @GetMapping("/{contractId}")
    public ResponseEntity<?> getStandard(@PathVariable Long contractId) {
        try {
            StandardDTO dto = standardService.findByContractId(contractId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", "해당 계약서가 존재하지 않습니다."));
        }
    }

    // ContractId 기준 삭제
    @DeleteMapping("/{contractId}")
    public ResponseEntity<?> deleteStandard(@PathVariable Long contractId) {
        try {
            StandardDTO dto = standardService.findByContractId(contractId); // 존재 확인
            standardService.deleteById(dto.getId());
            return ResponseEntity.ok(Map.of("message", "근로계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}
