package org.zerock.signmate.admin.dto;

import lombok.Getter;

@Getter
public class UpdateUserRequest {
    private String companyName;
    private String email;
    private String name;
    private String nickname;
    private String role;
    private String type;
    private String password;
}
