package org.zerock.signmate.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.zerock.signmate.user.domain.User;

@Getter
@Builder
@AllArgsConstructor
public class UserListDto {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String type;
    public static UserListDto from(User u) {
        return UserListDto.builder()
                .userId(u.getUserId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getUserRole())
                .type(u.getUserType())
                .build();
    }
}