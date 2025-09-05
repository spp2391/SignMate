package org.zerock.signmate.notice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.signmate.notice.domain.NoticeBoard;
import org.zerock.signmate.notice.dto.NoticeBoardDTO;
import org.zerock.signmate.notice.repository.NoticeBoardRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class NoticeBoardService {

    private final NoticeBoardRepository noticeboardRepository;
    private final FileService fileService; // ✅ 이미지 파일 처리

    // 공지사항 등록 (이미지 포함)
    public NoticeBoardDTO register(NoticeBoardDTO dto, MultipartFile[] images) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        if (images != null) {
            for (MultipartFile file : images) {
                String url = fileService.saveFile(file); // 서버에 저장 후 URL 반환
                imageUrls.add(url);
            }
        }

        NoticeBoard entity = NoticeBoard.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .imageUrls(imageUrls)
                .build();

        NoticeBoard saved = noticeboardRepository.save(entity);
        return NoticeBoardDTO.fromEntity(saved);
    }

    // 공지사항 리스트 조회
    public List<NoticeBoardDTO> getList() {
        return noticeboardRepository.findAll().stream()
                .map(NoticeBoardDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 공지사항 단일 조회
    public NoticeBoardDTO get(Long nbno) {
        NoticeBoard noticeBoard = noticeboardRepository.findById(nbno)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 없습니다. nbno=" + nbno));
        return NoticeBoardDTO.fromEntity(noticeBoard);
    }

    // 공지사항 수정 (제목/내용 + 이미지 추가 가능)
    public NoticeBoardDTO modify(Long nbno, NoticeBoardDTO dto, MultipartFile[] images) throws IOException {
        NoticeBoard noticeBoard = noticeboardRepository.findById(nbno)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 없습니다. nbno=" + nbno));

        // 제목/내용 변경
        noticeBoard.update(dto.getTitle(), dto.getContent());

        // 이미지 추가
        if (images != null) {
            for (MultipartFile file : images) {
                String url = fileService.saveFile(file);
                noticeBoard.getImageUrls().add(url);
            }
        }

        return NoticeBoardDTO.fromEntity(noticeBoard);
    }

    // 공지사항 삭제
    public void remove(Long nbno) {
        if (!noticeboardRepository.existsById(nbno)) {
            throw new IllegalArgumentException("삭제할 공지사항이 없습니다. nbno=" + nbno);
        }
        noticeboardRepository.deleteById(nbno);
    }
}
