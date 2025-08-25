package org.zerock.signmate.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.signmate.admin.dto.*;
import org.zerock.signmate.admin.repository.adminUserRepository;
import org.zerock.signmate.user.domain.User;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class adminUserService {

    private final adminUserRepository repo;
    private final PasswordEncoder encoder;

    //회원목록 + 검색
    public Page<UserListDto> list(String q, Pageable pageable) {
        Page<User> page = (q == null || q.isBlank())
                ? repo.findAll(pageable)
                : repo.findByNameContainingOrEmailContaining(q, q, pageable);
        return page.map(UserListDto::from);
    }

    // 회원상세
    public UserDetailDto get(Long userId) {
        User u = repo.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));
        return UserDetailDto.from(u);
    }

    // 회원 수정(비번 제외, 이메일 포함)
    @Transactional
    public void update(Long userId, UpdateUserRequest req) {
        User u = repo.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));

        if (req.getCompanyName() != null) u.setCompanyName(req.getCompanyName());
        if (req.getName() != null) u.setName(req.getName());
        if (req.getNickname() != null) u.setNickname(req.getNickname());

        if (req.getEmail() != null && !req.getEmail().equals(u.getEmail())) {
            if (repo.existsByEmailAndUserIdNot(req.getEmail(), userId)) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
            u.setEmail(req.getEmail());
        }

        if (req.getRole() != null) u.setUserRole(req.getRole());
        if (req.getType() != null) u.setUserType(req.getType());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            u.setPassword(encoder.encode(req.getPassword()));
        }
    }

    // 회원삭제
    @Transactional
    public void delete(Long userId) {
        User u = repo.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));
        repo.delete(u);
    }

    // 비밀번호 초기화
    @Transactional
    public String resetPw(Long userId) {
        User u = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        String temp = "1234";
        u.setPassword(encoder.encode(temp));
        return temp;
    }
}
