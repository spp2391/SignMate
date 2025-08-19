package org.zerock.signmate.Contract.standard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.standard.domain.Standard;
import org.zerock.signmate.Contract.standard.dto.StandardDTO;
import org.zerock.signmate.Contract.standard.service.StandardService;
import org.zerock.signmate.user.domain.User;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employment")
@RequiredArgsConstructor
public class StandardController {

    private final StandardService standardService;

    // 생성 및 수정 (POST)
    @PostMapping
    public ResponseEntity<?> saveOrUpdateStandard(@RequestBody StandardDTO dto) {
        try {
            StandardDTO savedDto = standardService.addOrUpdateStandard(dto);
            return ResponseEntity.ok(savedDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }

    // 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getStandard(@PathVariable Long id) {
        StandardDTO dto = standardService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStandard(@PathVariable Long id) {
        try {
            standardService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "근로계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/my")
    public List<Standard> getMyContracts(@AuthenticationPrincipal User loginUser) {
        return standardService.getMyContracts(loginUser);
    }

}
