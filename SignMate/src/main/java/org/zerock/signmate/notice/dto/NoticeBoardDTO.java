package org.zerock.signmate.notice.dto;

import lombok.*;
import org.zerock.signmate.notice.domain.NoticeBoard;


import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class NoticeBoardDTO {
    private Long nbno;
    private String title;
    private String content;
    private LocalDateTime regdate;
    private LocalDateTime moddate;
    private List<String> imageUrls;


    public static NoticeBoardDTO fromEntity(NoticeBoard entity) {
        return NoticeBoardDTO.builder()
                .nbno(entity.getNbno())
                .title(entity.getTitle())
                .content(entity.getContent())
                .regdate(entity.getRegdate())
                .moddate(entity.getModdate())
                .imageUrls(entity.getImageUrls()) // ✅ 이미지 URL 포함
                .build();
    }
    public NoticeBoardDTO(NoticeBoard noticeBoard) {
        this.nbno = noticeBoard.getNbno();
        this.title = noticeBoard.getTitle();
        this.content = noticeBoard.getContent();
        this.regdate = noticeBoard.getRegdate();
        this.moddate = noticeBoard.getModdate();
    }
}
