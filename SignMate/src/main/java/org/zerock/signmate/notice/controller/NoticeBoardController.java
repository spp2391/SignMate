package org.zerock.signmate.notice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.notice.dto.NoticeBoardDTO;
import org.zerock.signmate.notice.service.NoticeBoardService;

import java.util.List;

@RestController
    @RequestMapping("/api/notices")
public class NoticeBoardController {

    private final NoticeBoardService noticeBoardService;

    public NoticeBoardController(NoticeBoardService noticeBoardService) {
        this.noticeBoardService = noticeBoardService;
    }

    /** 전체 공지사항 목록 */
    @GetMapping
    public List<NoticeBoardDTO> getAll() {
        return noticeBoardService.getList();
    }

    /** 공지사항 상세 조회 */
    @GetMapping("/{nbno}")
    public ResponseEntity<NoticeBoardDTO> getOne(@PathVariable Long nbno) {
        NoticeBoardDTO dto = noticeBoardService.get(nbno);
        return ResponseEntity.ok(dto);
    }

    /** 글 등록 처리 (ADMIN만 가능) */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<NoticeBoardDTO> create(@RequestBody NoticeBoardDTO dto) {
        NoticeBoardDTO savedDto = noticeBoardService.register(dto); // DB 저장 후 DTO 반환
        return ResponseEntity.ok(savedDto);
    }

    /** 글 수정 처리 (ADMIN만 가능) */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{nbno}")
    public ResponseEntity<NoticeBoardDTO> update(@PathVariable Long nbno, @RequestBody NoticeBoardDTO dto) {
        NoticeBoardDTO updatedDto = noticeBoardService.modify(nbno, dto);
        return ResponseEntity.ok(updatedDto);
    }

    /** 글 삭제 처리 (ADMIN만 가능) */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{nbno}")
    public ResponseEntity<Void> delete(@PathVariable Long nbno) {
        noticeBoardService.remove(nbno);
        return ResponseEntity.noContent().build();
    }
}
