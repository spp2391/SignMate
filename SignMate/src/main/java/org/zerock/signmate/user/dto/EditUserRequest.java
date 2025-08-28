package org.zerock.signmate.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditUserRequest {
    private String name;
    private String nickname;
    private String password;
    private String companyName;
    private String userType;
    private String userRole;
}
