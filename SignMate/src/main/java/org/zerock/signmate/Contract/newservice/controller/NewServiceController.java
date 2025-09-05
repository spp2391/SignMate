package org.zerock.signmate.Contract.newservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.newservice.dto.NewServiceDTO;
import org.zerock.signmate.Contract.newservice.service.NewServiceService;

import java.util.Map;

@RestController
@RequestMapping("/api/service")
@RequiredArgsConstructor
public class NewServiceController {

    private final NewServiceService newServiceService;

    // Contract 기준 저장 (POST = 새 작성, PUT = 수정)
    @PostMapping
    public ResponseEntity<?> createOrUpdateService(@RequestBody NewServiceDTO dto) {
        try {
            NewServiceDTO savedDto = newServiceService.saveContractByContract(dto);
            return ResponseEntity.ok(savedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateService(@PathVariable Long contractId, @RequestBody NewServiceDTO dto) {
        try {
            dto.setContractId(contractId); // URL의 contractId 적용
            NewServiceDTO updatedDto = newServiceService.saveContractByContract(dto);
            return ResponseEntity.ok(updatedDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류: " + e.getMessage()));
        }
    }

    // ContractId 기준 조회
    @GetMapping("/{contractId}")
    public ResponseEntity<NewServiceDTO> getService(@PathVariable Long contractId) {
        NewServiceDTO dto = newServiceService.findByContractId(contractId);
        return ResponseEntity.ok(dto);
    }


    @DeleteMapping("/{contractId}")
    public ResponseEntity<?> deleteService(@PathVariable Long contractId, Authentication authentication) {
        try {
            NewServiceDTO dto = newServiceService.findByContractId(contractId);
            newServiceService.deleteByContractId(dto.getId(), authentication);
            return ResponseEntity.ok(Map.of("message", "서비스 계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류: " + e.getMessage()));
        }
    }
}
