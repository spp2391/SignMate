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

    // 비밀유지계약서 생성 및 수정 (POST/PUT 구분 없이 save 사용)
    @PostMapping
    public ResponseEntity<?> saveOrUpdateSecret(@RequestBody SecretDTO dto) {
        try {
            // addOrUpdateSecret: Contract 존재 여부 확인 + Secret 존재 여부 확인 후 처리
            SecretDTO savedDto = secretService.addOrUpdateSecret(dto);
            return ResponseEntity.ok(savedDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
        }
    }


//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateSecret(@PathVariable Long id, @RequestBody SecretDTO dto) {
//        if (!id.equals(dto.getId())) {
//            return ResponseEntity.badRequest().body(Map.of("message", "URL ID와 요청 데이터 ID가 일치하지 않습니다."));
//        }
//
//        try {
//            SecretDTO updatedDto = secretService.save(dto);
//            return ResponseEntity.ok(updatedDto);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
//        }
//    }

    // 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getSecret(@PathVariable Long id) {
        SecretDTO dto = secretService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSecret(@PathVariable Long id) {
        try {
            secretService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "비밀유지계약서가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "삭제 중 오류가 발생했습니다."));
        }
    }
}
