package org.zerock.signmate.Contract.newservice.controller;



import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.newservice.dto.NewServiceDTO;
import org.zerock.signmate.Contract.newservice.service.NewServiceService;

import java.util.Map;

@RestController
@RequestMapping("/api/new-services")
@RequiredArgsConstructor
public class NewServiceController {

    private final NewServiceService service;

    // 생성 및 수정 (POST/PUT 구분 없이 save 사용)
    @PostMapping
    public ResponseEntity<?> saveOrUpdate(@RequestBody NewServiceDTO dto) {
        try {
            NewServiceDTO savedDto = service.addOrUpdateDocument(dto);
            return ResponseEntity.ok(savedDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }

    // 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable Long id) {
        NewServiceDTO dto = service.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "서비스 계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류가 발생했습니다."));
        }
    }

    // ContractId로 조회
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<?> getByContractId(@PathVariable Long contractId) {
        try {
            NewServiceDTO dto = service.findByContractId(contractId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }
}
