package org.zerock.signmate.admin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.admin.dto.ContractDetailDto;
import org.zerock.signmate.admin.dto.ContractListDto;
import org.zerock.signmate.admin.dto.UpdateContractRequest;
import org.zerock.signmate.admin.service.AdminContractService;

@RestController
@RequestMapping("/api/admin/contracts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminContractController {

    private final AdminContractService service;

    /** 목록 + 필터(keyword, type, status=CSV)
     *  동의어 허용: query -> keyword, statusGroup -> status */
    @GetMapping
    public ResponseEntity<Page<ContractListDto>> list(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "") String type,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(required = false, name = "statusGroup") String statusGroup,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        String resolvedKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim()
                : (query != null ? query.trim() : "");
        String resolvedStatus = (status != null && !status.isBlank()) ? status.trim()
                : (statusGroup != null ? statusGroup.trim() : "");
        String resolvedType = type != null ? type.trim() : "";

        return ResponseEntity.ok(service.list(resolvedKeyword, resolvedType, resolvedStatus, pageable));
    }

    /** 상세 */
    @GetMapping("/{id}")
    public ResponseEntity<ContractDetailDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    /** 수정(PATCH) */
    @PatchMapping("/{id}")
    public ResponseEntity<ContractDetailDto> update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateContractRequest req
    ) {
        return ResponseEntity.ok(service.update(id, req));
    }

    /** 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
