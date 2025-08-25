package org.zerock.signmate.notice.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.zerock.signmate.notice.domain.NoticeBoard;
import org.zerock.signmate.notice.dto.NoticeBoardDTO;
import org.zerock.signmate.notice.repository.NoticeBoardRepository;


import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NoticeBoardService {
    private final NoticeBoardRepository noticeboardRepository;
    public NoticeBoardService(NoticeBoardRepository noticeboardRepository) {
        this.noticeboardRepository = noticeboardRepository;
    }

    public NoticeBoardDTO register(NoticeBoardDTO dto) {
        NoticeBoard entity = NoticeBoard.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .build();
        NoticeBoard saved = noticeboardRepository.save(entity);
        return NoticeBoardDTO.fromEntity(saved);
    }
    public List<NoticeBoardDTO> getList() {
        return noticeboardRepository.findAll().stream()
                .map(NoticeBoardDTO::fromEntity)
                .collect(Collectors.toList());
    }
    public NoticeBoardDTO get(Long nbno) {
        NoticeBoard noticeBoard = noticeboardRepository.findById(nbno)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 없습니다. nbno=" + nbno));
        return NoticeBoardDTO.fromEntity(noticeBoard);
    }
    public NoticeBoardDTO modify(Long nbno, NoticeBoardDTO dto) {
        NoticeBoard noticeBoard = noticeboardRepository.findById(nbno)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 없습니다. nbno=" + nbno));

        // 변경
        noticeBoard.update(dto.getTitle(), dto.getContent());

        return NoticeBoardDTO.fromEntity(noticeBoard);
    }
    public void remove(Long nbno) {
        if (!noticeboardRepository.existsById(nbno)) {
            throw new IllegalArgumentException("삭제할 공지사항이 없습니다. nbno=" + nbno);
        }
        noticeboardRepository.deleteById(nbno);
    }
}

