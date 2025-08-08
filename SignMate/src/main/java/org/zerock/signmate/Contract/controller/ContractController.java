package org.zerock.signmate.Contract.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.signmate.Contract.dto.ServiceContractDto;
import org.zerock.signmate.Contract.service.ContractService;

import java.util.Map;

@RestController
@RequestMapping("/api/service-contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    public ResponseEntity<?> saveContract(@RequestBody ServiceContractDto dto) {
        try {
            ServiceContractDto savedDto = contractService.save(dto);
            return ResponseEntity.ok(savedDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }
}
