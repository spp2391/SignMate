package org.zerock.signmate.user.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "user_role", length = 10)
    private String role;

    @Column(name = "user_type", length = 10)
    private String userType;

    @Column(name = "regdate")
    private LocalDateTime regdate;

    @Column(name = "moddate")
    private LocalDateTime moddate;

    @Column(name = "nickname", length = 15)
    private String nickname;

    @Builder.Default
    @Column(nullable = false)
    private boolean deleted = false;

    private Long kakaoId;



    // ===== UserDetails 구현 =====
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !deleted;
    }

    @PrePersist
    public void prePersist() {
        this.regdate = LocalDateTime.now();
        this.moddate = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.moddate = LocalDateTime.now();
    }



}
