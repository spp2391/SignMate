package org.zerock.signmate.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.user.domain.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByUserId(Long userId);
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
