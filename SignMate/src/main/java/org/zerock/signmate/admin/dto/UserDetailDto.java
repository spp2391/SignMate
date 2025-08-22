package org.zerock.signmate.admin.dto;

import lombok.*;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class UserDetailDto {
    private Long userId;
    private String companyName;
    private String email;
    private String name;
    private String nickname;
    private String role;
    private String type;
    private LocalDateTime regdate;
    private LocalDateTime moddate;

    public static UserDetailDto from(User u) {
        return UserDetailDto.builder()
                .userId(u.getUserId())
                .companyName(u.getCompanyName())
                .email(u.getEmail())
                .name(u.getName())
                .nickname(u.getNickname())
                .role(u.getUserRole())
                .type(u.getUserType())
                .regdate(u.getRegdate())
                .moddate(u.getModdate())
                .build();
    }
}