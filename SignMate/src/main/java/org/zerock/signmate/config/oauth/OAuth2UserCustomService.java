package org.zerock.signmate.config.oauth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.zerock.signmate.user.OAuth2User.CustomOAuth2User;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.Map;

@RequiredArgsConstructor
@Service
//FormLogin용 로그인 객체를 저장하는 서비스
public class OAuth2UserCustomService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
//        saveOrUpdate(user);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if ("kakao".equals(registrationId)) {
            return kakaoSaveOrUpdate(user);
        } else if ("naver".equals(registrationId)) {
            return null;
        } else if ("google".equals(registrationId)) {
            return googleSaveOrUpdate(user);
        }

        throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인: " + registrationId);
    }
    private CustomOAuth2User googleSaveOrUpdate(OAuth2User oAuth2User) {
        //구글 로그인 시 보내주는 데이터를 attributes 맵에 저장
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        //User테이블에 회원정보가 있으면 update만 ㅅ ㅣㄹ행
        //회원정보가 없는 경우 새로운 회원을 생성
        User user = userRepository.findByEmail(email)
                .map(entity -> entity.update(name))
                .orElse(User.builder()
                        .email(email)
                        .nickname(name)
                        .build());
        //데이터베이스에 결과를 저장
        userRepository.save(user);
        //유저가 있으면 업데이터, 유저가 없으면 새롭게 생서
        return new CustomOAuth2User(user, attributes);
    }
    private CustomOAuth2User kakaoSaveOrUpdate(OAuth2User oAuth2User) {

        Map<String, Object> attributes = oAuth2User.getAttributes();

        Long kakaoId = ((Number) attributes.get("id")).longValue();

        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String nickname = (String) profile.get("nickname");

        User user = userRepository.findByKakaoId(kakaoId)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .kakaoId(kakaoId)
                                .name(nickname)
                                .email(kakaoId.toString())  // 이메일은 없음
                                .userType("USER")
                                .build()
                ));

        return new CustomOAuth2User(user, attributes);
    }
    private CustomOAuth2User naverSaveOrUpdate(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 네이버 응답 구조 확인
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        String email = (String) response.get("email");
        String name = (String) response.get("name");
        String nickname = (String) response.get("nickname");
        String mobile = (String) response.get("mobile");

        // DB에서 사용자 검색
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // 없으면 USER 권한으로 새로 가입
                    User newUser = User.builder()
                            .email(email)
                            .name(name != null ? name : nickname)
                            .nickname(nickname != null ? nickname : name)
                            .userType("USER") // 소셜 로그인 사용자도 USER
                            .password("") // 소셜 로그인은 비밀번호 없음
                            .build();
                    return userRepository.save(newUser);
                });

        // ROLE_USER 부여된 CustomOAuth2User 반환
        return new CustomOAuth2User(user, attributes);
    }
}
