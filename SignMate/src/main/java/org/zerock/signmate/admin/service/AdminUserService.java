package org.zerock.signmate.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.signmate.admin.dto.UpdateUserRequest;
import org.zerock.signmate.admin.dto.UserDetailDto;
import org.zerock.signmate.admin.dto.UserListDto;
import org.zerock.signmate.admin.repository.AdminUserRepository;
import org.zerock.signmate.user.domain.User;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final AdminUserRepository repo;
    private final PasswordEncoder encoder;

    /** 목록 조회(이름/이메일 LIKE) */
    public Page<UserListDto> list(String keyword, Pageable pageable) {
        Page<User> page;
        if (keyword == null || keyword.isBlank()) {
            page = repo.findAll(pageable);
        } else {
            page = repo.findByNameContainingOrEmailContaining(keyword, keyword, pageable);
        }
        return page.map(UserListDto::from);
    }

    /** 상세 */
    public UserDetailDto get(Long userId) {
        User u = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
        return UserDetailDto.from(u);
    }

    /** 수정 */
    @Transactional
    public UserDetailDto update(Long userId, UpdateUserRequest req) {
        User u = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        // 이메일 중복검사(자기 자신 제외)
        if (req.getEmail() != null && !req.getEmail().equals(u.getEmail())) {
            if (repo.existsByEmailAndUserIdNot(req.getEmail(), userId)) {
                throw new IllegalArgumentException("duplicated email");
            }
            u.setEmail(req.getEmail());
        }

        if (req.getCompanyName() != null) u.setCompanyName(req.getCompanyName());
        if (req.getName() != null)        u.setName(req.getName());
        if (req.getNickname() != null)    u.setNickname(req.getNickname());
        if (req.getRole() != null)        u.setUserRole(req.getRole());
        if (req.getType() != null)        u.setUserType(req.getType());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            u.setPassword(encoder.encode(req.getPassword()));
        }

        return UserDetailDto.from(u);
    }

    /** 삭제 */
    @Transactional
    public void delete(Long userId) {
        User u = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
        repo.delete(u);
    }

    /** 비밀번호 초기화 */
    @Transactional
    public String resetPw(Long userId) {
        User u = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
        String temp = "1234"; // TODO: 안전한 랜덤 생성 + 메일 발송 연결
        u.setPassword(encoder.encode(temp));
        return temp;
    }
}
