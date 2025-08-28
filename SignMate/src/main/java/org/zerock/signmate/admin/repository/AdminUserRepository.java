package org.zerock.signmate.admin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.user.domain.User;

public interface AdminUserRepository extends JpaRepository<User, Long> {
    Page<User> findByNameContainingOrEmailContaining(String name, String email, Pageable pageable);
    boolean existsByEmailAndUserIdNot(String email, Long userId);
}
