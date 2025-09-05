package org.zerock.signmate.notice.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.signmate.notice.dto.NoticeBoardDTO;
import org.zerock.signmate.notice.service.NoticeBoardService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeBoardController {

    private final NoticeBoardService noticeService;
    private final String UPLOAD_DIR = "uploads/";

    // 공지사항 등록
    @PostMapping
//    @PreAuthorize("hasRole('ADMIN')")
    public NoticeBoardDTO createNotice(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(value = "images", required = false) MultipartFile[] images
    ) throws IOException {
        // 업로드 디렉토리 생성
//        File dir = new File(UPLOAD_DIR);
//        if (!dir.exists()) dir.mkdirs();
//
//        for (MultipartFile img : images) {
//            // 저장할 파일명
//            String fileName = System.currentTimeMillis() + "_" + img.getOriginalFilename();
//            Path filePath = Paths.get(UPLOAD_DIR, fileName);
//            Files.write(filePath, img.getBytes());
//        }

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
