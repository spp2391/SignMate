package org.zerock.signmate.notice.dto;

import lombok.*;
import org.zerock.signmate.notice.domain.NoticeBoard;


import java.time.LocalDateTime;

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


    public NoticeBoardDTO(NoticeBoard noticeBoard) {
        this.nbno = noticeBoard.getNbno();
        this.title = noticeBoard.getTitle();
        this.content = noticeBoard.getContent();
        this.regdate = noticeBoard.getRegdate();
        this.moddate = noticeBoard.getModdate();
    }
    public static NoticeBoardDTO fromEntity(NoticeBoard entity) {
        return new NoticeBoardDTO(entity);
    }
}
