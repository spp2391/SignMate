package org.zerock.signmate.Contract.business.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.business.dto.BusinessOutsourcingContractDTO;
import org.zerock.signmate.Contract.business.service.BusinessOutsourcingContractService;

import java.util.Map;

@RestController
@RequestMapping("/api/outsourcing")
@RequiredArgsConstructor
public class BusinessOutsourcingContractController {

    private final BusinessOutsourcingContractService service;

    // Contract 기준 저장 (POST = 새 작성, PUT = 수정)
    @PostMapping
    public ResponseEntity<?> createOrUpdateBusiness(@RequestBody BusinessOutsourcingContractDTO dto,
                                                    @RequestParam(defaultValue = "false") boolean force) {
        try {
            BusinessOutsourcingContractDTO savedDto = service.saveContractByContract(dto);
            return ResponseEntity.ok(savedDto);
        } catch (SecurityException e) {
            // 작성자 불일치 → 충돌(409)
            return ResponseEntity.status(409).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateBusiness(@PathVariable Long contractId,
                                            @RequestBody BusinessOutsourcingContractDTO dto,
                                            @RequestParam(defaultValue = "false") boolean force) {
        try {
            dto.setContractId(contractId); // URL에서 contractId 적용
            BusinessOutsourcingContractDTO updatedDto = service.saveContractByContract(dto);
            return ResponseEntity.ok(updatedDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(409).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    // ContractId 기준 조회
    @GetMapping("/{contractId}")
    public ResponseEntity<BusinessOutsourcingContractDTO> getBusiness(@PathVariable Long contractId) {
        BusinessOutsourcingContractDTO dto = service.findByContractId(contractId);
        return ResponseEntity.ok(dto);
    }

    // ContractId 기준 삭제
//    @DeleteMapping("/{contractId}")
//    public ResponseEntity<?> deleteBusiness(@PathVariable Long contractId) {
//        try {
//            service.deleteByContractId(contractId);
//            return ResponseEntity.ok(Map.of("message", "업무위탁 계약서가 삭제되었습니다."));
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류: " + e.getMessage()));
//        }
//    }
}
