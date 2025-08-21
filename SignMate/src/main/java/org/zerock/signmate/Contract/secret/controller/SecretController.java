package org.zerock.signmate.Contract.secret.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.secret.dto.SecretDTO;
import org.zerock.signmate.Contract.secret.service.SecretService;

import java.util.Map;

@RestController
@RequestMapping("/api/secrets")
@RequiredArgsConstructor
public class SecretController {

    private final SecretService secretService;

    // Contract 기준 저장 (POST = 새 작성, PUT = 수정)
    @PostMapping
    public ResponseEntity<?> createOrUpdateSecret(@RequestBody SecretDTO dto) {
        try {
            SecretDTO savedDto = secretService.saveSecretByContract(dto);
            return ResponseEntity.ok(savedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateSecret(@PathVariable Long contractId, @RequestBody SecretDTO dto) {
        try {
            dto.setContractId(contractId); // URL의 contractId 적용
            SecretDTO updatedDto = secretService.saveSecretByContract(dto);
            return ResponseEntity.ok(updatedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    // ContractId 기준 조회
    @GetMapping("/{contractId}")
    public ResponseEntity<SecretDTO> getSecret(@PathVariable Long contractId) {
        SecretDTO dto = secretService.findByContractId(contractId);
        return ResponseEntity.ok(dto);
    }

    // ContractId 기준 삭제
    @DeleteMapping("/{contractId}")
    public ResponseEntity<?> deleteSecret(@PathVariable Long contractId) {
        try {
            secretService.deleteByContractId(contractId);
            return ResponseEntity.ok(Map.of("message", "비밀유지계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류: " + e.getMessage()));
        }
    }
}
