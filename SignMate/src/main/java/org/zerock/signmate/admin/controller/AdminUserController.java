package org.zerock.signmate.admin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.admin.dto.UpdateUserRequest;
import org.zerock.signmate.admin.dto.UserDetailDto;
import org.zerock.signmate.admin.dto.UserListDto;
import org.zerock.signmate.admin.service.adminUserService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final adminUserService adminUserService;

    // 회원 목록 + 검색
    @GetMapping
    public Page<UserListDto> list(@RequestParam(required = false) String q,
                                  @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return adminUserService.list(q, pageable);
    }

    // 회원 상세
    @GetMapping("/{id}")
    public UserDetailDto get(@PathVariable("id") Long userId) {
        return adminUserService.get(userId);
    }

    // 회원 수정
    @PatchMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable("id") Long userId,
                                       @Valid @RequestBody UpdateUserRequest req) {
        adminUserService.update(userId, req);
        return ResponseEntity.noContent().build();
    }

    // 회원 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long userId) {
        adminUserService.delete(userId);
        return ResponseEntity.noContent().build();
    }

    // 비밀번호 초기화
    @PostMapping("/{id}/reset-password")
    public Map<String, String> resetPassword(@PathVariable("id") Long userId) {
        String temp = adminUserService.resetPw(userId);
        return Map.of("temporaryPassword", temp);
    }
}
