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
import org.zerock.signmate.admin.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService userService;

    /** 목록 (이름/이메일 keyword 검색) */
    @GetMapping
    public ResponseEntity<Page<UserListDto>> list(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        String k = keyword != null ? keyword.trim() : "";
        return ResponseEntity.ok(userService.list(k, pageable));
    }

    /** 상세 */
    @GetMapping("/{id}")
    public ResponseEntity<UserDetailDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(userService.get(id));
    }

    /** 수정(PATCH; 필요한 필드만 수정) */
    @PatchMapping("/{id}")
    public ResponseEntity<UserDetailDto> update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserRequest req
    ) {
        return ResponseEntity.ok(userService.update(id, req));
    }

    /** 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** 비밀번호 초기화 (임시) */
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<String> resetPassword(@PathVariable Long id) {
        String temp = userService.resetPw(id);
        return ResponseEntity.ok(temp);
    }
}
