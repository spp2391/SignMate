package org.zerock.signmate.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
public class UserListDto {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String type;
    private LocalDateTime regdate;


    public static UserListDto from(User u) {
        return UserListDto.builder()
                .userId(u.getUserId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getUserRole())
                .type(u.getUserType())
                .regdate(u.getRegdate())
                .build();
    }
}
