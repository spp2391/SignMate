package org.zerock.signmate.user.OAuth2User;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MultiOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final CustomOAuth2UserService_Kakao kakaoOAuth2UserService;   // 카카오
    private final CustomOAuth2UserService_Naver naverOAuth2UserService;  // 네이버

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if ("kakao".equals(registrationId)) {
            return kakaoOAuth2UserService.loadUser(userRequest);
        } else if ("naver".equals(registrationId)) {
            return naverOAuth2UserService.loadUser(userRequest);
        }

        throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인: " + registrationId);
    }
}
