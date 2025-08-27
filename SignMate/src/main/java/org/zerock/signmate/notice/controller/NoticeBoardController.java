package org.zerock.signmate.notice.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.signmate.notice.dto.NoticeBoardDTO;
import org.zerock.signmate.notice.service.NoticeBoardService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeBoardController {

    private final NoticeBoardService noticeService;

    // 공지사항 등록
    @PostMapping
    public NoticeBoardDTO createNotice(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(value = "images", required = false) MultipartFile[] images
    ) throws IOException {
        NoticeBoardDTO dto = NoticeBoardDTO.builder()
                .title(title)
                .content(content)
                .build();
        return noticeService.register(dto, images);
    }

    // 공지사항 리스트 조회
    @GetMapping
    public List<NoticeBoardDTO> getNotices() {
        return noticeService.getList();
    }

    // 공지사항 단일 조회
    @GetMapping("/{nbno}")
    public NoticeBoardDTO getNotice(@PathVariable Long nbno) {
        return noticeService.get(nbno);
    }

    // 공지사항 수정
    @PutMapping("/{nbno}")
    public NoticeBoardDTO updateNotice(
            @PathVariable Long nbno,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(value = "images", required = false) MultipartFile[] images
    ) throws IOException {
        NoticeBoardDTO dto = NoticeBoardDTO.builder()
                .title(title)
                .content(content)
                .build();
        return noticeService.modify(nbno, dto, images);
    }

    // 공지사항 삭제
    @DeleteMapping("/{nbno}")
    public void deleteNotice(@PathVariable Long nbno) {
        noticeService.remove(nbno);
    }
}
