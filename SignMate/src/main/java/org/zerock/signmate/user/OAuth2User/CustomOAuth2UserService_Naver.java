package org.zerock.signmate.user.OAuth2User;




import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;


import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService_Naver extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
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
                            .phoneNumber(mobile)
                            .role("USER") // 소셜 로그인 사용자도 USER
                            .password("") // 소셜 로그인은 비밀번호 없음
                            .build();
                    return userRepository.save(newUser);
                });

        // ROLE_USER 부여된 CustomOAuth2User 반환
        return new CustomOAuth2User(user, attributes);
    }
}
