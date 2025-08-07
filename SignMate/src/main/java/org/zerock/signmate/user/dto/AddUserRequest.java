package org.zerock.signmate.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddUserRequest {
    private Long userId;
    @NotBlank
    private String name;
    @NotBlank
    private String nickname;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String companyName;
    @NotBlank
    private String userType;
}
