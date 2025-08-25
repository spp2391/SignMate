package org.zerock.signmate.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.user.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    Optional<User> findByKakaoId(Long kakaoId);

    List<User> email(String email);

    void deleteByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);
}