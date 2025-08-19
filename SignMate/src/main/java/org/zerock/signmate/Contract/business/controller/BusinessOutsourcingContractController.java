package org.zerock.signmate.Contract.business.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.business.dto.BusinessOutsourcingContractDTO;
import org.zerock.signmate.Contract.business.service.BusinessOutsourcingContractService;

import java.util.Map;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessOutsourcingContractController {

    private final BusinessOutsourcingContractService service;

    // 업무위탁 계약서 생성 및 수정
    @PostMapping
    public ResponseEntity<?> saveOrUpdateContract(@RequestBody BusinessOutsourcingContractDTO dto,
                                                  @RequestParam(defaultValue = "false") boolean force) {
        try {
            BusinessOutsourcingContractDTO savedDto = service.addOrUpdateContract(dto,force);
            return ResponseEntity.ok(savedDto);
        }catch (SecurityException e) {
            // 작성자 불일치 경고용 409 반환
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }

    // 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getContract(@PathVariable Long id) {
        BusinessOutsourcingContractDTO dto = service.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    // ContractId로 조회
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<?> getByContractId(@PathVariable Long contractId) {
        try {
            BusinessOutsourcingContractDTO dto = service.findByContractId(contractId);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "업무위탁 계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류가 발생했습니다."));
        }
    }
}
