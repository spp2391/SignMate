package org.zerock.signmate.user.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
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
@Where(clause = "deleted = false")
@SQLDelete(sql = "UPDATE user SET deleted = true, deleted_at = NOW() WHERE user_id = ?")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @Column(name = "email", length = 255, unique = true)
    private String email;

    @Column(name = "google_id", length = 255, unique = true)
    private String googleId;

    // 제공되는 정보의 차이로 인해 Long 사용
    @Column(name = "kakao_id", length = 255, unique = true)
    private Long kakaoId;

    @Column(name = "naver_id", length = 255, unique = true)
    private String naverId;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "company_name", length = 200)
    private String companyName;

    @Column(name = "user_type", length = 10)
    private String userType;

    // PRIVATE, COMPANY
    @Column(name = "user_role", length = 10)
    private String userRole;

    @Column(name = "auth_type", length = 10)
    private String authType;

    @Column(name = "regdate")
    private LocalDateTime regdate;

    @Column(name = "moddate")
    private LocalDateTime moddate;

    @Builder.Default
    @Column(nullable = false)
    private boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ===== UserDetails 구현 =====
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // ⚠️ 기존 로직 유지 (user_type 사용) — 요청대로 추가 부분에서 user_type 사용하지 않음
        return List.of(new SimpleGrantedAuthority("ROLE_" + userType));
    }

    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return !deleted; }

    @PrePersist
    public void prePersist() {
        this.regdate = LocalDateTime.now();
        this.moddate = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.moddate = LocalDateTime.now();
    }

    public User update(String name) {
        this.name = name;
        return this;
    }
}
