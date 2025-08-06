package org.zerock.signmate.user.sevice;


import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.zerock.signmate.user.domain.RefreshToken;
import org.zerock.signmate.user.repository.RefreshTokenRepository;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    // AccessToken만료시 RefreshToken을 찾아 RefreshToken이 일치하는지 확인하기 위해
    public RefreshToken findByRefreshToken(String refreshToken){
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(()->new IllegalArgumentException("Unexpected token"));
    }
}









