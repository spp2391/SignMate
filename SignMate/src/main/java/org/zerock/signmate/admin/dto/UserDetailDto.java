package org.zerock.signmate.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDetailDto {
    private Long userId;
    private String companyName;
    private String email;
    private String name;
    private String nickname;
    private String role;


    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime regdate;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime moddate;

    public static UserDetailDto from(User u) {
        return UserDetailDto.builder()
                .userId(u.getUserId())
                .companyName(u.getCompanyName())
                .email(u.getEmail())
                .name(u.getName())
                .nickname(u.getNickname())
                .role(u.getUserRole())
                .regdate(u.getRegdate())
                .moddate(u.getModdate())
                .build();
    }
}
